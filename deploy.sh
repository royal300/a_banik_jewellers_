#!/bin/bash
set -e
APP_DIR="/var/www/a_banikjewellers"
APP_NAME="abanik-web"
APP_PORT=3025

export PATH="$HOME/.bun/bin:$PATH"

echo "=========================================="
echo "Deploying A. Banik Jewellers ($APP_DIR)"
echo "=========================================="

cd "$APP_DIR"
echo "-> Pulling latest changes from GitHub..."
git fetch origin
git reset --hard origin/main

echo "-> Installing dependencies..."
bun install

echo "-> Building application (Nitro node preset)..."
NITRO_PRESET=node bun run build

echo "-> Restarting PM2 process ($APP_NAME on Port $APP_PORT)..."
if pm2 list | grep -q "$APP_NAME"; then
    PORT=$APP_PORT pm2 restart "$APP_NAME" --update-env
else
    SERVER_ENTRY=$(find "$APP_DIR/.output" -name "index.mjs" | head -1)
    PORT=$APP_PORT pm2 start "$SERVER_ENTRY" --name "$APP_NAME"
fi
pm2 save

echo "=========================================="
echo "Deployment successful! Site live on Port $APP_PORT"
echo "=========================================="
