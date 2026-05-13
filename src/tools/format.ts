import type { SessionPayload } from "@/models/session.js";

/** list_sessions / search_sessions の1行フォーマット */
export function formatSessionLine(
  index: number,
  id: string,
  payload: SessionPayload,
  score?: number,
): string {
  const date = payload.created_at.slice(0, 10);
  const primaryRepo =
    payload.repos.find((r) => r.role === "primary")?.repo ?? "-";
  const scoreStr = score !== undefined ? `[score: ${score.toFixed(2)}] ` : "";
  const line1 = `${index}: ${scoreStr}[${payload.status}] [${date}] ${primaryRepo} - ${payload.title}`;
  const line2 = `     layer: ${payload.layer.join(", ")} / tags: ${payload.tags.join(", ")}`;
  return `${line1}\n${line2}`;
}

/** load_session / preview_session のフル詳細フォーマット */
export function formatSessionDetail(
  id: string,
  payload: SessionPayload,
): string {
  const lines: string[] = [];

  lines.push(`session_id: ${id}`);
  lines.push(`title:      ${payload.title}`);
  lines.push(`summary:    ${payload.summary}`);
  lines.push(`status:     ${payload.status}`);
  lines.push(`layer:      ${payload.layer.join(", ")}`);
  lines.push(`tags:       ${payload.tags.join(", ")}`);
  lines.push(`created_at: ${payload.created_at}`);
  lines.push(`updated_at: ${payload.updated_at}`);

  lines.push(`\nrepos:`);
  for (const r of payload.repos) {
    lines.push(`  - ${r.owner}/${r.repo} (${r.role})`);
  }

  lines.push(`\nkey_decisions:`);
  for (const d of payload.key_decisions) {
    lines.push(`  - ${d}`);
  }

  if (payload.phase) {
    lines.push(`\nphase: ${payload.phase.current} / ${payload.phase.total}`);
    lines.push(`  completed: ${payload.phase.completed_phases.join(", ")}`);
    lines.push(`  next_action: ${payload.phase.next_action}`);
  }

  if (payload.blocked_by.length > 0) {
    lines.push(`\nblocked_by:`);
    for (const b of payload.blocked_by) {
      lines.push(`  - [${b.type}] ${b.title} / ${b.reason}`);
    }
  }

  if (payload.code_references.length > 0) {
    lines.push(`\ncode_references:`);
    for (const c of payload.code_references) {
      lines.push(`  - ${c.file} [${c.symbols.join(", ")}] ${c.note}`);
    }
  }

  if (payload.external_references.length > 0) {
    lines.push(`\nexternal_references:`);
    for (const e of payload.external_references) {
      lines.push(`  - ${e.title} / ${e.note}`);
      lines.push(`    ${e.url}`);
    }
  }

  if (payload.github_references.length > 0) {
    lines.push(`\ngithub_references:`);
    for (const g of payload.github_references) {
      lines.push(`  - [${g.type}] ${g.title} / ${g.note}`);
    }
  }

  if (payload.artifacts.length > 0) {
    lines.push(`\nartifacts:`);
    for (const a of payload.artifacts) {
      lines.push(`  - [${a.type}] ${a.path} / ${a.note}`);
    }
  }

  return lines.join("\n");
}
