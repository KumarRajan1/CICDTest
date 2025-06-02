#!/bin/bash

set -e

REPOS_FILE="repos.txt"
DEST_DIR="all-projects"
DOCUSAURUS_DIR="../my-docusaurus-site"

mkdir -p "$DEST_DIR"
cd "$DEST_DIR" || exit 1

while read -r repo; do
    [[ -z "$repo" || "$repo" == \#* ]] && continue

    folder=$(basename "$repo" .git)
    if [ -d "$folder" ]; then
        echo " Updating $folder"
        cd "$folder"
        git pull origin main || git pull
        cd ..
    else
        echo "⬇️ Cloning $repo into $folder"
        git clone "$repo" "$folder"
    fi
done < "../$REPOS_FILE"

echo " Syncing all files to Docusaurus site..."

# Clear previous contents (optional)
rm -rf "$DOCUSAURUS_DIR/docs/*"
rm -rf "$DOCUSAURUS_DIR/static/android"

# Sync entire contents
cp -r docs/* "$DOCUSAURUS_DIR/docs/"
cp -r test/* "$DOCUSAURUS_DIR/test/"

echo " All files synced."
