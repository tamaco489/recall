import type {
  Repo,
  Phase,
  BlockedBy,
  CodeReference,
  ExternalReference,
  GitHubReference,
  Artifact,
} from "@/schemas/index.js";

export type {
  Repo,
  Phase,
  BlockedBy,
  CodeReference,
  ExternalReference,
  GitHubReference,
  Artifact,
};

export const Status = {
  InProgress: "in_progress",
  Blocked: "blocked",
  Completed: "completed",
  Abandoned: "abandoned",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Layer = {
  Backend: "backend",
  Frontend: "frontend",
  Infra: "infra",
  CI: "ci",
  Document: "document",
  Knowledge: "knowledge",
} as const;

export type Layer = (typeof Layer)[keyof typeof Layer];

export type SessionPayload = {
  title: string;
  summary: string;
  status: Status;
  key_decisions: string[];
  repos: Repo[];
  layer: Layer[];
  phase: Phase | null;
  blocked_by: BlockedBy[];
  code_references: CodeReference[];
  external_references: ExternalReference[];
  github_references: GitHubReference[];
  artifacts: Artifact[];
  tags: string[];
  compacted: boolean;
  created_at: string;
  updated_at: string;
};
