#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "recall",
  version: "0.1.0",
});

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("recall MCP server started\n");
