const { body, param, query } = require('express-validator');

// Validation rules for creating an employee
const validateCreateEmployee = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isIn(['HR', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations', 'IT', 'Legal', 'Customer Service', 'Research & Development'])
    .withMessage('Please select a valid department'),

  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),

  body('hireDate')
    .notEmpty()
    .withMessage('Hire date is required')
    .isISO8601()
    .withMessage('Please provide a valid date in YYYY-MM-DD format')
    .custom((value) => {
      const hireDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today
      
      if (hireDate > today) {
        throw new Error('Hire date cannot be in the future');
      }
      return true;
    }),

  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number')
    .toFloat(),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
    .toBoolean()
];

// Validation rules for updating an employee (all fields optional)
const validateUpdateEmployee = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('department')
    .optional()
    .trim()
    .isIn(['HR', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations', 'IT', 'Legal', 'Customer Service', 'Research & Development'])
    .withMessage('Please select a valid department'),

  body('position')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Position must be between 2 and 100 characters'),

  body('hireDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date in YYYY-MM-DD format')
    .custom((value) => {
      const hireDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (hireDate > today) {
        throw new Error('Hire date cannot be in the future');
      }
      return true;
    }),

  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number')
    .toFloat(),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
    .toBoolean()
];

// Validation for employee ID parameter
const validateEmployeeId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Employee ID must be a positive integer')
    .toInt()
];

// Validation for query parameters
const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('department')
    .optional()
    .trim()
    .isIn(['HR', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations', 'IT', 'Legal', 'Customer Service', 'Research & Development'])
    .withMessage('Invalid department'),

  query('isActive')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isActive must be true or false'),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),

  query('sortBy')
    .optional()
    .isIn(['firstName', 'lastName', 'email', 'department', 'position', 'hireDate', 'salary', 'createdAt'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('Sort order must be ASC or DESC')
];

module.exports = {
  validateCreateEmployee,
  validateUpdateEmployee,
  validateEmployeeId,
  validateQueryParams
};
