#!/usr/bin/env bash

# Install bats-core and dependencies locally
set -euo pipefail

BATS_DIR="${BATS_DIR:-./node_modules/.bats}"
BATS_CORE_DIR="$BATS_DIR/bats-core"
BATS_SUPPORT_DIR="$BATS_DIR/bats-support"
BATS_ASSERT_DIR="$BATS_DIR/bats-assert"

echo "🐦 Installing bats-core and dependencies..."

# Create bats directory
mkdir -p "$BATS_DIR"

# Install bats-core
if [[ ! -d "$BATS_CORE_DIR" ]]; then
  echo "📦 Installing bats-core..."
  git clone https://github.com/bats-core/bats-core.git "$BATS_CORE_DIR"
  cd "$BATS_CORE_DIR"
  git checkout v1.9.0
  cd - > /dev/null
fi

# Install bats-support
if [[ ! -d "$BATS_SUPPORT_DIR" ]]; then
  echo "📦 Installing bats-support..."
  git clone https://github.com/bats-core/bats-support.git "$BATS_SUPPORT_DIR"
  cd "$BATS_SUPPORT_DIR"
  git checkout v0.3.0
  cd - > /dev/null
fi

# Install bats-assert
if [[ ! -d "$BATS_ASSERT_DIR" ]]; then
  echo "📦 Installing bats-assert..."
  git clone https://github.com/bats-core/bats-assert.git "$BATS_ASSERT_DIR"
  cd "$BATS_ASSERT_DIR"
  git checkout v2.0.0
  cd - > /dev/null
fi

echo "✅ Bats installation complete!"
echo "🐦 Bats binary: $BATS_CORE_DIR/bin/bats"
echo "📚 Support library: $BATS_SUPPORT_DIR"
echo "🔍 Assert library: $BATS_ASSERT_DIR" 