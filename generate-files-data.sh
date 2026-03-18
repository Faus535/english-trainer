#!/bin/bash
# Generates english-app/js/files-data.js from all markdown files in english/
# Usage: bash generate-files-data.sh

cd "$(dirname "$0")"

OUTPUT="english-app/js/files-data.js"
ENGLISH_DIR="english"

echo "const FILES_DATA = {" > "$OUTPUT"

first=true
find "$ENGLISH_DIR" -name "*.md" -type f | sort | while read -r file; do
    # Key is relative path from english/ dir
    key="${file#$ENGLISH_DIR/}"

    if [ "$first" = true ]; then
        first=false
    else
        echo "," >> "$OUTPUT"
    fi

    # Write key and JSON-escaped content
    printf '  "%s": ' "$key" >> "$OUTPUT"
    python3 -c "
import json, sys
with open(sys.argv[1], 'r') as f:
    print(json.dumps(f.read()), end='')
" "$file" >> "$OUTPUT"
done

# Also add root ENGLISH.md and my-plan.md if they exist
for rootfile in ENGLISH.md; do
    if [ -f "$ENGLISH_DIR/../$rootfile" ]; then
        echo "," >> "$OUTPUT"
        printf '  "%s": ' "$rootfile" >> "$OUTPUT"
        python3 -c "
import json, sys
with open(sys.argv[1], 'r') as f:
    print(json.dumps(f.read()), end='')
" "$rootfile" >> "$OUTPUT"
    fi
done

echo "" >> "$OUTPUT"
echo "};" >> "$OUTPUT"

echo "Generated $OUTPUT with $(grep -c '\".*\":' "$OUTPUT") files"
