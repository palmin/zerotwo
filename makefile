npm=npm
run=run
run_npm=${npm} ${run}
build=build
dev=serve
lint=lint
install=install

.PHONY: build lint install

help:
	@echo "usage: make [target]"
	@echo ""
	@echo "targets:"
	@echo "  dev     - Opens the development environment"
	@echo "  build   - Runs the build process"
	@echo "  lint    - Runs the linter (${lint})"
	@echo "  install - Runs the npm install process (${npm} ${install})"
	@echo ""
	@echo "This makefile only exists for Windows users that use a linux subsystem."
	@echo "This makefile starts a powershell command corresponding to the needed target."
	@echo ""

dev:
	@echo "Starting development environment..."
	powershell.exe ${run_npm} ${dev}

build:
	@echo "Starting build process..."
	powershell.exe ${run_npm} ${build}

lint:
	@echo "Starting lint process..."
	powershell.exe ${run_npm} ${lint}

install:
	@echo "Starting install process..."
	powershell.exe ${npm} ${install}
