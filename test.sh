#!/bin/sh

CYAN='\033[1;36m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e ${CYAN}============== Testing client ==============${NC}
yarn --cwd client coverage
yarn --cwd client lint

echo -e ${CYAN}============== Testing server ==============${NC}
yarn --cwd server coverage
yarn --cwd server lint

echo -e ${GREEN}============== SUCCESS! ==============${NC}
