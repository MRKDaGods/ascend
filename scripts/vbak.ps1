cd ..

# Define volumes to back up
$volumes = @("ascend_minio_data", "ascend_pgadmin_data", "ascend_postgres_data", "ascend_rabbitmq_data")

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
