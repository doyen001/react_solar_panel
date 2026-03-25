#!/bin/bash
# CodeDeploy runs non-interactive shells; ~/.bashrc is not loaded, so nvm's npm is missing from PATH.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd /home/ubuntu/easylink-solar/web
npm ci
