# =================================================================
# セットアップ
# =================================================================
.PHONY: install download-model setup
install: ## 依存パッケージをインストールする
	npm install

download-model: ## 埋め込みモデルを事前ダウンロードする
	npm run download-model

setup: install download-model ## install と download-model をまとめて実行する


# =================================================================
# ビルド
# =================================================================
.PHONY: build dev clean
build: ## TypeScript をビルドする
	npm run build

dev: ## TypeScript をウォッチモードでビルドする
	npm run dev

clean: ## ビルド成果物 (dist/) を削除する
	rm -rf dist


# =================================================================
# Qdrant
# =================================================================
.PHONY: up down logs
up: ## Qdrant コンテナを起動する
	docker compose up -d

down: ## Qdrant コンテナを停止・削除する
	docker compose down

logs: ## Qdrant コンテナのログを表示する
	docker compose logs -f qdrant


# =================================================================
# other
# =================================================================
.PHONY: help
help: ## ヘルプを表示する
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
