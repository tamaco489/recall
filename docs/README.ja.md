# recall

[English](./README.md)

Claude Code 向けのセッションメモリ MCP サーバーです。
会話セッションをベクトル埋め込みとして Qdrant に保存し、セマンティック検索とコンテキスト呼び出しを実現します。

## recall が提供するもの

- **永続セッションメモリ** — 意思決定・コード参照・GitHub リンク・成果物などの作業コンテキストを構造化レコードとして保存します
- **セマンティック検索** — ベクトル類似度検索により、自然言語クエリで過去のセッションを取得できます
- **完全ローカル** — 埋め込みモデルはデバイス上で動作し、外部 API 呼び出しやデータ送信は一切行いません

## 技術スタック

| コンポーネント | 詳細 |
| --- | --- |
| 言語 | TypeScript (ESM) |
| プロトコル | MCP (Model Context Protocol) |
| ベクターストア | Qdrant (Docker) |
| 埋め込みモデル | [nomic-ai/nomic-embed-text-v1.5](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) (768 次元、ローカル) |
| スキーマ検証 | Zod |

## 提供ツール一覧 (8 本)

| ツール | 説明 |
| --- | --- |
| `preview_session` | 保存前にセッション内容をプレビューします |
| `save_session` | セッションを Qdrant に保存します |
| `list_sessions` | 最近のセッションを降順で一覧表示します |
| `load_session` | 番号または session ID でセッションをロードします |
| `search_sessions` | 自然言語クエリでセマンティック検索します |
| `update_session` | 指定フィールドのみ部分更新します |
| `compact_sessions` | 対象セッションの生データを返します (要約は Claude が行います) |
| `delete_session` | session_ids で指定したセッションを一括削除します |

## アーキテクチャ

![recall Architecture](./architecture.svg)

1. `save_session` 実行時、セッションテキストをローカル埋め込みモデルで 768 次元のベクトルに変換し、構造化ペイロードとともに Qdrant に保存します。
2. `search_sessions` 実行時、クエリを同様にベクトル化し、Qdrant がコサイン類似度で最近傍のセッションを返します。
3. すべての処理はローカルで完結し、データが外部へ送信されることはありません。

## 前提条件

- Node.js >= 22
- Docker

## セットアップ

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

`/path/to/recall` はクローンした recall リポジトリの絶対パスに置き換えてください。

**グローバル (どのリポジトリからも使えます):**

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

登録を確認します:

```bash
claude mcp list
```

Claude Code を再起動して設定を反映させてください。

## 使用例

```text
# 今日の作業をプレビューして保存
今日の作業をプレビューして保存して。
タイトル「recall Phase 6」、リポジトリ: tamaco489/recall、layer: backend

# 一覧表示
list_sessions で一覧を見せて

# セッションのロード
1 番のセッションをロードして

# セマンティック検索
「Qdrant ベクターストア実装」に関連するセッションを検索して

# セッション更新
セッション abc123 のステータスを completed に更新して

# 古いセッションを圧縮 (compact_sessions で生データを取得 → Claude が要約 → save_session で保存)
2 週間以上前のセッションの生データを取得して、要約したうえで save_session で保存して

# セッション削除
abc123 と def456 のセッションを削除して
```
