#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="${1:-$(pwd)}"
PORT="${2:-8080}"
STATE_DIR="$PROJECT_ROOT/.codex-local-deploy"
PID_FILE="$STATE_DIR/app.pid"
LOG_FILE="$STATE_DIR/app.log"

mkdir -p "$STATE_DIR"

if [[ -f "$PID_FILE" ]]; then
    OLD_PID="$(cat "$PID_FILE")"
    if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
        echo "Stopping previous local deploy process $OLD_PID"
        kill "$OLD_PID" 2>/dev/null || true
        for _ in {1..20}; do
            if ! kill -0 "$OLD_PID" 2>/dev/null; then
                break
            fi
            sleep 0.25
        done
    fi
fi

cd "$PROJECT_ROOT"

if [[ -x ./mvnw ]]; then
    MAVEN_CMD=(./mvnw)
else
    MAVEN_CMD=(mvn)
fi

echo "Starting Spring Boot app on port $PORT"
: > "$LOG_FILE"
"${MAVEN_CMD[@]}" spring-boot:run -Dspring-boot.run.arguments="--server.port=$PORT" > "$LOG_FILE" 2>&1 &
APP_PID="$!"
echo "$APP_PID" > "$PID_FILE"

for _ in {1..60}; do
    if curl -fsS "http://localhost:$PORT/actuator/health" >/dev/null 2>&1; then
        echo "Local deploy ready: http://localhost:$PORT/"
        echo "Health check ready: http://localhost:$PORT/actuator/health"
        echo "PID: $APP_PID"
        echo "Log: $LOG_FILE"
        exit 0
    fi

    if ! kill -0 "$APP_PID" 2>/dev/null; then
        echo "Spring Boot app exited before becoming ready. Recent logs:"
        tail -n 80 "$LOG_FILE" || true
        exit 1
    fi

    sleep 1
done

echo "Timed out waiting for local deploy. Recent logs:"
tail -n 80 "$LOG_FILE" || true
exit 1
