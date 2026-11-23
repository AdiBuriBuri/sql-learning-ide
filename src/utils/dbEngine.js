import alasql from 'alasql';

// Make AlaSQL case-insensitive for table names and column names
// so users can write: select * from employee where age=22
// instead of requiring exact casing like Employee / Age
alasql.options.casesensitive = false;

// Default Database Engine with AlaSQL
class DBEngine {
  constructor() {
    this.initialized = false;
    this.currentLabId = null;
  }

  // Initialize and seed database for a given lab
  initLabDatabase(labData) {
    try {
      // Clear database tables
      alasql('DROP DATABASE IF EXISTS testdb');
      alasql('CREATE DATABASE testdb');
      alasql('USE testdb');

      // Run DDL and Seeds
      if (labData.ddl) {
        const statements = labData.ddl.split(';').map(s => s.trim()).filter(Boolean);
        statements.forEach(stmt => {
          alasql(stmt);
        });
      }

      if (labData.seed) {
        const seedStatements = labData.seed.split(';').map(s => s.trim()).filter(Boolean);
        seedStatements.forEach(stmt => {
          alasql(stmt);
        });
      }

      this.currentLabId = labData.id;
      this.initialized = true;
      return { success: true };
    } catch (err) {
      console.error('Database initialization error:', err);
      return { success: false, error: err.message };
    }
  }

  // Execute arbitrary SQL query
  executeQuery(sqlQuery) {
    if (!sqlQuery || !sqlQuery.trim()) {
      return { success: false, error: 'Query is empty. Please enter a valid SQL query.' };
    }

    const startTime = performance.now();
    try {
      // Clean query and execute
      let cleaned = sqlQuery.trim();
      if (cleaned.endsWith(';')) {
        cleaned = cleaned.slice(0, -1);
      }

      // Check for multiple queries or single
      const result = alasql(cleaned);
      const executionTime = (performance.now() - startTime).toFixed(2);

      // Handle SELECT queries (returns array of objects)
      if (Array.isArray(result)) {
        const columns = result.length > 0 ? Object.keys(result[0]) : [];
        return {
          success: true,
          type: 'SELECT',
          columns,
          rows: result,
          rowCount: result.length,
          executionTime
        };
      } else {
        // DDL or DML (INSERT, UPDATE, DELETE)
        return {
          success: true,
          type: 'DML/DDL',
          message: typeof result === 'number' ? `${result} row(s) affected.` : 'Query executed successfully.',
          columns: [],
          rows: [],
          rowCount: typeof result === 'number' ? result : 0,
          executionTime
        };
      }
    } catch (err) {
      const executionTime = (performance.now() - startTime).toFixed(2);
      return {
        success: false,
        error: err.message || 'An error occurred while executing the query.',
        executionTime
      };
    }
  }

  // Get all tables in current database
  getTables() {
    try {
      const tablesObj = alasql.databases.testdb?.tables || {};
      const tableNames = Object.keys(tablesObj);
      return tableNames.map(name => {
        const data = alasql(`SELECT * FROM ${name}`) || [];
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        return {
          name,
          columns,
          rowCount: data.length,
          sampleData: data.slice(0, 10)
        };
      });
    } catch (err) {
      console.error('Error fetching tables:', err);
      return [];
    }
  }
}

export const dbEngine = new DBEngine();
