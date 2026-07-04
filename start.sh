#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting server..."
  NODE_OPTIONS="--max-old-space-size=512" bun run dev > dev.log 2>&1
  echo "[$(date)] Server exited (exit code: $?), restarting in 3s..."
  sleep 3
done
