# !/bin/bash

# Stop all running containers
docker rm -f $(docker ps -aq)

# Clone if needed
if [ ! -d "ascend" ]; then
    echo "ascend directory not found. Cloning..."

    # Clone repository
    git clone https://github.com/MRKDaGods/ascend.git
    if [ $? -ne 0 ]; then
        echo "Failed to clone ascend repository. Exiting..."
        exit 1
    fi
fi

cd ascend

echo "Checking out backend-master branch..."
git checkout backend-master
if [ $? -ne 0 ]; then
    echo "Failed to checkout backend-master branch. Exiting..."
    exit 1
fi

echo "Pulling latest changes..."
git pull origin backend-master
if [ $? -ne 0 ]; then
    echo "Failed to pull latest changes from backend-master branch. Exiting..."
    exit 1
fi

# Copy env file from ../.env to .env
echo "Copying env file..."
cp ../.env .env
if [ $? -ne 0 ]; then
    echo "Failed to copy .env file. Exiting..."
    exit 1
fi

# Restore volumes
echo "Restoring volumes..."
if [ -f "scripts/vres.sh" ]; then
    chmod +x scripts/vres.sh
    bash scripts/vres.sh --skip
    if [ $? -ne 0 ]; then
        echo "Failed to restore volumes. Exiting..."
        exit 1
    fi
else
    echo "scripts/vres.sh not found. Exiting..."
    exit 1
fi

# Build and start containers
echo "Building and starting containers..."
docker-compose -f docker-compose.yml up -d --build
if [ $? -ne 0 ]; then
    echo "Failed to build and start containers. Exiting..."
    exit 1
fi
echo "Containers started successfully."

echo "Waiting for containers to be ready..."
for i in {1..10}; do
    if docker-compose -f docker-compose.yml ps | grep -q "Up"; then
        echo "Containers are ready."
        break
    fi
    
    echo "Waiting for containers to be ready..."
    sleep 5
done

echo "Containers are up and running."