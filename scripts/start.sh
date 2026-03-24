#!/bin/bash
cd /home/ubuntu/easylink-solar/web

# Build if not already built
npm run build

# Restart app safely
pm2 delete easylink-solar || true
pm2 start npm --name "easylink-solar" -- start
pm2 save