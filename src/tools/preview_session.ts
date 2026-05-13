import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolName } from "@/constants/index.js";
import { SessionInputSchema } from "@/tools/schemas.js";
import { formatSessionDetail } from "@/tools/format.js";

/**
 * 保存予定データをプレビューする。Qdrant への書き込みは行わない。
 *
 * Claude が会話内容から SessionPayload を生成してユーザーに提示し、
 * 確認・修正を受け付ける。ユーザーが OK を出したら save_session を呼び出す。
 */
export function registerPreviewSession(server: McpServer): void {
  server.registerTool(
    ToolName.PreviewSession,
    {
      description:
        "保存予定のセッションデータをプレビューする。Qdrant への書き込みは行わない。ユーザーが OK を出したら save_session を呼び出す。",
      inputSchema: SessionInputSchema,
    },
    async (input) => {
      const payload = {
        ...input,
        compacted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const text = [
        "以下の内容で保存します。よろしいですか？",
        "",
        formatSessionDetail("(未採番)", payload),
      ].join("\n");

      return { content: [{ type: "text", text }] };
    },
  );
}
