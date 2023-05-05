NAME = 42t

COMPOSE_DIR = .
DOCKER_COMPOSE = docker-compose

up:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DIR)/docker-compose.yaml up -d --build

down:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DIR)/docker-compose.yaml down

clean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DIR)/docker-compose.yaml down --rmi all

re:	clean up

.PHONY:	up down clean