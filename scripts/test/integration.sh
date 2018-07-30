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

if [ ! -e /.dockerenv ]; then
  dockerComposeRestart
else
  # Inside a set of docker containers, we need to pull the connection settings
  export $(cat "${MARIADB_ENV}" | xargs)
fi

yarn mocha \
  --opts "${ROOT_DIR}/test/mocha.integration.opts" \
  "${INTEGRATION_DIR}"
CODE=$?

[ -e /.dockerenv ] || dockerComposeDown

exit ${CODE}
