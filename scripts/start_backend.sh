#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export SELFRDB_CONFIG="${SELFRDB_CONFIG:-$ROOT_DIR/SelfRDB/config.yaml}"
export SELFRDB_CHECKPOINT="${SELFRDB_CHECKPOINT:-$ROOT_DIR/brats_t1_t2/brats_t1_t2.ckpt}"
export FLASK_HOST="${FLASK_HOST:-0.0.0.0}"
export FLASK_PORT="${FLASK_PORT:-5000}"
export FLASK_DEBUG="${FLASK_DEBUG:-0}"

if [[ ! -f "$SELFRDB_CONFIG" ]]; then
  echo "Config not found: $SELFRDB_CONFIG" >&2
  exit 1
fi

if [[ ! -f "$SELFRDB_CHECKPOINT" ]]; then
  echo "Checkpoint not found: $SELFRDB_CHECKPOINT" >&2
  exit 1
fi

cd "$ROOT_DIR"
python BackEnd/app.py
