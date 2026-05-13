import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolName, LIST_MAX_LIMIT } from "@/constants/index.js";
import { loadSession, listSessions } from "@/store/index.js";
import { formatSessionDetail } from "@/tools/format.js";

/**
 * 番号または session_id を指定してセッションを完全ロードする。
 *
 * number を指定した場合は list_sessions の番号に対応するセッションをロードする。
 * session_id を指定した場合は直接ロードする。
 */
export function registerLoadSession(server: McpServer): void {
  server.registerTool(
    ToolName.LoadSession,
    {
      description:
        "番号または session_id を指定してセッションを完全ロードする。number は list_sessions / search_sessions で表示された番号。",
      inputSchema: {
        number: z
          .number()
          .optional()
          .describe("list_sessions / search_sessions で表示された番号"),
        session_id: z
          .string()
          .optional()
          .describe("セッション ID を直接指定する場合"),
      },
    },
    async ({ number, session_id }) => {
      if (number !== undefined) {
        const sessions = await listSessions(LIST_MAX_LIMIT);
        const target = sessions[number - 1];
        if (!target) {
          return {
            content: [
              {
                type: "text",
                text: `番号 ${number} のセッションが見つかりませんでした。list_sessions で一覧を確認してください。`,
              },
            ],
          };
        }
        const byNumber = await loadSession(target.id);
        if (!byNumber) {
          return {
            content: [
              {
                type: "text",
                text: `session_id: ${target.id} が見つかりませんでした。`,
              },
            ],
          };
        }
        return {
          content: [
            {
              type: "text",
              text: formatSessionDetail(byNumber.id, byNumber.payload),
            },
          ],
        };
      }

      if (!session_id) {
        return {
          content: [
            {
              type: "text",
              text: "number または session_id のいずれかを指定してください。",
            },
          ],
        };
      }

      // ここでは session_id が string に絞り込まれる
      const byId = await loadSession(session_id);
      if (!byId) {
        return {
          content: [
            {
              type: "text",
              text: `session_id: ${session_id} が見つかりませんでした。`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: formatSessionDetail(byId.id, byId.payload),
          },
        ],
      };
    },
  );
}
