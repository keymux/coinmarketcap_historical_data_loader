#!/usr/bin/env bash

MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
MY_DIR="${MY_DIR:?}"
ROOT_DIR="$(realpath "${MY_DIR}/..")"
SCRIPTS_DIR="${ROOT_DIR}/scripts"

. "${ROOT_DIR}/.env.d/mariadb.env"

export MYSQL_PORT="$("${SCRIPTS_DIR}/get_mariadb_port.sh")"

mysqlshow \
  --user=${MYSQL_USER} \
  --password=${MYSQL_PASSWORD} \
  --port=${MYSQL_PORT} \
  --host=${MYSQL_HOSTNAME} $@
