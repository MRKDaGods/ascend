# Ask for confirmation
$confirmation = Read-Host "This will restore all Docker volumes from backups. Continue? (y/N)"
if ($confirmation -ne 'y') {
    Write-Output "Restore cancelled."
    exit
}

# Ensure that we're in root
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PACKAGE_ROOT = Split-Path -Parent $SCRIPT_DIR

Set-Location $PACKAGE_ROOT
if (-not $?) {
    Write-Host "Failed to navigate to package root"
    exit 1
}

Write-Host "Working directory: $(Get-Location)"

# Define volumes to restore
$volumes = @("ascend_minio_data", "ascend_pgadmin_data", "ascend_postgres_data")

# Backup directory (Ensure it exists)
$backupDir = "$PWD\docker_backups"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Restore each volume
foreach ($vol in $volumes) {
    $backupFile = "$backupDir\$vol.tar.gz"
    if (Test-Path $backupFile) {
        Write-Output "Restoring $vol from $backupFile"
        docker volume create $vol
        docker run --rm -v ${vol}:/data -v ${backupDir}:/backup ubuntu tar xzf /backup/$vol.tar.gz -C /data
    }
    else {
        Write-Output "Backup file not found for ${vol}: $backupFile"
    }
}

Write-Output "All volumes restored!"
