#!/usr/bin/env bash

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR="$(realpath "${SCRIPTS_DIR}/..")"

. "${SCRIPTS_DIR}/lib.sh"

ENV_IN="${ENV_DIR}/mariadb.env.example"
ENV_OUT="${ENV_DIR}/mariadb.env"

cat "${ENV_IN}" | while read line; do
  while echo $line | grep "CHANGEME" > /dev/null; do
    line=$(echo "${line}" | sed "s/CHANGEME/$(randomString)/")
  done

  echo "${line}"
done > "${ENV_OUT}"

echo "Generated ${ENV_OUT}" >&2
