#!/bin/bash

echo "Starting Employee Management System..."
echo

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java 17 or higher"
    exit 1
fi

# Check Java version
java_version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
if [ "$java_version" -lt 17 ]; then
    echo "ERROR: Java 17 or higher is required"
    echo "Current Java version: $java_version"
    exit 1
fi

# Check if MySQL is running (optional check)
echo "Checking MySQL connection..."
if command -v mysql &> /dev/null; then
    mysql -u root -p -e "SELECT 1;" &> /dev/null
    if [ $? -ne 0 ]; then
        echo "WARNING: Could not connect to MySQL"
        echo "Please ensure MySQL is running and credentials are correct"
        echo
    fi
else
    echo "WARNING: MySQL client not found"
    echo "Please ensure MySQL is installed and running"
    echo
fi

# Make mvnw executable
chmod +x mvnw

# Start the application
echo "Starting Spring Boot application..."
echo "Access the application at: http://localhost:8080"
echo "Press Ctrl+C to stop the application"
echo

./mvnw spring-boot:run
