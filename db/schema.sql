----------Drops the Table to "wash" with clean Data:
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

----------Referring to Database that the Application will use:
USE employees_db;

----------Schema/Layout for First Table to Store Data; "Department":
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

----------Schema/Layout for Second Table to Store Data; "Role":
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    -- review TEXT NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

----------Schema/Layout for Third Table to Store Data; "Employees":
CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    -- review TEXT NOT NULL,
    FOREIGN KEY (role_id) 
    REFERENCES role(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
    ON DELETE SET NULL
);