#!/bin/bash

# Ask for confirmation
echo "This will create backups of all Docker volumes. Continue? (y/N)"
read -r confirmation
if [[ "$confirmation" != "y" ]]; then
    echo "Backup cancelled."
    exit
fi

# Ensure that we're in root
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
PACKAGE_ROOT=$(dirname "$SCRIPT_DIR")
cd "$PACKAGE_ROOT" || {
    echo "Failed to navigate to package root"
    exit 1
}

# Define volumes to back up
VOLUMES=("ascend_minio_data" "ascend_pgadmin_data" "ascend_postgres_data" "ascend_rabbitmq_data")

# Backup directory (Ensure it exists)
BACKUP_DIR="$(pwd)/docker_backups"
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir $BACKUP_DIR
fi

# Backup each volume
for VOL in "${VOLUMES[@]}"; do
    BACKUP_FILE="$BACKUP_DIR/$VOL.tar.gz"
    echo "Backing up $VOL to $BACKUP_FILE"
    docker run --rm -v $VOL:/data -v $BACKUP_DIR:/backup ubuntu tar czf /backup/$VOL.tar.gz -C /data .
done

echo "Backup completed!"
