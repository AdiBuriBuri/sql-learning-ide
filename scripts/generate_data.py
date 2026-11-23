import json
import os

labs_data = [
    # LAB 1
    {
        "id": "lab-1",
        "labNumber": "Lab 1",
        "week": "Week 1 (13-07-2026 to 18-07-2026)",
        "title": "Hospital ER-Model & Relational Tables",
        "co": "CO1, CO2",
        "blooms": "BL5",
        "category": "DDL & ER Modeling",
        "description": "Create scenario-based ER-Models with entities (Hospital Details: Wards, Patients, Doctor, Bills, Staff). Convert into tables (Minimum 5 entities), insert random data, update with ALTER, and apply DELETE and DROP commands.",
        "ddl": """CREATE TABLE Wards (ward_id INT, ward_name STRING, capacity INT, floor INT);
CREATE TABLE Patients (patient_id INT, name STRING, age INT, gender STRING, ward_id INT, disease STRING);
CREATE TABLE Doctors (doctor_id INT, name STRING, specialization STRING, contact STRING);
CREATE TABLE Bills (bill_id INT, patient_id INT, amount INT, payment_status STRING, bill_date STRING);
CREATE TABLE Staff (staff_id INT, name STRING, role STRING, ward_id INT);""",
        "seed": """INSERT INTO Wards VALUES (1, 'ICU', 15, 2);
INSERT INTO Wards VALUES (2, 'Cardiology', 25, 3);
INSERT INTO Wards VALUES (3, 'General Ward', 50, 1);
INSERT INTO Wards VALUES (4, 'Pediatrics', 20, 2);

INSERT INTO Patients VALUES (101, 'Rahul Verma', 45, 'Male', 1, 'Arrhythmia');
INSERT INTO Patients VALUES (102, 'Priya Sharma', 29, 'Female', 2, 'Angina');
INSERT INTO Patients VALUES (103, 'Aman Gupta', 62, 'Male', 3, 'Pneumonia');
INSERT INTO Patients VALUES (104, 'Sneha Joshi', 35, 'Female', 1, 'Post-Op');

INSERT INTO Doctors VALUES (501, 'Dr. Rajesh Rao', 'Cardiologist', '9876543210');
INSERT INTO Doctors VALUES (502, 'Dr. Meera Sen', 'Pulmonologist', '9812345678');
INSERT INTO Doctors VALUES (503, 'Dr. Arun Kumar', 'General Physician', '9898989898');

INSERT INTO Bills VALUES (1001, 101, 45000, 'Paid', '2026-07-14');
INSERT INTO Bills VALUES (1002, 102, 18500, 'Pending', '2026-07-15');
INSERT INTO Bills VALUES (1003, 103, 9200, 'Paid', '2026-07-16');

INSERT INTO Staff VALUES (301, 'Suresh Rawat', 'Nurse', 1);
INSERT INTO Staff VALUES (302, 'Geeta Devi', 'Ward Boy', 2);
INSERT INTO Staff VALUES (303, 'Sunita Rawat', 'Nurse', 3);""",
        "erDiagram": {
            "title": "Hospital Management ER Model (5 Entities)",
            "entities": [
                {"name": "Patients", "keys": ["patient_id (PK)"], "attributes": ["name", "age", "gender", "disease", "ward_id (FK)"]},
                {"name": "Wards", "keys": ["ward_id (PK)"], "attributes": ["ward_name", "capacity", "floor"]},
                {"name": "Doctors", "keys": ["doctor_id (PK)"], "attributes": ["name", "specialization", "contact"]},
                {"name": "Bills", "keys": ["bill_id (PK)"], "attributes": ["amount", "payment_status", "bill_date", "patient_id (FK)"]},
                {"name": "Staff", "keys": ["staff_id (PK)"], "attributes": ["name", "role", "ward_id (FK)"]}
            ],
            "relationships": [
                {"from": "Patients", "to": "Wards", "label": "Admitted in", "cardinality": "N : 1"},
                {"from": "Patients", "to": "Doctors", "label": "Consults / Treated by", "cardinality": "N : M"},
                {"from": "Patients", "to": "Bills", "label": "Generates", "cardinality": "1 : N"},
                {"from": "Staff", "to": "Wards", "label": "Assigned to", "cardinality": "N : 1"}
            ]
        },
        "tasks": [
            {
                "id": "lab1-q1",
                "title": "1. Patient Details with Assigned Ward",
                "prompt": "Display all patient names (alias as Patient_Name), age, disease, and their assigned ward names (alias as Ward_Name) using an INNER JOIN between Patients and Wards.",
                "starterCode": "-- Write your SQL query here\n-- Hint: Use INNER JOIN on Patients.ward_id = Wards.ward_id\n",
                "solutionCode": "SELECT p.name AS Patient_Name, p.age, p.disease, w.ward_name AS Ward_Name FROM Patients p INNER JOIN Wards w ON p.ward_id = w.ward_id;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM & JOIN (FROM Patients p INNER JOIN Wards w)", "desc": "Loads Patients table (4 records) and matches with Wards table using condition p.ward_id = w.ward_id. Rows without a matching ward_id are eliminated.", "rowsAffected": "4 rows matched"},
                    {"phase": "Step 2: SELECT Projection (p.name, p.age, p.disease, w.ward_name)", "desc": "Extracts the requested patient attributes and ward name, assigning friendly aliases 'Patient_Name' and 'Ward_Name'.", "rowsAffected": "4 columns projected"},
                    {"phase": "Step 3: Output Result", "desc": "Presents final consolidated patient-ward report.", "rowsAffected": "4 rows displayed"}
                ],
                "conceptExplanation": "In relational modeling, entities are converted into normalized tables. Foreign key 'ward_id' in Patients establishes an N:1 reference to Wards table, enabling seamless multi-entity navigation.",
                "vivaTips": "Viva Question: What is the difference between an Entity and an Attribute? Entity is a real-world object (e.g., Patient), while an Attribute is a property that describes it (e.g., Patient Age, Disease)."
            },
            {
                "id": "lab1-q2",
                "title": "2. High-Value Bills Filter",
                "prompt": "Display bill_id, patient_id, amount, and payment_status for all bills where the amount is greater than 10000.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT bill_id, patient_id, amount, payment_status FROM Bills WHERE amount > 10000;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Bills", "desc": "Accesses the Bills table containing 3 recorded hospital invoices.", "rowsAffected": "3 rows scanned"},
                    {"phase": "Step 2: WHERE amount > 10000", "desc": "Applies numerical threshold filter. Bill 1001 (45000) and Bill 1002 (18500) qualify; Bill 1003 (9200) is filtered out.", "rowsAffected": "2 rows qualify"},
                    {"phase": "Step 3: SELECT Attributes", "desc": "Returns bill_id, patient_id, amount, and payment_status.", "rowsAffected": "2 rows output"}
                ],
                "conceptExplanation": "The WHERE clause performs a horizontal selection on the dataset using a comparison operator (>).",
                "vivaTips": "Viva Question: Differentiate DDL and DML. DDL (CREATE, ALTER, DROP) alters the schema structure. DML (SELECT, INSERT, UPDATE, DELETE) manipulates the table data."
            }
        ]
    },

    # LAB 2
    {
        "id": "lab-2",
        "labNumber": "Lab 2",
        "week": "Week 2 (20-07-2026 to 25-07-2026)",
        "title": "User Privileges, Transactions & Constraints",
        "co": "CO2",
        "blooms": "BL5",
        "category": "DCL, TCL & Integrity",
        "description": "Create a user and provide GRANT privileges, then REVOKE. Insert 5 records and check ROLLBACK. Add DEFAULT, CHECK, UNIQUE and NOT NULL constraints. Examine duplicate Primary Key and NULL insertions.",
        "ddl": """CREATE TABLE Accounts (account_no INT, holder_name STRING, balance INT, account_type STRING);""",
        "seed": """INSERT INTO Accounts VALUES (1001, 'Vikas Singh', 25000, 'Savings');
INSERT INTO Accounts VALUES (1002, 'Rohan Mehta', 80000, 'Current');
INSERT INTO Accounts VALUES (1003, 'Ananya Sen', 15000, 'Savings');
INSERT INTO Accounts VALUES (1004, 'Kavita Rawat', 32000, 'Savings');
INSERT INTO Accounts VALUES (1005, 'Deepak Joshi', 95000, 'Current');""",
        "tasks": [
            {
                "id": "lab2-q1",
                "title": "1. Transaction Balance Mutation (DML Simulation)",
                "prompt": "Simulate a banking transaction: Deduct 5000 from account 1001 and deposit 5000 into account 1003, then view the updated records for accounts 1001 and 1003.",
                "starterCode": "-- Write your UPDATE and SELECT queries here\n",
                "solutionCode": "UPDATE Accounts SET balance = balance - 5000 WHERE account_no = 1001; UPDATE Accounts SET balance = balance + 5000 WHERE account_no = 1003; SELECT * FROM Accounts WHERE account_no IN (1001, 1003);",
                "stepBreakdown": [
                    {"phase": "Step 1: UPDATE (Debit Account 1001)", "desc": "Decrements balance of account 1001 from 25000 to 20000.", "rowsAffected": "1 row updated"},
                    {"phase": "Step 2: UPDATE (Credit Account 1003)", "desc": "Increments balance of account 1003 from 15000 to 20000.", "rowsAffected": "1 row updated"},
                    {"phase": "Step 3: SELECT Verification", "desc": "Retrieves both modified accounts to verify atomicity and state balance.", "rowsAffected": "2 rows returned"}
                ],
                "conceptExplanation": "ACID properties ensure financial transactions maintain integrity. If any statement fails in a transaction block, ROLLBACK cancels all modifications.",
                "vivaTips": "Viva Question: What is the difference between COMMIT and ROLLBACK? COMMIT permanently saves all changes made in the current transaction; ROLLBACK undoes all changes since the last COMMIT or SAVEPOINT."
            },
            {
                "id": "lab2-q2",
                "title": "2. Verify Domain Constraints (CHECK balance >= 25000)",
                "prompt": "Display all accounts (account_no, holder_name, balance, account_type) where balance is greater than or equal to 25000, ordered by balance descending.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT account_no, holder_name, balance, account_type FROM Accounts WHERE balance >= 25000 ORDER BY balance DESC;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Accounts", "desc": "Scans all 5 account records.", "rowsAffected": "5 rows scanned"},
                    {"phase": "Step 2: WHERE balance >= 25000", "desc": "Filters rows: 1005 (95000), 1002 (80000), 1004 (32000), 1001 (25000) qualify.", "rowsAffected": "4 rows retained"},
                    {"phase": "Step 3: ORDER BY balance DESC", "desc": "Sorts the high-balance accounts from highest to lowest.", "rowsAffected": "Sorted result"}
                ],
                "conceptExplanation": "Integrity constraints enforce business rules. CHECK constraints guarantee that invalid data cannot enter the system.",
                "vivaTips": "Viva Question: Can a table have multiple UNIQUE constraints? Yes! A table can have only ONE Primary Key, but multiple UNIQUE constraints."
            }
        ]
    },

    # LAB 3
    {
        "id": "lab-3",
        "labNumber": "Lab 3",
        "week": "Week 3 (27-07-2026 to 01-08-2026)",
        "title": "Basic Queries on Employee Table",
        "co": "CO3",
        "blooms": "BL4",
        "category": "Basic Queries",
        "description": "Create Employee table: (Employee_id PK, Employee_Name, Department, Age check>18, Salary, City). Run basic count, age checks, salary filters, column aliasing, and distinct operations.",
        "ddl": """CREATE TABLE Employee (Employee_id INT, Employee_Name STRING, Department STRING, Age INT, Salary INT, City STRING);""",
        "seed": """INSERT INTO Employee VALUES (2001, 'Prateek Sharma', 'CSE', 22, 55000, 'Dehradun');
INSERT INTO Employee VALUES (2002, 'Pooja Agarwal', 'Finance', 22, 48000, 'Delhi');
INSERT INTO Employee VALUES (2003, 'Rahul Rawat', 'IT', 26, 62000, 'Delhi');
INSERT INTO Employee VALUES (2004, 'Pankaj Verma', 'Finance', 22, 52000, 'Chandigarh');
INSERT INTO Employee VALUES (2005, 'Deepak Negi', 'CSE', 29, 71000, 'Dehradun');
INSERT INTO Employee VALUES (2006, 'Priya Bansal', 'HR', 24, 38000, 'Delhi');
INSERT INTO Employee VALUES (2007, 'Amit Patel', 'IT', 31, 85000, 'Mumbai');
INSERT INTO Employee VALUES (2008, 'Kunal Joshi', 'Finance', 28, 55000, 'Delhi');""",
        "tasks": [
            {
                "id": "lab3-q1",
                "title": "1. Display Total Number of Employees",
                "prompt": "Display the total number of employees in the Employee table using the COUNT aggregate function, labeled as 'total_employees'.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT COUNT(*) AS total_employees FROM Employee;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Employee", "desc": "Engine accesses the Employee table.", "rowsAffected": "8 rows scanned"},
                    {"phase": "Step 2: AGGREGATE COUNT(*)", "desc": "Calculates the cardinality of the table by counting all rows.", "rowsAffected": "1 aggregate value (8)"},
                    {"phase": "Step 3: SELECT & ALIAS", "desc": "Labels the output column as 'total_employees'.", "rowsAffected": "Single cell output: 8"}
                ],
                "conceptExplanation": "COUNT(*) is an aggregate function that counts total rows regardless of NULL values.",
                "vivaTips": "Viva Question: What is the difference between COUNT(*) and COUNT(column_name)? COUNT(*) counts all rows; COUNT(column_name) counts only rows where column_name is NOT NULL."
            },
            {
                "id": "lab3-q2",
                "title": "2. Retrieve Information of Employees Whose Age is 22",
                "prompt": "Retrieve all information of employees whose age is exactly 22.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT * FROM Employee WHERE Age = 22;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Employee", "desc": "Loads all 8 employee records.", "rowsAffected": "8 rows"},
                    {"phase": "Step 2: WHERE Age = 22", "desc": "Checks predicate: Prateek (22 - PASS), Pooja (22 - PASS), Rahul (26 - FAIL), Pankaj (22 - PASS), others - FAIL.", "rowsAffected": "3 rows pass"},
                    {"phase": "Step 3: SELECT *", "desc": "Projects all columns (Employee_id, Employee_Name, Department, Age, Salary, City).", "rowsAffected": "3 rows displayed"}
                ],
                "conceptExplanation": "The WHERE clause acts as a row filter before any projection occurs.",
                "vivaTips": "Viva Question: What order do SQL clauses execute in? Execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY."
            },
            {
                "id": "lab3-q3",
                "title": "3. Fetch Employees with Salary >= 50,000",
                "prompt": "Fetch the employee id, name and department whose salary is greater than or equal to 50000.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_id, Employee_Name, Department FROM Employee WHERE Salary >= 50000;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Employee", "desc": "Scans all 8 employee rows.", "rowsAffected": "8 rows"},
                    {"phase": "Step 2: WHERE Salary >= 50000", "desc": "Evaluates comparison: Prateek (55k), Rahul (62k), Pankaj (52k), Deepak (71k), Amit (85k), Kunal (55k) qualify.", "rowsAffected": "6 rows qualify"},
                    {"phase": "Step 3: PROJECTION", "desc": "Restricts columns to Employee_id, Employee_Name, and Department only.", "rowsAffected": "3 columns displayed"}
                ],
                "conceptExplanation": "Relational projection restricts specific attributes, reducing memory footprint and network transmission.",
                "vivaTips": "Viva Question: What is relational projection vs selection? Selection (sigma) selects rows; Projection (pi) selects columns."
            },
            {
                "id": "lab3-q4",
                "title": "4. Employees in 'Finance' with Age 22 (Aliased 'Full Name')",
                "prompt": "Find the name of the employees and label the column as \"Full Name\" for those employees whose department is \"Finance\" and age is 22.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_Name AS \"Full Name\" FROM Employee WHERE Department = 'Finance' AND Age = 22;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Employee", "desc": "Accesses Employee dataset.", "rowsAffected": "8 rows"},
                    {"phase": "Step 2: WHERE Department = 'Finance' AND Age = 22", "desc": "Evaluates logical conjunction: Pooja Agarwal and Pankaj Verma satisfy both conditions.", "rowsAffected": "2 rows match"},
                    {"phase": "Step 3: SELECT with Column Alias", "desc": "Projects Employee_Name and renames column header to 'Full Name'.", "rowsAffected": "2 rows output"}
                ],
                "conceptExplanation": "The AND operator requires both predicates to evaluate to TRUE. Column aliasing with AS or quotes provides user-friendly column titles.",
                "vivaTips": "Viva Question: Why use quotes around an alias? Double quotes are required in SQL if the alias contains spaces or special characters."
            },
            {
                "id": "lab3-q5",
                "title": "5. Print Unique Department Names (DISTINCT)",
                "prompt": "Print the department names from the employee table without having duplicates.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT DISTINCT Department FROM Employee;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Employee", "desc": "Reads all 8 rows.", "rowsAffected": "8 rows"},
                    {"phase": "Step 2: SELECT Department", "desc": "Extracts raw departments: ['CSE', 'Finance', 'IT', 'Finance', 'CSE', 'HR', 'IT', 'Finance'].", "rowsAffected": "8 values"},
                    {"phase": "Step 3: DISTINCT Operation", "desc": "Sorts/hashes and eliminates duplicate occurrences: ['CSE', 'Finance', 'IT', 'HR'].", "rowsAffected": "4 unique departments"}
                ],
                "conceptExplanation": "DISTINCT filters out duplicate records from the projection result set.",
                "vivaTips": "Viva Question: Does DISTINCT affect performance? Yes, DISTINCT requires sorting or hashing in memory to identify and remove duplicates."
            }
        ]
    },

    # LAB 4
    {
        "id": "lab-4",
        "labNumber": "Lab 4",
        "week": "Week 4 (03-08-2026 to 08-08-2026)",
        "title": "Aggregation & Sorting (MIN, MAX, SUM, AVG, ORDER BY)",
        "co": "CO2, CO3",
        "blooms": "BL4",
        "category": "Aggregation & Sorting",
        "description": "Find minimum and maximum salary, total and average salary, find employees with identical salary, sort from lowest to highest, and filter department-wise.",
        "ddl": """CREATE TABLE Employee (Employee_id INT, Employee_Name STRING, Department STRING, Age INT, Salary INT, City STRING);""",
        "seed": """INSERT INTO Employee VALUES (2001, 'Prateek Sharma', 'CSE', 22, 55000, 'Dehradun');
INSERT INTO Employee VALUES (2002, 'Pooja Agarwal', 'Finance', 22, 48000, 'Delhi');
INSERT INTO Employee VALUES (2003, 'Rahul Rawat', 'IT', 26, 62000, 'Delhi');
INSERT INTO Employee VALUES (2004, 'Pankaj Verma', 'Finance', 27, 55000, 'Chandigarh');
INSERT INTO Employee VALUES (2005, 'Deepak Negi', 'CSE', 29, 71000, 'Dehradun');
INSERT INTO Employee VALUES (2006, 'Priya Bansal', 'HR', 24, 48000, 'Delhi');
INSERT INTO Employee VALUES (2007, 'Amit Patel', 'IT', 31, 85000, 'Mumbai');
INSERT INTO Employee VALUES (2008, 'Kunal Joshi', 'Finance', 28, 55000, 'Delhi');""",
        "tasks": [
            {
                "id": "lab4-q1",
                "title": "1. Minimum and Maximum Salary",
                "prompt": "Find the minimum and maximum salary from the employee table (alias as min_salary and max_salary).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT MIN(Salary) AS min_salary, MAX(Salary) AS max_salary FROM Employee;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Employee", "desc": "Accesses Salary values: [55000, 48000, 62000, 55000, 71000, 48000, 85000, 55000].", "rowsAffected": "8 values"},
                    {"phase": "Step 2: MIN & MAX Aggregates", "desc": "Calculates MIN = 48000, MAX = 85000.", "rowsAffected": "1 summary row"},
                    {"phase": "Step 3: Output", "desc": "Displays min_salary: 48000 and max_salary: 85000.", "rowsAffected": "1 row"}
                ],
                "conceptExplanation": "MIN and MAX aggregate functions find the lower and upper bounds of a numerical or comparable column.",
                "vivaTips": "Viva Question: Can MIN() and MAX() be applied to text columns? Yes! On text columns, MIN and MAX use alphabetical collation order."
            },
            {
                "id": "lab4-q2",
                "title": "2. Total Salary and Average Salary",
                "prompt": "Show the total salary and average salary of all the employees (alias as total_salary and average_salary).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT SUM(Salary) AS total_salary, AVG(Salary) AS average_salary FROM Employee;",
                "stepBreakdown": [
                    {"phase": "Step 1: Scan Salaries", "desc": "Sums all salaries: 55k+48k+62k+55k+71k+48k+85k+55k = 479,000.", "rowsAffected": "8 rows summed"},
                    {"phase": "Step 2: Compute Average", "desc": "Computes average: 479000 / 8 = 59875.", "rowsAffected": "1 summary"},
                    {"phase": "Step 3: Return Result", "desc": "Outputs total_salary: 479000 and average_salary: 59875.", "rowsAffected": "1 row"}
                ],
                "conceptExplanation": "SUM ignores NULL values. AVG computes sum / non-null row count.",
                "vivaTips": "Viva Question: How does AVG handle NULL values? AVG ignores NULL rows in both numerator and denominator."
            },
            {
                "id": "lab4-q3",
                "title": "3. Details of Employees with the Same Salary",
                "prompt": "Show all the details of the employees who have the same salary, ordered by Salary.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT * FROM Employee WHERE Salary IN (SELECT Salary FROM Employee GROUP BY Salary HAVING COUNT(*) > 1) ORDER BY Salary;",
                "stepBreakdown": [
                    {"phase": "Step 1: Inner Subquery (GROUP BY & HAVING)", "desc": "Groups by Salary and finds values appearing more than once: 48000 and 55000.", "rowsAffected": "2 duplicate salaries"},
                    {"phase": "Step 2: Outer WHERE Salary IN (...)", "desc": "Matches all employee records whose salary is 48000 or 55000.", "rowsAffected": "5 rows match"},
                    {"phase": "Step 3: ORDER BY Salary", "desc": "Presents duplicate earners grouped together.", "rowsAffected": "5 rows"}
                ],
                "conceptExplanation": "Using an IN subquery with GROUP BY and HAVING COUNT(*) > 1 is the cleanest way to detect duplicate/tied values.",
                "vivaTips": "Viva Question: Can you use WHERE with COUNT(*)? No! Aggregate filters require HAVING, because WHERE executes before aggregation takes place."
            },
            {
                "id": "lab4-q4",
                "title": "4. Display Employees Sorted by Salary (Lowest to Highest)",
                "prompt": "Display the employees name and salary from lowest salary to highest salary.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_Name, Salary FROM Employee ORDER BY Salary ASC;",
                "stepBreakdown": [
                    {"phase": "Step 1: Extract Columns", "desc": "Selects Employee_Name and Salary from Employee.", "rowsAffected": "8 rows"},
                    {"phase": "Step 2: ORDER BY Salary ASC", "desc": "Sorts rows in ascending order (48000 to 85000).", "rowsAffected": "8 sorted rows"}
                ],
                "conceptExplanation": "ORDER BY defaults to ASC (ascending order). For descending, append DESC.",
                "vivaTips": "Viva Question: What is the default sorting order if neither ASC nor DESC is specified? ASC (ascending order)."
            },
            {
                "id": "lab4-q5",
                "title": "5. Department-wise Name & Salary (Salary >= 10,000 and Age > 25)",
                "prompt": "Display Department, Employee_Name, Salary, and Age for employees whose salary is >= 10,000 and age > 25, ordered by Department then Salary DESC.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Department, Employee_Name, Salary, Age FROM Employee WHERE Salary >= 10000 AND Age > 25 ORDER BY Department, Salary DESC;",
                "stepBreakdown": [
                    {"phase": "Step 1: WHERE Filter", "desc": "Evaluates Salary >= 10000 AND Age > 25 (Rahul Rawat, Pankaj Verma, Deepak Negi, Amit Patel, Kunal Joshi).", "rowsAffected": "5 rows pass"},
                    {"phase": "Step 2: ORDER BY Department, Salary DESC", "desc": "Clusters output by Department first, then orders within department by Salary in descending order.", "rowsAffected": "5 sorted rows"}
                ],
                "conceptExplanation": "Multi-column sorting arranges records by the first column, breaking ties using the subsequent columns.",
                "vivaTips": "Viva Question: What does 'department-wise' mean in SQL queries? It means sorting (ORDER BY) or grouping (GROUP BY) records by the Department attribute."
            }
        ]
    },

    # LAB 5
    {
        "id": "lab-5",
        "labNumber": "Lab 5",
        "week": "Week 5 (10-08-2026 to 15-08-2026)",
        "title": "Subqueries & Set Comparison (IN, ALL, ANY, EXISTS)",
        "co": "CO2, CO3",
        "blooms": "BL4",
        "category": "Subqueries & Set Operators",
        "description": "Fetch information of employees who belong to Delhi, range 2001 to 2005, and demonstrate subquery operators: IN, ALL, ANY, and EXISTS.",
        "ddl": """CREATE TABLE Employee (Employee_id INT, Employee_Name STRING, Department STRING, Age INT, Salary INT, City STRING);""",
        "seed": """INSERT INTO Employee VALUES (2001, 'Prateek Sharma', 'CSE', 22, 55000, 'Delhi');
INSERT INTO Employee VALUES (2002, 'Pooja Agarwal', 'Finance', 23, 48000, 'Delhi');
INSERT INTO Employee VALUES (2003, 'Rahul Rawat', 'IT', 26, 62000, 'Delhi');
INSERT INTO Employee VALUES (2004, 'Pankaj Verma', 'Finance', 27, 52000, 'Chandigarh');
INSERT INTO Employee VALUES (2005, 'Deepak Negi', 'CSE', 29, 71000, 'Dehradun');
INSERT INTO Employee VALUES (2006, 'Priya Bansal', 'HR', 24, 38000, 'Delhi');""",
        "tasks": [
            {
                "id": "lab5-q1",
                "title": "1. Fetch Information of Employees from 'Delhi'",
                "prompt": "Fetch the information of employees who belong to the city \"Delhi\".",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT * FROM Employee WHERE City = 'Delhi';",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Employee", "desc": "Accesses all 6 records.", "rowsAffected": "6 rows"},
                    {"phase": "Step 2: WHERE City = 'Delhi'", "desc": "Matches Prateek, Pooja, Rahul, and Priya.", "rowsAffected": "4 rows match"}
                ],
                "conceptExplanation": "Standard string equality comparison.",
                "vivaTips": "Viva Question: Is string comparison in SQL case-sensitive? It depends on the collation setting of the database or column."
            },
            {
                "id": "lab5-q2",
                "title": "2. Employees with ID in Range 2001 to 2005",
                "prompt": "Print the name and department of employees whose ID is in the range from 2001 to 2005.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_Name, Department FROM Employee WHERE Employee_id BETWEEN 2001 AND 2005;",
                "stepBreakdown": [
                    {"phase": "Step 1: BETWEEN 2001 AND 2005", "desc": "Evaluates condition: ID >= 2001 AND ID <= 2005.", "rowsAffected": "5 rows match"},
                    {"phase": "Step 2: PROJECTION", "desc": "Extracts Employee_Name and Department.", "rowsAffected": "5 rows returned"}
                ],
                "conceptExplanation": "BETWEEN is shorthand for inclusive lower and upper bound inequalities.",
                "vivaTips": "Viva Question: Does BETWEEN include the boundary values? Yes! BETWEEN low AND high is always inclusive."
            },
            {
                "id": "lab5-q3",
                "title": "3. Same City Using IN Operator",
                "prompt": "Show the names of employees who belong to a city shared by multiple employees using the IN operator.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_Name, City FROM Employee WHERE City IN (SELECT City FROM Employee GROUP BY City HAVING COUNT(*) > 1);",
                "stepBreakdown": [
                    {"phase": "Step 1: Subquery (Cities with >1 employees)", "desc": "Groups by City: Delhi has 4 employees; Dehradun and Chandigarh have 1 each. Returns 'Delhi'.", "rowsAffected": "1 city returned"},
                    {"phase": "Step 2: WHERE City IN ('Delhi')", "desc": "Picks all employees located in the shared city.", "rowsAffected": "4 rows match"}
                ],
                "conceptExplanation": "The IN operator checks membership against a subquery result set.",
                "vivaTips": "Viva Question: What happens if a subquery in an IN clause returns NULL? IN returns NULL/FALSE unless a non-null match exists."
            },
            {
                "id": "lab5-q4",
                "title": "4. Verification Using EXISTS Operator",
                "prompt": "Check whether there exist employees in the CSE department located in Dehradun using the EXISTS operator.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT * FROM Employee e WHERE EXISTS (SELECT 1 FROM Employee WHERE Department = 'CSE' AND City = 'Dehradun' AND Employee_id = e.Employee_id);",
                "stepBreakdown": [
                    {"phase": "Step 1: Correlated Subquery", "desc": "Evaluates subquery for each outer employee row.", "rowsAffected": "Per-row evaluation"},
                    {"phase": "Step 2: EXISTS Check", "desc": "Returns TRUE if the subquery returns at least one row (Deepak Negi matches).", "rowsAffected": "1 row returned"}
                ],
                "conceptExplanation": "EXISTS is optimized because it terminates scanning as soon as the first matching record is found.",
                "vivaTips": "Viva Question: Why is EXISTS often faster than IN? EXISTS performs short-circuit evaluation: it returns TRUE immediately upon finding the first match."
            }
        ]
    },

    # LAB 6
    {
        "id": "lab-6",
        "labNumber": "Lab 6",
        "week": "Week 6 (17-08-2026 to 22-08-2026)",
        "title": "Pattern Matching & Wildcards (LIKE '%', '_')",
        "co": "CO2, CO3",
        "blooms": "BL4",
        "category": "String Pattern Matching",
        "description": "Show records of CSE employees, names starting with 'P', ending with 'al', city starting with 'D' and ending with 'h', names with exactly 3 letters, and names with >= 5 letters.",
        "ddl": """CREATE TABLE Employee (Employee_id INT, Employee_Name STRING, Department STRING, Age INT, Salary INT, City STRING);""",
        "seed": """INSERT INTO Employee VALUES (2001, 'Prateek', 'CSE', 22, 55000, 'Dehradun');
INSERT INTO Employee VALUES (2002, 'Pooja', 'Finance', 23, 48000, 'Delhi');
INSERT INTO Employee VALUES (2003, 'Ali', 'CSE', 21, 42000, 'Dehradun');
INSERT INTO Employee VALUES (2004, 'Pankaj', 'IT', 27, 52000, 'Chandigarh');
INSERT INTO Employee VALUES (2005, 'Kunal', 'CSE', 29, 71000, 'Delhi');
INSERT INTO Employee VALUES (2006, 'Payal', 'HR', 24, 38000, 'Delhi');
INSERT INTO Employee VALUES (2007, 'Om', 'IT', 25, 35000, 'Nainital');
INSERT INTO Employee VALUES (2008, 'Vishal', 'CSE', 28, 65000, 'Dehli');""",
        "tasks": [
            {
                "id": "lab6-q1",
                "title": "1. Names Starting with Letter 'P'",
                "prompt": "Fetch the names of employees whose names start with the letter 'P'.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_Name FROM Employee WHERE Employee_Name LIKE 'P%';",
                "stepBreakdown": [
                    {"phase": "Step 1: Pattern Match 'P%'", "desc": "Scans names: Prateek, Pooja, Pankaj, Payal match.", "rowsAffected": "4 rows match"},
                    {"phase": "Step 2: Projection", "desc": "Returns Employee_Name.", "rowsAffected": "4 rows"}
                ],
                "conceptExplanation": "The % wildcard represents 0, 1, or multiple characters.",
                "vivaTips": "Viva Question: What are the two main wildcards used with the LIKE operator in SQL? % represents any number of characters; _ represents exactly one character."
            },
            {
                "id": "lab6-q2",
                "title": "2. Names Ending with Letters 'al'",
                "prompt": "Fetch the information of employees, including their names and departments, whose names end with the letters 'al'.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_Name, Department FROM Employee WHERE Employee_Name LIKE '%al';",
                "stepBreakdown": [
                    {"phase": "Step 1: Pattern Match '%al'", "desc": "Finds names ending in 'al': Kunal, Payal, Vishal.", "rowsAffected": "3 rows match"},
                    {"phase": "Step 2: Projection", "desc": "Extracts Employee_Name and Department.", "rowsAffected": "3 rows"}
                ],
                "conceptExplanation": "'%al' matches any sequence followed by the letters 'al' at the end of the string.",
                "vivaTips": "Viva Question: How do you search for an actual percent sign '%' in a column? By using an ESCAPE character."
            },
            {
                "id": "lab6-q3",
                "title": "3. Names Consisting of Exactly Three Letters",
                "prompt": "Print names of employees whose names consist of exactly three letters using wildcard characters.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_Name FROM Employee WHERE Employee_Name LIKE '___';",
                "stepBreakdown": [
                    {"phase": "Step 1: Pattern '___' (3 Underscores)", "desc": "Enforces string length of exactly 3 characters. Ali (3 - MATCH), Om (2 - NO), Pooja (5 - NO).", "rowsAffected": "1 row matches"},
                    {"phase": "Step 2: Result", "desc": "Returns 'Ali'.", "rowsAffected": "1 row"}
                ],
                "conceptExplanation": "Each underscore represents exactly one single character slot.",
                "vivaTips": "Viva Question: What is the difference between LIKE '___' and LENGTH(col) = 3? Both enforce 3 characters; LIKE '___' is standard ANSI SQL pattern matching."
            },
            {
                "id": "lab6-q4",
                "title": "4. Names with At Least Five Letters along with City",
                "prompt": "Print the names of employees along with their city for those whose names have at least five letters.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_Name, City FROM Employee WHERE Employee_Name LIKE '_____%';",
                "stepBreakdown": [
                    {"phase": "Step 1: Pattern '_____%' (5 underscores + %)", "desc": "Requires at least 5 characters. Prateek (7), Pooja (5), Pankaj (6), Kunal (5), Payal (5), Vishal (6) qualify.", "rowsAffected": "6 rows match"},
                    {"phase": "Step 2: Projection", "desc": "Extracts Employee_Name and City.", "rowsAffected": "6 rows"}
                ],
                "conceptExplanation": "Combining 5 underscores with trailing % guarantees a minimum string length of 5.",
                "vivaTips": "Viva Question: How would you match a string with at most 3 characters? By using LENGTH(name) <= 3 or checking patterns of length 1, 2, or 3."
            }
        ]
    },

    # LAB 7
    {
        "id": "lab-7",
        "labNumber": "Lab 7",
        "week": "Week 7 (24-08-2026 to 29-08-2026)",
        "title": "Joins: INNER, LEFT, and RIGHT Joins",
        "co": "CO2, CO3",
        "blooms": "BL4",
        "category": "Relational Joins",
        "description": "Create Employee & Department tables. Practice INNER JOIN, LEFT JOIN with NULL check, RIGHT JOIN for empty departments, and INNER JOIN with Age > 30.",
        "ddl": """CREATE TABLE Department (Department_id INT, Department_Name STRING);
CREATE TABLE Employee (Employee_id INT, Department_id INT, Name STRING, Age INT, Salary INT, City STRING);""",
        "seed": """INSERT INTO Department VALUES (10, 'Computer Science');
INSERT INTO Department VALUES (20, 'Information Technology');
INSERT INTO Department VALUES (30, 'Finance');
INSERT INTO Department VALUES (40, 'Human Resources');
INSERT INTO Department VALUES (50, 'Marketing');

INSERT INTO Employee VALUES (101, 10, 'Amit Sharma', 26, 32000, 'Dehradun');
INSERT INTO Employee VALUES (102, 10, 'Priya Joshi', 32, 45000, 'Delhi');
INSERT INTO Employee VALUES (103, 20, 'Rohan Verma', 28, 22000, 'Chandigarh');
INSERT INTO Employee VALUES (104, 30, 'Sneha Rawat', 34, 52000, 'Delhi');
INSERT INTO Employee VALUES (105, NULL, 'Kunal Negi', 24, 18000, 'Dehradun');
INSERT INTO Employee VALUES (106, 10, 'Vikram Sen', 35, 60000, 'Nainital');""",
        "tasks": [
            {
                "id": "lab7-q1",
                "title": "1. All Employees with Department Names (INNER JOIN)",
                "prompt": "Display the details of all employees (Employee_id, Name, Salary) along with their corresponding department names (Department_Name) using INNER JOIN.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT e.Employee_id, e.Name, e.Salary, d.Department_Name FROM Employee e INNER JOIN Department d ON e.Department_id = d.Department_id;",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Employee e INNER JOIN Department d", "desc": "Evaluates match condition e.Department_id = d.Department_id.", "rowsAffected": "5 rows match"},
                    {"phase": "Step 2: NULL Exclusion", "desc": "Kunal Negi has Department_id = NULL, so he is excluded from INNER JOIN.", "rowsAffected": "1 row excluded"},
                    {"phase": "Step 3: Output", "desc": "Returns 5 matched employee-department records.", "rowsAffected": "5 rows"}
                ],
                "conceptExplanation": "INNER JOIN returns only rows that have matching values in both tables.",
                "vivaTips": "Viva Question: What happens to NULL values in an INNER JOIN condition? Rows with NULL in the join column do not match anything and are excluded."
            },
            {
                "id": "lab7-q2",
                "title": "2. Employees Not Assigned to Any Department (LEFT JOIN NULL Check)",
                "prompt": "Display the names, salary, and city of employees who are not assigned to any department using LEFT JOIN with a NULL check.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT e.Name, e.Salary, e.City FROM Employee e LEFT JOIN Department d ON e.Department_id = d.Department_id WHERE d.Department_id IS NULL;",
                "stepBreakdown": [
                    {"phase": "Step 1: LEFT JOIN", "desc": "Preserves all employees from Employee table. For Kunal Negi, d.Department_id becomes NULL.", "rowsAffected": "6 rows produced"},
                    {"phase": "Step 2: WHERE d.Department_id IS NULL", "desc": "Filters for unmatched employees.", "rowsAffected": "1 row matches (Kunal Negi)"}
                ],
                "conceptExplanation": "LEFT JOIN + IS NULL on the right table is the classic anti-join technique.",
                "vivaTips": "Viva Question: Why use 'IS NULL' instead of '= NULL'? In SQL, NULL represents an unknown value; testing '= NULL' always yields UNKNOWN (falsy), so IS NULL must be used."
            },
            {
                "id": "lab7-q3",
                "title": "3. All Departments Including Those with No Employees",
                "prompt": "Display the names of all departments along with the names of employees assigned to them (alias as Employee_Name), including departments that have no employees.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT d.Department_Name, e.Name AS Employee_Name FROM Department d LEFT JOIN Employee e ON d.Department_id = e.Department_id;",
                "stepBreakdown": [
                    {"phase": "Step 1: LEFT JOIN from Department", "desc": "Preserves all 5 departments, even HR and Marketing which have no assigned employees.", "rowsAffected": "7 rows produced"},
                    {"phase": "Step 2: Output", "desc": "Shows NULL for Employee_Name beside Human Resources and Marketing.", "rowsAffected": "7 rows displayed"}
                ],
                "conceptExplanation": "When Department is the left driving table in a LEFT JOIN, every department is guaranteed to appear in the result.",
                "vivaTips": "Viva Question: Can a RIGHT JOIN be rewritten as a LEFT JOIN? Yes! By swapping the positions of the left and right tables."
            },
            {
                "id": "lab7-q4",
                "title": "4. Departments and Employees Older Than 30 Years",
                "prompt": "Display Department_Name, Employee Name, and Age for employees who are older than 30 years using INNER JOIN with WHERE Age > 30.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT d.Department_Name, e.Name, e.Age FROM Employee e INNER JOIN Department d ON e.Department_id = d.Department_id WHERE e.Age > 30;",
                "stepBreakdown": [
                    {"phase": "Step 1: INNER JOIN", "desc": "Matches employees to departments.", "rowsAffected": "5 rows"},
                    {"phase": "Step 2: WHERE e.Age > 30", "desc": "Filters rows: Priya Joshi (32), Sneha Rawat (34), Vikram Sen (35) qualify.", "rowsAffected": "3 rows pass"}
                ],
                "conceptExplanation": "Combines a join relationship with a row-level boolean predicate.",
                "vivaTips": "Viva Question: Is it better to put Age > 30 in the ON clause or WHERE clause in an INNER JOIN? In an INNER JOIN, both yield the same result, but standard practice puts join conditions in ON and filter conditions in WHERE."
            }
        ]
    },

    # LAB 8
    {
        "id": "lab-8",
        "labNumber": "Lab 8",
        "week": "Week 8 (31-08-2026 to 05-09-2026)",
        "title": "Customer & Order Records (FULL JOIN, CROSS JOIN)",
        "co": "CO2, CO3",
        "blooms": "BL4",
        "category": "Advanced Joins",
        "description": "Create Customer and Order tables. Practice FULL OUTER JOIN, destination cities, CROSS JOIN, and same-city customer orders.",
        "ddl": """CREATE TABLE Customer (CustomerID INT, CustomerName STRING, Age INT, Address STRING, City STRING);
CREATE TABLE Orders (OrderID INT, CustomerID INT, OrderDate STRING, Amount INT);""",
        "seed": """INSERT INTO Customer VALUES (1, 'Aarav Gupta', 30, 'Sector 14', 'Delhi');
INSERT INTO Customer VALUES (2, 'Bhavna Roy', 25, 'Rajpur Road', 'Dehradun');
INSERT INTO Customer VALUES (3, 'Chirag Sethi', 40, 'Indiranagar', 'Bangalore');
INSERT INTO Customer VALUES (4, 'Divya Nair', 35, 'Koramangala', 'Bangalore');
INSERT INTO Customer VALUES (5, 'Eshaan Khan', 28, 'MG Road', 'Mumbai');

INSERT INTO Orders VALUES (5001, 1, '2026-08-15', 4500);
INSERT INTO Orders VALUES (5002, 1, '2026-08-20', 12000);
INSERT INTO Orders VALUES (5003, 2, '2026-08-22', 8000);
INSERT INTO Orders VALUES (5004, 3, '2026-08-25', 15000);
INSERT INTO Orders VALUES (5005, 99, '2026-08-28', 3500);""",
        "tasks": [
            {
                "id": "lab8-q1",
                "title": "1. FULL OUTER JOIN between Customer and Orders",
                "prompt": "Apply a FULL OUTER JOIN to inspect all customers (CustomerID, CustomerName, City) and orders (OrderID, Amount), including unmatched customers and orders.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT c.CustomerID, c.CustomerName, c.City, o.OrderID, o.Amount FROM Customer c FULL OUTER JOIN Orders o ON c.CustomerID = o.CustomerID;",
                "stepBreakdown": [
                    {"phase": "Step 1: FULL OUTER JOIN", "desc": "Unions matched rows + left-unmatched (Divya, Eshaan) + right-unmatched (Order 5005).", "rowsAffected": "7 rows"},
                    {"phase": "Step 2: Projection", "desc": "Displays unified customer and order data with NULLs where no relationship exists.", "rowsAffected": "7 rows output"}
                ],
                "conceptExplanation": "FULL OUTER JOIN retains all records from both sides, filling missing attributes with NULL.",
                "vivaTips": "Viva Question: Does standard MySQL support FULL OUTER JOIN directly? No, standard MySQL requires simulating it using LEFT JOIN UNION RIGHT JOIN."
            },
            {
                "id": "lab8-q2",
                "title": "2. Destination City for Customers Who Have Placed Orders",
                "prompt": "Display the unique destination cities for customers who have placed orders (labeled as Destination_City).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT DISTINCT c.City AS Destination_City FROM Customer c INNER JOIN Orders o ON c.CustomerID = o.CustomerID;",
                "stepBreakdown": [
                    {"phase": "Step 1: INNER JOIN", "desc": "Finds customers who placed orders (Aarav, Bhavna, Chirag).", "rowsAffected": "4 order rows"},
                    {"phase": "Step 2: DISTINCT c.City", "desc": "Extracts unique cities: Delhi, Dehradun, Bangalore.", "rowsAffected": "3 unique cities"}
                ],
                "conceptExplanation": "Eliminates duplicate city names when customers place multiple orders from the same city.",
                "vivaTips": "Viva Question: Why is DISTINCT needed here? Because Customer 1 (Delhi) placed two separate orders, causing Delhi to appear twice without DISTINCT."
            },
            {
                "id": "lab8-q3",
                "title": "3. CROSS JOIN between Customer and Orders",
                "prompt": "Apply a CROSS JOIN between Customer and Orders to demonstrate the full Cartesian product (display CustomerName, OrderID, and Amount).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT c.CustomerName, o.OrderID, o.Amount FROM Customer c CROSS JOIN Orders o;",
                "stepBreakdown": [
                    {"phase": "Step 1: Cartesian Product", "desc": "Multiplies 5 customers by 5 orders = 25 total combination pairs.", "rowsAffected": "25 combinations"}
                ],
                "conceptExplanation": "A CROSS JOIN returns the Cartesian product of two tables without requiring any matching keys.",
                "vivaTips": "Viva Question: What is the total row count of a CROSS JOIN between table A (m rows) and table B (n rows)? Exactly m * n rows."
            }
        ]
    },

    # LAB 9
    {
        "id": "lab-9",
        "labNumber": "Lab 9",
        "week": "Week 9 (07-09-2026 to 12-09-2026)",
        "title": "Academic Database (Student, Program, Register)",
        "co": "CO2, CO3",
        "blooms": "BL4",
        "category": "Relational Schemas",
        "description": "Student (Roll No PK, Name, City), Program (Program ID PK, Program Name, Program Type, Fee, Dept), Register (Program ID, Roll No). Perform multi-table joins, subqueries, and enrollment counts.",
        "ddl": """CREATE TABLE Student (RollNo INT, Name STRING, City STRING);
CREATE TABLE Program (ProgramID INT, ProgramName STRING, ProgramType STRING, ProgramFee INT, Department STRING);
CREATE TABLE Register (ProgramID INT, RollNo INT);""",
        "seed": """INSERT INTO Student VALUES (1, 'Rohan Verma', 'Dehradun');
INSERT INTO Student VALUES (2, 'Sneha Joshi', 'Delhi');
INSERT INTO Student VALUES (3, 'Aditya Rawat', 'Haridwar');
INSERT INTO Student VALUES (4, 'Priya Mehra', 'Delhi');
INSERT INTO Student VALUES (5, 'Kavita Bisht', 'Dehradun');
INSERT INTO Student VALUES (6, 'Manish Sharma', 'Roorkee');

INSERT INTO Program VALUES (101, 'MCA', 'PG', 65000, 'CSE');
INSERT INTO Program VALUES (102, 'B.Tech CSE', 'UG', 95000, 'CSE');
INSERT INTO Program VALUES (103, 'BBA', 'UG', 28000, 'Management');
INSERT INTO Program VALUES (104, 'MBA', 'PG', 75000, 'Management');

INSERT INTO Register VALUES (101, 1);
INSERT INTO Register VALUES (101, 2);
INSERT INTO Register VALUES (101, 3);
INSERT INTO Register VALUES (102, 1);
INSERT INTO Register VALUES (102, 4);
INSERT INTO Register VALUES (103, 5);""",
        "tasks": [
            {
                "id": "lab9-q1",
                "title": "1. Students Registered in the MCA Program",
                "prompt": "Display the names of students registered in the MCA program.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT s.Name FROM Student s INNER JOIN Register r ON s.RollNo = r.RollNo INNER JOIN Program p ON r.ProgramID = p.ProgramID WHERE p.ProgramName = 'MCA';",
                "stepBreakdown": [
                    {"phase": "Step 1: 3-Way Join", "desc": "Joins Student -> Register -> Program on matching primary and foreign keys.", "rowsAffected": "6 enrollment rows"},
                    {"phase": "Step 2: WHERE ProgramName = 'MCA'", "desc": "Filters for MCA registrations (Rohan, Sneha, Aditya).", "rowsAffected": "3 rows match"}
                ],
                "conceptExplanation": "Standard junction table join resolving an M:N relationship between Student and Program.",
                "vivaTips": "Viva Question: Why is a junction/bridge table needed for M:N relationships? Relational databases cannot directly store multi-valued foreign keys without violating 1NF."
            },
            {
                "id": "lab9-q2",
                "title": "2. Programs with Fees Greater Than Average Fee",
                "prompt": "Display programs (ProgramName, ProgramFee) that have fees greater than the average fee.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT ProgramName, ProgramFee FROM Program WHERE ProgramFee > (SELECT AVG(ProgramFee) FROM Program);",
                "stepBreakdown": [
                    {"phase": "Step 1: Inner Subquery", "desc": "Calculates AVG(ProgramFee) = (65000+95000+28000+75000)/4 = 65750.", "rowsAffected": "1 scalar average"},
                    {"phase": "Step 2: WHERE ProgramFee > 65750", "desc": "Selects B.Tech CSE (95000) and MBA (75000).", "rowsAffected": "2 programs qualify"}
                ],
                "conceptExplanation": "Independent subquery computes the aggregate threshold dynamically.",
                "vivaTips": "Viva Question: How many times does an independent subquery execute? Exactly once for the entire query."
            },
            {
                "id": "lab9-q3",
                "title": "3. Students Not Registered in Any Course",
                "prompt": "Display names of students who have not registered in any course.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT s.Name FROM Student s LEFT JOIN Register r ON s.RollNo = r.RollNo WHERE r.RollNo IS NULL;",
                "stepBreakdown": [
                    {"phase": "Step 1: LEFT JOIN Student with Register", "desc": "Preserves all students.", "rowsAffected": "7 joined rows"},
                    {"phase": "Step 2: WHERE r.RollNo IS NULL", "desc": "Filters students having no registration row (Manish Sharma).", "rowsAffected": "1 student"}
                ],
                "conceptExplanation": "Outer join anti-pattern identifies orphan entities.",
                "vivaTips": "Viva Question: What is an alternative way to write this without LEFT JOIN? Using NOT IN or NOT EXISTS."
            }
        ]
    },

    # LAB 10
    {
        "id": "lab-10",
        "labNumber": "Lab 10",
        "week": "Week 10 (14-09-2026 to 19-09-2026)",
        "title": "Advanced Subqueries (WITHOUT LIMIT / ORDER BY / DENSE_RANK)",
        "co": "CO2, CO3",
        "blooms": "BL4",
        "category": "Subqueries & Calculus",
        "description": "Find 2nd minimum, 2nd maximum, and 3rd maximum salary WITHOUT using LIMIT, DENSE_RANK, or ORDER BY clause! Display employees earning > average, same department as 'Scott', and older than colleagues.",
        "ddl": """CREATE TABLE Employee (Employee_id INT, Employee_Name STRING, Department STRING, Age INT, Salary INT, City STRING);""",
        "seed": """INSERT INTO Employee VALUES (101, 'Scott', 'Research', 38, 70000, 'Dehradun');
INSERT INTO Employee VALUES (102, 'Allen', 'Sales', 30, 45000, 'Delhi');
INSERT INTO Employee VALUES (103, 'Ward', 'Sales', 32, 52000, 'Delhi');
INSERT INTO Employee VALUES (104, 'Jones', 'Research', 35, 68000, 'Delhi');
INSERT INTO Employee VALUES (105, 'Martin', 'Sales', 28, 48000, 'Mumbai');
INSERT INTO Employee VALUES (106, 'Blake', 'Manager', 42, 90000, 'Dehradun');
INSERT INTO Employee VALUES (107, 'Clark', 'Manager', 40, 85000, 'Delhi');
INSERT INTO Employee VALUES (108, 'King', 'President', 48, 120000, 'Mumbai');""",
        "tasks": [
            {
                "id": "lab10-q1",
                "title": "1. Second Minimum Salary (NO LIMIT / ORDER BY)",
                "prompt": "Find the second minimum salary of an employee without using limit, dense_rank, and order by clause (labeled as Second_Min_Salary).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT MIN(Salary) AS Second_Min_Salary FROM Employee WHERE Salary > (SELECT MIN(Salary) FROM Employee);",
                "stepBreakdown": [
                    {"phase": "Step 1: Subquery (Absolute Minimum)", "desc": "Calculates MIN(Salary) = 45000 (Allen).", "rowsAffected": "1 minimum value"},
                    {"phase": "Step 2: WHERE Salary > 45000", "desc": "Discards the absolute minimum salary.", "rowsAffected": "7 remaining salaries"},
                    {"phase": "Step 3: Outer MIN(Salary)", "desc": "Finds MIN of remaining salaries = 48000 (Martin).", "rowsAffected": "1 scalar result: 48000"}
                ],
                "conceptExplanation": "By strictly eliminating the absolute minimum, the minimum of the remaining set is mathematically the second minimum.",
                "vivaTips": "Viva Question: Why is this question asked frequently in technical interviews? It tests deep understanding of pure relational calculus without relying on SQL syntax sugar."
            },
            {
                "id": "lab10-q2",
                "title": "2. Second Maximum Salary (NO LIMIT / ORDER BY)",
                "prompt": "Find the second maximum salary of an employee without using limit, dense_rank, and order by clause (labeled as Second_Max_Salary).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT MAX(Salary) AS Second_Max_Salary FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee);",
                "stepBreakdown": [
                    {"phase": "Step 1: Subquery (Absolute Maximum)", "desc": "Calculates MAX(Salary) = 120000 (King).", "rowsAffected": "1 maximum value"},
                    {"phase": "Step 2: WHERE Salary < 120000", "desc": "Excludes the top salary.", "rowsAffected": "7 salaries remaining"},
                    {"phase": "Step 3: Outer MAX(Salary)", "desc": "Finds maximum of the remaining pool: 90000 (Blake).", "rowsAffected": "1 scalar result: 90000"}
                ],
                "conceptExplanation": "Pure ANSI SQL logic to determine 2nd highest salary across any SQL dialect.",
                "vivaTips": "Viva Question: How would you find the N-th maximum salary generically? Using a correlated subquery counting distinct values."
            },
            {
                "id": "lab10-q3",
                "title": "3. Third Maximum Salary (NO LIMIT / ORDER BY)",
                "prompt": "Find the third maximum salary of an employee without using limit, dense_rank, and order by clause (labeled as Third_Max_Salary).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT MAX(Salary) AS Third_Max_Salary FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee WHERE Salary < (SELECT MAX(Salary) FROM Employee));",
                "stepBreakdown": [
                    {"phase": "Step 1: Level 1 Subquery", "desc": "Calculates 1st Max = 120000.", "rowsAffected": "Level 1"},
                    {"phase": "Step 2: Level 2 Subquery", "desc": "Calculates 2nd Max = 90000 (values < 120000).", "rowsAffected": "Level 2"},
                    {"phase": "Step 3: Outer Query", "desc": "Finds MAX of values strictly less than 90000: 85000 (Clark).", "rowsAffected": "1 scalar result: 85000"}
                ],
                "conceptExplanation": "Recursive layering of MAX subqueries peels away highest values layer by layer.",
                "vivaTips": "Viva Question: What happens if two employees share the maximum salary? MAX(DISTINCT ...) ensures duplicate ties don't distort the rank."
            },
            {
                "id": "lab10-q4",
                "title": "4. Employees Belonging to Same Department as 'Scott'",
                "prompt": "Fetch Employee_Name, Department, and Salary of employees who belong to the same department as the employee named 'Scott' (excluding Scott).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT Employee_Name, Department, Salary FROM Employee WHERE Department = (SELECT Department FROM Employee WHERE Employee_Name = 'Scott') AND Employee_Name != 'Scott';",
                "stepBreakdown": [
                    {"phase": "Step 1: Subquery", "desc": "Resolves Scott's department: 'Research'.", "rowsAffected": "1 value ('Research')"},
                    {"phase": "Step 2: Outer Query", "desc": "Finds colleagues in 'Research' excluding Scott himself (Jones).", "rowsAffected": "1 row matches"}
                ],
                "conceptExplanation": "Single-row subquery dynamically determines department attribute of a named entity.",
                "vivaTips": "Viva Question: What error occurs if the subquery returns multiple rows with the '=' operator? 'Subquery returns more than 1 row' error. In that case, use IN instead."
            }
        ]
    },

    # LAB 11
    {
        "id": "lab-11",
        "labNumber": "Lab 11",
        "week": "Week 11 (28-09-2026 to 03-10-2026)",
        "title": "Triggers & Constraints (Row-Level Logic)",
        "co": "CO2, CO3",
        "blooms": "BL4",
        "category": "Triggers & DDL",
        "description": "Create row-level trigger logic for INSERT, UPDATE, DELETE. Automatically convert employee names to UPPERCASE and manage salary audit tracking.",
        "ddl": """CREATE TABLE Employee (Employee_id INT, Employee_Name STRING, Department STRING, Salary INT);
CREATE TABLE SalaryAudit (audit_id INT, emp_id INT, old_salary INT, new_salary INT, change_date STRING);""",
        "seed": """INSERT INTO Employee VALUES (101, 'AMIT SHARMA', 'IT', 45000);
INSERT INTO Employee VALUES (102, 'PRIYA VERMA', 'CSE', 55000);""",
        "tasks": [
            {
                "id": "lab11-q1",
                "title": "1. Automatic UPPERCASE Formatting Simulation",
                "prompt": "Simulate the trigger rule: Insert employee 103 with name converted to UPPERCASE using the UPPER() function, and select all employees to verify.",
                "starterCode": "-- Write your INSERT and SELECT queries here\n",
                "solutionCode": "INSERT INTO Employee VALUES (103, UPPER('deepak rawat'), 'HR', 48000); SELECT * FROM Employee;",
                "stepBreakdown": [
                    {"phase": "Step 1: BEFORE INSERT Action", "desc": "Transforms input string 'deepak rawat' -> 'DEEPAK RAWAT'.", "rowsAffected": "Transformation"},
                    {"phase": "Step 2: Table Storage", "desc": "Inserts standardized uppercase row into Employee table.", "rowsAffected": "1 row inserted"},
                    {"phase": "Step 3: Verification", "desc": "SELECT displays all 3 employees in uniform uppercase.", "rowsAffected": "3 rows"}
                ],
                "conceptExplanation": "A BEFORE INSERT trigger intercepts data before disk write to sanitize or transform values.",
                "vivaTips": "Viva Question: What is the difference between a Statement Trigger and a Row Trigger? A Statement Trigger executes once per statement; a Row Trigger fires for each row affected."
            },
            {
                "id": "lab11-q2",
                "title": "2. Salary Audit Trail Simulation",
                "prompt": "Simulate an AFTER UPDATE trigger: Update employee 101's salary to 52000, and insert an audit record into SalaryAudit capturing the change.",
                "starterCode": "-- Write your UPDATE and INSERT statements here\n",
                "solutionCode": "UPDATE Employee SET Salary = 52000 WHERE Employee_id = 101; INSERT INTO SalaryAudit VALUES (1, 101, 45000, 52000, '2026-10-02'); SELECT * FROM SalaryAudit;",
                "stepBreakdown": [
                    {"phase": "Step 1: UPDATE Employee", "desc": "Updates Employee 101 Salary from 45000 to 52000.", "rowsAffected": "1 row updated"},
                    {"phase": "Step 2: AFTER UPDATE Action", "desc": "Inserts an audit record capturing old salary (45000) and new salary (52000).", "rowsAffected": "1 audit row inserted"},
                    {"phase": "Step 3: Verification", "desc": "SELECT verifies the audit trail.", "rowsAffected": "1 row"}
                ],
                "conceptExplanation": "AFTER UPDATE triggers utilize :OLD and :NEW qualifiers to maintain compliance audit logs.",
                "vivaTips": "Viva Question: What are :NEW and :OLD pseudorecords in triggers? :OLD holds column values before mutation; :NEW holds column values proposed for the update/insert."
            }
        ]
    },

    # LAB 12
    {
        "id": "lab-12",
        "labNumber": "Lab 12",
        "week": "Week 12 (05-10-2026 to 10-10-2026)",
        "title": "Hospital Management Case Study",
        "co": "CO1, CO2, CO3",
        "blooms": "BL5",
        "category": "Full Case Study",
        "description": "Full clinical schema: Patient, Consultant, Doctor, MedicalTest, Appointment, Bill. Query appointments per doctor, MRI test results, and bills exceeding 10,000.",
        "ddl": """CREATE TABLE Patient (patient_id INT, name STRING, age INT, gender STRING, city STRING);
CREATE TABLE Doctor (doctor_id INT, name STRING, department STRING, fee INT);
CREATE TABLE MedicalTest (test_id INT, patient_id INT, test_name STRING, test_result STRING, test_date STRING);
CREATE TABLE Appointment (appointment_id INT, patient_id INT, doctor_id INT, appointment_date STRING, status STRING);
CREATE TABLE Bill (bill_id INT, patient_id INT, total_amount INT, payment_status STRING);""",
        "seed": """INSERT INTO Patient VALUES (1, 'Ramesh Negi', 48, 'Male', 'Dehradun');
INSERT INTO Patient VALUES (2, 'Sunita Rawat', 34, 'Female', 'Rishikesh');
INSERT INTO Patient VALUES (3, 'Harish Bisht', 62, 'Male', 'Haridwar');
INSERT INTO Patient VALUES (4, 'Anjali Verma', 27, 'Female', 'Dehradun');

INSERT INTO Doctor VALUES (101, 'Dr. Rajesh Sharma', 'Cardiology', 800);
INSERT INTO Doctor VALUES (102, 'Dr. Preeti Sen', 'Neurology', 1000);
INSERT INTO Doctor VALUES (103, 'Dr. Anand Joshi', 'Orthopedics', 600);

INSERT INTO MedicalTest VALUES (301, 1, 'MRI', 'Normal', '2026-10-06');
INSERT INTO MedicalTest VALUES (302, 2, 'Blood Test', 'Hemoglobin 11.5', '2026-10-07');
INSERT INTO MedicalTest VALUES (303, 3, 'MRI', 'Cervical Spondylosis', '2026-10-08');

INSERT INTO Appointment VALUES (401, 1, 101, '2026-10-06', 'Completed');
INSERT INTO Appointment VALUES (402, 2, 102, '2026-10-07', 'Completed');
INSERT INTO Appointment VALUES (403, 3, 101, '2026-10-08', 'Completed');
INSERT INTO Appointment VALUES (404, 4, 101, '2026-10-09', 'Scheduled');
INSERT INTO Appointment VALUES (405, 4, 103, '2026-10-10', 'Scheduled');

INSERT INTO Bill VALUES (501, 1, 14500, 'Paid');
INSERT INTO Bill VALUES (502, 2, 8500, 'Pending');
INSERT INTO Bill VALUES (503, 3, 22000, 'Paid');
INSERT INTO Bill VALUES (504, 4, 6000, 'Paid');""",
        "erDiagram": {
            "title": "Hospital Management ER Diagram",
            "entities": [
                {"name": "Patient", "keys": ["patient_id (PK)"], "attributes": ["name", "age", "gender", "city"]},
                {"name": "Doctor", "keys": ["doctor_id (PK)"], "attributes": ["name", "department", "fee"]},
                {"name": "Appointment", "keys": ["appointment_id (PK)"], "attributes": ["patient_id (FK)", "doctor_id (FK)", "appointment_date", "status"]},
                {"name": "MedicalTest", "keys": ["test_id (PK)"], "attributes": ["patient_id (FK)", "test_name", "test_result", "test_date"]},
                {"name": "Bill", "keys": ["bill_id (PK)"], "attributes": ["patient_id (FK)", "total_amount", "payment_status"]}
            ],
            "relationships": [
                {"from": "Patient", "to": "Appointment", "label": "Books", "cardinality": "1 : N"},
                {"from": "Doctor", "to": "Appointment", "label": "Attends", "cardinality": "1 : N"},
                {"from": "Patient", "to": "MedicalTest", "label": "Undergoes", "cardinality": "1 : N"},
                {"from": "Patient", "to": "Bill", "label": "Receives", "cardinality": "1 : N"}
            ]
        },
        "tasks": [
            {
                "id": "lab12-q1",
                "title": "1. Appointments Handled by Each Doctor (DESC Order)",
                "prompt": "Display doctor name (alias Doctor_Name), department, and count of appointments (alias Appointment_Count) in descending order of count.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT d.name AS Doctor_Name, d.department, COUNT(a.appointment_id) AS Appointment_Count FROM Doctor d LEFT JOIN Appointment a ON d.doctor_id = a.doctor_id GROUP BY d.doctor_id, d.name, d.department ORDER BY Appointment_Count DESC;",
                "stepBreakdown": [
                    {"phase": "Step 1: LEFT JOIN Doctor with Appointment", "desc": "Associates doctors with their booked appointments.", "rowsAffected": "5 joined rows"},
                    {"phase": "Step 2: GROUP BY Doctor", "desc": "Dr. Rajesh Sharma has 3 appointments, Dr. Preeti has 1, Dr. Anand has 1.", "rowsAffected": "3 groups"},
                    {"phase": "Step 3: ORDER BY Appointment_Count DESC", "desc": "Sorts doctors by workload descending.", "rowsAffected": "3 rows output"}
                ],
                "conceptExplanation": "Demonstrates aggregation and sorting on relational parent-child datasets.",
                "vivaTips": "Viva Question: Why use LEFT JOIN instead of INNER JOIN here? If a doctor has 0 appointments, INNER JOIN would omit them; LEFT JOIN keeps them with count 0."
            },
            {
                "id": "lab12-q2",
                "title": "2. Patients Who Underwent MRI Test",
                "prompt": "List the names of patients (alias Patient_Name), test_name, test_result, and test_date for those who underwent MRI test.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT p.name AS Patient_Name, t.test_name, t.test_result, t.test_date FROM Patient p INNER JOIN MedicalTest t ON p.patient_id = t.patient_id WHERE t.test_name = 'MRI';",
                "stepBreakdown": [
                    {"phase": "Step 1: INNER JOIN Patient & MedicalTest", "desc": "Joins patient records to diagnostic test logs.", "rowsAffected": "3 test rows"},
                    {"phase": "Step 2: WHERE test_name = 'MRI'", "desc": "Selects Ramesh Negi ('Normal') and Harish Bisht ('Cervical Spondylosis').", "rowsAffected": "2 rows match"}
                ],
                "conceptExplanation": "Filters join records using specific medical procedure criteria.",
                "vivaTips": "Viva Question: What type of relationship exists between Patient and MedicalTest? One-to-Many (1:N)."
            },
            {
                "id": "lab12-q3",
                "title": "3. Bills with Total Amount > 10,000",
                "prompt": "Display bill details: Patient_Name, total_amount, payment_status for patients whose total_amount is greater than 10000.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT p.name AS Patient_Name, b.total_amount, b.payment_status FROM Patient p INNER JOIN Bill b ON p.patient_id = b.patient_id WHERE b.total_amount > 10000;",
                "stepBreakdown": [
                    {"phase": "Step 1: INNER JOIN Patient & Bill", "desc": "Connects patient demographics to billing ledger.", "rowsAffected": "4 bill rows"},
                    {"phase": "Step 2: WHERE total_amount > 10000", "desc": "Selects Ramesh Negi (14500) and Harish Bisht (22000).", "rowsAffected": "2 rows qualify"}
                ],
                "conceptExplanation": "Joins master entity to financial records with threshold filtering.",
                "vivaTips": "Viva Question: What is referential integrity in this schema? Foreign key patient_id in Bill must reference an existing patient_id in Patient table."
            }
        ]
    },

    # LAB 13
    {
        "id": "lab-13",
        "labNumber": "Lab 13",
        "week": "Week 13 (26-10-2026 to 31-10-2026)",
        "title": "Employee & Project Management Case Study",
        "co": "CO1, CO2, CO3",
        "blooms": "BL5",
        "category": "Full Case Study",
        "description": "Design ER and tables: Employee, Department, Project, Assignment. Query employees per department, project counts, multi-project employees (HAVING > 1), and complete allocation reports.",
        "ddl": """CREATE TABLE Department (dept_id INT, dept_name STRING);
CREATE TABLE Employee (emp_id INT, name STRING, dept_id INT, salary INT);
CREATE TABLE Project (project_id INT, project_name STRING, budget INT);
CREATE TABLE Assignment (assignment_id INT, emp_id INT, project_id INT, assign_date STRING);""",
        "seed": """INSERT INTO Department VALUES (1, 'Engineering');
INSERT INTO Department VALUES (2, 'Cloud Services');
INSERT INTO Department VALUES (3, 'Security');

INSERT INTO Employee VALUES (101, 'Arjun Rawat', 1, 75000);
INSERT INTO Employee VALUES (102, 'Divya Nair', 1, 68000);
INSERT INTO Employee VALUES (103, 'Siddharth Jain', 2, 82000);
INSERT INTO Employee VALUES (104, 'Neha Bhatt', 3, 59000);

INSERT INTO Project VALUES (501, 'AI Search Engine', 1500000);
INSERT INTO Project VALUES (502, 'Cloud Migration', 900000);
INSERT INTO Project VALUES (503, 'Zero Trust Firewall', 600000);

INSERT INTO Assignment VALUES (1, 101, 501, '2026-10-15');
INSERT INTO Assignment VALUES (2, 101, 502, '2026-10-18');
INSERT INTO Assignment VALUES (3, 102, 501, '2026-10-20');
INSERT INTO Assignment VALUES (4, 103, 502, '2026-10-22');
INSERT INTO Assignment VALUES (5, 104, 503, '2026-10-25');""",
        "erDiagram": {
            "title": "Employee & Project Management ER Diagram",
            "entities": [
                {"name": "Department", "keys": ["dept_id (PK)"], "attributes": ["dept_name"]},
                {"name": "Employee", "keys": ["emp_id (PK)"], "attributes": ["name", "dept_id (FK)", "salary"]},
                {"name": "Project", "keys": ["project_id (PK)"], "attributes": ["project_name", "budget"]},
                {"name": "Assignment", "keys": ["assignment_id (PK)"], "attributes": ["emp_id (FK)", "project_id (FK)", "assign_date"]}
            ],
            "relationships": [
                {"from": "Department", "to": "Employee", "label": "Employs", "cardinality": "1 : N"},
                {"from": "Employee", "to": "Assignment", "label": "Assigned in", "cardinality": "1 : N"},
                {"from": "Project", "to": "Assignment", "label": "Allocated via", "cardinality": "1 : N"}
            ]
        },
        "tasks": [
            {
                "id": "lab13-q1",
                "title": "1. Number of Employees Working in Each Department",
                "prompt": "Display the number of employees working in each department (dept_name, Employee_Count) using GROUP BY and COUNT().",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT d.dept_name, COUNT(e.emp_id) AS Employee_Count FROM Department d LEFT JOIN Employee e ON d.dept_id = e.dept_id GROUP BY d.dept_id, d.dept_name;",
                "stepBreakdown": [
                    {"phase": "Step 1: LEFT JOIN Department with Employee", "desc": "Connects departments to employees.", "rowsAffected": "4 rows"},
                    {"phase": "Step 2: GROUP BY dept_name", "desc": "Engineering: 2, Cloud Services: 1, Security: 1.", "rowsAffected": "3 groups"}
                ],
                "conceptExplanation": "Department-level head-count reporting.",
                "vivaTips": "Viva Question: What is the benefit of grouping by both d.dept_id and d.dept_name? It adheres to SQL standards requiring non-aggregated SELECT columns in GROUP BY."
            },
            {
                "id": "lab13-q2",
                "title": "2. Employees Working on More Than One Project",
                "prompt": "Display employee name and count of assigned projects (alias Project_Count) for employees working on more than one project (HAVING COUNT > 1).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT e.name, COUNT(a.project_id) AS Project_Count FROM Employee e INNER JOIN Assignment a ON e.emp_id = a.emp_id GROUP BY e.emp_id, e.name HAVING COUNT(a.project_id) > 1;",
                "stepBreakdown": [
                    {"phase": "Step 1: INNER JOIN", "desc": "Links Employee with Assignment entries.", "rowsAffected": "5 assignment rows"},
                    {"phase": "Step 2: GROUP BY e.emp_id, e.name", "desc": "Counts projects per employee: Arjun (2), Divya (1), Siddharth (1), Neha (1).", "rowsAffected": "4 groups"},
                    {"phase": "Step 3: HAVING COUNT > 1", "desc": "Filters groups: Only Arjun Rawat has > 1 project.", "rowsAffected": "1 row matches"}
                ],
                "conceptExplanation": "The HAVING clause filters aggregated groups after the GROUP BY reduction.",
                "vivaTips": "Viva Question: Differentiate WHERE and HAVING. WHERE filters individual rows before grouping; HAVING filters aggregated groups after grouping."
            },
            {
                "id": "lab13-q3",
                "title": "3. Complete 4-Table Project Allocation Report",
                "prompt": "Display project_name, employee_name, dept_name, and assign_date for all allocations using multiple INNER JOINs.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT p.project_name, e.name AS employee_name, d.dept_name, a.assign_date FROM Assignment a INNER JOIN Employee e ON a.emp_id = e.emp_id INNER JOIN Department d ON e.dept_id = d.dept_id INNER JOIN Project p ON a.project_id = p.project_id;",
                "stepBreakdown": [
                    {"phase": "Step 1: Multi-Table Join", "desc": "Navigates 4 relations simultaneously via primary-foreign key paths.", "rowsAffected": "5 joined records"},
                    {"phase": "Step 2: Projection", "desc": "Selects project name, staff name, department, and date of assignment.", "rowsAffected": "5 rows output"}
                ],
                "conceptExplanation": "Shows full relational navigation across multiple normalized dimension tables.",
                "vivaTips": "Viva Question: In what order are multiple INNER JOINs executed by the query optimizer? Optimizers evaluate cost estimates to select the most selective driving table first."
            }
        ]
    },

    # LAB 14
    {
        "id": "lab-14",
        "labNumber": "Lab 14",
        "week": "Week 14 (02-11-2026 to 07-11-2026)",
        "title": "Training Institute Management System Case Study",
        "co": "CO1, CO2, CO3",
        "blooms": "BL5",
        "category": "Full Case Study",
        "description": "Training programs: Java Developer, Full Stack, Data Scientist. Tables: Trainee, Program, Course, Enrollment. Queries: courses with prerequisites, courses with average grade below 70%, and total fees.",
        "ddl": """CREATE TABLE Program (prog_id INT, title STRING, fee INT);
CREATE TABLE Trainee (trainee_id INT, name STRING, prog_id INT);
CREATE TABLE Course (course_code STRING, course_name STRING, instructor STRING, fee INT, has_prereq STRING);
CREATE TABLE Enrollment (trainee_id INT, course_code STRING, grade INT);""",
        "seed": """INSERT INTO Program VALUES (1, 'Full Stack Developer', 50000);
INSERT INTO Program VALUES (2, 'Data Scientist', 65000);

INSERT INTO Trainee VALUES (101, 'Aman Saxena', 1);
INSERT INTO Trainee VALUES (102, 'Ria Sen', 1);
INSERT INTO Trainee VALUES (103, 'Mohit Panwar', 2);

INSERT INTO Course VALUES ('CS101', 'Core Java', 'Prof. Sudhani Verma', 12000, 'NO');
INSERT INTO Course VALUES ('CS102', 'Spring Boot Microservices', 'Prof. Sudhani Verma', 18000, 'YES');
INSERT INTO Course VALUES ('DS201', 'Python for AI', 'Dr. Alok Nath', 15000, 'NO');
INSERT INTO Course VALUES ('DS202', 'Deep Learning & NLP', 'Dr. Alok Nath', 25000, 'YES');

INSERT INTO Enrollment VALUES (101, 'CS101', 85);
INSERT INTO Enrollment VALUES (101, 'CS102', 78);
INSERT INTO Enrollment VALUES (102, 'CS101', 62);
INSERT INTO Enrollment VALUES (102, 'CS102', 65);
INSERT INTO Enrollment VALUES (103, 'DS201', 90);
INSERT INTO Enrollment VALUES (103, 'DS202', 88);""",
        "erDiagram": {
            "title": "Training Institute Management ER Diagram",
            "entities": [
                {"name": "Program", "keys": ["prog_id (PK)"], "attributes": ["title", "fee"]},
                {"name": "Trainee", "keys": ["trainee_id (PK)"], "attributes": ["name", "prog_id (FK)"]},
                {"name": "Course", "keys": ["course_code (PK)"], "attributes": ["course_name", "instructor", "fee", "has_prereq"]},
                {"name": "Enrollment", "keys": ["trainee_id (FK)", "course_code (FK)"], "attributes": ["grade"]}
            ],
            "relationships": [
                {"from": "Program", "to": "Trainee", "label": "Enrolls", "cardinality": "1 : N"},
                {"from": "Trainee", "to": "Enrollment", "label": "Participates in", "cardinality": "1 : N"},
                {"from": "Course", "to": "Enrollment", "label": "Offers", "cardinality": "1 : N"}
            ]
        },
        "tasks": [
            {
                "id": "lab14-q1",
                "title": "1. Instructors & Courses with Prerequisites",
                "prompt": "Write an SQL query to get the names of instructors, course_name, course_code, and fee for courses that have prerequisites (has_prereq = 'YES').",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT instructor, course_name, course_code, fee FROM Course WHERE has_prereq = 'YES';",
                "stepBreakdown": [
                    {"phase": "Step 1: FROM Course", "desc": "Accesses curriculum courses.", "rowsAffected": "4 courses"},
                    {"phase": "Step 2: WHERE has_prereq = 'YES'", "desc": "Selects Spring Boot (Prof. Sudhani Verma) and Deep Learning (Dr. Alok Nath).", "rowsAffected": "2 courses qualify"}
                ],
                "conceptExplanation": "Filters curriculum entities based on categorical prerequisite flags.",
                "vivaTips": "Viva Question: How would course prerequisites be modeled if a course can have multiple prerequisites? Using a self-referencing relationship or a junction table."
            },
            {
                "id": "lab14-q2",
                "title": "2. Average Grade per Course Below 70%",
                "prompt": "Find the average grade for each course where the average grade is below 70% (course_name, avg_grade).",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT c.course_name, AVG(e.grade) AS avg_grade FROM Course c INNER JOIN Enrollment e ON c.course_code = e.course_code GROUP BY c.course_code, c.course_name HAVING AVG(e.grade) < 70;",
                "stepBreakdown": [
                    {"phase": "Step 1: Join Course with Enrollment", "desc": "Matches grades to course titles.", "rowsAffected": "6 enrollment records"},
                    {"phase": "Step 2: GROUP BY Course & Compute AVG", "desc": "Calculates average per course.", "rowsAffected": "Aggregate groups"},
                    {"phase": "Step 3: HAVING Filter", "desc": "Filters out courses meeting or exceeding 70%.", "rowsAffected": "Qualified courses"}
                ],
                "conceptExplanation": "Demonstrates group reduction with conditional threshold filtering via HAVING.",
                "vivaTips": "Viva Question: Can you use a column alias defined in SELECT inside the HAVING clause in standard SQL? No, standard ANSI SQL requires the aggregate expression itself inside HAVING."
            },
            {
                "id": "lab14-q3",
                "title": "3. Total Fees Spent on Each Course",
                "prompt": "List course_name, Single_Fee (c.fee), Enrolled_Count, and Total_Revenue (c.fee * count of students) for each course.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT c.course_name, c.fee AS Single_Fee, COUNT(e.trainee_id) AS Enrolled_Count, (c.fee * COUNT(e.trainee_id)) AS Total_Revenue FROM Course c LEFT JOIN Enrollment e ON c.course_code = e.course_code GROUP BY c.course_code, c.course_name, c.fee;",
                "stepBreakdown": [
                    {"phase": "Step 1: LEFT JOIN Course & Enrollment", "desc": "Ensures all courses are listed even with 0 enrollments.", "rowsAffected": "6 records"},
                    {"phase": "Step 2: Expression Calculation", "desc": "Computes (c.fee * COUNT(e.trainee_id)) for each course.", "rowsAffected": "4 course totals output"}
                ],
                "conceptExplanation": "Combines relational joins, aggregate counts, and arithmetic multiplication expressions.",
                "vivaTips": "Viva Question: What is the return type of an expression multiplying INT by aggregate COUNT()? Integer."
            }
        ]
    },

    # UNIT 1 ASSIGNMENT
    {
        "id": "assignment-1",
        "labNumber": "Assignment 1",
        "week": "Unit 1 Assignment (A1 & A2)",
        "title": "ER Modeling & DDL Schemas (Car Insurance & Library)",
        "co": "CO1, CO2",
        "blooms": "BL3, BL4",
        "category": "Assignment & DDL",
        "description": "Construct ER model for Library Management and Hospital Systems (A-1). Implement DDL relational schema for Car Insurance: Person, Car, Accident, Owns, Participated (A-2).",
        "ddl": """CREATE TABLE Person (DriverID INT, Name STRING, Address STRING);
CREATE TABLE Car (Licence STRING, Model STRING, Year INT);
CREATE TABLE Accident (ReportNo INT, AccidentDate STRING, Location STRING);
CREATE TABLE Owns (DriverID INT, Licence STRING);
CREATE TABLE Participated (DriverID INT, Licence STRING, ReportNo INT, DamageAmount INT);""",
        "seed": """INSERT INTO Person VALUES (101, 'Vijay Chauhan', 'Rajpur Road, Dehradun');
INSERT INTO Person VALUES (102, 'Anita Rawat', 'Subhash Nagar, Dehradun');
INSERT INTO Person VALUES (103, 'Sunil Joshi', 'Connaught Place, Delhi');

INSERT INTO Car VALUES ('UK07-AB-1234', 'Hyundai Creta', 2024);
INSERT INTO Car VALUES ('UK07-CD-5678', 'Tata Nexon', 2025);
INSERT INTO Car VALUES ('DL01-EF-9999', 'Maruti Swift', 2023);

INSERT INTO Owns VALUES (101, 'UK07-AB-1234');
INSERT INTO Owns VALUES (102, 'UK07-CD-5678');
INSERT INTO Owns VALUES (103, 'DL01-EF-9999');

INSERT INTO Accident VALUES (901, '2026-06-10', 'Clock Tower, Dehradun');
INSERT INTO Accident VALUES (902, '2026-06-25', 'ISBT Flyover, Dehradun');

INSERT INTO Participated VALUES (101, 'UK07-AB-1234', 901, 25000);
INSERT INTO Participated VALUES (102, 'UK07-CD-5678', 902, 12000);""",
        "erDiagram": {
            "title": "Car Insurance Relational Schema ER Model",
            "entities": [
                {"name": "Person", "keys": ["DriverID (PK)"], "attributes": ["Name", "Address"]},
                {"name": "Car", "keys": ["Licence (PK)"], "attributes": ["Model", "Year"]},
                {"name": "Accident", "keys": ["ReportNo (PK)"], "attributes": ["AccidentDate", "Location"]},
                {"name": "Owns", "keys": ["DriverID (FK)", "Licence (FK)"], "attributes": []},
                {"name": "Participated", "keys": ["DriverID (FK)", "Licence (FK)", "ReportNo (FK)"], "attributes": ["DamageAmount"]}
            ],
            "relationships": [
                {"from": "Person", "to": "Owns", "label": "Owns", "cardinality": "1 : N"},
                {"from": "Car", "to": "Owns", "label": "Possessed in", "cardinality": "1 : N"},
                {"from": "Person", "to": "Participated", "label": "Involved in", "cardinality": "1 : N"},
                {"from": "Accident", "to": "Participated", "label": "Recorded in", "cardinality": "1 : N"}
            ]
        },
        "tasks": [
            {
                "id": "assign-q1",
                "title": "1. Drivers and Damage Amount in Accidents",
                "prompt": "Display Driver Name (Driver_Name), Car Model (Car_Model), ReportNo, and DamageAmount for all drivers who participated in an accident.",
                "starterCode": "-- Write your SQL query here\n",
                "solutionCode": "SELECT p.Name AS Driver_Name, c.Model AS Car_Model, pt.ReportNo, pt.DamageAmount FROM Person p INNER JOIN Participated pt ON p.DriverID = pt.DriverID INNER JOIN Car c ON pt.Licence = c.Licence;",
                "stepBreakdown": [
                    {"phase": "Step 1: 3-Way Join", "desc": "Joins Person, Participated, and Car tables via DriverID and Licence foreign keys.", "rowsAffected": "2 accident participant records"},
                    {"phase": "Step 2: Projection", "desc": "Returns Vijay Chauhan (Creta, 25000) and Anita Rawat (Nexon, 12000).", "rowsAffected": "2 rows output"}
                ],
                "conceptExplanation": "Implementation of ternary and associative relationships in a normalized relational schema.",
                "vivaTips": "Viva Question: What is the primary key of the Participated table? The composite key consisting of (DriverID, Licence, ReportNo)."
            }
        ]
    }
]

output_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'labsData.js')
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('export const labsData = ' + json.dumps(labs_data, indent=2) + ';\n')

print(f"Generated {len(labs_data)} labs successfully with blank starterCode into {output_path}")
