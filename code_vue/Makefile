# Name of the image
IMAGE_NAME=blockenspiel

# Dev mode (watch with hot reload)
watch:
	docker compose -f docker-compose.dev.yml down -v
	docker compose -f docker-compose.dev.yml up --build

# Prod mode (build and serve with nginx)
prod:
	docker compose -f docker-compose.yml up --build

# Optional cleanup commands
stop:
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.dev.yml down

clean:
	docker system prune -f

test:
	npx vitest