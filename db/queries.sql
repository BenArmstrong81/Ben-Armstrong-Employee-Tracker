-- select department.department_name AS department,
--     SUM(role.salary) AS utilized_budget
-- from role
-- LEFT JOIN employees ON role.id = employees.role_id
-- LEFT JOIN department ON role.department_id = department.id
-- GROUP BY department_name

-- insert into role(title, salary, department_id)
-- values('New Role', 100000, 1);

-- select * from role;