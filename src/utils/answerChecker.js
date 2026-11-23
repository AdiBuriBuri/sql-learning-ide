// Normalize a row object so all keys are lowercase strings
function normalizeRowKeys(row) {
  if (!row || typeof row !== 'object') return {};
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.toLowerCase(), v])
  );
}

// Deep diagnostic comparison between User Result and Expected Result
export function checkAnswer(userResult, expectedResult) {
  if (!userResult) {
    return {
      status: 'NOT_RUN',
      passed: false,
      title: 'Query Not Executed',
      message: 'Write your query and click "Check Answer" to test your solution.'
    };
  }

  // 1. SQL Execution Error
  if (!userResult.success) {
    return {
      status: 'SQL_ERROR',
      passed: false,
      title: 'SQL Syntax / Execution Error',
      message: userResult.error || 'Syntax error in SQL query.',
      hint: getSqlErrorHint(userResult.error)
    };
  }

  if (!expectedResult || !expectedResult.success) {
    return {
      status: 'PASSED',
      passed: true,
      title: 'Query Executed',
      message: 'Statement executed successfully.'
    };
  }

  // DDL / DML checks
  if (expectedResult.type === 'DML/DDL') {
    return {
      status: 'PASSED',
      passed: true,
      title: 'Statement Succeeded',
      message: 'Data definition or manipulation statement executed properly.'
    };
  }

  const userCols = userResult.columns || [];
  const expCols = expectedResult.columns || [];
  const userRows = userResult.rows || [];
  const expRows = expectedResult.rows || [];

  // 2. Empty Result when rows expected
  if (userRows.length === 0 && expRows.length > 0) {
    return {
      status: 'EMPTY_RESULT',
      passed: false,
      title: 'Returned 0 Rows (Empty Output)',
      message: `Your query executed, but returned no rows. Expected ${expRows.length} row(s).`,
      hint: 'Check your WHERE clause filters. Are you matching strings with the exact case (e.g. \'Delhi\' vs \'delhi\')? Or is a JOIN condition too restrictive?'
    };
  }

  // 3. Column Names & Aliasing Diagnostics (case-insensitive)
  const userColsLower = userCols.map(c => c.toLowerCase());
  const expColsLower = expCols.map(c => c.toLowerCase());

  const missingCols = expCols.filter(ec => !userColsLower.includes(ec.toLowerCase()));
  const extraCols = userCols.filter(uc => !expColsLower.includes(uc.toLowerCase()));

  if (missingCols.length > 0) {
    return {
      status: 'COLUMN_MISMATCH',
      passed: false,
      title: 'Missing Required Column(s)',
      message: `Your query is missing the column(s): ${missingCols.map(c => `"${c}"`).join(', ')}.`,
      hint: `Did you forget a column alias? For example, check if the prompt asked to label a column with AS "${missingCols[0]}". Expected columns: [${expCols.join(', ')}], but got: [${userCols.join(', ')}].`,
      diff: {
        expectedColumns: expCols,
        actualColumns: userCols,
        missing: missingCols,
        extra: extraCols
      }
    };
  }

  // 4. Row Count Diagnostics
  if (userRows.length !== expRows.length) {
    return {
      status: 'ROW_COUNT_MISMATCH',
      passed: false,
      title: 'Incorrect Row Count',
      message: `Your query returned ${userRows.length} row(s), but the correct answer expects ${expRows.length} row(s).`,
      hint: userRows.length > expRows.length
        ? 'Your query returned extra rows. Your WHERE or ON condition might be too broad, or you might need DISTINCT to eliminate duplicates.'
        : 'Your query returned fewer rows than expected. Check if your WHERE filter is too strict, or if you used INNER JOIN instead of LEFT JOIN.',
      diff: {
        expectedRowCount: expRows.length,
        actualRowCount: userRows.length
      }
    };
  }

  // 5. Data Content & Values Diagnostics
  // Normalize row keys to lowercase for robust case-insensitive lookup
  const normalizeRow = (row) => {
    const normalized = normalizeRowKeys(row);
    // Use lowercase column names for lookup
    return expColsLower.map(col => {
      const val = normalized[col];
      if (val === null || val === undefined) return '__NULL__';
      if (typeof val === 'number') return String(Math.round(val * 100) / 100);
      // Case-insensitive string comparison: normalize to lowercase and trim
      return String(val).trim().toLowerCase();
    }).join('|||');
  };

  const expRowStrings = expRows.map(r => normalizeRow(r));
  const userRowStrings = userRows.map(r => normalizeRow(r));

  // Check if identical in order
  const isExactOrder = userRowStrings.every((val, idx) => val === expRowStrings[idx]);

  if (isExactOrder) {
    return {
      status: 'PASSED',
      passed: true,
      title: 'All Tests Passed! 🎉',
      message: `Your query returned exactly ${userRows.length} row(s) with matching columns and values.`
    };
  }

  // Check if rows match as a set (ignoring order)
  const userRowSet = new Set(userRowStrings);
  const allRowsMatchIgnoreOrder = expRowStrings.every(r => userRowSet.has(r)) && userRows.length === expRows.length;

  if (allRowsMatchIgnoreOrder) {
    return {
      status: 'ORDER_MISMATCH',
      passed: false,
      title: 'Sort Order Incorrect',
      message: 'The rows returned match the expected data, but they are in the wrong order.',
      hint: 'Check your ORDER BY clause. Did the problem ask to sort ASC (ascending) or DESC (descending), or sort by Department then Salary?'
    };
  }

  // Find specific missing and unexpected rows
  const missingRows = [];
  const unexpectedRows = [];

  expRows.forEach((r, idx) => {
    const s = expRowStrings[idx];
    if (!userRowSet.has(s)) {
      missingRows.push(r);
    }
  });

  const expRowSet = new Set(expRowStrings);
  userRows.forEach((r, idx) => {
    const s = userRowStrings[idx];
    if (!expRowSet.has(s)) {
      unexpectedRows.push(r);
    }
  });

  return {
    status: 'DATA_MISMATCH',
    passed: false,
    title: 'Output Data Does Not Match Expected Answer',
    message: 'The query executed and returned rows, but the values inside the rows do not match the expected solution.',
    hint: missingRows.length > 0 
      ? `Check your filtering logic. Your output is missing records like: ${JSON.stringify(missingRows[0])}.`
      : 'Verify your calculations, JOIN ON conditions, or mathematical expressions.',
    diff: {
      missingSample: missingRows.slice(0, 2),
      unexpectedSample: unexpectedRows.slice(0, 2)
    }
  };
}

function getSqlErrorHint(err) {
  if (!err) return '';
  const lower = err.toLowerCase();
  if (lower.includes('syntax') || lower.includes('near')) {
    return 'Check for missing commas between SELECT columns, unclosed quotes, or misspelled keywords.';
  }
  if (lower.includes('column') || lower.includes('unknown column') || lower.includes('not found')) {
    return 'A column referenced in SELECT, WHERE, or JOIN does not exist. Check table schema for exact column spellings.';
  }
  if (lower.includes('table') || lower.includes('no such table')) {
    return 'A referenced table name does not exist. Inspect the "Active Tables" tab to check table names.';
  }
  if (lower.includes('group') || lower.includes('aggregate')) {
    return 'Aggregate expressions like COUNT, SUM, AVG cannot be used directly in WHERE. Use HAVING after GROUP BY.';
  }
  return 'Review your SQL statement structure and ensure keywords are properly separated.';
}
