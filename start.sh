#!/bin/bash
# Lancement du QG — nettoie les variables Claude Code pour éviter les conflits
unset CLAUDECODE
unset CLAUDE_CODE_ENTRYPOINT
cd "$(dirname "$0")"
exec npx next dev --turbopack -p 3333
