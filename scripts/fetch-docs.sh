# Get latest version
LATEST_VERSION=$(echo "$VERSION_DIRS" | tail -n1)
echo "➡️  Latest version found: $LATEST_VERSION"

TARGET_DIR="$BASE_DIR/$BASE_PATH/$LATEST_VERSION"
TARGET_FILE="$TARGET_DIR/README.md"

# 🧹 Always clean old local versions (even if latest already exists)
if compgen -G "$BASE_DIR/$BASE_PATH/v*/" > /dev/null; then
  for LOCAL_DIR in "$BASE_DIR/$BASE_PATH"/v*/; do
    DIR_NAME=$(basename "$LOCAL_DIR")
    if [[ "$DIR_NAME" != "$LATEST_VERSION" ]]; then
      echo "🗑️  Removing old version: $LOCAL_DIR"
      rm -rf "$LOCAL_DIR"
    fi
  done
fi

# 🛑 Skip download if already exists
if [ -f "$TARGET_FILE" ]; then
  echo "⏭️  Skipping $BASE_PATH/$LATEST_VERSION (already exists)"
  continue
fi

# Download latest README.md
RAW_URL="$RAW_BASE/$BASE_PATH/$LATEST_VERSION/README.md"
mkdir -p "$TARGET_DIR"
curl -s -o "$TARGET_FILE" "$RAW_URL"
echo "✅ Downloaded: $TARGET_FILE"
