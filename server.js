//----------Imports and requires inquirer
const inquirer = require('inquirer');
//----------Imports and requires mysql2
const mysql = require('mysql2');

//----------Connects to database:
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'S0phi32021!',
      database: 'employees_db'
    },
    console.log(`Connected to the Employee Management Database.`)
  );


const mainMenu = () => {
//BEN TO AMEND, for some reason syntax not working??
    console.log(` _________________________________________________
                 |                                                 |
                 |  _____                 _                        |
                 | | ____|_ __ ___  _ __ | | ___  _   _  ___  ___  |
                 | |  _| | '_ ` _ \| '_ \| |/ _ \| | | |/ _ \/ _ \ |
                 | | |___| | | | | | |_) | | (_) | |_| |  __/  __/ |
                 | |_____|_| |_| |_| .__/|_|\___/ \__, |\___|\___| |
                 |                 |_|             |__/            |
                 |  __  __                                         |
                 | |  \/  | ___ _ _ __   __ _  __ _  ___ _ __      |
                 | | |\/| |/  _ `| '_ \ / _` |/ _` |/ _ \ '__|     |
                 | | |  | |  (_| | | | | (_| | (_| |  __/ |        |
                 | |_|  |_|\___,_|_| |_|\__,_|\__, |\___|_|        |
                 |                            |___/                |
                 |                                                 |
                 |_________________________________________________|
                 `);
    inquirer
      .prompt({
        name: "startingOptions",
        type: "list",
        message: "What would you like to do",
        choices: [
            "View all Employees",
            "Add an Employee",
            "Remove an Employee",
            "Update an Employee Role",
            "View all Roles",
            "Add a Role",
            "Remove a Role", 
            "View all Departments", 
            "Add a Department", 
            "Remove a Department", 
            "Quit", 
        ],
      })
      .then((answer) => {
        // console.log(answer);
        switch (answer.startingOptions) {
        case "View All Employees":
            ViewAllEmployees();
            break;
  
        case "Add an Employee":
            AddEmployee();
            break;
  
        case "Remove an Employee":
            RemoveEmployee();
            break;
  
        case "Update an Employee Role":
            UpdateEmployeeRole();
            break;

        case "View all Roles":
            ViewAllRoles();
            break;
  
        case "Add a Role":
            AddRole();
            break;

        case "Remove a Role":
            RemoveRole();
            break;

        case "View all Departments":
            ViewAllDepartments();
            break;

        case "Add a Department":
            AddDepartment();
            break;

        case "Remove a Department":
            RemoveDepartment();
            break;
  
          case "Quit":
            Exit();
            break;
        }
      });
  };

//----------Upon user input views "All Employees" using: id, first_name, last_name, role_title, department, salary, manager :
  function ViewAllEmployees() {
    const query = `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS 
    department, 
    role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS 
    manager FROM 
    employee 
    LEFT JOIN role ON 
    employee.role_id = role.id 
    LEFT JOIN department ON 
    role.department_id = department.id 
    LEFT JOIN employee manager ON 
    manager.id = employee.manager_id;`;
    // show result in the terminal by console.table
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      mainMenu();
    });
  }
