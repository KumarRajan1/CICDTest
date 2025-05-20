#!/bin/bash

GITHUB_ORG="KumarRajan1"
REPO="CICDTest"
BRANCH="main"
RAW_BASE="https://raw.githubusercontent.com/$GITHUB_ORG/$REPO/$BRANCH"
API_BASE="https://api.github.com/repos/$GITHUB_ORG/$REPO/contents"
BASE_DIR="$(pwd)"

# Paths to check for versions
PATHS=(
  "mapping/web"
  "search/web"
)

for BASE_PATH in "${PATHS[@]}"; do
  echo "📦 Checking versions for: $BASE_PATH"

  # Get version directories from GitHub
  VERSION_DIRS=$(curl -s "$API_BASE/$BASE_PATH" | jq -r '.[] | select(.type=="dir") | .name' | grep '^v' | sort -V)

  if [ -z "$VERSION_DIRS" ]; then
    echo "⚠️  No version directories found for $BASE_PATH"
    continue
  fi

  LATEST_VERSION=$(echo "$VERSION_DIRS" | tail -n1)
  echo "➡️  Latest version: $LATEST_VERSION"

  TARGET_DIR="$BASE_DIR/$BASE_PATH/$LATEST_VERSION"
  TARGET_FILE="$TARGET_DIR/README.md"

  # 🧹 Always remove older versions (except latest)
  if compgen -G "$BASE_DIR/$BASE_PATH/v*/" > /dev/null; then
    for LOCAL_DIR in "$BASE_DIR/$BASE_PATH"/v*/; do
      DIR_NAME=$(basename "$LOCAL_DIR")
      if [[ "$DIR_NAME" != "$LATEST_VERSION" ]]; then
        echo "🗑️  Removing old version: $LOCAL_DIR"
        rm -rf "$LOCAL_DIR"
      fi
    done
  fi

  # ⏭️ Skip download if already exists
  if [ -f "$TARGET_FILE" ]; then
    echo "✅ Latest version already exists: $TARGET_FILE"
    continue
  fi

  # ⬇️ Download README.md
  RAW_URL="$RAW_BASE/$BASE_PATH/$LATEST_VERSION/README.md"
  mkdir -p "$TARGET_DIR"
  curl -s -o "$TARGET_FILE" "$RAW_URL"
  echo "✅ Downloaded: $TARGET_FILE"

  # 🏷️ Add frontmatter if missing
  if ! grep -q '^---' "$TARGET_FILE"; then
    TMP_FILE="${TARGET_FILE}.tmp"
    echo -e "---\nid: ${BASE_PATH//\//-}-${LATEST_VERSION}\ntitle: ${BASE_PATH##*/} ${LATEST_VERSION} Docs\n---\n" > "$TMP_FILE"
    cat "$TARGET_FILE" >> "$TMP_FILE"
    mv "$TMP_FILE" "$TARGET_FILE"
  fi
done

echo "🎉 Done. Latest versions fetched or verified. Older versions removed."
