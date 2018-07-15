#!/usr/bin/env bash

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR="$(realpath "${SCRIPTS_DIR}/..")"
ENV_IN="${ROOT_DIR}/mariadb.env.example"
ENV_OUT="${ROOT_DIR}/mariadb.env"

. "${SCRIPTS_DIR}/lib.sh"

cat "${ENV_IN}" | sed "s/CHANGEME/$(randomString)/" > ${ENV_OUT}

echo "Generated ${ENV_OUT}" >&2
