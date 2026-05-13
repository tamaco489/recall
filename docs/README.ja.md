# recall

[English](./README.md)

Claude Code 向けのセッションメモリ MCP サーバー。
Qdrant をベクターストアとして使用し、会話のコンテキストを保存・検索する。

## 前提条件

- Node.js >= 22
- Docker

## インストール

```bash
# 1. リポジトリをクローン
git clone https://github.com/tamaco489/recall.git
cd recall

# 2. 依存パッケージのインストールと埋め込みモデルのダウンロード
make setup

# 3. Qdrant を起動
make up

# 4. ビルド
make build
```

## Claude Code への登録

`/path/to/recall` はクローンした recall リポジトリの絶対パスに置き換える。

**グローバル (どのリポジトリからも使える):**

```bash
claude mcp add --scope user recall -- node /path/to/recall/dist/index.js
```

**プロジェクト共有 (`.claude/settings.json` に保存、チームで共有):**

```bash
claude mcp add --scope project recall -- node /path/to/recall/dist/index.js
```

**個人のみ (`~/.claude.json` にプロジェクトスコープで保存、git 管理外):**

```bash
claude mcp add --scope local recall -- node /path/to/recall/dist/index.js
```

登録確認:

```bash
claude mcp list
```

Claude Code を再起動して設定を反映する。

## 提供ツール一覧

| ツール             | 説明                                                  |
| ------------------ | ----------------------------------------------------- |
| `preview_session`  | 保存前にセッション内容をプレビューする                |
| `save_session`     | セッションを Qdrant に保存する                        |
| `list_sessions`    | 最近のセッションを降順で一覧表示する                  |
| `load_session`     | 番号または session ID でセッションをロードする        |
| `search_sessions`  | 自然言語クエリでセマンティック検索する                |
| `update_session`   | 指定フィールドのみ部分更新する                        |
| `compact_sessions` | 対象セッションの生データを返す (要約は Claude が行う) |
| `delete_session`   | session_ids で指定したセッションを一括削除する        |

## 使用例

```text
# プレビューして保存
今日の作業をプレビューして保存して。タイトル「recall Phase 6」、リポジトリ: tamaco489/recall、layer: backend

# 一覧表示
list_sessions で一覧を見せて

# セッションのロード
1番のセッションをロードして

# セマンティック検索
「Qdrant ベクターストア実装」に関連するセッションを検索して

# セッション更新
セッション abc123 のステータスを completed に更新して

# セッション削除
abc123 と def456 のセッションを削除して
```
