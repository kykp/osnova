#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Не найден .env. Скопируйте .env.example в .env." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; source .env; set +a

if [ -z "${DATABASE_URI:-}" ]; then
  echo "DATABASE_URI не задан в .env" >&2
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "Не найден pg_dump. Установите PostgreSQL client tools." >&2
  exit 1
fi

mkdir -p backups
STAMP=$(date +%Y%m%d-%H%M)
FILE="backups/osnova-${STAMP}.sql"

pg_dump "$DATABASE_URI" --no-owner --no-acl > "$FILE"

echo "Резервная копия сохранена: $FILE"
