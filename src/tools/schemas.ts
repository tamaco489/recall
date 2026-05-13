import { z } from "zod";
import {
  RepoSchema,
  PhaseSchema,
  BlockedBySchema,
  CodeReferenceSchema,
  ExternalReferenceSchema,
  GitHubReferenceSchema,
  ArtifactSchema,
} from "@/schemas/index.js";

/** save_session / preview_session の共通入力スキーマ */
export const SessionInputSchema = z.object({
  title: z.string().describe("セッションの短いタイトル"),
  summary: z.string().describe("セッション全体の要約 (500字程度)"),
  status: z
    .enum(["in_progress", "blocked", "completed", "abandoned"])
    .describe("作業の進行状態"),
  key_decisions: z.array(z.string()).describe("主要な意思決定の箇条書き"),
  repos: z.array(RepoSchema).describe("関連リポジトリ"),
  layer: z
    .array(
      z.enum(["backend", "frontend", "infra", "ci", "document", "knowledge"]),
    )
    .describe("変更対象レイヤー"),
  phase: PhaseSchema.nullable().describe("フェーズ進捗。管理不要な場合は null"),
  blocked_by: z
    .array(BlockedBySchema)
    .describe("ブロッカー・依存関係 (なければ [])"),
  code_references: z
    .array(CodeReferenceSchema)
    .describe("触ったファイル・関数・変数 (なければ [])"),
  external_references: z
    .array(ExternalReferenceSchema)
    .describe("参照したドキュメント URL (なければ [])"),
  github_references: z
    .array(GitHubReferenceSchema)
    .describe("関連 Issue / PR / Discussion (なければ [])"),
  artifacts: z.array(ArtifactSchema).describe("成果物 (なければ [])"),
  tags: z.array(z.string()).describe("検索用タグ"),
});

export type SessionInput = z.infer<typeof SessionInputSchema>;
