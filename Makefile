NAME = ft_transcendence

# ANSI colors
GREEN  = \033[1;32m
BLUE   = \033[1;34m
YELLOW = \033[1;33m
RED    = \033[1;31m
RESET  = \033[0m

build:
	@echo "$(BLUE)[+] Building containers...$(RESET)"
	@docker-compose build

up:
	@echo "$(GREEN)[+] Starting containers in background...$(RESET)"
	@docker-compose up

run:
	@echo "$(GREEN)[+] Building & starting containers in background...$(RESET)"
	@docker-compose up --build

re:
	@echo "$(YELLOW)[!] Rebuilding with no cache & starting...$(RESET)"
	@docker-compose down
	@docker-compose build --no-cache
	@docker-compose up

down:
	@echo "$(RED)[x] Stopping containers...$(RESET)"
	@docker-compose down

logs:
	@echo "$(BLUE)[+] Tailing logs (ctrl-C to stop)...$(RESET)"
	@docker-compose logs -f --tail=100

fclean: down
	@echo "$(RED)[x] Removing node_modules...$(RESET)"
	@rm -rf frontend/node_modules backend/node_modules
	@echo "$(RED)[x] Clean complete.$(RESET)"

.PHONY: build up run re down logs fclean
