# 🔧 Environment Configuration Guide

## 📋 **Overview**

This guide explains how to set up environment variables for the Employee Management System, including both frontend (React/Vite) and backend (Spring Boot) configurations.

## 📁 **Environment Files Structure**

```
employee-ms/
├── ems/                          # Frontend (React/Vite)
│   ├── .env                      # Development environment
│   ├── .env.example              # Template file
│   └── .env.production           # Production environment
├── Backend/                      # Backend (Spring Boot)
│   ├── .env                      # Development environment
│   └── .env.example              # Template file
└── .gitignore                    # Excludes sensitive .env files
```

## 🎯 **Frontend Environment Variables (Vite)**

### **File: `ems/.env`**

**Important**: Vite environment variables must start with `VITE_` to be accessible in the browser.

### **Key Variables:**
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_BACKEND_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_DEMO_DATA=true
VITE_ENABLE_STATISTICS=true
VITE_ENABLE_SEARCH=true

# UI Configuration
VITE_DEFAULT_PAGE_SIZE=10
VITE_THEME=light
```

### **Usage in React Components:**
```typescript
// Access environment variables in React
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const enableDemo = import.meta.env.VITE_ENABLE_DEMO_DATA === 'true';
```

## 🚀 **Backend Environment Variables (Spring Boot)**

### **File: `Backend/.env`**

### **Key Variables:**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ems
DB_USERNAME=root
DB_PASSWORD=Anekka@123

# Server Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

### **Usage in Spring Boot:**
Spring Boot automatically loads `.env` files and maps them to application properties.

## 🔧 **Setup Instructions**

### **1. Frontend Setup**
```bash
cd ems
cp .env.example .env
# Edit .env with your specific values
```

### **2. Backend Setup**
```bash
cd Backend
cp .env.example .env
# Edit .env with your database credentials
```

### **3. Update Database Credentials**
Edit `Backend/.env`:
```bash
DB_PASSWORD=your-actual-password
DB_NAME=your-database-name
```

## 🌍 **Environment-Specific Configurations**

### **Development Environment**
- **Frontend**: Uses `.env` (already configured)
- **Backend**: Uses `.env` with local database
- **API URL**: `http://localhost:8080`

### **Production Environment**
- **Frontend**: Uses `.env.production`
- **Backend**: Uses environment variables from hosting platform
- **API URL**: Your production backend URL

### **Netlify Deployment**
For Netlify, set environment variables in the dashboard:
```
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_ENABLE_DEMO_DATA=false
VITE_DEBUG_MODE=false
```

## 🔒 **Security Best Practices**

### **✅ DO:**
- Use `.env.example` files as templates
- Keep sensitive data in `.env` files (excluded from Git)
- Use different configurations for different environments
- Validate environment variables in your application

### **❌ DON'T:**
- Commit `.env` files with sensitive data to Git
- Put secrets in frontend environment variables (they're public)
- Use the same credentials for development and production

## 🛠️ **Customization**

### **Adding New Variables**

**Frontend (Vite):**
1. Add to `ems/.env`: `VITE_NEW_FEATURE=true`
2. Use in code: `import.meta.env.VITE_NEW_FEATURE`

**Backend (Spring Boot):**
1. Add to `Backend/.env`: `NEW_CONFIG=value`
2. Use in code: `@Value("${NEW_CONFIG}") String newConfig`

### **Environment Variable Validation**
Consider adding validation in your application startup to ensure required variables are set.

## 🎯 **Quick Start**

### **1. Copy Template Files**
```bash
cp ems/.env.example ems/.env
cp Backend/.env.example Backend/.env
```

### **2. Update Database Credentials**
Edit `Backend/.env` with your MySQL credentials.

### **3. Update Frontend API URL**
Edit `ems/.env` if your backend runs on a different port.

### **4. Start Applications**
```bash
# Backend
cd Backend && mvn spring-boot:run

# Frontend
cd ems && npm run dev
```

## 📊 **Environment Variables Reference**

### **Frontend Variables:**
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_ENABLE_DEMO_DATA`: Show demo data
- `VITE_DEFAULT_PAGE_SIZE`: Items per page
- `VITE_THEME`: UI theme (light/dark)

### **Backend Variables:**
- `DB_PASSWORD`: Database password
- `SERVER_PORT`: Application port
- `CORS_ALLOWED_ORIGINS`: Frontend URLs
- `SPRING_PROFILES_ACTIVE`: Active profile

## 🎉 **Ready to Use!**

Your environment configuration is now set up and ready for development and deployment! 🚀
