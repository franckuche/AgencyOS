#!/bin/bash
unset CLAUDECODE
unset CLAUDE_CODE_ENTRYPOINT
echo "=== ENV CHECK ==="
env | grep -i claude || echo "No claude vars"
echo "=== RUNNING CLAUDE ==="
/Users/franck/.local/bin/claude -p "dis OK" 2>/tmp/claude-test-stderr.log
echo "=== EXIT CODE: $? ==="
echo "=== STDERR ==="
cat /tmp/claude-test-stderr.log
