#!/bin/bash

set -e

REPOS_FILE="repos.txt"
DEST_DIR="docs"
DOCUSAURUS_DIR="../my-docusaurus-site/docs"

mkdir -p "$DEST_DIR"
cd "$DEST_DIR" || exit 1

changes_detected=false

while read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue

    if [[ "$line" == *"|"* ]]; then
        folder="${line%%|*}"
        repo="${line##*|}"
    else
        repo="$line"
        folder=$(basename "$repo" .git)
    fi

    echo "🔍 Processing $folder"

    if [ -d "$folder/.git" ]; then
        cd "$folder"
        echo "   ⏳ Checking for remote updates..."
        git remote update > /dev/null

        LOCAL=$(git rev-parse @)
        REMOTE=$(git rev-parse @{u})
        BASE=$(git merge-base @ @{u})

        if [ "$LOCAL" = "$REMOTE" ]; then
            echo "   ✅ Up to date — no pull needed"
        elif [ "$LOCAL" = "$BASE" ]; then
            echo "   🔄 Pulling updates..."
            git pull
            changes_detected=true
        else
            echo "   ⚠️ Diverged — skipping for safety"
        fi

        cd ..

    else
        echo "⬇️ Cloning $repo into $folder"
        git clone "$repo" "$folder"
        changes_detected=true
    fi
done < "../$REPOS_FILE"

# Sync .md files only if changes were detected
if $changes_detected; then
    echo "📁 Syncing .md files to Docusaurus..."

    # Clear old docs
    rm -rf "$DOCUSAURUS_DIR"/*
    
    for repo_dir in */; do
        [ -d "$repo_dir/.git" ] || continue

        echo "   ➕ Copying from $repo_dir"
        find "$repo_dir" -type f -name "*.md" | while read -r file; do
            cp --parents "$file" "$DOCUSAURUS_DIR"
        done
    done

    echo "✅ Docs sync completed."
else
    echo "🛑 No repo updates — skipping docs sync."
fi

# 🔄 Push changes back if any .md file was modified locally
echo "📤 Checking for local changes in repos to push back..."

for repo_dir in */; do
    [ -d "$repo_dir/.git" ] || continue
    cd "$repo_dir"

    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo "   🚀 Committing and pushing changes in $repo_dir"
        git add -u
        git commit -m "docs: sync updated .md files from Docusaurus"
        git push origin HEAD
    else
        echo "   ✅ No local .md changes to commit in $repo_dir"
    fi

    cd ..
done
