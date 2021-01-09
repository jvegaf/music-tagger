makeSHELL = /bin/sh

.PHONY: preps
preps:
	@npm install

.PHONY: start
start:
	@npm run build:start

.PHONY: clean
clean:
	@rm -rf dist

.PHONY: pack
pack: clean save-the-world
	@npm run build:make

.PHONY: save-the-world
save-the-world:
	@rm -rf out
