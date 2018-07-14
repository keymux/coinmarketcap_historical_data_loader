#!/usr/bin/env bash

docker-compose ps wiremock | grep -o -E '[0-9]+->8080/tcp' | sed 's/->.*//'
