# ──────────────────────────────────────────────
# Birhan Garage — Makefile
# ──────────────────────────────────────────────

.PHONY: help dev build up down restart logs shell clean pnpm-install

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@echo ""

# ── Local development ──────────────────────────
pnpm-install: ## Install dependencies with pnpm
	pnpm install

dev-local: ## Run dev server locally (no Docker)
	pnpm dev

# ── Docker: development ────────────────────────
dev: ## Start hot-reload dev server in Docker
	docker compose --profile dev up --build

# ── Docker: production ────────────────────────
build: ## Build production Docker image
	docker compose build

up: ## Start production app (detached)
	docker compose up -d app

down: ## Stop all containers
	docker compose down

restart: ## Restart production app
	docker compose restart app

logs: ## Tail app logs
	docker compose logs -f app

shell: ## Open shell in running container
	docker compose exec app sh

# ── Maintenance ────────────────────────────────
clean: ## Remove containers, images, volumes
	docker compose down --rmi local --volumes --remove-orphans
	docker image prune -f

status: ## Show container status
	docker compose ps

health: ## Check app health endpoint
	curl -s http://localhost:$${PORT:-3000}/health
