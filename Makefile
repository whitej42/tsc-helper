default: help

help: # Show help for each of the Makefile recipes.
	@grep -E '^[a-zA-Z0-9._-]+:.*#' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*# ";} {printf "\033[36m  %-30s\033[0m %s\n", $$1, $$2}'

run:
	npm start

route-builder:
	node scripts/route-builder.js