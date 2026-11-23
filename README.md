# SQL Lab IDE & Execution Explorer
### Graphic Era Hill University (GEHU) • PCS 503 Database Management System Lab

An interactive, in-browser SQL IDE and relational database learning platform specifically built for the **Graphic Era Hill University PCS 503 Course File (Odd Semester)**.

---

## 🌟 Key Features

1. **Complete PCS 503 Syllabus Coverage**:
   - **Lab 1**: Hospital Scenario ER Modeling, Relational Tables, ALTER, and DELETE/DROP.
   - **Lab 2**: User Privileges (GRANT/REVOKE), TCL (ROLLBACK/COMMIT), and Constraints (CHECK, UNIQUE, NOT NULL, DEFAULT).
   - **Lab 3**: Basic Queries on Employee Table (COUNT, age filters, salary thresholds, aliasing, DISTINCT).
   - **Lab 4**: Aggregation & Sorting (MIN, MAX, SUM, AVG, duplicate salary detection, multi-column ORDER BY).
   - **Lab 5**: Subqueries & Set Operators (City filters, ID range BETWEEN, IN, ALL, ANY, and EXISTS).
   - **Lab 6**: Pattern Matching & Wildcards (`LIKE 'P%'`, `LIKE '%al'`, `LIKE 'D%h'`, `___`, `_____%`).
   - **Lab 7**: Relational Joins (Employee & Department: INNER JOIN, LEFT JOIN with NULL check, RIGHT JOIN, Age filters).
   - **Lab 8**: Customer & Order Records (FULL OUTER JOIN, destination cities, CROSS JOIN).
   - **Lab 9**: Academic Database (Student, Program, Register: MCA students, avg fee subqueries, un-enrolled students).
   - **Lab 10**: Advanced Subqueries (Find 2nd MIN, 2nd MAX, and 3rd MAX salary **WITHOUT** using LIMIT, DENSE_RANK, or ORDER BY).
   - **Lab 11**: Triggers & Constraints (Row-level triggers, UPPERCASE name formatting, salary audit tracking).
   - **Lab 12**: Hospital Management Case Study (Patient, Doctor, Consultant, MedicalTest, Appointment, Bill).
   - **Lab 13**: Employee & Project Management Case Study (Employee, Department, Project, Assignment, multi-table joins).
   - **Lab 14**: Training Institute Management System (Programs, Courses, Instructors, Prerequisites, Trainees, Fees).
   - **Unit 1 Assignments**: Library & Hospital ER models (A1), Car Insurance DDL Schemas (A2).

2. **"How Did We Reach The Solution" (Step-by-Step Logic Tracer)**:
   - Visualizes the exact **ANSI SQL Logical Execution Pipeline**:
     $$\text{FROM / JOIN} \longrightarrow \text{WHERE} \longrightarrow \text{GROUP BY} \longrightarrow \text{HAVING} \longrightarrow \text{SELECT / ALIAS} \longrightarrow \text{ORDER BY}$$
   - Clickable interactive stepper showing what happens to rows and columns at each logical phase.
   - Conceptual breakdowns explaining why the query is constructed this way, edge cases handled, and alternative SQL approaches.

3. **In-Browser SQL Engine (Zero External DB Setup)**:
   - Powered by AlaSQL WebAssembly in-memory database.
   - Preloads tables and sample data for every lab automatically.
   - Instant query execution with sub-millisecond response times.

4. **Automated Verification & Pass/Fail Feedback**:
   - Executes the user's query and compares output (columns, rows, data types) against the expected model solution.
   - Celebrates correct answers with a pass badge and tracks total completion progress.

5. **Integrated ER Diagram & Schema Visualizer**:
   - Interactive ER Diagrams for complex case studies (Hospital, Training Institute, Projects, Car Insurance).
   - Live Database Schema & Table Viewer modal to browse tables, row counts, and data schemas anytime.

6. **Viva-Voce & Oral Exam Cheatsheet**:
   - Built-in GEHU examination viva preparation guide with common oral questions and answers (ACID, Normalization, DDL/DML/DCL/TCL, Joins, Triggers, Execution Order).

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in your browser:
# http://localhost:5173
```
