#!/usr/bin/env bash

MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
MY_DIR="${MY_DIR:?}"
SCRIPTS_DIR="$(realpath "${MY_DIR}/..")"
ROOT_DIR="$(realpath "${SCRIPTS_DIR}/..")"
REPORTS_DIR="${ROOT_DIR}/reports"

. "${SCRIPTS_DIR}/lib.sh"

yarn -s eslint \
  --ignore-path .gitignore \
  "${ROOT_DIR}/**/*.js"
