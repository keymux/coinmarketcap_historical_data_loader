#!/usr/bin/env bash

SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
SCRIPTS_DIR="${SCRIPTS_DIR:?}"
ROOT_DIR="$(realpath "${SCRIPTS_DIR}/..")"
ENV_DIR="${ROOT_DIR}/.env.d"
CACHE_DIR="${ROOT_DIR}/.cache"

mkdir -p "${CACHE_DIR}"

WIREMOCK_TGZ_URI="https://nc.0ti.me/index.php/s/n7RN8j8ZRmZjZWJ/download"
WIREMOCK_TGZ_FILE="${CACHE_DIR}/wiremock.tgz"

MARIADB_ENV="${ENV_DIR}/mariadb.env"

whichOrExit() {
  if ! which $1 > /dev/null 2>&1; then
    echo "$1 must be installed" >&2

    return 1
  fi

  return 0
}

uuid() {
  cmd="node -p 'require(\"uuid\")()'"

  if ! eval ${cmd}; then
    yarn global add uuid

    ${cmd}
  fi
}

assertFileEquals() {
  FILE="$1"
  CONTENTS="$2"

  diff "${FILE}" <(echo "${CONTENTS}")
}

assertGrep() {
  result=$(grep $@ 2>&1)

  if [ ${CODE} -ne 0 ]; then
    echo grep "$@"
    echo "resulted in:"
    echo "${result}"

    exit ${CODE}
  fi
}

# The list of reports to run is contained in .reports of package.json
getReports() {
  cat "${ROOT_DIR}/package.json" | jq -r '.reports[]'
}

# Since I just want to ignore the contents of .gitignore, I'll generate
# the .nycrc file here
buildNycrc() {
  first=1
  echo -ne "{\"exclude\":["

  cat "${ROOT_DIR}/.gitignore" | grep -v '^!' | while read line; do
    if [ ${first} -eq 1 ]; then
      first=0
    else
      echo -ne ","
    fi

    echo -ne "\"${line}\""
  done

  echo -ne ",\"**/test/**\""

  echo -ne "]}\n"
}

detectOs() {
  u=${1}

  if [[ "${u}" == "Linux" ]]; then
    return 0
  elif [[ "${u}" == "FreeBSD" ]]; then
    return 1
  elif [[ "${u}" == "Darwin" ]]; then
    return 2
  elif [[ "${u}" == "Cygwin" ]]; then
    return 3
  else
    return 4
  fi
}

open() {
  uname=$(uname)
  detectOs "${uname}"
  os=$?

  case $os in
    0)
      xdg-open $@
      ;;
    2)
      open $@
      ;;
    3)
      cygstart $@
      ;;
    *)
      echo "Not sure how to handle this os (${uname})" >&2
      ;;
  esac
}

createWiremockTgz() {
  tar --exclude="*.swp" -czf "${WIREMOCK_TGZ_FILE}" "test/wiremock"
}

getWiremockMappingsAndFiles() {
  if ! which tar; then
    echo -ne "You must install \`tar\`\n" >&2
  elif which curl; then
    curl -o "${WIREMOCK_TGZ_FILE}" "${WIREMOCK_TGZ_URI}"

    return $?
  elif which wget; then
    wget -O "${WIREMOCK_TGZ_FILE}" "${WIREMOCK_TGZ_URI}"

    return $?
  else
    echo -ne "You must install either \`curl\` or \`wget\`\n" >&2
  fi

  return -1
}

unpackWiremockMappingsAndFiles() {
  if ! which tar; then
    echo -ne "You must install \`tar\`\n" >&2

    return -1
  fi

  pushd "${ROOT_DIR}" 2>&1 >/dev/null || return $?
  tar -xzf "${WIREMOCK_TGZ_FILE}" || return $?
  popd 2>&1 >/dev/null
}

dockerComposeUp() {
  if [ ! -f "${MARIADB_ENV}" ]; then
    "${SCRIPTS_DIR}/generate_mariadb_env.sh"
  fi

  . "${MARIADB_ENV}"

  getWiremockMappingsAndFiles || return $?

  unpackWiremockMappingsAndFiles || return $?

  docker-compose up -d --force-recreate

  export WIREMOCK_PORT="$("${SCRIPTS_DIR}/get_wiremock_port.sh")"
  export MARIADB_PORT="$("${SCRIPTS_DIR}/get_mariadb_port.sh")"

  echo -ne "Waiting for mysql to be ready" >&2

  until "${SCRIPTS_DIR}/mysqlshow.sh" > /dev/null 2>&1; do
    echo -ne "." >&2

    sleep 1
  done

  echo
}

dockerComposeDown() {
  docker-compose rm -fs
}

randomString() {
  cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w ${1:-32} | head -n 1
}

whichOrExit yarn
whichOrExit jq

DOCKER_IMAGE_NAME="$(cat "${ROOT_DIR}/package.json" | jq -r ".name" | sed 's/^@//')"
