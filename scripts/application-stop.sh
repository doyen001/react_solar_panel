#!/bin/bash
# Stop the Next.js process so CodeDeploy can replace files under .next without locks.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

pm2 stop easylink-solar 2>/dev/null || true
