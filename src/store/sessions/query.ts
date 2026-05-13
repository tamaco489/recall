import type { SessionPayload } from "@/models/session.js";
import {
  COLLECTION_NAME,
  LIST_DEFAULT_LIMIT,
  LIST_MAX_LIMIT,
} from "@/constants.js";
import { embed } from "@/embedder/index.js";
import { qdrant } from "@/store/client.js";

/** repo / layer フィルターを Qdrant Filter 形式に変換する */
function buildFilter(repo?: string, layer?: string) {
  const must: unknown[] = [];
  if (repo) {
    must.push({
      nested: {
        key: "repos",
        filter: { must: [{ key: "repo", match: { value: repo } }] },
      },
    });
  }
  if (layer) {
    must.push({ key: "layer", match: { value: layer } });
  }
  return must.length > 0 ? { must } : undefined;
}

/** 最近のセッションを created_at 降順で返す */
export async function listSessions(
  limit: number = LIST_DEFAULT_LIMIT,
  repo?: string,
  layer?: string,
): Promise<Array<{ id: string; payload: SessionPayload }>> {
  const clampedLimit = Math.min(limit, LIST_MAX_LIMIT);
  const filter = buildFilter(repo, layer);

  const result = await qdrant.scroll(COLLECTION_NAME, {
    filter,
    limit: clampedLimit,
    with_payload: true,
    with_vector: false,
    order_by: { key: "created_at", direction: "desc" },
  });

  return result.points.map((p) => ({
    id: String(p.id),
    payload: p.payload as unknown as SessionPayload,
  }));
}

/** 自然言語クエリでセマンティック検索し、類似度スコア付きで返す */
export async function searchSessions(
  query: string,
  limit: number = LIST_DEFAULT_LIMIT,
  repo?: string,
  layer?: string,
): Promise<Array<{ id: string; score: number; payload: SessionPayload }>> {
  const clampedLimit = Math.min(limit, LIST_MAX_LIMIT);
  const vector = await embed(query);
  const filter = buildFilter(repo, layer);

  const result = await qdrant.search(COLLECTION_NAME, {
    vector,
    limit: clampedLimit,
    filter,
    with_payload: true,
  });

  return result.map((p) => ({
    id: String(p.id),
    score: p.score,
    payload: p.payload as unknown as SessionPayload,
  }));
}

/** session_id を指定してセッションを1件ロードする。存在しない場合は null を返す */
export async function loadSession(
  sessionId: string,
): Promise<{ id: string; payload: SessionPayload } | null> {
  const result = await qdrant.retrieve(COLLECTION_NAME, {
    ids: [sessionId],
    with_payload: true,
    with_vector: false,
  });

  if (result.length === 0) return null;
  const point = result[0];
  return {
    id: String(point.id),
    payload: point.payload as unknown as SessionPayload,
  };
}
