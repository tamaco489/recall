/**
 * 全ツール共通のエラーコード。
 *
 * - `QDRANT_CONNECTION_ERROR` — Qdrant が起動していない
 * - `SESSION_NOT_FOUND` — 指定した session_id が存在しない
 * - `EMBEDDING_ERROR` — 埋め込みベクターの生成に失敗
 * - `VALIDATION_ERROR` — 入力パラメータが不正
 */
export const ErrorCode = {
  QdrantConnectionError: "QDRANT_CONNECTION_ERROR",
  SessionNotFound: "SESSION_NOT_FOUND",
  EmbeddingError: "EMBEDDING_ERROR",
  ValidationError: "VALIDATION_ERROR",
} as const;

/** {@link ErrorCode} のユニオン型 */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * エラーコードに対応する推奨アクション。
 *
 * エラーレスポンスの `action` フィールドとして使用する。
 */
const ERROR_ACTIONS: Record<ErrorCode, string> = {
  QDRANT_CONNECTION_ERROR:
    "docker compose up -d を実行して Qdrant を起動してください",
  SESSION_NOT_FOUND: "list_sessions で一覧を確認してください",
  EMBEDDING_ERROR:
    "make download-model を再実行してモデルを再ダウンロードしてください",
  VALIDATION_ERROR: "error フィールドの詳細を確認してください",
};

/**
 * アプリケーション固有のエラークラス。
 *
 * `code` に {@link ErrorCode} を持ち、`catchToErrorResponse` で
 * 適切な MCP エラーレスポンスに変換される。
 */
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** MCP ツールハンドラーの共通レスポンス型 */
export type ToolResponse = { content: Array<{ type: "text"; text: string }> };

/** エラーを MCP レスポンス形式に変換する */
export function errorResponse(code: ErrorCode, message: string): ToolResponse {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          { error: message, code, action: ERROR_ACTIONS[code] },
          null,
          2,
        ),
      },
    ],
  };
}

/** catch ブロックで受け取った unknown をエラーレスポンスに変換する */
export function catchToErrorResponse(err: unknown): ToolResponse {
  if (err instanceof AppError) {
    return errorResponse(err.code, err.message);
  }

  const msg = err instanceof Error ? err.message : String(err);

  if (
    msg.includes("ECONNREFUSED") ||
    msg.includes("fetch failed") ||
    msg.includes("Failed to fetch") ||
    msg.includes("socket hang up")
  ) {
    return errorResponse(
      ErrorCode.QdrantConnectionError,
      "Qdrant に接続できませんでした",
    );
  }

  throw err;
}

/**
 * ツールハンドラーを try-catch でラップし、エラー時に共通レスポンスを返す。
 *
 * 各ツールで繰り返される try-catch ボイラープレートを削減するためのヘルパー。
 */
export async function withErrorHandling(
  fn: () => Promise<ToolResponse>,
): Promise<ToolResponse> {
  try {
    return await fn();
  } catch (err) {
    return catchToErrorResponse(err);
  }
}
