# Ensure that we're in root
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PACKAGE_ROOT = Split-Path -Parent $SCRIPT_DIR

Set-Location $PACKAGE_ROOT
if (-not $?) {
    Write-Host "Failed to navigate to package root"
    exit 1
}

Write-Host "Working directory: $(Get-Location)"

Write-Host "Starting Docker compose stack..."
docker-compose up
