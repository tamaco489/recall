# recall

[日本語](./README.ja.md)

Session memory MCP server for Claude Code.
Stores and retrieves conversation context using Qdrant as a vector store.

## Prerequisites

- Node.js >= 22
- Docker

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/tamaco489/recall.git
cd recall

# 2. Install dependencies and download the embedding model
make setup

# 3. Start Qdrant
make up

# 4. Build
make build
```

## Register with Claude Code

Replace `/path/to/recall` with the absolute path where you cloned the repository.

**Global (available from any repository):**

```bash
claude mcp add --scope user recall -- node /path/to/recall/dist/index.js
```

**Per-project, shared with team (stored in `.claude/settings.json`):**

```bash
claude mcp add --scope project recall -- node /path/to/recall/dist/index.js
```

**Per-project, personal only (stored in `~/.claude.json` scoped to the project):**

```bash
claude mcp add --scope local recall -- node /path/to/recall/dist/index.js
```

Verify registration:

```bash
claude mcp list
```

Restart Claude Code to apply the change.

## Available Tools

| Tool               | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| `preview_session`  | Preview session data before saving                              |
| `save_session`     | Save a session to Qdrant                                        |
| `list_sessions`    | List recent sessions in reverse chronological order             |
| `load_session`     | Load a session by number or session ID                          |
| `search_sessions`  | Semantic search using a natural language query                  |
| `update_session`   | Partially update specified fields                               |
| `compact_sessions` | Return raw session data for Claude to summarize and consolidate |
| `delete_session`   | Delete one or more sessions by session ID                       |

## Usage Example

```text
# Preview and save
Preview and save today's work. Title: "recall Phase 6", repo: tamaco489/recall, layer: backend

# List sessions
Show me the list with list_sessions

# Load a session
Load session number 1

# Search sessions
Search for sessions related to "Qdrant vector store implementation"

# Update a session
Update the status of session abc123 to completed

# Delete a session
Delete sessions with IDs abc123 and def456
```
