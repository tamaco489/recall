# =================================================================
# setup
# =================================================================
.PHONY: install download-model setup
install: ## 依存パッケージをインストールする
	npm install

download-model: ## 埋め込みモデルを事前ダウンロードする
	npm run download-model

setup: install download-model ## install と download-model をまとめて実行する


# =================================================================
# dev
# =================================================================
.PHONY: build dev clean start
build: ## TypeScript をビルドする
	npm run build

dev: ## TypeScript をウォッチモードでビルドする
	npm run dev

clean: ## ビルド成果物 (dist/) を削除する
	rm -rf dist

start: build ## ビルドして MCP サーバーを起動する
	node dist/index.js


# =================================================================
# Qdrant
# =================================================================
.PHONY: up down logs rebuild
up: ## Qdrant コンテナを起動する
	docker compose up -d

down: ## Qdrant コンテナを停止・削除する
	docker compose down

logs: ## Qdrant コンテナのログを表示する
	docker compose logs -f qdrant

rebuild: ## Qdrant コンテナをキャッシュなしで再ビルドして起動する
	docker compose down -v
	docker compose pull
	docker compose up -d

.PHONY: health collections
health: ## Qdrant のヘルスチェックを行う
	curl -s http://localhost:6333/ | jq .

collections: ## Qdrant のコレクション一覧を表示する
	curl -s http://localhost:6333/collections | jq .


# =================================================================
# other
# =================================================================
.PHONY: help
help: ## ヘルプを表示する
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
