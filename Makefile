SHELL = /bin/sh

.PHONY: preps
preps:
	@yarn install

.PHONY: start
start:
	@yarn run electron

.PHONY: clean
clean:
	@rm -rf dist

.PHONY: pack
build: clean save-the-world
	@yarn run electron:pack

save-the-world:
	@rm -rf release
