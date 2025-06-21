#!/bin/bash

echo "========================================"
echo "  EMPLOYEE MANAGEMENT SYSTEM DEPLOYMENT"
echo "========================================"

echo
echo "[1/5] Stopping existing containers..."
docker-compose -f docker-compose.fullstack.yml down

echo
echo "[2/5] Removing old images..."
docker image prune -f

echo
echo "[3/5] Building and starting services..."
docker-compose -f docker-compose.fullstack.yml up --build -d

echo
echo "[4/5] Waiting for services to be ready..."
sleep 30

echo
echo "[5/5] Checking service health..."
echo
echo "Backend Health Check:"
curl -s http://localhost:8080/api/demo/health || echo "Backend not ready yet"

echo
echo "Frontend Check:"
curl -s http://localhost/ || echo "Frontend not ready yet"

echo
echo "========================================"
echo "  DEPLOYMENT COMPLETE!"
echo "========================================"
echo
echo "Services running at:"
echo "  Frontend: http://localhost"
echo "  Backend:  http://localhost:8080"
echo "  Database: localhost:3306"
echo
echo "To view logs: docker-compose -f docker-compose.fullstack.yml logs -f"
echo "To stop:      docker-compose -f docker-compose.fullstack.yml down"
echo
