const { sequelize } = require('../config/database');
const Employee = require('./Employee');

// Define associations here if needed in the future
// Example: Employee.hasMany(Project);

const models = {
  Employee,
  sequelize
};

module.exports = models;
