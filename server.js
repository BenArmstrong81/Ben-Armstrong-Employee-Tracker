//----------Imports and requires inquirer
const inquirer = require('inquirer');
const figlet = require('figlet');
//----------Imports and requires mysql2
const mysql = require('mysql2');


figlet("Employee Manager", function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data)
});    
//----------Connects to database:
const connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'S0phi32021!',
      database: 'employees_db'
    },
    console.log(`Connected to the Employee Management Database.`)
  );


const mainMenu = () => { 
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
        case "View all Employees":
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
    employees.id, 
    employees.first_name, 
    employees.last_name, 
    role.title,  
    department_name,
    role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS 
    manager FROM 
    employees 
    LEFT JOIN role ON 
    employees.role_id = role.id 
    LEFT JOIN department ON 
    role.department_id = department.id 
    LEFT JOIN employees manager ON 
    manager.id = employees.manager_id;`;
    // show result in the terminal by console.table
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      mainMenu();
    });
  }
//----------Upon user input "Add Employee" which will include: first name, last name, role, and manager
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
        FROM employees
        LEFT JOIN role ON employees.role_id = role.id
        LEFT JOIN employees AS manager ON manager.id = employees.manager_id 
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
        const query = `INSERT INTO employees 
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
    employees.id, 
    employees.first_name, 
    employees.last_name, 
    role.title, 
    department_name, 
    role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS 
    manager FROM 
    employees LEFT JOIN role ON 
    employees.role_id = role.id 
    LEFT JOIN department ON 
    role.department_id = department.id LEFT JOIN 
    employees manager ON 
    manager.id = employees.manager_id;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      const employees = data.map(
        (item) => `${item.first_name} ${item.last_name}`
      );
      inquirer
        .prompt({
          name: "employees",
          type: "list",
          message: "Which Employee Would you Like to Remove?",
          choices: [...employees],
        })
        .then((answer) => {
          const query = `DELETE FROM employees WHERE first_name = ? AND last_name = ?`;
          connection.query(
            query,
            [answer.employees.split(" ")[0], answer.employees.split(" ")[1]],
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
     department_name AS department 
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
    department_name FROM 
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
          name: "department_name",
          message: "What is the name of your new Department?",
        },
      ])
      .then((data) => {
        const { department_name } = data;
        connection.query(
          `INSERT INTO department (department_name) VALUES (?)`,
          [department_name],
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n-------------------\n Department ${department_name} has been Added!\n`
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
// =============view all employees by manager===========
function ViewAllEmployeesByManager() {
  // display a list includes all managers: first name, last name
  const query = `SELECT 
   employees.id, 
   employees.first_name, 
   employees.last_name, 
   role.title, 
   department.name AS 
   department, 
   CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
   FROM employees 
   LEFT JOIN role ON employees.role_id = role.id 
   LEFT JOIN department ON role.department_id = department.id 
   LEFT JOIN employees manager ON manager.id = employees.manager_id 
   ORDER BY manager;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}
// ========== update employee manager ==========
function UpdateEmployeeManager() {
  // show all ee's as a list
  const query = `SELECT first_name, last_name FROM employee;`;
  connection.query(query, (err, data) => {
  // map all ee's to an array
  const employees = data.map(
    (item) => `${item.first_name} ${item.last_name}`
  );
  // prompt user to select an ee to update
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee would you like to update?",
        choices: employees,
      },
    ])
    .then((answer) => {
      // console.log("line 400+ &&&", answer); // returns the selected employee
      // get the selected employee's first and last name
      const selectedEmployee = answer.employee.split(" ");
      const firstName = selectedEmployee[0];
      const lastName = selectedEmployee[1];
 
      // query all managers 
      const query = `SELECT 
      first_name, last_name 
      FROM employees 
      WHERE manager_id IS NULL 
      AND first_name != '${firstName}' 
      AND last_name != '${lastName}';`;
      connection.query(query, (err, data) => {
        //console.log("line 400+ ***", data); 
        // map all managers to an array
        const managers = data.map(
          (item) => `${item.first_name} ${item.last_name}`
        );
        // prompt the user to select a new manager
        inquirer
          .prompt({
            name: "manager",
            type: "list",
            message: "Who is the employee's new manager?",
            choices: managers,
          })
          .then((answer) => {
            // get the selected manager's id
            const query = `SELECT id FROM employee WHERE first_name = ? AND last_name = ?`;
            connection.query(query, [answer.manager.split(" ")[0], answer.manager.split(" ")[1]], (err, data) => {
              if (err) throw err;
              const managerId = data[0].id;
              // update the employee's manager in the database
              const query = `UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?`;
              connection.query(
                query,
                [managerId, firstName, lastName],
                (err, data) => {
                  if (err) throw err;
                  console.log(
                    `Successfully updated ${firstName} ${lastName}'s manager to ${answer.manager}.`
                  );
                  ViewAllEmployees();
                }
              );
            });
          });
      }
    );
  });
});
}
// ============ total utilized budget of a department ===========
function ViewTotalUtilizedBudgetByDepartment() {
  // total budget: department, sum of salaries
  const query = `SELECT department.name AS department, 
   SUM(role.salary) AS utilized_budget FROM employee 
   LEFT JOIN role ON employee.role_id = role.id 
   LEFT JOIN department ON role.department_id = department.id 
   GROUP BY department.name;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}
  
//----------Exit's the Application:
function Exit() {
  console.log("Thanks for Using the Employee Management Tracker Have a ✨ GREAT Day!✨");
  connection.end();
}
  
mainMenu();