import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolName } from "@/constants/index.js";
import { updateSession } from "@/store/index.js";
import { withErrorHandling } from "@/errors/index.js";

/** 指定フィールドのみ部分更新する。ベクター再生成が必要なフィールドは自動的に再生成する */
export function registerUpdateSession(server: McpServer): void {
  server.registerTool(
    ToolName.UpdateSession,
    {
      description:
        "指定フィールドのみ部分更新する。title / summary / key_decisions を変更した場合はベクターを再生成する。updated_at は常に自動更新される。",
      inputSchema: {
        session_id: z.uuid().describe("更新対象のセッション ID"),
        title: z.string().optional().describe("セッションの短いタイトル"),
        summary: z
          .string()
          .optional()
          .describe("セッション全体の要約 (500字程度)"),
        status: z
          .enum(["in_progress", "blocked", "completed", "abandoned"])
          .optional()
          .describe("作業の進行状態"),
        key_decisions: z
          .array(z.string())
          .optional()
          .describe("主要な意思決定の箇条書き"),
        phase: z
          .object({
            current: z.number(),
            total: z.number(),
            completed_phases: z.array(z.string()),
            next_action: z.string(),
          })
          .nullable()
          .optional()
          .describe("フェーズ進捗。null で削除"),
        blocked_by: z
          .array(
            z.object({
              type: z.enum(["issue", "pr", "session"]),
              url: z.string(),
              title: z.string(),
              reason: z.string(),
            }),
          )
          .optional()
          .describe("ブロッカー・依存関係"),
        code_references: z
          .array(
            z.object({
              file: z.string(),
              symbols: z.array(z.string()),
              note: z.string(),
            }),
          )
          .optional()
          .describe("触ったファイル・関数・変数"),
        external_references: z
          .array(
            z.object({
              url: z.string(),
              title: z.string(),
              quote: z.string(),
              note: z.string(),
            }),
          )
          .optional()
          .describe("参照したドキュメント URL"),
        github_references: z
          .array(
            z.object({
              type: z.enum(["issue", "pr", "discussion"]),
              url: z.string(),
              title: z.string(),
              note: z.string(),
            }),
          )
          .optional()
          .describe("関連 Issue / PR / Discussion"),
        artifacts: z
          .array(
            z.object({
              type: z.enum(["branch", "migration", "tag", "file"]),
              path: z.string(),
              note: z.string(),
            }),
          )
          .optional()
          .describe("成果物"),
        tags: z.array(z.string()).optional().describe("検索用タグ"),
      },
    },
    ({ session_id, ...updates }) =>
      withErrorHandling(async () => {
        const result = await updateSession(session_id, updates);
        return {
          content: [
            {
              type: "text",
              text: `session_id: ${result.session_id}\nupdated_at: ${result.updated_at}`,
            },
          ],
        };
      }),
  );
}
