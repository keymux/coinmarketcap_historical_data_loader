#!/usr/bin/env bash

MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
MY_DIR="${MY_DIR:?}"
SCRIPTS_DIR="$(realpath "${MY_DIR}/..")"
ROOT_DIR="$(realpath "${SCRIPTS_DIR}/..")"

. "${SCRIPTS_DIR}/lib.sh"
. "${MY_DIR}/mon.lib.sh"

fn() {
  countFailed=0

  x=$(dt)

  coverage

  dockerComposeUp
  export $(cat "${MARIADB_ENV}" | xargs)

  integration

  lint

  y=$(dt)

  divide "Total time: "$(echo "($y - $x)" | wholeBc).$(echo "(1000 * (($y - $x) % 1))" | wholeBc)s
}

loop fn
