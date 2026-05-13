import { randomUUID } from "node:crypto";
import { embed } from "@/embedder/index.js";
import type { SessionPayload } from "@/models/session.js";
import { COLLECTION_NAME } from "@/constants/index.js";
import { qdrant } from "@/store/client.js";
import { loadSession } from "@/store/sessions/query.js";
import { AppError, ErrorCode } from "@/errors/index.js";

/** title + summary + key_decisions を結合して埋め込みの入力テキストを生成する */
function buildEmbedInput(
  payload: Pick<SessionPayload, "title" | "summary" | "key_decisions">,
): string {
  return [payload.title, payload.summary, ...payload.key_decisions].join("\n");
}

export type SaveSessionInput = Omit<
  SessionPayload,
  "created_at" | "updated_at"
>;

/**
 * 更新可能なフィールドの型。
 * repos / layer / compacted / created_at / updated_at は更新不可。
 */
export type SessionUpdate = Partial<
  Pick<
    SessionPayload,
    | "title"
    | "summary"
    | "status"
    | "key_decisions"
    | "phase"
    | "blocked_by"
    | "code_references"
    | "external_references"
    | "github_references"
    | "artifacts"
    | "tags"
  >
>;

/**
 * セッションを Qdrant に保存する。
 *
 * sourceIds が指定された場合 (compact_sessions 経由) は保存後に元セッションを削除する。
 */
export async function saveSession(
  input: SaveSessionInput,
  sourceIds?: string[],
): Promise<{ session_id: string; created_at: string }> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const vector = await embed(buildEmbedInput(input));
  const payload: SessionPayload = {
    ...input,
    created_at: now,
    updated_at: now,
  };

  await qdrant.upsert(COLLECTION_NAME, {
    points: [{ id, vector, payload: payload as Record<string, unknown> }],
  });

  if (sourceIds && sourceIds.length > 0) {
    await deleteSessions(sourceIds);
  }

  return { session_id: id, created_at: now };
}

/**
 * 指定フィールドのみ部分更新する。
 *
 * title / summary / key_decisions が含まれる場合はベクターを再生成する。
 * updated_at は常に自動更新する。
 */
export async function updateSession(
  sessionId: string,
  updates: SessionUpdate,
): Promise<{ session_id: string; updated_at: string }> {
  const current = await loadSession(sessionId);
  if (!current) {
    throw new AppError(
      ErrorCode.SessionNotFound,
      `session_id: ${sessionId} が見つかりませんでした`,
    );
  }

  const now = new Date().toISOString();
  const updatedPayload: SessionPayload = {
    ...current.payload,
    ...updates,
    updated_at: now,
  };

  const needsReembed =
    updates.title !== undefined ||
    updates.summary !== undefined ||
    updates.key_decisions !== undefined;

  if (needsReembed) {
    const vector = await embed(buildEmbedInput(updatedPayload));
    await qdrant.upsert(COLLECTION_NAME, {
      points: [
        {
          id: sessionId,
          vector,
          payload: updatedPayload as Record<string, unknown>,
        },
      ],
    });
  } else {
    await qdrant.overwritePayload(COLLECTION_NAME, {
      payload: updatedPayload as Record<string, unknown>,
      points: [sessionId],
    });
  }

  return { session_id: sessionId, updated_at: now };
}

/** 指定した session_id の配列を一括削除する */
export async function deleteSessions(
  sessionIds: string[],
): Promise<{ deleted: number }> {
  await qdrant.delete(COLLECTION_NAME, { points: sessionIds });
  return { deleted: sessionIds.length };
}
