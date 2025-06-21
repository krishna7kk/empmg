#!/bin/bash

echo "========================================"
echo "  EMPLOYEE MANAGEMENT SYSTEM - PRODUCTION"
echo "========================================"

echo
echo "[1/3] Starting Backend Server..."
echo "Backend will run on: http://localhost:8080"
echo

cd spring-employee-ms
nohup java -jar target/employee-management-system-1.0.0.jar --spring.profiles.active=dev > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

echo "Waiting for backend to start..."
sleep 10

echo
echo "[2/3] Starting Frontend Server..."
echo "Frontend will run on: http://localhost:3000"
echo

cd ../ems
nohup npx serve -s dist -l 3000 > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo "Waiting for frontend to start..."
sleep 5

echo
echo "[3/3] System Ready!"
sleep 2

echo
echo "========================================"
echo "  DEPLOYMENT COMPLETE!"
echo "========================================"
echo
echo "Your Employee Management System is running:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8080"
echo "  API:      http://localhost:8080/api/demo/"
echo
echo "Process IDs:"
echo "  Backend PID:  $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo

echo "Checking system status..."
echo
echo "Backend Health:"
curl -s http://localhost:8080/api/demo/health || echo "Backend not responding yet"

echo
echo "Frontend Status:"
curl -s http://localhost:3000 | grep -q "Employee" && echo "Frontend is running" || echo "Frontend not responding yet"

echo
echo "To stop the servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo
echo "To view logs:"
echo "  Backend:  tail -f spring-employee-ms/backend.log"
echo "  Frontend: tail -f ems/frontend.log"
echo

# Save PIDs for easy stopping
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo "PIDs saved to .backend.pid and .frontend.pid files"
