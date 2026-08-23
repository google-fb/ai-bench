#!/usr/bin/env bash
# Idempotent Cloud Agent install. This repo is a Node gallery, not a Python package.
set -euo pipefail
node -v
npm -v
echo "ai-bench: Node gallery ready. Install npm deps per project as needed."
