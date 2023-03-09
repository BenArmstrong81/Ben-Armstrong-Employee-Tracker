----------Referring to Database that the Application will use:
USE employees_db;

----------First Table to Store Data; "Department":
INSERT INTO department (department_name)
VALUES ("Executive"),
       ("Treasuries"),
       ("Operations"),
       ("Retail"),
       ("Risk & Compliance"),
       ("Products"),
       ("Data, Analytics, Info Mgmt"),
       ("Information and Technology");

----------Second Table to Store Data; "Role":
INSERT INTO role (title, salary, department_id)
VALUES ("Head Of", 250000, 1),
       ("Senior Leader", 180000, 2),
       ("Specialist", 150000, 3),
       ("Analyst", 125000, 4),
       ("Team Leader", 135000, 5),
       ("Team Member", 90000, 6),
       ("Processor", 75000, 7),
       ("Admin", 62000, 8);

----------Third Table to Store Data; "Employees":
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Richard", "Branson", 1, NULL),
       ("Michael", "Schumacher", 2, 1),
       ("Warren", "Buffett", 3, NULL),
       ("Simon", "Sinek", 4, 3),
       ("Charle", "Munger", 5, NULL),
       ("Tim", "Ferris", 6, 5),
       ("Jack", "Bogle", 7, NULL),
       ("Ray", "Dalio", 8, 7);