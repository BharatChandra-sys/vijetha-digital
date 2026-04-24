PYTHON ?= python
PIP ?= pip

.PHONY: dev test lint fmt migrate seed docker-up docker-down precommit

dev:
	$(PYTHON) -m uvicorn app.main:app --reload

test:
	$(PYTHON) -m pytest tests -q

lint:
	$(PYTHON) -m ruff check app tests

fmt:
	$(PYTHON) -m ruff format app tests

migrate:
	$(PYTHON) -m alembic upgrade head

seed:
	$(PYTHON) scripts/seed_admin.py

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

precommit:
	pre-commit run --all-files