//----------Upon user input "Add Employee" // first name, last name, role, and manager
function AddEmployee() {
    let userInput1;
    const query = `SELECT id, title FROM role WHERE title NOT LIKE '%Manager%';`;
    Promise.resolve()
      .then(() => {
        return new Promise((resolve, reject) => {
          connection.query(query, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
      })
      .then((rolesData) => {
        const roles = rolesData.map(
          (item) => `Role title: ${item.title}, Role ID: ${item.id}`
        );
        return inquirer.prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "role",
            type: "list",
            message: "What is the employee's role id?",
            choices: roles,
          },
        ]);
      })
      .then((answer) => {
        userInput1 = answer;
        const query2 = `SELECT 
        manager.id as manager_id,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN employee AS manager ON manager.id = employee.manager_id 
        WHERE manager.id IS NOT NULL
        GROUP BY manager_id;`;
        return new Promise((resolve, reject) => {
          connection.query(query2, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
      })
      .then((managersData) => {
        const managers = managersData.map(
          (item) => `${item.manager_name} ID:${item.manager_id}`
        );
        return inquirer.prompt([
          {
            name: "manager",
            type: "list",
            message: "Which Manager does the Employee Report to?",
            choices: [...managers, "None"],
          },
        ]);
      })
      .then((answer) => {
        const query = `INSERT INTO employee 
        (first_name, last_name, role_id, manager_id) 
        VALUES (?, ?, ?, ?)`;
        connection.query(
          query,
          [
            userInput1.first_name,
            userInput1.last_name,
            userInput1.role.split("ID: ")[1],
            answer.manager.split("ID:")[1],
          ],
          (err, data) => {
            if (err) throw err;
            console.log(
              `Added ${userInput1.first_name} ${userInput1.last_name} Successfully into the Employee's Database!`
            );
            ViewAllEmployees();
          }
        );
      });
  }
//----------Upon User Input, It Allows The User to Remove an Employee:
function RemoveEmployee() {
    const query = `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS 
    department, 
    role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS 
    manager FROM 
    employee LEFT JOIN role ON 
    employee.role_id = role.id 
    LEFT JOIN department ON 
    role.department_id = department.id LEFT JOIN 
    employee manager ON 
    manager.id = employee.manager_id;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      const employees = data.map(
        (item) => `${item.first_name} ${item.last_name}`
      );
      inquirer
        .prompt({
          name: "employee",
          type: "list",
          message: "Which Employee Would you Like to Remove?",
          choices: [...employees],
        })
        .then((answer) => {
          const query = `DELETE FROM employee WHERE first_name = ? AND last_name = ?`;
          connection.query(
            query,
            [answer.employee.split(" ")[0], answer.employee.split(" ")[1]],
            (err, data) => {
              // console.log("line 340", data);
              if (err) throw err;
              console.log(
                `You have Successfully Removed ${answer.employee} from the Emplyee's Database.`
              );
              ViewAllEmployees();
            }
          );
        });
    });
  }
  
//----------Upon User Input, Allows User to Update an Employee's Role:
  function UpdateEmployeeRole() {
    const query = `SELECT first_name, last_name FROM employee;`;
    connection.query(query, (err, data) => {
      const employees = data.map(
        (item) => `${item.first_name} ${item.last_name}`
      );
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which Employee Would you Like to Update?",
            choices: employees,
          },
        ])
        .then((answer) => {
          const selectedEmployee = answer.employee.split(" ");
          const firstName = selectedEmployee[0];
          const lastName = selectedEmployee[1];
          const query = `SELECT title FROM role;`;
          connection.query(query, (err, data) => {
            const roles = data.map((item) => item.title);
            inquirer
              .prompt({
                name: "role",
                type: "list",
                message: "What is the Employee's New Role?",
                choices: roles,
              })
              .then((answer) => {
                const query = `SELECT id FROM role WHERE title = ?`;
                connection.query(query, [answer.role], (err, data) => {
                  if (err) throw err;
                  const roleId = data[0].id;
                  const query = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`;
                  connection.query(
                    query,
                    [roleId, firstName, lastName],
                    (err, data) => {
                      if (err) throw err;
                      console.log(
                        `Successfully Updated ${firstName} ${lastName}'s Role to ${answer.role}.`
                      );
                      ViewAllEmployees();
                    }
                  );
                });
              });
          });
        });
    });
  }
