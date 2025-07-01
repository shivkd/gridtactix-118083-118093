#!/bin/bash
cd /home/kavia/workspace/code-generation/gridtactix-118083-118093/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

