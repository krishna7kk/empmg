# 🐳 Docker Deployment Troubleshooting Guide

## 🔧 **Common Docker Errors and Solutions**

### **Error: `maven:3.9.4-openjdk-21: not found`**

**Problem:** The Maven Docker image tag doesn't exist or is not available.

**Solutions:**

#### **Solution 1: Use Fixed Dockerfile (Recommended)**
The main Dockerfile has been updated with correct image tags:
```dockerfile
FROM maven:3.9.5-eclipse-temurin-21 AS build
FROM eclipse-temurin:21-jre-alpine
```

#### **Solution 2: Use Alternative Dockerfile**
If the main Dockerfile still fails, use the alternative:
```bash
# Rename current Dockerfile
mv Backend/Dockerfile Backend/Dockerfile.original

# Use alternative Dockerfile
mv Backend/Dockerfile.alternative Backend/Dockerfile

# Build again
docker-compose -f docker-compose.production.yml build backend
```

#### **Solution 3: Use Simple Dockerfile**
For maximum compatibility:
```bash
# Use the simple Dockerfile
cp Backend/Dockerfile.simple Backend/Dockerfile

# Build again
docker build -t employee-backend Backend/
```

---

## 🛠️ **Docker Image Availability Issues**

### **Check Available Maven Images:**
```bash
# Search for available Maven images
docker search maven

# Pull specific versions
docker pull maven:3.9.5-eclipse-temurin-21
docker pull maven:3.9.5-openjdk-21
docker pull maven:latest
```

### **Check Available OpenJDK Images:**
```bash
# Search for OpenJDK images
docker search openjdk

# Alternative JDK images
docker pull eclipse-temurin:21-jre-alpine
docker pull openjdk:21-jre-slim
docker pull amazoncorretto:21-alpine
```

---

## 🔄 **Quick Fix Commands**

### **Fix 1: Update Dockerfile with Working Images**
```bash
# Navigate to Backend directory
cd Backend

# Backup original Dockerfile
cp Dockerfile Dockerfile.backup

# Use the fixed Dockerfile (already updated)
# Or manually edit Dockerfile with these lines:
echo "FROM maven:3.9.5-eclipse-temurin-21 AS build" > Dockerfile.new
echo "FROM eclipse-temurin:21-jre-alpine" >> Dockerfile.new
# ... rest of Dockerfile content
```

### **Fix 2: Use Pre-built JAR Approach**
```bash
# Build JAR locally first
cd Backend
mvn clean package -DskipTests

# Use simple runtime Dockerfile
cat > Dockerfile.runtime << EOF
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY target/employee-management-system-1.0.0.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
CMD ["java", "-jar", "app.jar"]
EOF

# Build with runtime Dockerfile
docker build -f Dockerfile.runtime -t employee-backend .
```

### **Fix 3: Use Docker Hub Official Images**
```bash
# Update Dockerfile to use official images
sed -i 's/maven:3.9.4-openjdk-21/maven:3.9.5-openjdk-21/g' Backend/Dockerfile
sed -i 's/openjdk:21-jdk-slim/openjdk:21-jre-slim/g' Backend/Dockerfile

# Rebuild
docker-compose -f docker-compose.production.yml build --no-cache backend
```

---

## 🎯 **Recommended Dockerfile Configurations**

### **Option 1: Eclipse Temurin (Recommended)**
```dockerfile
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /app/target/employee-management-system-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### **Option 2: Official OpenJDK**
```dockerfile
FROM maven:3.9.5-openjdk-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:21-jre-slim
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/employee-management-system-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### **Option 3: Amazon Corretto**
```dockerfile
FROM maven:3.9.5-amazoncorretto-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM amazoncorretto:21-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /app/target/employee-management-system-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

---

## 🚀 **Deployment Recovery Steps**

### **Step 1: Verify Docker Setup**
```bash
# Check Docker version
docker --version
docker-compose --version

# Check Docker daemon
docker info

# Test basic functionality
docker run hello-world
```

### **Step 2: Clean Docker Environment**
```bash
# Stop all containers
docker-compose -f docker-compose.production.yml down

# Remove old images
docker image prune -f

# Remove build cache
docker builder prune -f
```

### **Step 3: Rebuild with Fixed Configuration**
```bash
# Use the updated Dockerfile
docker-compose -f docker-compose.production.yml build --no-cache backend

# Start services
docker-compose -f docker-compose.production.yml up -d
```

### **Step 4: Verify Deployment**
```bash
# Check container status
docker-compose -f docker-compose.production.yml ps

# Check logs
docker-compose -f docker-compose.production.yml logs backend

# Test health endpoint
curl http://localhost:8080/api/demo/health
```

---

## 🔍 **Alternative Deployment Methods**

### **If Docker Issues Persist:**

#### **Method 1: Local JAR Deployment**
```bash
cd Backend
mvn clean package -DskipTests
java -jar target/employee-management-system-1.0.0.jar --spring.profiles.active=prod
```

#### **Method 2: Heroku Deployment**
```bash
cd Backend
heroku create your-app-name
git subtree push --prefix=Backend heroku main
```

#### **Method 3: Railway Deployment**
```bash
cd Backend
railway login
railway deploy
```

---

## 📋 **Docker Image Verification**

### **Before Building, Verify Images Exist:**
```bash
# Check if Maven image exists
docker pull maven:3.9.5-eclipse-temurin-21

# Check if JRE image exists
docker pull eclipse-temurin:21-jre-alpine

# If images don't exist, use alternatives:
docker pull maven:latest
docker pull openjdk:21-jre-slim
```

---

## 🎉 **Quick Resolution**

**The main Dockerfile has been fixed with working image tags. To resolve immediately:**

```bash
# 1. Navigate to project root
cd /path/to/employee-ms

# 2. Rebuild with fixed Dockerfile
docker-compose -f docker-compose.production.yml build --no-cache backend

# 3. Start services
docker-compose -f docker-compose.production.yml up -d

# 4. Verify
curl http://localhost:8080/api/demo/health
```

**If this still fails, use the simple Dockerfile:**
```bash
cp Backend/Dockerfile.simple Backend/Dockerfile
docker-compose -f docker-compose.production.yml build --no-cache backend
```

**Your deployment should now work successfully!** 🚀
