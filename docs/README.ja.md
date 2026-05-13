# recall

[English](./README.md)

Claude Code 向けのセッションメモリ MCP サーバー。
Qdrant をベクターストアとして使用し、会話のコンテキストを保存・検索する。

## 前提条件

- Node.js >= 22
- Docker

## セットアップ

```bash
# 依存パッケージのインストールと埋め込みモデルのダウンロード
make setup

# Qdrant 起動
make up

# ビルド & MCP サーバー起動
make start
```

## 開発コマンド一覧

| コマンド      | 内容                                            |
| ------------- | ----------------------------------------------- |
| `make setup`  | 依存パッケージインストール & モデルダウンロード |
| `make build`  | TypeScript をビルドする                         |
| `make dev`    | ウォッチモードでビルドする                      |
| `make start`  | ビルドして MCP サーバーを起動する               |
| `make up`     | Qdrant コンテナを起動する                       |
| `make down`   | Qdrant コンテナを停止する                       |
| `make health` | Qdrant のヘルスチェックを行う                   |
| `make clean`  | ビルド成果物を削除する                          |
