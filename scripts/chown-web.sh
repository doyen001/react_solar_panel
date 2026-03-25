#!/bin/bash
set -euo pipefail
# CodeDeploy installs files as root; ubuntu must own the tree before npm ci (run as ubuntu).
# Omit runas in appspec so this hook runs as root.
TARGET="/home/ubuntu/easylink-solar/web"
if [[ -d "$TARGET" ]]; then
  chown -R ubuntu:ubuntu "$TARGET"
fi
