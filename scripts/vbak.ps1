# Ask for confirmation
$confirmation = Read-Host "This will create backups of all Docker volumes. Continue? (y/N)"
if ($confirmation -ne 'y') {
    Write-Output "Backup cancelled."
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

# Define volumes to back up
$volumes = @("ascend_minio_data", "ascend_pgadmin_data", "ascend_postgres_data")

# Backup directory (Ensure it exists)
$backupDir = "$PWD\docker_backups"
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Backup each volume
foreach ($vol in $volumes) {
    $backupFile = "$backupDir\$vol.tar.gz"
    Write-Output "Backing up $vol to $backupFile"
    docker run --rm -v ${vol}:/data -v ${backupDir}:/backup ubuntu tar czf /backup/$vol.tar.gz -C /data .
}

Write-Output "Backup completed!"
