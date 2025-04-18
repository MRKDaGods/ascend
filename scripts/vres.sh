#!/bin/bash

# Ask for confirmation
if [[ "$1" != "--skip" ]]; then
    echo "This script will restore all Docker volumes from backups. Are you sure you want to continue? (y/N)"
    read -r confirmation
    if [[ "$confirmation" != "y" ]]; then
        echo "Restore cancelled."
        exit
    fi
fi

# Ensure that we're in root
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
PACKAGE_ROOT=$(dirname "$SCRIPT_DIR")
cd "$PACKAGE_ROOT" || {
    echo "Failed to navigate to package root"
    exit 1
}

# Stop containers
CONTAINERS_STOPPED=false
if docker-compose -f docker-compose.yml ps | grep -qE 'postgres|minio|pgadmin'; then
    echo "Stopping containers..."
    docker-compose -f docker-compose.yml down postgres minio pgadmin

    CONTAINERS_STOPPED=true
else
    echo "No containers to stop."
fi

VOLUMES=("ascend_minio_data" "ascend_pgadmin_data" "ascend_postgres_data")

# Backup directory
BACKUP_DIR="$(pwd)/docker_backups"

# Ensure the backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Backup directory not found: $BACKUP_DIR"
    exit 1
fi

for VOL in "${VOLUMES[@]}"; do
    BACKUP_FILE="$BACKUP_DIR/$VOL.tar.gz"

    if [ -f "$BACKUP_FILE" ]; then
        echo "Restoring $VOL from $BACKUP_FILE..."
        
        # Create volume if not exists
        docker volume create $VOL

        # Restore data from the backup
        docker run --rm -v $VOL:/data -v $BACKUP_DIR:/backup ubuntu tar xzf /backup/$VOL.tar.gz -C /data

        echo "$VOL restored successfully!"
    else
        echo "Backup file not found for $VOL: $BACKUP_FILE"
    fi
done

echo "All volumes restored!"

if $CONTAINERS_STOPPED; then
    echo "Starting containers..."
    docker-compose -f docker-compose.yml up -d postgres minio pgadmin
else
    echo "No containers were stopped."
fi