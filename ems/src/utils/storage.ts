import { Employee, PayRequest, Message, Notification, MonthlyRecord } from '../types';

export const StorageKeys = {
  EMPLOYEES: 'employees',
  PAY_REQUESTS: 'payRequests',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  MONTHLY_RECORDS: 'monthlyRecords',
  CURRENT_USER: 'currentUser'
};

export const getEmployees = (): Employee[] => {
  return JSON.parse(localStorage.getItem(StorageKeys.EMPLOYEES) || '[]');
};

export const saveEmployees = (employees: Employee[]): void => {
  localStorage.setItem(StorageKeys.EMPLOYEES, JSON.stringify(employees));
};

export const getPayRequests = (): PayRequest[] => {
  return JSON.parse(localStorage.getItem(StorageKeys.PAY_REQUESTS) || '[]');
};

export const savePayRequests = (requests: PayRequest[]): void => {
  localStorage.setItem(StorageKeys.PAY_REQUESTS, JSON.stringify(requests));
};

export const getMessages = (): Message[] => {
  return JSON.parse(localStorage.getItem(StorageKeys.MESSAGES) || '[]');
};

export const saveMessages = (messages: Message[]): void => {
  localStorage.setItem(StorageKeys.MESSAGES, JSON.stringify(messages));
};

export const getNotifications = (): Notification[] => {
  return JSON.parse(localStorage.getItem(StorageKeys.NOTIFICATIONS) || '[]');
};

export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem(StorageKeys.NOTIFICATIONS, JSON.stringify(notifications));
};

export const getMonthlyRecords = (): MonthlyRecord[] => {
  return JSON.parse(localStorage.getItem(StorageKeys.MONTHLY_RECORDS) || '[]');
};

export const saveMonthlyRecords = (records: MonthlyRecord[]): void => {
  localStorage.setItem(StorageKeys.MONTHLY_RECORDS, JSON.stringify(records));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const addNotification = (userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void => {
  const notifications = getNotifications();
  const newNotification: Notification = {
    id: generateId(),
    userId,
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  notifications.unshift(newNotification);
  saveNotifications(notifications);
};

export const calculateNetSalary = (record: Partial<MonthlyRecord>): number => {
  const basicSalary = record.basicSalary || 0;
  const presentDays = record.presentDays || 0;
  const totalWorkingDays = record.totalWorkingDays || 1;
  const halfDays = record.halfDays || 0;
  const overtimeHours = record.overtimeHours || 0;
  const bonuses = record.bonuses || 0;
  const deductions = record.deductions || 0;

  // Calculate daily rate
  const dailyRate = basicSalary / totalWorkingDays;
  
  // Calculate salary based on attendance
  const attendanceSalary = (presentDays * dailyRate) + (halfDays * dailyRate * 0.5);
  
  // Add overtime (assuming 1.5x rate for overtime)
  const overtimePay = overtimeHours * (dailyRate / 8) * 1.5;
  
  // Calculate gross salary
  const grossSalary = attendanceSalary + overtimePay + bonuses;
  
  // Calculate net salary
  const netSalary = grossSalary - deductions;
  
  return Math.max(0, netSalary);
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

export const getCurrentMonthYear = (): { month: string; year: number } => {
  const now = new Date();
  return {
    month: getMonthName(now.getMonth()),
    year: now.getFullYear()
  };
};