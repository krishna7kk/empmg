# Employee Management System

A comprehensive web-based Employee Management System built with Spring Boot, MySQL, and Bootstrap.

## Features

- **Employee CRUD Operations**: Create, Read, Update, Delete employees
- **Search & Filter**: Search by name, email, position, and filter by department
- **Pagination**: Efficient data browsing with pagination
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **REST API**: Complete RESTful API for integration
- **Data Validation**: Server-side validation with user-friendly error messages
- **Dashboard**: Statistics and overview of employee data
- **Department Management**: Organize employees by departments

## Technology Stack

- **Backend**: Spring Boot 3.2.0, Java 17
- **Database**: MySQL 8.0+
- **Frontend**: Thymeleaf, Bootstrap 5, JavaScript
- **Build Tool**: Maven
- **ORM**: Hibernate/JPA

## Prerequisites

Before running the application, ensure you have:

1. **Java 17** or higher installed
2. **MySQL 8.0** or higher installed and running
3. **Maven 3.6** or higher (or use the included Maven wrapper)

## Database Setup

### Option 1: Using Docker (Recommended)
```bash
# Start MySQL using Docker Compose
docker-compose up -d mysql

# Wait for MySQL to be ready (check logs)
docker-compose logs -f mysql
```

### Option 2: Local MySQL Installation
1. **Install MySQL 8.0+** (if not already installed)
2. **Create the database**:
   ```bash
   mysql -u root -p < database-setup.sql
   ```

   Or manually:
   ```sql
   mysql -u root -p
   CREATE DATABASE employee_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   exit
   ```

3. **Update database credentials** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

### Verify Database Connection
```bash
mysql -u root -p -e "SHOW DATABASES;" | grep employee_management
```

## Running the Application

### Option 1: Using Maven Wrapper (Recommended)
```bash
# On Windows
./mvnw.cmd spring-boot:run

# On Linux/Mac
./mvnw spring-boot:run
```

### Option 2: Using Maven
```bash
mvn spring-boot:run
```

### Option 3: Build and Run JAR
```bash
mvn clean package
java -jar target/employee-management-system-1.0.0.jar
```

### Option 4: Using Docker
```bash
# Start MySQL and the application
docker-compose up -d

# Or build and run just the app (MySQL must be running separately)
docker build -t employee-management .
docker run -p 8080:8080 --network host employee-management
```

## Accessing the Application

Once the application starts successfully:

- **Web Interface**: http://localhost:8080
- **Dashboard**: http://localhost:8080/dashboard
- **Employee List**: http://localhost:8080/employees
- **REST API**: http://localhost:8080/api/employees

## API Endpoints

### Employee Management
- `GET /api/employees` - Get all employees (with pagination and filtering)
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee (soft delete)
- `GET /api/employees/statistics` - Get employee statistics
- `GET /api/employees/departments` - Get all departments

### Query Parameters for GET /api/employees
- `page` - Page number (default: 0)
- `size` - Page size (default: 10)
- `sortBy` - Sort field (default: id)
- `sortDirection` - Sort direction: asc/desc (default: asc)
- `search` - Search term
- `department` - Filter by department

## Sample API Usage

### Get all employees
```bash
curl -X GET "http://localhost:8080/api/employees"
```

### Create new employee
```bash
curl -X POST "http://localhost:8080/api/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "department": "Engineering",
    "position": "Software Developer",
    "hireDate": "2024-01-15",
    "salary": 75000
  }'
```

### Search employees
```bash
curl -X GET "http://localhost:8080/api/employees?search=john&department=Engineering"
```

## Configuration

### Database Configuration
Edit `src/main/resources/application.properties`:

```properties
# Database URL
spring.datasource.url=jdbc:mysql://localhost:3306/employee_management?useSSL=false&serverTimezone=UTC

# Database credentials
spring.datasource.username=root
spring.datasource.password=your_password

# Hibernate settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Server Configuration
```properties
# Server port
server.port=8080

# Application name
spring.application.name=Employee Management System
```

## Project Structure

```
src/
├── main/
│   ├── java/com/employeems/
│   │   ├── controller/          # REST and Web controllers
│   │   ├── entity/              # JPA entities
│   │   ├── repository/          # Data repositories
│   │   ├── service/             # Business logic
│   │   └── EmployeeManagementSystemApplication.java
│   └── resources/
│       ├── static/              # CSS, JS, images
│       ├── templates/           # Thymeleaf templates
│       ├── application.properties
│       └── data.sql
└── test/                        # Test files
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in application.properties
   - Verify database exists

2. **Port Already in Use**
   - Change server port in application.properties: `server.port=8081`

3. **Java Version Issues**
   - Ensure Java 17+ is installed: `java -version`
   - Set JAVA_HOME environment variable

4. **Maven Issues**
   - Use Maven wrapper: `./mvnw` instead of `mvn`
   - Clear Maven cache: `mvn clean`

### Logs
Check application logs for detailed error information. Logs will show:
- Database connection status
- SQL queries (if `spring.jpa.show-sql=true`)
- Application startup information

## Development

### Adding New Features
1. Create new entity in `entity/` package
2. Create repository interface in `repository/` package
3. Implement business logic in `service/` package
4. Create REST endpoints in `controller/` package
5. Add web pages in `templates/` directory

### Database Schema Changes
- Modify entity classes
- Set `spring.jpa.hibernate.ddl-auto=update` for automatic schema updates
- Or create migration scripts for production

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Ensure all prerequisites are met
4. Verify database connectivity

git commit -m "Initial commit"
