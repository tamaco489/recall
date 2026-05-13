import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolName } from "@/constants/index.js";
import { saveSession } from "@/store/index.js";
import { SessionInputSchema, type SessionInput } from "@/tools/schemas.js";
import { withErrorHandling } from "@/errors/index.js";

/**
 * 確認済みセッションデータを Qdrant に保存する。
 *
 * source_ids が指定された場合 (compact_sessions 経由) は保存後に元セッションを自動削除する。
 * preview_session でユーザーの確認が取れてから呼び出す。
 */
export function registerSaveSession(server: McpServer): void {
  server.registerTool(
    ToolName.SaveSession,
    {
      description:
        "確認済みセッションデータを Qdrant に保存する。preview_session でユーザーの確認が取れてから呼び出す。",
      inputSchema: {
        ...SessionInputSchema.shape,
        source_ids: z
          .array(z.string())
          .optional()
          .describe(
            "compact_sessions 経由の場合のみ指定。保存後に元セッションを自動削除する",
          ),
      },
    },
    ({ source_ids, ...input }: SessionInput & { source_ids?: string[] }) =>
      withErrorHandling(async () => {
        const result = await saveSession(
          {
            ...input,
            compacted: source_ids !== undefined && source_ids.length > 0,
          },
          source_ids,
        );

        const text = [
          "セッションを保存しました。",
          `session_id: ${result.session_id}`,
          `created_at: ${result.created_at}`,
        ].join("\n");

        return { content: [{ type: "text", text }] };
      }),
  );
}
