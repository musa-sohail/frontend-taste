#!/usr/bin/env bash
# Install the frontend-taste skill for Claude Code.
#   ./install.sh            -> user-level   (~/.claude/skills/frontend-taste)
#   ./install.sh --project  -> this project (./.claude/skills/frontend-taste)
#   curl -fsSL https://raw.githubusercontent.com/musa-sohail/frontend-taste/main/install.sh | bash
set -euo pipefail

REPO="https://github.com/musa-sohail/frontend-taste"
if [[ "${1:-}" == "--project" ]]; then DEST="$PWD/.claude/skills/frontend-taste"; else DEST="$HOME/.claude/skills/frontend-taste"; fi

SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || true)"
if [[ -n "$SRC_DIR" && -f "$SRC_DIR/skills/frontend-taste/SKILL.md" ]]; then
  SRC="$SRC_DIR/skills/frontend-taste"
else
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  git clone --depth 1 -q "$REPO" "$TMP/repo"
  SRC="$TMP/repo/skills/frontend-taste"
fi

mkdir -p "$(dirname "$DEST")"
rm -rf "$DEST"
cp -R "$SRC" "$DEST"
echo "✓ Installed frontend-taste → $DEST"
echo "  Try it: open Claude Code and ask \"build me a school website\"."
echo "  Optional (for scripts/audit.mjs): npm i -D playwright"
