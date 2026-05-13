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

export type Repo = {
  owner: string;
  repo: string;
  role: "primary" | "related";
};

export type Phase = {
  current: number;
  total: number;
  completed_phases: string[];
  next_action: string;
};

export type BlockedBy = {
  type: "issue" | "pr" | "session";
  url: string;
  title: string;
  reason: string;
};

export type CodeReference = {
  file: string;
  symbols: string[];
  note: string;
};

export type ExternalReference = {
  url: string;
  title: string;
  quote: string;
  note: string;
};

export type GitHubReference = {
  type: "issue" | "pr" | "discussion";
  url: string;
  title: string;
  note: string;
};

export type Artifact = {
  type: "branch" | "migration" | "tag" | "file";
  path: string;
  note: string;
};

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
