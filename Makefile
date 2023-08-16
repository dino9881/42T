NAME = 42t

COMPOSE_DIR = .
DOCKER_COMPOSE = docker compose
COMPOSE_SRC = docker-compose.yaml

up:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DIR)/$(COMPOSE_SRC) up -d

down:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DIR)/$(COMPOSE_SRC) down

log:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DIR)/$(COMPOSE_SRC) logs -f

clean:
	$(DOCKER_COMPOSE) -f $(COMPOSE_DIR)/$(COMPOSE_SRC) down --rmi all --remove-orphans -v

fclean: clean
	rm -rf ./data

re:	fclean up

.PHONY:	up down clean fclean re log