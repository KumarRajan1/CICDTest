#!/bin/bash

cd docs  # go into the main folder

for dir in */ ; do              # loop through each folder
    cd "$dir" || continue       # enter the folder; skip if it fails

    if [[ -d .git ]]; then      # check if it's a Git repo
        git add .               # stage all changes
        if ! git diff --cached --quiet; then
            git commit -m "Auto-commit from script"   # commit if there are staged changes
            git push --force                                   # push to origin
        else
            echo "No changes in $dir"
        fi
    fi

    cd ..                       # go back to all-projects folder
done
