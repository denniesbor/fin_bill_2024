#!/bin/bash

# Step 1: Update the repository
echo "Pulling latest changes from the repository..."
git pull origin staging

# Step 2: Bring up Docker containers
echo "Starting Docker containers..."
docker-compose up -d

# Step 3: Housekeeping commands
# Wait for the containers to be up and running
echo "Waiting for Docker containers to start..."
sleep 10

# Make migrations
echo "Making migrations..."
docker-compose run --rm api python manage.py makemigrations

# Apply migrations
echo "Applying migrations..."
docker-compose run --rm api python manage.py migrate

# Collect static files
echo "Collecting static files..."
docker-compose run --rm api python manage.py collectstatic --noinput

echo "Housekeeping complete. The application should now be running."
