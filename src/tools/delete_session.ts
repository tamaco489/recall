import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolName } from "@/constants/index.js";
import { deleteSessions } from "@/store/index.js";
import { catchToErrorResponse } from "@/errors/index.js";

/** session_ids の配列で複数件削除する */
export function registerDeleteSession(server: McpServer): void {
  server.registerTool(
    ToolName.DeleteSession,
    {
      description: "session_ids で指定したセッションを一括削除する。",
      inputSchema: {
        session_ids: z
          .array(z.uuid())
          .min(1)
          .describe("削除対象のセッション ID の配列"),
      },
    },
    async ({ session_ids }) => {
      try {
        const result = await deleteSessions(session_ids);
        return {
          content: [
            {
              type: "text",
              text: `${result.deleted} 件のセッションを削除しました。`,
            },
          ],
        };
      } catch (err) {
        return catchToErrorResponse(err);
      }
    },
  );
}
