export interface Employee {
  id: string;
  fullName: string;
  email: string;
  password: string;
  contactNumber: string;
  accountNumber: string;
  parentName: string;
  parentContact: string;
  esicNumber?: string;
  pfNumber?: string;
  isApproved: boolean;
  createdAt: string;
  basicSalary?: number;
  leaveBalance?: number;
}

export interface MonthlyRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  overtimeHours: number;
  bonuses: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  paymentStatus: 'pending' | 'paid' | 'processing';
  createdAt: string;
  updatedAt: string;
}

export interface PayRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  purpose: string;
  description?: string;
  requestType: 'salary' | 'advance' | 'bonus' | 'reimbursement' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
  adminNotes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  senderType: 'employee' | 'admin';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  type: 'employee' | 'admin';
  name: string;
  email: string;
}

export interface AttendanceReport {
  employeeId: string;
  employeeName: string;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  leaveBalance: number;
  attendancePercentage: number;
}

export interface SalaryReport {
  employeeId: string;
  employeeName: string;
  monthlyRecords: MonthlyRecord[];
  totalEarnings: number;
  totalDeductions: number;
  averageSalary: number;
}