//----------Upon User Input, Allows them to View All Roles in the Organization:
function ViewAllRoles() {
    const query = `SELECT 
     role.id, 
     role.title, 
     role.salary, 
     department.name AS department 
     FROM role 
     LEFT JOIN department ON 
     role.department_id = department.id;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      mainMenu();
    });
  }
  
//----------Upon User Input, Add's a New Role:
  function AddRole() {
    const query = `SELECT department.name FROM department`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      const departments = data.map((item) => `${item.name}`);
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is the Title of the New Role you Wish to Add?",
          },
          {
            type: "input",
            name: "salary",
            message: "What is the Salary of Your Newly Created Role?",
          },
          {
            type: "list",
            name: "department_name",
            message: "What is the Department of Your Newly Created Role?",
            choices: [...departments],
          },
        ])
        .then((data) => {
          const { title, salary, department_name } = data;
          connection.query(
            `INSERT INTO role (title, salary, department_id)
               SELECT ?, ?, department.id
               FROM department
               WHERE department.name = ?`,
            [title, salary, department_name],
            (err, res) => {
              if (err) throw err;
              console.log(
                `\n-------------------\n Role ${title} has been Added!\n`
              );
              ViewAllRoles();
            }
          );
        });
    });
  }
  
//----------Upon User Input, Remove's a Role from the Database:
  function RemoveRole() {
    connection.query("SELECT role.title FROM role", (err, data) => {
      const roles = data.map((item) => `${item.title}`);
      inquirer
        .prompt([
          {
            type: "list",
            name: "title",
            message: "Select the Role you wish to Remove",
            choices: [...roles],
          },
        ])
        .then((data) => {
          const { title } = data;
          connection.query(
            "SELECT * FROM role WHERE title = '" + title + "'",
            (err, res) => {
              if (err) throw err;
              if (res.length === 0) {
                console.log(`Role with Title ${data.title} Does NOT Exist.`);
              }
              if (res.length !== 0) {
                connection.query(
                  "DELETE FROM role WHERE title = '" + title + "'",
                  (err, res) => {
                    if (err) throw err;
                    if (res.affectedRows === 0) {
                      console.log(
                        `Role with Title ${data.title} Does NOT Exist.`
                      );
                    } else {
                      console.table({
                        message: `\n-------------------\n Role with Title ${data.title} Has Been Successfully Removed.\n`,
                        affectedRows: res.affectedRows,
                      });
                      ViewAllRoles();
                    }
                  }
                );
              }
            }
          );
        });
    });
  }
//----------Upon User Input, Allows User to View All Departments:
function ViewAllDepartments() {
    const query = `SELECT 
    department.id, 
    department.name FROM 
    department;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      mainMenu();
    });
  }
  
//----------Upon User Input, Add's a Department:
  function AddDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of your new Department?",
        },
      ])
      .then((data) => {
        const { name } = data;
        connection.query(
          `INSERT INTO department (name) VALUES (?)`,
          [name],
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n-------------------\n Department ${name} has been Added!\n`
            );
            ViewAllDepartments();
          }
        );
      });
  }
  
//----------Upon User input, Remove's a Department:
  function RemoveDepartment() {
    connection.query("SELECT department.name FROM department", (err, data) => {
      const departments = data.map((item) => `${item.name}`);
      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Select the Department you wish to Remove",
            choices: [...departments],
          },
        ])
        .then((data) => {
          const { name } = data;
          connection.query(
            "SELECT * FROM department WHERE name = '" + name + "'",
            (err, res) => {
              if (err) throw err;
              if (res.length === 0) {
                console.log(`Department with Name ${data.name} Does NOT Exist.`);
              }
              if (res.length !== 0) {
                connection.query(
                  "DELETE FROM department WHERE name = '" + name + "'",
                  (err, res) => {
                    if (err) throw err;
                    if (res.affectedRows === 0) {
                      console.log(
                        `Department with Name ${data.name} Does NOT Exist.`
                      );
                    } else {
                      console.table({
                        message: `\n-------------------\n Department with Name ${data.name} Has Been Successfully Removed.\n`,
                        affectedRows: res.affectedRows,
                      });
                      ViewAllDepartments();
                    }
                  }
                );
              }
            }
          );
        });
    });
  }
//----------Exit's the Application:
function Exit() {
    console.log("Thanks for Using the Emplyee Tracker, Have a GREAT Day!");
    connection.end();
  }
  
  mainMenu();