import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ToolName,
  LIST_DEFAULT_LIMIT,
  LIST_MAX_LIMIT,
} from "@/constants/index.js";
import { listSessions } from "@/store/index.js";
import { formatSessionLine } from "@/tools/format.js";
import { withErrorHandling } from "@/errors/index.js";

/** 最近のセッションを番号付き一覧で返す */
export function registerListSessions(server: McpServer): void {
  server.registerTool(
    ToolName.ListSessions,
    {
      description:
        "最近のセッションを created_at 降順の番号付き一覧で返す。load_session の番号指定に使う。",
      inputSchema: {
        limit: z
          .number()
          .optional()
          .describe(
            `取得件数。デフォルト ${LIST_DEFAULT_LIMIT}、最大 ${LIST_MAX_LIMIT}`,
          ),
        repo: z.string().optional().describe("repos[].repo での絞り込み"),
        layer: z.string().optional().describe("layer での絞り込み"),
      },
    },
    ({ limit, repo, layer }) =>
      withErrorHandling(async () => {
        const sessions = await listSessions(limit, repo, layer);

        if (sessions.length === 0) {
          return {
            content: [
              { type: "text", text: "セッションが見つかりませんでした。" },
            ],
          };
        }

        const lines = sessions.map((s, i) =>
          formatSessionLine(i + 1, s.id, s.payload),
        );

        return { content: [{ type: "text", text: lines.join("\n\n") }] };
      }),
  );
}
