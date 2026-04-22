#!/bin/bash
set -euo pipefail
# Remove previous Next.js output before the Copy phase so stale chunk files cannot block deploy.
# Runs as root (no runas); matches destination owner fix in AfterInstall.
TARGET="/home/ubuntu/easylink-solar/web"
if [[ -d "$TARGET/.next" ]]; then
  rm -rf "$TARGET/.next"
fi
