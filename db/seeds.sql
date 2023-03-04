USE employees_db;

INSERT INTO department (id, department_name)
VALUES (1, "Executive"),
       (2, "Treasuries"),
       (3, "Operations"),
       (4, "Retail"),
       (5, "Risk & Compliance"),
       (6, "Products"),
       (7, "Data, Analytics, Info Mgmt"),
       (8, "Information and Tecnology");
    

INSERT INTO department_role (id, title, salary)
VALUES (1, "Head Of", 250000),
       (2, "Senior Leader", 180000),
       (3, "Specialist", 150000),
       (4, "Analyst", 125000),
       (5, "Team Leader", 135000),
       (6, "Team Member", 90000),
       (7, "Processor", 75000);

INSERT INTO employees (id, first_name, last_name, manager_id)
VALUES (1, "Richard", "Branson", NULL),
       (2, "Michael", "Schumacher", 1),
       (3, "Warren", "Buffett", NULL),
       (4, "Simon", "Sinek", 3),
       (5, "Charle", "Munger", NULL),
       (6, "Tim", "Ferris", 5),
       (7, "Jack", "Bogle", NULL),
       (8, "Ray", "Dalio", 7);