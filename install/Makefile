.PHONY: build run run-client mupen-config client-config stop-client stop rm rm-client .network

BASH := $(shell which bash)
SHELL := $(BASH)
CLIENT_PORT := $(shell expr 5900 + $(PLAYER_NUM))
NOVNCPORT := $(shell expr 8000 + $(PLAYER_NUM))

mupen-config:
	ruby util/gentranslation.rb > config/keysym-translation.json
	ruby util/genmupencfg.rb > config/mupen64plus.cfg

build: mupen-config
	docker compose build ..

run:
	docker compose up -f ../docker-compose.yml

stop:
	docker compose down -f ../docker-compose.yml

rm:
	docker compose rm -f ../docker-compose.yml

# \
tag: \
	docker tag $(SERVER_IMAGE_NAME) itstehkman/$(SERVER_IMAGE_NAME) \
	docker tag $(CLIENT_IMAGE_NAME) itstehkman/$(CLIENT_IMAGE_NAME) \
\
push: \
	$(MAKE) tag \
	docker push itstehkman/$(SERVER_IMAGE_NAME) \
	docker push itstehkman/$(CLIENT_IMAGE_NAME)
