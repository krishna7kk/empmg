import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Phone, CreditCard, UserCheck, Calendar, 
  DollarSign, TrendingUp, MessageCircle, Bell,
  Send, CheckCircle, Clock, AlertCircle, Plus,
  BarChart3, FileText, Target, Award
} from 'lucide-react';
import { 
  getEmployees, getPayRequests, savePayRequests, 
  getMessages, saveMessages, getNotifications, saveNotifications,
  getMonthlyRecords, generateId, addNotification 
} from '../utils/storage';
import { Employee, PayRequest, Message, Notification, MonthlyRecord } from '../types';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'salary' | 'messages' | 'notifications'>('dashboard');
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [payRequests, setPayRequests] = useState<PayRequest[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([]);
  const [showPayRequestForm, setShowPayRequestForm] = useState(false);
  const [newPayRequest, setNewPayRequest] = useState({
    amount: '',
    purpose: '',
    description: '',
    requestType: 'advance' as 'salary' | 'advance' | 'bonus' | 'reimbursement' | 'other'
  });

  useEffect(() => {
    if (user) {
      const employees = getEmployees();
      const currentEmployee = employees.find(emp => emp.id === user.id);
      setEmployee(currentEmployee || null);
      
      loadMessages();
      loadNotifications();
      loadPayRequests();
      loadMonthlyRecords();
    }
  }, [user]);

  const loadMessages = () => {
    const allMessages = getMessages();
    const employeeMessages = allMessages.filter(
      msg => msg.senderId === user?.id || msg.receiverId === user?.id
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    setMessages(employeeMessages);
  };

  const loadNotifications = () => {
    const allNotifications = getNotifications();
    const employeeNotifications = allNotifications.filter(notif => notif.userId === user?.id);
    setNotifications(employeeNotifications);
  };

  const loadPayRequests = () => {
    const allRequests = getPayRequests();
    const employeeRequests = allRequests.filter(req => req.employeeId === user?.id);
    setPayRequests(employeeRequests);
  };

  const loadMonthlyRecords = () => {
    const allRecords = getMonthlyRecords();
    const employeeRecords = allRecords.filter(record => record.employeeId === user?.id);
    setMonthlyRecords(employeeRecords);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: generateId(),
      senderId: user.id,
      senderName: user.name,
      receiverId: 'admin',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      senderType: 'employee'
    };

    const allMessages = getMessages();
    allMessages.push(message);
    saveMessages(allMessages);
    loadMessages();
    setNewMessage('');

    // Notify admin
    addNotification('admin', 'New Message', `${user.name} sent you a message`, 'info');
  };

  const handleSubmitPayRequest = () => {
    if (!user || !newPayRequest.amount || !newPayRequest.purpose) return;

    const request: PayRequest = {
      id: generateId(),
      employeeId: user.id,
      employeeName: user.name,
      amount: parseInt(newPayRequest.amount),
      purpose: newPayRequest.purpose,
      description: newPayRequest.description,
      requestType: newPayRequest.requestType,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const allRequests = getPayRequests();
    allRequests.push(request);
    savePayRequests(allRequests);
    loadPayRequests();

    // Notify admin
    addNotification('admin', 'New Payment Request', `${user.name} submitted a ${newPayRequest.requestType} request for ₹${newPayRequest.amount}`, 'info');

    setShowPayRequestForm(false);
    setNewPayRequest({
      amount: '',
      purpose: '',
      description: '',
      requestType: 'advance'
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    const allNotifications = getNotifications();
    const updatedNotifications = allNotifications.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    saveNotifications(updatedNotifications);
    loadNotifications();
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadMessages = messages.filter(msg => !msg.isRead && msg.senderId !== user?.id).length;
  const unreadNotifications = notifications.filter(notif => !notif.isRead).length;
  const pendingPayRequests = payRequests.filter(req => req.status === 'pending').length;
  const totalEarnings = monthlyRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const currentMonthRecord = monthlyRecords.find(record => {
    const now = new Date();
    const currentMonth = now.toLocaleDateString('en-US', { month: 'long' });
    const currentYear = now.getFullYear();
    return record.month === currentMonth && record.year === currentYear;
  });

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: User },
              { key: 'attendance', label: 'Attendance', icon: Calendar },
              { key: 'salary', label: 'Salary Records', icon: DollarSign },
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900">{employee.fullName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{employee.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Contact Number</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-900">{employee.contactNumber}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Account Number</label>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-900">{employee.accountNumber}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Parent/Guardian</label>
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-900">{employee.parentName}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Parent Contact</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-900">{employee.parentContact}</p>
                  </div>
                </div>
                {employee.esicNumber && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">ESIC Number</label>
                    <p className="text-gray-900">{employee.esicNumber}</p>
                  </div>
                )}
                {employee.pfNumber && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">PF Number</label>
                    <p className="text-gray-900">{employee.pfNumber}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Basic Salary</label>
                  <p className="text-gray-900">₹{employee.basicSalary?.toLocaleString() || 'Not set'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Leave Balance</label>
                  <p className="text-gray-900">{employee.leaveBalance || 0} days</p>
                </div>
              </div>
            </div>

            {/* Current Month Summary */}
            {currentMonthRecord && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Current Month - {currentMonthRecord.month} {currentMonthRecord.year}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Present Days</p>
                        <p className="text-2xl font-semibold text-gray-900">{currentMonthRecord.presentDays}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Attendance</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {((currentMonthRecord.presentDays / currentMonthRecord.totalWorkingDays) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-amber-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Leave Days</p>
                        <p className="text-2xl font-semibold text-gray-900">{currentMonthRecord.leaveDays}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Net Salary</p>
                        <p className="text-2xl font-semibold text-gray-900">₹{currentMonthRecord.netSalary.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-green-600">₹{totalEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Requests</span>
                  <span className="font-semibold text-amber-600">{pendingPayRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Salary Records</span>
                  <span className="font-semibold text-blue-600">{monthlyRecords.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Leave Balance</span>
                  <span className="font-semibold text-purple-600">{employee.leaveBalance || 0} days</span>
                </div>
              </div>
            </div>

            {/* Payment Request */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Requests</h3>
              <button
                onClick={() => setShowPayRequestForm(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Request
              </button>
            </div>

            {/* Recent Requests */}
            {payRequests.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h3>
                <div className="space-y-3">
                  {payRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">₹{request.amount}</p>
                        <p className="text-xs text-gray-500">{request.requestType}</p>
                      </div>
                      <div className="flex items-center">
                        {request.status === 'pending' && (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        {request.status === 'approved' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {request.status === 'rejected' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`ml-2 text-xs font-medium capitalize ${
                          request.status === 'pending' ? 'text-yellow-600' :
                          request.status === 'approved' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Attendance Summary</h3>
            
            {monthlyRecords.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No attendance records available yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Present</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {monthlyRecords.reduce((sum, record) => sum + record.presentDays, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Target className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Avg Attendance</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {(monthlyRecords.reduce((sum, record) => sum + (record.presentDays / record.totalWorkingDays * 100), 0) / monthlyRecords.length).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-amber-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Leaves</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {monthlyRecords.reduce((sum, record) => sum + record.leaveDays, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Award className="h-8 w-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Leave Balance</p>
                        <p className="text-2xl font-semibold text-gray-900">{employee.leaveBalance || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Records */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Days</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Half Days</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leaves</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlyRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.month} {record.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.totalWorkingDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.presentDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.absentDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.halfDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.leaveDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              (record.presentDays / record.totalWorkingDays * 100) >= 90 ? 'bg-green-100 text-green-800' :
                              (record.presentDays / record.totalWorkingDays * 100) >= 75 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {((record.presentDays / record.totalWorkingDays) * 100).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Salary Records Tab */}
      {activeTab === 'salary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Salary Records</h3>
            
            {monthlyRecords.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No salary records available yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Salary Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                        <p className="text-2xl font-semibold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Average Salary</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          ₹{monthlyRecords.length > 0 ? Math.round(totalEarnings / monthlyRecords.length).toLocaleString() : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Records Count</p>
                        <p className="text-2xl font-semibold text-gray-900">{monthlyRecords.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Records */}
                <div className="space-y-4">
                  {monthlyRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">{record.month} {record.year}</h4>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          record.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          record.paymentStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {record.paymentStatus}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Basic Salary</p>
                          <p className="text-lg font-semibold text-gray-900">₹{record.basicSalary.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Attendance</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {record.presentDays}/{record.totalWorkingDays} days
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Bonuses</p>
                          <p className="text-lg font-semibold text-green-600">+₹{record.bonuses.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Deductions</p>
                          <p className="text-lg font-semibold text-red-600">-₹{record.deductions.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Gross Salary</p>
                            <p className="text-xl font-semibold text-gray-900">₹{record.grossSalary.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-500">Net Salary</p>
                            <p className="text-2xl font-bold text-green-600">₹{record.netSalary.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      {record.overtimeHours > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Overtime:</span> {record.overtimeHours} hours
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Messages with Admin</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications yet.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 bg-blue-600 rounded-full ml-2 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Payment Request Modal */}
      {showPayRequestForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Payment Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Request Type</label>
                  <select
                    value={newPayRequest.requestType}
                    onChange={(e) => setNewPayRequest({...newPayRequest, requestType: e.target.value as any})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="advance">Salary Advance</option>
                    <option value="salary">Salary Payment</option>
                    <option value="bonus">Bonus Request</option>
                    <option value="reimbursement">Reimbursement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                  <input
                    type="number"
                    value={newPayRequest.amount}
                    onChange={(e) => setNewPayRequest({...newPayRequest, amount: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Purpose</label>
                  <input
                    type="text"
                    value={newPayRequest.purpose}
                    onChange={(e) => setNewPayRequest({...newPayRequest, purpose: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief purpose of request"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                  <textarea
                    value={newPayRequest.description}
                    onChange={(e) => setNewPayRequest({...newPayRequest, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional details..."
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end pt-6 space-x-2">
                <button
                  onClick={() => {
                    setShowPayRequestForm(false);
                    setNewPayRequest({
                      amount: '',
                      purpose: '',
                      description: '',
                      requestType: 'advance'
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPayRequest}
                  disabled={!newPayRequest.amount || !newPayRequest.purpose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;