import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, COLLECTION_NAME, VECTOR_SIZE } from "@/constants/index.js";

export const qdrant = new QdrantClient({ url: QDRANT_URL });

/** 起動時にコレクションの存在を確認し、なければ自動作成する */
export async function initCollection(): Promise<void> {
  try {
    await qdrant.getCollection(COLLECTION_NAME);
  } catch {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: { size: VECTOR_SIZE, distance: "Cosine" },
    });
    // order_by: created_at で降順ソートするために datetime インデックスを作成する
    await qdrant.createPayloadIndex(COLLECTION_NAME, {
      field_name: "created_at",
      field_schema: "datetime",
    });
  }
}
