import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolName } from "@/constants/index.js";
import type { SessionPayload } from "@/models/session.js";
import { listSessions, loadSession } from "@/store/index.js";
import { withErrorHandling } from "@/errors/index.js";

/**
 * 対象セッションの生データを返す。
 * 要約は会話中の Claude が行い、save_session (source_ids 付き) で保存する。
 */
export function registerCompactSessions(server: McpServer): void {
  server.registerTool(
    ToolName.CompactSessions,
    {
      description:
        "対象セッションの生データを返す。Claude がこの出力を要約し save_session (source_ids 付き) で保存することで、元セッションが自動削除される。",
      inputSchema: {
        session_ids: z
          .array(z.uuid())
          .optional()
          .describe(
            "対象セッション ID を直接指定 (指定した場合は repo / before を無視)",
          ),
        repo: z
          .string()
          .optional()
          .describe("repos[].repo での絞り込み (session_ids 未指定時に有効)"),
        before: z
          .string()
          .optional()
          .describe(
            "ISO 8601 日時。この日付より古いセッションを対象にする (session_ids 未指定時に有効)",
          ),
      },
    },
    ({ session_ids, repo, before }) =>
      withErrorHandling(async () => {
        let targets: Array<{ id: string; payload: SessionPayload }>;

        if (session_ids && session_ids.length > 0) {
          const results = await Promise.all(session_ids.map(loadSession));
          targets = results
            .filter((r): r is NonNullable<typeof r> => r !== null)
            .map((r) => ({ id: r.id, payload: r.payload }));
        } else {
          const all = await listSessions(50, repo);
          targets = before
            ? all
                .filter((s) => s.payload.created_at < before)
                .map((s) => ({ id: s.id, payload: s.payload }))
            : all.map((s) => ({ id: s.id, payload: s.payload }));
        }

        if (targets.length === 0) {
          return {
            content: [
              { type: "text", text: "対象セッションが見つかりませんでした。" },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(targets, null, 2),
            },
          ],
        };
      }),
  );
}
