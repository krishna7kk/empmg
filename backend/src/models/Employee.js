const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'First name is required'
      },
      len: {
        args: [2, 50],
        msg: 'First name must be between 2 and 50 characters'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Last name is required'
      },
      len: {
        args: [2, 50],
        msg: 'Last name must be between 2 and 50 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Email address already exists'
    },
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      },
      notEmpty: {
        msg: 'Email is required'
      }
    }
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Department is required'
      },
      isIn: {
        args: [['HR', 'Engineering', 'Marketing', 'Sales', 'Finance', 'Operations', 'IT', 'Legal', 'Customer Service', 'Research & Development']],
        msg: 'Please select a valid department'
      }
    }
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Position is required'
      },
      len: {
        args: [2, 100],
        msg: 'Position must be between 2 and 100 characters'
      }
    }
  },
  hireDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Please provide a valid hire date'
      },
      notEmpty: {
        msg: 'Hire date is required'
      },
      isNotFuture(value) {
        if (new Date(value) > new Date()) {
          throw new Error('Hire date cannot be in the future');
        }
      }
    }
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: {
        msg: 'Salary must be a valid number'
      },
      min: {
        args: [0],
        msg: 'Salary cannot be negative'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  tableName: 'employees',
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['department']
    },
    {
      fields: ['isActive']
    }
  ]
});

// Instance methods
Employee.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

Employee.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  
  // Add computed fields
  values.fullName = this.getFullName();
  
  return values;
};

module.exports = Employee;
