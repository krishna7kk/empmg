# 🐳 Docker Setup Guide - Employee Management System

## 🎯 **Overview**

This guide explains how to run the Employee Management System using Docker after the backend reorganization to the `Backend/` folder.

## 📁 **Docker Configuration Files**

```
employee-ms/
├── docker-compose.fullstack.yml    # Full-stack deployment (Frontend + Backend + MySQL)
├── Backend/
│   ├── Dockerfile                  # Backend Docker image
│   ├── docker-compose.yml          # Backend + MySQL only
│   └── docker-run-backend.bat      # Windows script for backend
└── ems/
    └── Dockerfile                  # Frontend Docker image
```

## 🚀 **Deployment Options**

### **Option 1: Full-Stack Deployment (Recommended)**

Run the complete system (Frontend + Backend + MySQL):

```bash
# From the root directory (employee-ms/)
docker-compose -f docker-compose.fullstack.yml up -d
```

**Services Started:**
- ✅ MySQL Database (port 3306)
- ✅ Spring Boot Backend (port 8080)
- ✅ React Frontend (port 80)

### **Option 2: Backend + MySQL Only**

Run only the backend services:

```bash
# From the Backend/ directory
cd Backend
docker-compose up -d
```

**Services Started:**
- ✅ MySQL Database (port 3306)
- ✅ Spring Boot Backend (port 8080)

### **Option 3: MySQL Database Only**

Run only the database:

```bash
# From the Backend/ directory
cd Backend
docker-compose up -d mysql
```

## 🔧 **Quick Start Commands**

### **Windows Users:**
```batch
# Full-stack deployment
docker-compose -f docker-compose.fullstack.yml up -d

# Backend only (from Backend directory)
cd Backend
docker-run-backend.bat
```

### **Linux/macOS Users:**
```bash
# Full-stack deployment
docker-compose -f docker-compose.fullstack.yml up -d

# Backend only
cd Backend
docker-compose up -d
```

## 📊 **Service URLs**

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | React application |
| **Backend API** | http://localhost:8080 | Spring Boot REST API |
| **Health Check** | http://localhost:8080/api/demo/health | Backend health status |
| **MySQL** | localhost:3306 | Database (internal) |

## 🛠️ **Docker Management Commands**

### **View Running Services:**
```bash
docker-compose ps
```

### **View Logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### **Stop Services:**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### **Rebuild Services:**
```bash
# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

## 🔍 **Troubleshooting**

### **Error: "failed to read dockerfile: open Dockerfile: no such file or directory"**

**Cause:** Running Docker command from wrong directory.

**Solution:**
```bash
# For full-stack deployment, run from root directory:
cd /path/to/employee-ms
docker-compose -f docker-compose.fullstack.yml up -d

# For backend only, run from Backend directory:
cd /path/to/employee-ms/Backend
docker-compose up -d
```

### **Error: "Port already in use"**

**Cause:** Services already running on required ports.

**Solution:**
```bash
# Stop existing services
docker-compose down

# Check what's using the port
netstat -an | findstr :8080  # Windows
lsof -i :8080               # Linux/macOS

# Kill the process or change port in docker-compose.yml
```

### **Error: "MySQL connection refused"**

**Cause:** MySQL container not ready.

**Solution:**
```bash
# Wait for MySQL to be healthy
docker-compose logs mysql

# Check MySQL health
docker-compose exec mysql mysqladmin ping -h localhost
```

## 🎯 **Environment Variables**

### **Backend Environment:**
```yaml
SPRING_PROFILES_ACTIVE: prod
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/employee_management
SPRING_DATASOURCE_USERNAME: root
SPRING_DATASOURCE_PASSWORD: password
SPRING_JPA_HIBERNATE_DDL_AUTO: update
```

### **Frontend Environment:**
```yaml
REACT_APP_API_URL: http://localhost:8080/api
```

## 📋 **Development Workflow**

### **1. Start Development Environment:**
```bash
# Start MySQL only
cd Backend
docker-compose up -d mysql

# Run backend locally
mvn spring-boot:run

# Run frontend locally (in another terminal)
cd ../ems
npm run dev
```

### **2. Test Full Docker Deployment:**
```bash
# Build and run everything
docker-compose -f docker-compose.fullstack.yml up -d --build

# Test the application
curl http://localhost:8080/api/demo/health
curl http://localhost/
```

### **3. Production Deployment:**
```bash
# Use production configuration
docker-compose -f docker-compose.fullstack.yml up -d

# Monitor logs
docker-compose -f docker-compose.fullstack.yml logs -f
```

## 🎊 **Success Verification**

After running Docker commands, verify:

1. **✅ Containers Running:**
   ```bash
   docker ps
   ```

2. **✅ Backend Health:**
   ```bash
   curl http://localhost:8080/api/demo/health
   ```

3. **✅ Frontend Accessible:**
   ```bash
   curl http://localhost/
   ```

4. **✅ Database Connected:**
   ```bash
   curl http://localhost:8080/api/demo/employees
   ```

## 🚀 **Ready to Use!**

Your Docker setup is now configured for the reorganized backend structure. Choose the deployment option that best fits your needs and follow the appropriate commands above.

**For most users, the full-stack deployment is recommended:**
```bash
docker-compose -f docker-compose.fullstack.yml up -d
```
