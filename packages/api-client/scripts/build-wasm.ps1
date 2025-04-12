$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PACKAGE_ROOT = Split-Path -Parent $SCRIPT_DIR

# Ensure that we're in root
Set-Location $PACKAGE_ROOT
if (-not $?) {
    Write-Host "Failed to navigate to package root"
    exit 1
}

Write-Host "Working directory: $(Get-Location)"

Write-Host "Building API client..."
wasm-pack build --target web --out-dir pkg --scope ascend

# Ensure pkg/package.json exists
if (-not (Test-Path "pkg/package.json")) {
    Write-Host "Error: pkg/package.json doesn't exist. Build may have failed."
    exit 1
}

# Copy models from shared/models to pkg/models
Write-Host "Copying models..."
New-Item -Path "pkg/models" -ItemType Directory -Force

Copy-Item -Path "../shared/src/models/*" -Destination "pkg/models/" -Recurse -Force
if (-not $?) {
    Write-Host "Error: Failed to copy models."
    exit 1
}
Write-Host "Models copied successfully."

# Add our stuff
Write-Host "Postprocessing package.json..."
$packageJson = Get-Content "pkg/package.json" -Raw | ConvertFrom-Json

if (-not ($packageJson.'/* Postprocessed */')) {
    # Add TypeScript as a dev dependency
    if (-not $packageJson.devDependencies) {
        $packageJson | Add-Member -Type NoteProperty -Name "devDependencies" -Value @{}
    }

    $packageJson.devDependencies.typescript = "^5.8.2"
    
    # Add build script
    if (-not $packageJson.scripts) {
        $packageJson | Add-Member -Type NoteProperty -Name "scripts" -Value @{}
    }

    $packageJson.scripts.build = "tsc"
    
    # Add files to the files array
    if (-not $packageJson.files) {
        $packageJson | Add-Member -Type NoteProperty -Name "files" -Value @()
    }

    $packageJson.files += "mrk.js"
    $packageJson.files += "mrk.d.ts"
    $packageJson.files += "models"
    
    # Add postprocessed marker
    $packageJson | Add-Member -Type NoteProperty -Name '/* Postprocessed */' -Value ""
    
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "pkg/package.json"
    Write-Host "Postprocessed package.json"
} else {
    Write-Host "Already postprocessed"
}

# Build the TypeScript definitions
Set-Location pkg
Write-Host "Building TypeScript definitions..."
npm run build