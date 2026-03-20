#!/bin/bash
cd /root/maturita-web-uceni3
git add -A
git diff --cached --quiet && exit 0
git commit -m "auto-backup $(date '+%Y-%m-%d %H:%M')"
git push origin main
