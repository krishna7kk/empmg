// Environment Configuration for Employee Management System
// This file centralizes all environment variable access

export interface AppConfig {
  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;
  backendUrl: string;
  employeesEndpoint: string;
  demoEndpoint: string;

  // Application Configuration
  appName: string;
  appVersion: string;
  appDescription: string;

  // Development Configuration
  devMode: boolean;
  debugMode: boolean;
  enableLogging: boolean;

  // Feature Flags
  enableDemoData: boolean;
  enableStatistics: boolean;
  enableSearch: boolean;
  enableExport: boolean;

  // UI Configuration
  defaultPageSize: number;
  maxPageSize: number;
  theme: string;

  // Performance Configuration
  enableLazyLoading: boolean;
  cacheDuration: number;

  // Error Handling
  enableErrorBoundary: boolean;
  errorReporting: boolean;
}

// Helper function to parse boolean environment variables
const parseBoolean = (value: string | undefined, defaultValue: boolean = false): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to parse number environment variables
const parseNumber = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Environment configuration object
export const config: AppConfig = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  apiTimeout: parseNumber(import.meta.env.VITE_API_TIMEOUT, 10000),
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  employeesEndpoint: import.meta.env.VITE_API_EMPLOYEES_ENDPOINT || '/api/employees',
  demoEndpoint: import.meta.env.VITE_API_DEMO_ENDPOINT || '/api/demo',

  // Application Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Employee Management System',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Full-stack Employee Management System',

  // Development Configuration
  devMode: parseBoolean(import.meta.env.VITE_DEV_MODE, import.meta.env.DEV),
  debugMode: parseBoolean(import.meta.env.VITE_DEBUG_MODE, false),
  enableLogging: parseBoolean(import.meta.env.VITE_ENABLE_LOGGING, true),

  // Feature Flags
  enableDemoData: parseBoolean(import.meta.env.VITE_ENABLE_DEMO_DATA, true),
  enableStatistics: parseBoolean(import.meta.env.VITE_ENABLE_STATISTICS, true),
  enableSearch: parseBoolean(import.meta.env.VITE_ENABLE_SEARCH, true),
  enableExport: parseBoolean(import.meta.env.VITE_ENABLE_EXPORT, false),

  // UI Configuration
  defaultPageSize: parseNumber(import.meta.env.VITE_DEFAULT_PAGE_SIZE, 10),
  maxPageSize: parseNumber(import.meta.env.VITE_MAX_PAGE_SIZE, 100),
  theme: import.meta.env.VITE_THEME || 'light',

  // Performance Configuration
  enableLazyLoading: parseBoolean(import.meta.env.VITE_ENABLE_LAZY_LOADING, true),
  cacheDuration: parseNumber(import.meta.env.VITE_CACHE_DURATION, 300000),

  // Error Handling
  enableErrorBoundary: parseBoolean(import.meta.env.VITE_ENABLE_ERROR_BOUNDARY, true),
  errorReporting: parseBoolean(import.meta.env.VITE_ERROR_REPORTING, false),
};

// API URLs builder
export const apiUrls = {
  // Base URLs
  base: config.apiBaseUrl,
  backend: config.backendUrl,

  // Employee endpoints
  employees: `${config.apiBaseUrl}${config.employeesEndpoint}`,
  employeeById: (id: number) => `${config.apiBaseUrl}${config.employeesEndpoint}/${id}`,
  employeeSearch: `${config.apiBaseUrl}${config.employeesEndpoint}/search`,
  employeeStatistics: `${config.apiBaseUrl}${config.employeesEndpoint}/statistics`,
  employeeDepartments: `${config.apiBaseUrl}${config.employeesEndpoint}/departments`,
  employeeHealth: `${config.apiBaseUrl}${config.employeesEndpoint}/health`,

  // Demo endpoints
  demo: `${config.apiBaseUrl}${config.demoEndpoint}`,
  demoEmployees: `${config.apiBaseUrl}${config.demoEndpoint}/employees`,
  demoStatistics: `${config.apiBaseUrl}${config.demoEndpoint}/statistics`,
  demoHealth: `${config.apiBaseUrl}${config.demoEndpoint}/health`,
};

// Utility functions
export const utils = {
  // Check if running in development mode
  isDevelopment: () => config.devMode,

  // Check if running in production mode
  isProduction: () => !config.devMode,

  // Get full API URL
  getApiUrl: (endpoint: string) => `${config.apiBaseUrl}${endpoint}`,

  // Log only if logging is enabled
  log: (...args: any[]) => {
    if (config.enableLogging) {
      console.log('[EMS]', ...args);
    }
  },

  // Debug log only if debug mode is enabled
  debug: (...args: any[]) => {
    if (config.debugMode) {
      console.debug('[EMS DEBUG]', ...args);
    }
  },

  // Error log (always enabled)
  error: (...args: any[]) => {
    console.error('[EMS ERROR]', ...args);
  },
};

// Export environment info for debugging
export const environmentInfo = {
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
  ssr: import.meta.env.SSR,
  baseUrl: import.meta.env.BASE_URL,
  config,
};

// Log configuration in development mode
if (config.devMode && config.enableLogging) {
  console.log('🔧 Environment Configuration Loaded:', environmentInfo);
}

export default config;
