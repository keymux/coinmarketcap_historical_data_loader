#!/usr/bin/env bash

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR="$(realpath "${SCRIPTS_DIR}/..")"

. "${SCRIPTS_DIR}/lib.sh"

ENV_IN="${ENV_DIR}/mariadb.env.example"
ENV_OUT="${ENV_DIR}/mariadb.env"

cat "${ENV_IN}" | sed "s/CHANGEME/$(randomString)/" > ${ENV_OUT}

echo "Generated ${ENV_OUT}" >&2
