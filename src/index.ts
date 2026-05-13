#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initCollection } from "@/store/index.js";

/**
 * recall MCP サーバーのエントリポイント。
 *
 * 起動時に Qdrant コレクションを初期化し、stdio トランスポートで MCP サーバーを起動する。
 * ログは MCP プロトコルの stdout を汚染しないよう、すべて stderr に出力する。
 */
const server = new McpServer({
  name: "recall",
  version: "0.1.0",
});

await initCollection();

/** Claude Code との通信に stdio を使用する。MCP は stdout を制御チャネルとして使うため、ログは stderr のみ */
const transport = new StdioServerTransport();

/** トランスポートを接続して MCP サーバーをリクエスト待機状態にする */
await server.connect(transport);

process.stderr.write("recall MCP server started\n");
