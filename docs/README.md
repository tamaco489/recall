# recall

[日本語](./README.ja.md)

Session memory MCP server for Claude Code.
Stores and retrieves conversation context using Qdrant as a vector store.

## Prerequisites

- Node.js >= 22
- Docker

## Setup

```bash
# Install dependencies and download embedding model
make setup

# Start Qdrant
make up

# Build and start MCP server
make start
```

## Development Commands

| Command       | Description                           |
| ------------- | ------------------------------------- |
| `make setup`  | Install dependencies & download model |
| `make build`  | Compile TypeScript                    |
| `make dev`    | Watch mode build                      |
| `make start`  | Build and start MCP server            |
| `make up`     | Start Qdrant container                |
| `make down`   | Stop Qdrant container                 |
| `make health` | Check Qdrant health                   |
| `make clean`  | Remove build artifacts                |
