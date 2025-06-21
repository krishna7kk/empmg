# 🚀 Employee Management System - Deployment Guide

## 📋 Prerequisites

### Required Software:
- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Git** (for version control)

### System Requirements:
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10/11, macOS, or Linux

## 🎯 Deployment Options

### Option 1: Full Stack Docker Deployment (Recommended)

This deploys the complete application with:
- **Frontend**: React + TypeScript + Nginx (Port 80)
- **Backend**: Spring Boot + Java 21 (Port 8080)
- **Database**: MySQL 8.0 (Port 3306)

#### Quick Deploy:

**Windows:**
```bash
deploy.bat
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Manual Deploy:
```bash
# Stop existing containers
docker-compose -f docker-compose.fullstack.yml down

# Build and start all services
docker-compose -f docker-compose.fullstack.yml up --build -d

# Check status
docker-compose -f docker-compose.fullstack.yml ps
```

### Option 2: Individual Service Deployment

#### Backend Only:
```bash
cd spring-employee-ms
docker build -t employee-backend .
docker run -p 8080:8080 employee-backend
```

#### Frontend Only:
```bash
cd ems
docker build -t employee-frontend .
docker run -p 80:80 employee-frontend
```

## 🌐 Access Your Application

After successful deployment:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | Main application interface |
| **Backend API** | http://localhost:8080/api | REST API endpoints |
| **Health Check** | http://localhost:8080/api/demo/health | Backend health status |
| **Database** | localhost:3306 | MySQL database |

## 📊 Service Management

### View Logs:
```bash
# All services
docker-compose -f docker-compose.fullstack.yml logs -f

# Specific service
docker-compose -f docker-compose.fullstack.yml logs -f backend
docker-compose -f docker-compose.fullstack.yml logs -f frontend
docker-compose -f docker-compose.fullstack.yml logs -f mysql
```

### Stop Services:
```bash
docker-compose -f docker-compose.fullstack.yml down
```

### Restart Services:
```bash
docker-compose -f docker-compose.fullstack.yml restart
```

### Update Application:
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker-compose.fullstack.yml up --build -d
```

## 🔧 Configuration

### Environment Variables:

**Backend (application-prod.properties):**
- Database connection settings
- CORS configuration
- Logging levels
- Security settings

**Frontend (nginx.conf):**
- API proxy configuration
- Static file caching
- Security headers

### Database Configuration:
- **Host**: mysql (container) / localhost (external)
- **Port**: 3306
- **Database**: employee_management
- **Username**: root
- **Password**: password

## 🛠️ Troubleshooting

### Common Issues:

1. **Port Already in Use:**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :8080
   
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database Connection Failed:**
   ```bash
   # Check MySQL container status
   docker-compose -f docker-compose.fullstack.yml logs mysql
   
   # Restart MySQL
   docker-compose -f docker-compose.fullstack.yml restart mysql
   ```

3. **Frontend Not Loading:**
   ```bash
   # Check frontend logs
   docker-compose -f docker-compose.fullstack.yml logs frontend
   
   # Rebuild frontend
   docker-compose -f docker-compose.fullstack.yml up --build frontend
   ```

### Health Checks:
```bash
# Backend health
curl http://localhost:8080/api/demo/health

# Frontend health
curl http://localhost/

# Database health
docker-compose -f docker-compose.fullstack.yml exec mysql mysqladmin ping
```

## 🔒 Security Notes

- Change default passwords in production
- Configure proper CORS origins
- Use HTTPS in production
- Implement proper authentication
- Regular security updates

## 📈 Monitoring

### Container Stats:
```bash
docker stats
```

### Resource Usage:
```bash
docker-compose -f docker-compose.fullstack.yml top
```

## 🚀 Production Deployment

For production deployment, consider:

1. **Use external database** (AWS RDS, Google Cloud SQL)
2. **Configure HTTPS** with SSL certificates
3. **Set up load balancing** for high availability
4. **Implement monitoring** (Prometheus, Grafana)
5. **Configure backup strategies**
6. **Use container orchestration** (Kubernetes, Docker Swarm)

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify all prerequisites are installed
3. Ensure ports are available
4. Check Docker daemon is running
