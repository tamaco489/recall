/** 使用する埋め込みモデル。768 次元ベクターを生成する */
export const EMBED_MODEL = "nomic-ai/nomic-embed-text-v1.5";

/** モデル初期化失敗時の最大リトライ回数 */
export const EMBED_MAX_RETRIES = 3;

/** @huggingface/transformers pipeline で使用するタスク種別 */
export const PipelineTask = {
  FeatureExtraction: "feature-extraction",
  TextClassification: "text-classification",
  TextGeneration: "text-generation",
  Translation: "translation",
  QuestionAnswering: "question-answering",
} as const;

export type PipelineTask = (typeof PipelineTask)[keyof typeof PipelineTask];
