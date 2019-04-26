npm=npm run
build=build
dev=serve
lint=wotan

.PHONY: build lint

help:
	@echo "usage: make [target]"
	@echo ""
	@echo "targets:"
	@echo "  dev     - Opens the development environment"
	@echo "  build   - Runs the build process"
	@echo "  lint    - Runs the linter (${lint})"
	@echo ""
	@echo "This makefile only exists for Windows users that use a linux subsystem."
	@echo "This makefile starts a powershell command corresponding to the needed target."
	@echo ""

dev:
	@echo "Starting development environment..."
	powershell.exe ${npm} ${dev}

build:
	@echo "Starting build process..."
	powershell.exe ${npm} ${build}

lint:
	@echo "Starting lint process..."
	powershell.exe ${npm} ${lint}
