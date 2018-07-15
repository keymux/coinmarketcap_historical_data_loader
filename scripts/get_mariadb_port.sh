#!/usr/bin/env bash

docker-compose ps mariadb | grep -o -E '[0-9]+->3306/tcp' | sed 's/->.*//'
