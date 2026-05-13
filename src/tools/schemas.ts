import { z } from "zod";

const RepoSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  role: z.enum(["primary", "related"]),
});

const PhaseSchema = z.object({
  current: z.number(),
  total: z.number(),
  completed_phases: z.array(z.string()),
  next_action: z.string(),
});

const BlockedBySchema = z.object({
  type: z.enum(["issue", "pr", "session"]),
  url: z.string(),
  title: z.string(),
  reason: z.string(),
});

const CodeReferenceSchema = z.object({
  file: z.string(),
  symbols: z.array(z.string()),
  note: z.string(),
});

const ExternalReferenceSchema = z.object({
  url: z.string(),
  title: z.string(),
  quote: z.string(),
  note: z.string(),
});

const GitHubReferenceSchema = z.object({
  type: z.enum(["issue", "pr", "discussion"]),
  url: z.string(),
  title: z.string(),
  note: z.string(),
});

const ArtifactSchema = z.object({
  type: z.enum(["branch", "migration", "tag", "file"]),
  path: z.string(),
  note: z.string(),
});

/** save_session / preview_session の共通入力スキーマ */
export const SessionInputSchema = {
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
};
