#!/bin/bash
set -e

echo " Syncing repos listed in repos.txt..."

while IFS="|" read -r name url; do
  target="./docs/$name"
  echo " $name -> $url"

  if [ -d "$target/.git" ]; then
    git -C "$target" pull --rebase || git -C "$target" pull
  else
    git clone "$url" "$target"
  fi
done < repos.txt
