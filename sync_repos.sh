#!/bin/bash

set -e

REPOS_FILE="repos.txt"
DEST_DIR="docs"
DOCUSAURUS_DIR="../my-docusaurus-site"

mkdir -p "$DEST_DIR"
cd "$DEST_DIR" || exit 1

while read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue

    if [[ "$line" == *"|"* ]]; then
        folder="${line%%|*}"
        repo="${line##*|}"
    else
        repo="$line"
        folder=$(basename "$repo" .git)
    fi

    if [ -d "$folder" ]; then
        echo "🔄 Updating $folder"
        cd "$folder"
        git pull origin main || git pull
        cd ..
    else
        echo "⬇️ Cloning $repo into $folder"
        git clone "$repo" "$folder"
    fi
done < "../$REPOS_FILE"

echo "📁 Syncing all files to Docusaurus site..."

# Clear previous contents (optional)
rm -rf "$DOCUSAURUS_DIR/docs/*"
rm -rf "$DOCUSAURUS_DIR/static/android"

# Example: Sync content from specific folders
# Customize this section based on actual folders in your cloned repos
if [ -d "docs" ]; then
    cp -r docs/* "$DOCUSAURUS_DIR/docs/"
fi

if [ -d "test/android" ]; then
    mkdir -p "$DOCUSAURUS_DIR/static/android"
    cp -r test/android/* "$DOCUSAURUS_DIR/static/android/"
fi

echo "✅ All files synced."
