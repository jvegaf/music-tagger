makeSHELL = /bin/sh

.PHONY: preps
preps:
	@npm install

.PHONY: start
start:
	@npm run start

.PHONY: dev
start:
	@npm run build:start

.PHONY: clean
clean:
	@rm -rf dist

.PHONY: pack
build: clean save-the-world
	@npm run electron:pack

save-the-world:
	@rm -rf release
