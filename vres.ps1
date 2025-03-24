# Define volumes to restore
$volumes = @("ascend_minio_data", "ascend_pgadmin_data", "ascend_postgres_data", "ascend_rabbitmq_data")

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
