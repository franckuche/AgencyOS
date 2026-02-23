#!/bin/bash
export CLAUDECODE=""
export CLAUDE_CODE_ENTRYPOINT=""
exec "${CLAUDE_BIN:-claude}" "$@"
