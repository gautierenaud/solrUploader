.PHONY: help lint init
help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

lint: ## check the linting of the project
	@flake8 solr_uploader

init: ## install all dependencies for development
	pip install -e .[dev]

serve: ## start local solr instance
	@docker-compose up