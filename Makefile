.PHONY: help dev-backend dev-frontend docker-up docker-down seed

help:
	@echo "Trust Graph Platform - Useful Commands"
	@echo "  make dev-backend   Run FastAPI Backend API server locally"
	@echo "  make dev-frontend  Run React Vite Frontend dev server"
	@echo "  make docker-up     Start full environment via Docker Compose"
	@echo "  make docker-down   Stop all Docker Compose services"
	@echo "  make seed          Seed database with demo multi-actor collusion scenarios"

dev-backend:
	cd backend && uvicorn main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down -v

seed:
	cd backend && python db/seed_data.py
