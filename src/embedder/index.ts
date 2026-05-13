import { getExtractor } from "./pipeline.js";
import { AppError, ErrorCode } from "@/errors/index.js";

/**
 * テキストを 768 次元の埋め込みベクターに変換する。
 *
 * mean pooling + L2 正規化を適用し、コサイン類似度での検索に適した形式で返す。
 *
 * @param text 埋め込み対象のテキスト
 * @returns 768 次元の float32 配列
 */
export async function embed(text: string): Promise<number[]> {
  try {
    const ext = await getExtractor();
    const output = await ext(text, { pooling: "mean", normalize: true });
    return Array.from(output.data as Float32Array);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(
      ErrorCode.EmbeddingError,
      "埋め込みベクターの生成に失敗しました",
    );
  }
}
