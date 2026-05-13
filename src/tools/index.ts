import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerPreviewSession } from "@/tools/preview_session.js";
import { registerSaveSession } from "@/tools/save_session.js";
import { registerListSessions } from "@/tools/list_sessions.js";
import { registerLoadSession } from "@/tools/load_session.js";

/** Phase 5 の基本ツール 4 本をサーバーに登録する */
export function registerTools(server: McpServer): void {
  registerPreviewSession(server);
  registerSaveSession(server);
  registerListSessions(server);
  registerLoadSession(server);
}
