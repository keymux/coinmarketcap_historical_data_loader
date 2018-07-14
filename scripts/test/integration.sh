#!/usr/bin/env bash

# TODO: Move all of this js stuff into a node module
# Tests the binary file scripts/prevent_clobber.js

MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
MY_DIR="${MY_DIR:?}"
SCRIPTS_DIR="$(realpath "${MY_DIR}/..")"
ROOT_DIR="$(realpath "${SCRIPTS_DIR}/..")"
INTEGRATION_DIR="${ROOT_DIR}/test/integration"
REPORTS_DIR="/tmp/reports"

. "${SCRIPTS_DIR}/lib.sh"

if [ ! -d "test/wiremock/__files" ]; then
  "${SCRIPTS_DIR}/get_and_unpack_wiremock_tgz.sh"
fi

[ -f /.dockerenv ] || dockerComposeUp

export WIREMOCK_PORT="$("${SCRIPTS_DIR}/get_wiremock_port.sh")"

yarn mocha \
  --reporter-options reportDir="${REPORTS_DIR}/integration" \
  "${INTEGRATION_DIR}"

[ -f /.dockerenv ] || dockerComposeDown
