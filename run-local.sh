#!/usr/bin/env sh
set -eu

PORT="${PORT:-8090}"
export PORT

if [ ! -f target/simple-java-date-time-app-1.0.0.jar ]; then
  mvn clean package
fi

exec java -jar target/simple-java-date-time-app-1.0.0.jar
