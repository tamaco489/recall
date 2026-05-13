import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ToolName,
  LIST_DEFAULT_LIMIT,
  LIST_MAX_LIMIT,
} from "@/constants/index.js";
import { searchSessions } from "@/store/index.js";
import { formatSessionLine } from "@/tools/format.js";

/** 自然言語クエリでセマンティック検索し、スコア付き番号一覧で返す */
export function registerSearchSessions(server: McpServer): void {
  server.registerTool(
    ToolName.SearchSessions,
    {
      description:
        "自然言語クエリでセマンティック検索し、類似度スコア付きの番号一覧を返す。",
      inputSchema: {
        query: z.string().describe("自然言語の検索クエリ"),
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
    async ({ query, limit, repo, layer }) => {
      const sessions = await searchSessions(query, limit, repo, layer);

      if (sessions.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "該当するセッションが見つかりませんでした。",
            },
          ],
        };
      }

      const lines = sessions.map((s, i) =>
        formatSessionLine(i + 1, s.id, s.payload, s.score),
      );

      return { content: [{ type: "text", text: lines.join("\n\n") }] };
    },
  );
}
