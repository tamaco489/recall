import { pipeline } from "@huggingface/transformers";
import { EMBED_MODEL, EMBED_MAX_RETRIES, PipelineTask } from "@/constants.js";

/**
 * pipeline インスタンスをシングルトンで返す。
 *
 * 未初期化の場合のみ initWithRetry() を呼び出し、以降は同じインスタンスを使い回す。
 */
export async function getExtractor(): Promise<EmbedFn> {
  if (!extractor) {
    extractor = await initWithRetry();
  }
  return extractor;
}

/**
 * @huggingface/transformers の feature-extraction pipeline の呼び出し型。
 *
 * pipeline() の戻り値はタスクごとに異なる Union 型で TypeScript が表現できないため、
 * 実際に使用するシグネチャのみを定義して unknown 経由でキャストする。
 */
export type EmbedFn = (
  input: string,
  options: { pooling: string; normalize: boolean },
) => Promise<{ data: ArrayLike<number> }>;

/** 初期化済みの pipeline インスタンス。サーバー起動中は使い回す */
let extractor: EmbedFn | null = null;

/**
 * pipeline の初期化を指数バックオフで最大 EMBED_MAX_RETRIES 回試みる。
 *
 * キャッシュが壊れている場合など一時的な失敗をリカバリするため。
 * - 1回目失敗 → 2秒待機 → 2回目
 * - 2回目失敗 → 4秒待機 → 3回目
 * - 3回目失敗 → エラーをスローして終了
 */
async function initWithRetry(): Promise<EmbedFn> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < EMBED_MAX_RETRIES; attempt++) {
    try {
      // pipeline() の戻り値 Union 型は TS で表現できないため EmbedFn にキャスト
      return (await pipeline(
        PipelineTask.FeatureExtraction,
        EMBED_MODEL,
      )) as unknown as EmbedFn;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // 最後の試行の場合は待機せずそのままループを抜けてエラーをスロー
      if (attempt < EMBED_MAX_RETRIES - 1) {
        // 2 ** (attempt + 1) * 1000: 1回目失敗 → 2秒, 2回目失敗 → 4秒
        const waitMs = 2 ** (attempt + 1) * 1000;
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }
  throw new Error(
    `埋め込みモデルの初期化に失敗しました (${EMBED_MAX_RETRIES}回試行)。` +
      `npm run download-model を再実行してください。原因: ${lastError?.message}`,
  );
}
