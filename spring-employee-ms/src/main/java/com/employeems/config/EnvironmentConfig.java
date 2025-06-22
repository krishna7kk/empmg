package com.employeems.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * Environment Configuration for Employee Management System
 * This class centralizes all environment variable access
 */
@Configuration
@PropertySource(value = "file:.env", ignoreResourceNotFound = true)
public class EnvironmentConfig {

    // Database Configuration
    @Value("${DB_HOST:localhost}")
    private String dbHost;

    @Value("${DB_PORT:3306}")
    private String dbPort;

    @Value("${DB_NAME:ems}")
    private String dbName;

    @Value("${DB_USERNAME:root}")
    private String dbUsername;

    @Value("${DB_PASSWORD:}")
    private String dbPassword;

    // Server Configuration
    @Value("${SERVER_PORT:8080}")
    private String serverPort;

    @Value("${SERVER_SERVLET_CONTEXT_PATH:/}")
    private String contextPath;

    // Application Configuration
    @Value("${SPRING_APPLICATION_NAME:Employee Management System}")
    private String applicationName;

    @Value("${SPRING_PROFILES_ACTIVE:dev}")
    private String activeProfile;

    // CORS Configuration
    @Value("${CORS_ALLOWED_ORIGINS:http://localhost:3000,http://localhost:5173}")
    private String corsAllowedOrigins;

    @Value("${CORS_ALLOWED_METHODS:GET,POST,PUT,DELETE,OPTIONS}")
    private String corsAllowedMethods;

    @Value("${CORS_ALLOWED_HEADERS:*}")
    private String corsAllowedHeaders;

    @Value("${CORS_ALLOW_CREDENTIALS:true}")
    private boolean corsAllowCredentials;

    // Security Configuration
    @Value("${SECURITY_ENABLED:false}")
    private boolean securityEnabled;

    @Value("${JWT_SECRET:default-secret-key}")
    private String jwtSecret;

    @Value("${JWT_EXPIRATION:86400000}")
    private long jwtExpiration;

    // Logging Configuration
    @Value("${LOGGING_LEVEL_COM_EMPLOYEEMS:DEBUG}")
    private String loggingLevel;

    // Cache Configuration
    @Value("${CACHE_TTL:300}")
    private int cacheTtl;

    // Connection Pool Configuration
    @Value("${SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE:20}")
    private int maxPoolSize;

    @Value("${SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE:5}")
    private int minIdle;

    // Getters
    public String getDbHost() {
        return dbHost;
    }

    public String getDbPort() {
        return dbPort;
    }

    public String getDbName() {
        return dbName;
    }

    public String getDbUsername() {
        return dbUsername;
    }

    public String getDbPassword() {
        return dbPassword;
    }

    public String getServerPort() {
        return serverPort;
    }

    public String getContextPath() {
        return contextPath;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public String getActiveProfile() {
        return activeProfile;
    }

    public String getCorsAllowedOrigins() {
        return corsAllowedOrigins;
    }

    public String getCorsAllowedMethods() {
        return corsAllowedMethods;
    }

    public String getCorsAllowedHeaders() {
        return corsAllowedHeaders;
    }

    public boolean isCorsAllowCredentials() {
        return corsAllowCredentials;
    }

    public boolean isSecurityEnabled() {
        return securityEnabled;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    public long getJwtExpiration() {
        return jwtExpiration;
    }

    public String getLoggingLevel() {
        return loggingLevel;
    }

    public int getCacheTtl() {
        return cacheTtl;
    }

    public int getMaxPoolSize() {
        return maxPoolSize;
    }

    public int getMinIdle() {
        return minIdle;
    }

    // Utility methods
    public String getDatabaseUrl() {
        return String.format("jdbc:mysql://%s:%s/%s?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&zeroDateTimeBehavior=convertToNull",
                dbHost, dbPort, dbName);
    }

    public String[] getCorsAllowedOriginsArray() {
        return corsAllowedOrigins.split(",");
    }

    public String[] getCorsAllowedMethodsArray() {
        return corsAllowedMethods.split(",");
    }

    public String[] getCorsAllowedHeadersArray() {
        return corsAllowedHeaders.equals("*") ? new String[]{"*"} : corsAllowedHeaders.split(",");
    }

    public boolean isDevelopmentMode() {
        return "dev".equals(activeProfile) || "development".equals(activeProfile);
    }

    public boolean isProductionMode() {
        return "prod".equals(activeProfile) || "production".equals(activeProfile);
    }

    // Configuration validation
    public boolean isConfigurationValid() {
        return dbPassword != null && !dbPassword.isEmpty() &&
               dbName != null && !dbName.isEmpty() &&
               dbUsername != null && !dbUsername.isEmpty();
    }

    @Override
    public String toString() {
        return "EnvironmentConfig{" +
                "dbHost='" + dbHost + '\'' +
                ", dbPort='" + dbPort + '\'' +
                ", dbName='" + dbName + '\'' +
                ", dbUsername='" + dbUsername + '\'' +
                ", serverPort='" + serverPort + '\'' +
                ", applicationName='" + applicationName + '\'' +
                ", activeProfile='" + activeProfile + '\'' +
                ", securityEnabled=" + securityEnabled +
                ", corsAllowedOrigins='" + corsAllowedOrigins + '\'' +
                '}';
    }
}
