import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, DollarSign, MessageCircle, 
  Bell, CheckCircle, XCircle, Edit, Send, Calendar,
  Plus, TrendingUp, FileText, Clock, Calculator,
  BarChart3, PieChart, Download
} from 'lucide-react';
import { 
  getEmployees, saveEmployees, getPayRequests, savePayRequests,
  getMessages, saveMessages, getNotifications, saveNotifications,
  getMonthlyRecords, saveMonthlyRecords, generateId, addNotification,
  calculateNetSalary, getMonthName, getCurrentMonthYear
} from '../utils/storage';
import { Employee, PayRequest, Message, Notification, MonthlyRecord } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'employees' | 'salary' | 'payments' | 'reports' | 'messages' | 'notifications'>('pending');
  const [pendingEmployees, setPendingEmployees] = useState<Employee[]>([]);
  const [approvedEmployees, setApprovedEmployees] = useState<Employee[]>([]);
  const [payRequests, setPayRequests] = useState<PayRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messageRecipient, setMessageRecipient] = useState('');
  const [showAddMonth, setShowAddMonth] = useState(false);
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState<string>('');
  const [newMonthlyRecord, setNewMonthlyRecord] = useState<Partial<MonthlyRecord>>({
    month: getCurrentMonthYear().month,
    year: getCurrentMonthYear().year,
    basicSalary: 0,
    totalWorkingDays: 22,
    presentDays: 0,
    absentDays: 0,
    halfDays: 0,
    leaveDays: 0,
    overtimeHours: 0,
    bonuses: 0,
    deductions: 0,
    paymentStatus: 'pending'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const employees = getEmployees();
    setPendingEmployees(employees.filter(emp => !emp.isApproved));
    setApprovedEmployees(employees.filter(emp => emp.isApproved));
    
    setPayRequests(getPayRequests());
    setMessages(getMessages());
    setNotifications(getNotifications().filter(n => n.userId === 'admin'));
    setMonthlyRecords(getMonthlyRecords());
  };

  const handleApproveEmployee = (employeeId: string, approve: boolean) => {
    const employees = getEmployees();
    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        return { ...emp, isApproved: approve, leaveBalance: 24 }; // 24 days annual leave
      }
      return emp;
    });
    saveEmployees(updatedEmployees);
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      addNotification(
        employeeId,
        approve ? 'Account Approved' : 'Account Rejected',
        approve 
          ? 'Your account has been approved. You can now log in and access your dashboard.'
          : 'Unfortunately, your account application was not approved.',
        approve ? 'success' : 'error'
      );
    }
    
    loadData();
  };

  const handlePayRequest = (requestId: string, approve: boolean, adminNotes?: string) => {
    const requests = getPayRequests();
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return { 
          ...req, 
          status: approve ? 'approved' as const : 'rejected' as const,
          processedAt: new Date().toISOString(),
          processedBy: 'admin',
          adminNotes: adminNotes || ''
        };
      }
      return req;
    });
    savePayRequests(updatedRequests);
    
    const request = requests.find(req => req.id === requestId);
    if (request) {
      addNotification(
        request.employeeId,
        approve ? 'Payment Request Approved' : 'Payment Request Rejected',
        approve 
          ? `Your ${request.requestType} request of ₹${request.amount} has been approved.`
          : `Your ${request.requestType} request of ₹${request.amount} has been rejected. ${adminNotes ? 'Reason: ' + adminNotes : ''}`,
        approve ? 'success' : 'error'
      );
    }
    
    loadData();
  };

  const handleUpdateEmployee = (employee: Employee) => {
    const employees = getEmployees();
    const updatedEmployees = employees.map(emp => 
      emp.id === employee.id ? employee : emp
    );
    saveEmployees(updatedEmployees);
    setEditingEmployee(null);
    loadData();
    
    addNotification(
      employee.id,
      'Profile Updated',
      'Your profile information has been updated by admin.',
      'info'
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !messageRecipient) return;

    const message: Message = {
      id: generateId(),
      senderId: 'admin',
      senderName: 'Administrator',
      receiverId: messageRecipient,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      senderType: 'admin'
    };

    const allMessages = getMessages();
    allMessages.push(message);
    saveMessages(allMessages);
    
    const employee = approvedEmployees.find(emp => emp.id === messageRecipient);
    if (employee) {
      addNotification(
        messageRecipient,
        'New Message',
        'Administrator sent you a message',
        'info'
      );
    }
    
    setNewMessage('');
    setMessageRecipient('');
    loadData();
  };

  const handleAddMonthlyRecord = () => {
    if (!selectedEmployeeForSalary || !newMonthlyRecord.basicSalary) return;

    const employee = approvedEmployees.find(emp => emp.id === selectedEmployeeForSalary);
    if (!employee) return;

    // Calculate derived values
    const totalWorkingDays = newMonthlyRecord.totalWorkingDays || 22;
    const presentDays = newMonthlyRecord.presentDays || 0;
    const halfDays = newMonthlyRecord.halfDays || 0;
    const leaveDays = newMonthlyRecord.leaveDays || 0;
    const absentDays = totalWorkingDays - presentDays - halfDays - leaveDays;

    const grossSalary = calculateNetSalary({
      ...newMonthlyRecord,
      absentDays,
      totalWorkingDays
    }) + (newMonthlyRecord.deductions || 0);

    const netSalary = calculateNetSalary({
      ...newMonthlyRecord,
      absentDays,
      totalWorkingDays
    });

    const monthlyRecord: MonthlyRecord = {
      id: generateId(),
      employeeId: selectedEmployeeForSalary,
      employeeName: employee.fullName,
      month: newMonthlyRecord.month || getCurrentMonthYear().month,
      year: newMonthlyRecord.year || getCurrentMonthYear().year,
      basicSalary: newMonthlyRecord.basicSalary || 0,
      totalWorkingDays,
      presentDays,
      absentDays,
      halfDays: halfDays,
      leaveDays,
      overtimeHours: newMonthlyRecord.overtimeHours || 0,
      bonuses: newMonthlyRecord.bonuses || 0,
      deductions: newMonthlyRecord.deductions || 0,
      grossSalary,
      netSalary,
      paymentStatus: newMonthlyRecord.paymentStatus || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const records = getMonthlyRecords();
    records.push(monthlyRecord);
    saveMonthlyRecords(records);

    // Update employee's leave balance
    const updatedEmployees = getEmployees().map(emp => {
      if (emp.id === selectedEmployeeForSalary) {
        return {
          ...emp,
          leaveBalance: Math.max(0, (emp.leaveBalance || 24) - leaveDays)
        };
      }
      return emp;
    });
    saveEmployees(updatedEmployees);

    addNotification(
      selectedEmployeeForSalary,
      'Monthly Record Added',
      `Your salary record for ${newMonthlyRecord.month} ${newMonthlyRecord.year} has been added. Net salary: ₹${netSalary}`,
      'info'
    );

    setShowAddMonth(false);
    setSelectedEmployeeForSalary('');
    setNewMonthlyRecord({
      month: getCurrentMonthYear().month,
      year: getCurrentMonthYear().year,
      basicSalary: 0,
      totalWorkingDays: 22,
      presentDays: 0,
      absentDays: 0,
      halfDays: 0,
      leaveDays: 0,
      overtimeHours: 0,
      bonuses: 0,
      deductions: 0,
      paymentStatus: 'pending'
    });
    loadData();
  };

  const markNotificationAsRead = (notificationId: string) => {
    const allNotifications = getNotifications();
    const updatedNotifications = allNotifications.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    saveNotifications(updatedNotifications);
    loadData();
  };

  const updatePaymentStatus = (recordId: string, status: 'pending' | 'paid' | 'processing') => {
    const records = getMonthlyRecords();
    const updatedRecords = records.map(record => {
      if (record.id === recordId) {
        return { ...record, paymentStatus: status, updatedAt: new Date().toISOString() };
      }
      return record;
    });
    saveMonthlyRecords(updatedRecords);
    
    const record = records.find(r => r.id === recordId);
    if (record) {
      addNotification(
        record.employeeId,
        'Payment Status Updated',
        `Your salary payment for ${record.month} ${record.year} is now ${status}.`,
        status === 'paid' ? 'success' : 'info'
      );
    }
    
    loadData();
  };

  const generateReport = (type: 'salary' | 'attendance') => {
    const data = monthlyRecords.map(record => ({
      Employee: record.employeeName,
      Month: `${record.month} ${record.year}`,
      'Basic Salary': record.basicSalary,
      'Present Days': record.presentDays,
      'Total Days': record.totalWorkingDays,
      'Attendance %': ((record.presentDays / record.totalWorkingDays) * 100).toFixed(1),
      'Net Salary': record.netSalary,
      'Payment Status': record.paymentStatus
    }));

    const csvContent = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const pendingCount = pendingEmployees.length;
  const pendingPayments = payRequests.filter(req => req.status === 'pending').length;
  const unreadMessages = messages.filter(msg => !msg.isRead && msg.senderType === 'employee').length;
  const unreadNotifications = notifications.filter(notif => !notif.isRead).length;
  const totalSalaryPaid = monthlyRecords.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.netSalary, 0);

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-2xl font-semibold text-gray-900">{approvedEmployees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-amber-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Payments</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingPayments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Paid</p>
              <p className="text-2xl font-semibold text-gray-900">₹{totalSalaryPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Unread Messages</p>
              <p className="text-2xl font-semibold text-gray-900">{unreadMessages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {[
              { key: 'pending', label: 'Pending Approvals', icon: UserCheck, badge: pendingCount },
              { key: 'employees', label: 'Employees', icon: Users },
              { key: 'salary', label: 'Salary Management', icon: Calculator },
              { key: 'payments', label: 'Payment Requests', icon: DollarSign, badge: pendingPayments },
              { key: 'reports', label: 'Reports', icon: BarChart3 },
              { key: 'messages', label: 'Messages', icon: MessageCircle, badge: unreadMessages },
              { key: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications }
            ].map(({ key, label, icon: Icon, badge }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
                {badge && badge > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Pending Approvals Tab */}
        {activeTab === 'pending' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Employee Approvals</h3>
            {pendingEmployees.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <UserCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEmployees.map((employee) => (
                  <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{employee.fullName}</h4>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                        <p className="text-sm text-gray-600">{employee.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account: {employee.accountNumber}</p>
                        <p className="text-sm text-gray-600">Parent: {employee.parentName}</p>
                        <p className="text-sm text-gray-600">Parent Contact: {employee.parentContact}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApproveEmployee(employee.id, true)}
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveEmployee(employee.id, false)}
                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Management</h3>
            <div className="space-y-4">
              {approvedEmployees.map((employee) => (
                <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                      <div>
                        <h4 className="font-medium text-gray-900">{employee.fullName}</h4>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ESIC: {employee.esicNumber || 'Not set'}</p>
                        <p className="text-sm text-gray-600">PF: {employee.pfNumber || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Basic Salary: ₹{employee.basicSalary || 'Not set'}</p>
                        <p className="text-sm text-gray-600">Leave Balance: {employee.leaveBalance || 0} days</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingEmployee(employee)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Salary Management Tab */}
        {activeTab === 'salary' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Salary Management</h3>
              <button
                onClick={() => setShowAddMonth(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Month
              </button>
            </div>

            <div className="space-y-4">
              {monthlyRecords.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No salary records yet. Click "Add Month" to create the first record.</p>
                </div>
              ) : (
                monthlyRecords.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{record.employeeName}</h4>
                        <p className="text-sm text-gray-600">{record.month} {record.year}</p>
                        <p className="text-sm text-gray-600">Basic: ₹{record.basicSalary}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Present: {record.presentDays}/{record.totalWorkingDays} days</p>
                        <p className="text-sm text-gray-600">Attendance: {((record.presentDays / record.totalWorkingDays) * 100).toFixed(1)}%</p>
                        <p className="text-sm text-gray-600">Leave: {record.leaveDays} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gross: ₹{record.grossSalary}</p>
                        <p className="text-sm text-gray-600">Deductions: ₹{record.deductions}</p>
                        <p className="text-sm font-medium text-gray-900">Net: ₹{record.netSalary}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            record.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            record.paymentStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {record.paymentStatus}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {record.paymentStatus === 'pending' && (
                            <button
                              onClick={() => updatePaymentStatus(record.id, 'processing')}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                            >
                              Process
                            </button>
                          )}
                          {record.paymentStatus === 'processing' && (
                            <button
                              onClick={() => updatePaymentStatus(record.id, 'paid')}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Payment Requests Tab */}
        {activeTab === 'payments' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Requests</h3>
            <div className="space-y-4">
              {payRequests.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No payment requests yet</p>
                </div>
              ) : (
                payRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{request.employeeName}</h4>
                            <p className="text-sm text-gray-600">Type: {request.requestType}</p>
                            <p className="text-sm text-gray-600">Amount: ₹{request.amount}</p>
                            <p className="text-sm text-gray-600">Purpose: {request.purpose}</p>
                          </div>
                          <div>
                            {request.description && (
                              <p className="text-sm text-gray-600 mb-2">Description: {request.description}</p>
                            )}
                            <p className="text-sm text-gray-600">
                              Requested: {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            {request.processedAt && (
                              <p className="text-sm text-gray-600">
                                Processed: {new Date(request.processedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handlePayRequest(request.id, true)}
                              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handlePayRequest(request.id, false, 'Request denied by admin')}
                              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Reports & Analytics</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => generateReport('salary')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Salary Report
                </button>
                <button
                  onClick={() => generateReport('attendance')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Attendance Report
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center">
                  <PieChart className="h-8 w-8 mr-3" />
                  <div>
                    <p className="text-sm opacity-90">Total Records</p>
                    <p className="text-2xl font-semibold">{monthlyRecords.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 mr-3" />
                  <div>
                    <p className="text-sm opacity-90">Total Salary Paid</p>
                    <p className="text-2xl font-semibold">₹{totalSalaryPaid.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 mr-3" />
                  <div>
                    <p className="text-sm opacity-90">Avg Attendance</p>
                    <p className="text-2xl font-semibold">
                      {monthlyRecords.length > 0 
                        ? (monthlyRecords.reduce((sum, r) => sum + (r.presentDays / r.totalWorkingDays * 100), 0) / monthlyRecords.length).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Records Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900">Recent Salary Records</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyRecords.slice(0, 10).map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.employeeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.month} {record.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.presentDays}/{record.totalWorkingDays} ({((record.presentDays / record.totalWorkingDays) * 100).toFixed(1)}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{record.netSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            record.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            record.paymentStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {record.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Send Message</h4>
                <div className="space-y-3">
                  <select
                    value={messageRecipient}
                    onChange={(e) => setMessageRecipient(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Employee</option>
                    {approvedEmployees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.fullName}
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !messageRecipient}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {message.senderType === 'employee' ? message.senderName : 'You'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {message.senderType === 'employee' && !message.isRead && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Monthly Record Modal */}
      {showAddMonth && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Monthly Salary Record</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Employee</label>
                    <select
                      value={selectedEmployeeForSalary}
                      onChange={(e) => setSelectedEmployeeForSalary(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose Employee</option>
                      {approvedEmployees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Month</label>
                    <select
                      value={newMonthlyRecord.month}
                      onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, month: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({length: 12}, (_, i) => (
                        <option key={i} value={getMonthName(i)}>{getMonthName(i)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="number"
                      value={newMonthlyRecord.year}
                      onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, year: parseInt(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Basic Salary (₹)</label>
                    <input
                      type="number"
                      value={newMonthlyRecord.basicSalary}
                      onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, basicSalary: parseInt(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Attendance Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Working Days</label>
                      <input
                        type="number"
                        value={newMonthlyRecord.totalWorkingDays}
                        onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, totalWorkingDays: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Present Days</label>
                      <input
                        type="number"
                        value={newMonthlyRecord.presentDays}
                        onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, presentDays: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Half Days</label>
                      <input
                        type="number"
                        value={newMonthlyRecord.halfDays}
                        onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, halfDays: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Leave Days</label>
                      <input
                        type="number"
                        value={newMonthlyRecord.leaveDays}
                        onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, leaveDays: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Additional Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Overtime Hours</label>
                      <input
                        type="number"
                        value={newMonthlyRecord.overtimeHours}
                        onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, overtimeHours: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bonuses (₹)</label>
                      <input
                        type="number"
                        value={newMonthlyRecord.bonuses}
                        onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, bonuses: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deductions (₹)</label>
                      <input
                        type="number"
                        value={newMonthlyRecord.deductions}
                        onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, deductions: parseInt(e.target.value) || 0})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                      <select
                        value={newMonthlyRecord.paymentStatus}
                        onChange={(e) => setNewMonthlyRecord({...newMonthlyRecord, paymentStatus: e.target.value as any})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Salary Preview */}
                {newMonthlyRecord.basicSalary && newMonthlyRecord.totalWorkingDays && (
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Salary Preview</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Gross Salary:</p>
                          <p className="font-medium">₹{(calculateNetSalary(newMonthlyRecord) + (newMonthlyRecord.deductions || 0)).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Deductions:</p>
                          <p className="font-medium">₹{(newMonthlyRecord.deductions || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Net Salary:</p>
                          <p className="font-semibold text-green-600">₹{calculateNetSalary(newMonthlyRecord).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end pt-6 space-x-2">
                <button
                  onClick={() => {
                    setShowAddMonth(false);
                    setSelectedEmployeeForSalary('');
                    setNewMonthlyRecord({
                      month: getCurrentMonthYear().month,
                      year: getCurrentMonthYear().year,
                      basicSalary: 0,
                      totalWorkingDays: 22,
                      presentDays: 0,
                      absentDays: 0,
                      halfDays: 0,
                      leaveDays: 0,
                      overtimeHours: 0,
                      bonuses: 0,
                      deductions: 0,
                      paymentStatus: 'pending'
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMonthlyRecord}
                  disabled={!selectedEmployeeForSalary || !newMonthlyRecord.basicSalary}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Employee: {editingEmployee.fullName}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ESIC Number</label>
                    <input
                      type="text"
                      value={editingEmployee.esicNumber || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, esicNumber: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">PF Number</label>
                    <input
                      type="text"
                      value={editingEmployee.pfNumber || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, pfNumber: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Basic Salary (₹)</label>
                    <input
                      type="number"
                      value={editingEmployee.basicSalary || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, basicSalary: parseInt(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Leave Balance (days)</label>
                    <input
                      type="number"
                      value={editingEmployee.leaveBalance || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, leaveBalance: parseInt(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end pt-6 space-x-2">
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateEmployee(editingEmployee)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;