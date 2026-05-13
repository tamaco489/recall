// ── 埋め込みモデル ──────────────────────────────────────────────────────────

/** 使用する埋め込みモデル */
export const EMBED_MODEL = "nomic-ai/nomic-embed-text-v1.5";

/** モデル初期化失敗時の最大リトライ回数 */
export const EMBED_MAX_RETRIES = 3;

/** nomic-embed-text-v1.5 の出力ベクター次元数 */
export const VECTOR_SIZE = 768;

/** @huggingface/transformers pipeline で使用するタスク種別 */
export const PipelineTask = {
  FeatureExtraction: "feature-extraction",
  TextClassification: "text-classification",
  TextGeneration: "text-generation",
  Translation: "translation",
  QuestionAnswering: "question-answering",
} as const;

export type PipelineTask = (typeof PipelineTask)[keyof typeof PipelineTask];

// ── Qdrant ──────────────────────────────────────────────────────────────────

/** Qdrant サーバーの接続 URL */
export const QDRANT_URL = "http://localhost:6333";

/** セッションデータを格納する Qdrant コレクション名 */
export const COLLECTION_NAME = "claude_sessions";

// ── クエリ ──────────────────────────────────────────────────────────────────

/** list_sessions / search_sessions のデフォルト取得件数 */
export const LIST_DEFAULT_LIMIT = 5;

/** list_sessions / search_sessions の最大取得件数 */
export const LIST_MAX_LIMIT = 10;
