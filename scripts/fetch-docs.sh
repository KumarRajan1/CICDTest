#!/bin/bash

GITHUB_ORG="KumarRajan1"
REPO="CICDTest"
BRANCH="main"
RAW_BASE="https://raw.githubusercontent.com/$GITHUB_ORG/$REPO/$BRANCH"
API_BASE="https://api.github.com/repos/$GITHUB_ORG/$REPO/contents"
BASE_DIR="$(pwd)"

# List of folder paths to check
PATHS=(
  "mapping/web"
  "search/web"
)

for BASE_PATH in "${PATHS[@]}"; do
  echo "📦 Checking versions for: $BASE_PATH"

  # Get all version directories (starting with v)
  VERSION_DIRS=$(curl -s "$API_BASE/$BASE_PATH" | jq -r '.[] | select(.type=="dir") | .name' | grep '^v' | sort -V)

  if [ -z "$VERSION_DIRS" ]; then
    echo "⚠️  No version directories found for $BASE_PATH"
    continue
  fi

  LATEST_VERSION=$(echo "$VERSION_DIRS" | tail -n1)
  echo "➡️  Latest version found: $LATEST_VERSION"

  TARGET_DIR="$BASE_DIR/$BASE_PATH/$LATEST_VERSION"
  TARGET_FILE="$TARGET_DIR/README.md"
  RAW_URL="$RAW_BASE/$BASE_PATH/$LATEST_VERSION/README.md"
  TMP_FILE="${TARGET_FILE}.tmp"

  mkdir -p "$TARGET_DIR"
  curl -s -o "$TMP_FILE" "$RAW_URL"

  # Compare checksum if file exists
  if [[ -f "$TARGET_FILE" ]]; then
    OLD_HASH=$(sha256sum "$TARGET_FILE" | cut -d ' ' -f1)
    NEW_HASH=$(sha256sum "$TMP_FILE" | cut -d ' ' -f1)

    if [[ "$OLD_HASH" == "$NEW_HASH" ]]; then
      echo "⏭️  Skipping $BASE_PATH/$LATEST_VERSION (no content change)"
      rm "$TMP_FILE"
      continue
    else
      echo "🔁 Updating $BASE_PATH/$LATEST_VERSION (content changed)"
    fi
  else
    echo "⬇️  Downloading new file for $BASE_PATH/$LATEST_VERSION"
  fi

  # Replace with updated file
  mv "$TMP_FILE" "$TARGET_FILE"

  # Add frontmatter if missing
  if ! grep -q '^---' "$TARGET_FILE"; then
    echo "📝 Adding frontmatter to $TARGET_FILE"
    TMP_META="${TARGET_FILE}.meta"
    echo -e "---\nid: ${BASE_PATH//\//-}-${LATEST_VERSION}\ntitle: ${BASE_PATH##*/} ${LATEST_VERSION} Docs\n---\n" > "$TMP_META"
    cat "$TARGET_FILE" >> "$TMP_META"
    mv "$TMP_META" "$TARGET_FILE"
  fi

  # Remove older versions
  for LOCAL_DIR in "$BASE_DIR/$BASE_PATH"/v*/; do
    DIR_NAME=$(basename "$LOCAL_DIR")
    if [[ "$DIR_NAME" != "$LATEST_VERSION" ]]; then
      echo "🗑️  Removing old version: $LOCAL_DIR"
      rm -rf "$LOCAL_DIR"
    fi
  done

done

echo "🎉 Latest version content synced. Only changed files were updated."
