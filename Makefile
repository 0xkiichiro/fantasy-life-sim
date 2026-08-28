IMAGE := fantasy-life-sim
DEV_CONTAINER := $(IMAGE)-dev
PROD_CONTAINER := $(IMAGE)-prod
DEV_PORT := 5173
PROD_PORT := 8080

.PHONY: run run-prod build build-dev build-prod typecheck stop clean shell logs

run: build-dev
	docker run --rm -it \
		--name $(DEV_CONTAINER) \
		-p $(DEV_PORT):5173 \
		-v $(CURDIR)/src:/app/src \
		-v $(CURDIR)/index.html:/app/index.html \
		-v $(CURDIR)/vite.config.ts:/app/vite.config.ts \
		-v $(CURDIR)/tsconfig.json:/app/tsconfig.json \
		$(IMAGE):dev

run-prod: build-prod
	docker run --rm -it \
		--name $(PROD_CONTAINER) \
		-p $(PROD_PORT):80 \
		$(IMAGE):prod

build: build-prod

build-dev:
	docker build --target dev -t $(IMAGE):dev .

build-prod:
	docker build --target prod -t $(IMAGE):prod .

typecheck:
	docker build --target build -t $(IMAGE):build .

shell: build-dev
	docker run --rm -it -v $(CURDIR)/src:/app/src $(IMAGE):dev sh

logs:
	docker logs -f $(DEV_CONTAINER)

stop:
	-docker stop $(DEV_CONTAINER) $(PROD_CONTAINER)

clean: stop
	-docker rmi $(IMAGE):dev $(IMAGE):prod $(IMAGE):build
