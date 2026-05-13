/** MCP ツール名の一覧 */
export const ToolName = {
  PreviewSession: "preview_session",
  SaveSession: "save_session",
  ListSessions: "list_sessions",
  SearchSessions: "search_sessions",
  LoadSession: "load_session",
  CompactSessions: "compact_sessions",
  UpdateSession: "update_session",
  DeleteSession: "delete_session",
} as const;

export type ToolName = (typeof ToolName)[keyof typeof ToolName];
