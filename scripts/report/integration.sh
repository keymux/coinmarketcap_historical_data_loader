#!/usr/bin/env bash

# TODO: Move all of this js stuff into a node module
# Tests the binary file scripts/prevent_clobber.js

MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
MY_DIR="${MY_DIR:?}"
SCRIPTS_DIR="$(realpath "${MY_DIR}/..")"
ROOT_DIR="$(realpath "${SCRIPTS_DIR}/..")"
INTEGRATION_DIR="${ROOT_DIR}/test/integration"
REPORTS_DIR="${ROOT_DIR}/reports"
MOCHAWESOME_JSON="${REPORTS_DIR}/integration/mochawesome.json"
MARKDOWN_FILE="${REPORTS_DIR}/integration.md"

yarn mocha \
  --recursive \
  --reporter=mochawesome \
  --reporter-options "reportDir=${REPORTS_DIR}/integration" \
  "${INTEGRATION_DIR}" \
  && \
yarn -s mochawesome_to_markdown \
  --mochawesome "${MOCHAWESOME_JSON}" \
  | tee -a ${MARKDOWN_FILE}
