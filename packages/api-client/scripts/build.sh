# !/bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
PACKAGE_ROOT=$(dirname "$SCRIPT_DIR")

# Ensure that we're in root
cd "$PACKAGE_ROOT" || {
    echo "Failed to navigate to package root"
    exit 1
}

echo "Working directory: $(pwd)"

echo "Building API client..."
wasm-pack build --target web --out-dir pkg --scope ascend

# Ensure pkg/package.json exists
if [ ! -f "pkg/package.json" ]; then
    echo "Error: pkg/package.json doesn't exist. Build may have failed."
    exit 1
fi

# Add mrk.xx to the files array
echo "Postprocessing package.json..."
if ! grep -q '/* Postprocessed */' pkg/package.json; then
    TMP_FILE=$(mktemp)

    jq '(.devDependencies.typescript) = "^5.8.2" 
        | (.scripts.build) = "tsc" 
        | .files += ["mrk.js", "mrk.d.ts"] 
        | . + { "/* Postprocessed */": "" }' pkg/package.json >"$TMP_FILE"

    mv "$TMP_FILE" pkg/package.json

    echo "Added mrk.xx to files in package.json"
else
    echo "mrk.xx already in files list"
fi

# Build the TypeScript definitions
cd pkg
echo "Building TypeScript definitions..."
npm run build
