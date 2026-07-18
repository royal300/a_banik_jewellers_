#!/bin/bash
# A. Banik Jewellers - Local Push & Deploy Script
set -e

COMMIT_MSG="${1:-"Update home page hero and banner heights"}"
echo "🚀 Starting deployment process for A. Banik Jewellers..."

if [[ -n $(git status -s) ]]; then
    echo "📦 Staging changes..."
    git add .
    echo "💾 Committing changes: $COMMIT_MSG..."
    git commit -m "$COMMIT_MSG"
else
    echo "✨ No new local changes to commit."
fi

echo "📤 Pushing to GitHub..."
git push origin main

echo "🖥️  Triggering remote deployment on VPS (93.127.206.52)..."
/usr/bin/expect -c '
set timeout 300
spawn ssh -o StrictHostKeyChecking=no root@93.127.206.52 "cd /var/www/a_banikjewellers && chmod +x deploy.sh && ./deploy.sh"
expect "password:"
send "Royal300@2026\r"
expect eof
'

echo "✅ Success! Deployment complete."
echo "🌐 Visit: https://abanikjewellers.in"
