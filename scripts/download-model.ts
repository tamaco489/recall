import { pipeline } from "@huggingface/transformers";
import { EMBED_MODEL, PipelineTask } from "../src/constants.js";

process.stderr.write(`モデルをダウンロード中: ${EMBED_MODEL}\n`);
await pipeline(PipelineTask.FeatureExtraction, EMBED_MODEL);
process.stderr.write("ダウンロード完了\n");
