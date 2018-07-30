#!/usr/bin/env/bash

MY_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
MY_DIR="${MY_DIR:?}"
SCRIPTS_DIR="$(realpath "${MY_DIR}/..")"
ROOT_DIR="$(realpath "${SCRIPTS_DIR}/..")"
INT_DIR="${ROOT_DIR}/test/integration"

. "${SCRIPTS_DIR}/lib.sh"

divide() {
  divider
  divider

  echo

  for i in "$@"; do
    echo $i
  done

  echo

  divider
  divider
}

divider() {
  echo "========================================================================================================"
}

dt() {
  date "+%s.%N"
}

leftOfDecimal() {
  awk -F'.' '{print $1}'
}

wholeBc() {
  bc | leftOfDecimal
}

tdiff() {
  echo "${END_TIME} - ${START_TIME}"
}

montime() {
  START_TIME=$(dt)

  eval "$@"

  END_TIME=$(dt)

  echo "Total time: "$(echo "$(tdiff)" | wholeBc).$(echo "(1000 * (($(tdiff)) % 1))" | wholeBc)s
}

unit() {
  yarn $(mochaFn spec)
}

nycFn() {
  buildNycrc

  yarn nyc \
    --all \
    --reporter=lcov \
    --reporter=text \
    --report-dir=${REPORT_DIR} "$@"
}

coverage() {
  REPORT_DIR="${ROOT_DIR}/reports/unit"
  nycFn $(mochaFn spec)
}

mochaFn() {
  REPORTER=$1
  P=$2
  MR_DIR=""

  if [[ "${REPORTER}" != "" ]]; then
    REPORTER="--reporter=${REPORTER}"
  fi

  if [[ "${P}" == "" ]]; then
    P="${ROOT_DIR}/test/unit"
  fi

  if [[ "${REPORT_DIR}" != "" ]]; then
    MR_DIR="--reporter-options reportDir=${REPORT_DIR}"
  fi

  echo mocha \
    ${REPORTER} \
    --recursive \
    --opts /dev/null \
    ${MR_DIR} \
    "${P}"
}

integration() {
  REPORT_DIR="${ROOT_DIR}/reports/integration"

  dockerComposeUp
  export $(cat "${MARIADB_ENV}" | xargs)

  yarn $(mochaFn spec "${INT_DIR}")
}

intCoverage() {
  REPORT_DIR="${ROOT_DIR}/reports/integration"

  dockerComposeUp
  export $(cat "${MARIADB_ENV}" | xargs)

  nycFn $(mochaFn spec "${INT_DIR}")
}

lint() {
  yarn -s eslint \
    --ignore-path .gitignore \
    "${ROOT_DIR}/**/*js"
}

loop() {
  while true; do
    yarn -s nodemon -C -V --exitcrash -x 'echo "" | grep -E "[A-Z]"' 2>&1 | grep -iE "(trigger)|(changes)|(match)"

    # Re-import self
    . "${MY_DIR}/mon.lib.sh"

    clear

    montime $1
  done
}
