import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerPreviewSession } from "@/tools/preview_session.js";
import { registerSaveSession } from "@/tools/save_session.js";
import { registerListSessions } from "@/tools/list_sessions.js";
import { registerLoadSession } from "@/tools/load_session.js";
import { registerSearchSessions } from "@/tools/search_sessions.js";
import { registerUpdateSession } from "@/tools/update_session.js";
import { registerCompactSessions } from "@/tools/compact_sessions.js";
import { registerDeleteSession } from "@/tools/delete_session.js";

/** 全ツールをサーバーに登録する */
export function registerTools(server: McpServer): void {
  // preview_session: 保存前にセッション内容をプレビューする
  registerPreviewSession(server);

  // save_session: セッションを Qdrant に保存する
  registerSaveSession(server);

  // list_sessions: 最近のセッションを降順で一覧表示する
  registerListSessions(server);

  // load_session: 番号または session_id でセッションをロードする
  registerLoadSession(server);

  // search_sessions: 自然言語クエリでセマンティック検索する
  registerSearchSessions(server);

  // update_session: 指定フィールドのみ部分更新する
  registerUpdateSession(server);

  // compact_sessions: 対象セッションの生データを返す (要約は Claude が行う)
  registerCompactSessions(server);

  // delete_session: session_ids で指定したセッションを一括削除する
  registerDeleteSession(server);
}
