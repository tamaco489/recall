import { z } from "zod";

export const RepoSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  role: z.enum(["primary", "related"]),
});

export const PhaseSchema = z.object({
  current: z.number(),
  total: z.number(),
  completed_phases: z.array(z.string()),
  next_action: z.string(),
});

export const BlockedBySchema = z.object({
  type: z.enum(["issue", "pr", "session"]),
  url: z.string(),
  title: z.string(),
  reason: z.string(),
});

export const CodeReferenceSchema = z.object({
  file: z.string(),
  symbols: z.array(z.string()),
  note: z.string(),
});

export const ExternalReferenceSchema = z.object({
  url: z.string(),
  title: z.string(),
  quote: z.string(),
  note: z.string(),
});

export const GitHubReferenceSchema = z.object({
  type: z.enum(["issue", "pr", "discussion"]),
  url: z.string(),
  title: z.string(),
  note: z.string(),
});

export const ArtifactSchema = z.object({
  type: z.enum(["branch", "migration", "tag", "file"]),
  path: z.string(),
  note: z.string(),
});

export type Repo = z.infer<typeof RepoSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type BlockedBy = z.infer<typeof BlockedBySchema>;
export type CodeReference = z.infer<typeof CodeReferenceSchema>;
export type ExternalReference = z.infer<typeof ExternalReferenceSchema>;
export type GitHubReference = z.infer<typeof GitHubReferenceSchema>;
export type Artifact = z.infer<typeof ArtifactSchema>;
