npm=npm
run=run
run_npm=${npm} ${run}
build=build
dev=serve
lint=wotan
install=install

.PHONY: build lint install

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
	powershell.exe ${npm_run} ${dev}

build:
	@echo "Starting build process..."
	powershell.exe ${npm_run} ${build}

lint:
	@echo "Starting lint process..."
	powershell.exe ${npm_run} ${lint}

install:
	@echo "Starting install process..."
	powershell.exe ${npm} ${install}
