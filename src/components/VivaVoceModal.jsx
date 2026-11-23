import React, { useState } from 'react';
import { X, BookOpen, HelpCircle, CheckCircle2, ChevronRight, Award, Sparkles } from 'lucide-react';

export default function VivaVoceModal({ isOpen, onClose }) {
  const [selectedTopic, setSelectedTopic] = useState('ALL');

  if (!isOpen) return null;

  const vivaTopics = [
    {
      category: 'SQL Execution',
      question: 'What is the exact logical execution order of an SQL query?',
      answer: 'SQL queries are logically processed in the order: 1) FROM & JOIN -> 2) WHERE -> 3) GROUP BY -> 4) HAVING -> 5) SELECT -> 6) DISTINCT -> 7) ORDER BY -> 8) LIMIT. Because WHERE executes before SELECT, you cannot filter on column aliases created in the SELECT clause within WHERE!'
    },
    {
      category: 'SQL Commands',
      question: 'Differentiate DDL, DML, DCL, and TCL with examples.',
      answer: '• DDL (Data Definition Language): Defines and modifies database schema structure (CREATE, ALTER, DROP, TRUNCATE).\n• DML (Data Manipulation Language): Manipulates data within tables (SELECT, INSERT, UPDATE, DELETE).\n• DCL (Data Control Language): Manages user permissions (GRANT, REVOKE).\n• TCL (Transaction Control Language): Manages transactions (COMMIT, ROLLBACK, SAVEPOINT).'
    },
    {
      category: 'Relational Joins',
      question: 'Explain the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN.',
      answer: '• INNER JOIN: Returns only rows that have matching keys in BOTH tables.\n• LEFT JOIN: Returns ALL rows from the left table; unmatched columns from the right table are filled with NULL.\n• FULL OUTER JOIN: Returns all rows from both tables, filling with NULL wherever a relationship does not match.'
    },
    {
      category: 'Aggregation & Filtering',
      question: 'What is the difference between WHERE and HAVING clause?',
      answer: 'WHERE filters individual records BEFORE aggregation occurs and CANNOT contain aggregate functions (e.g., WHERE salary > 10000). HAVING filters aggregated groups AFTER GROUP BY and is specifically designed for aggregate conditions (e.g., HAVING COUNT(*) > 1 or HAVING AVG(grade) < 70).'
    },
    {
      category: 'Subqueries',
      question: 'Why is EXISTS generally faster than IN for subqueries?',
      answer: 'EXISTS evaluates to TRUE as soon as it discovers the first matching record (short-circuit boolean evaluation) and does not need to build an entire list of values in memory. IN processes and loads the entire subquery result set before membership checking.'
    },
    {
      category: 'Database Keys',
      question: 'Differentiate Primary Key, Candidate Key, and Foreign Key.',
      answer: '• Candidate Key: A minimal set of attributes that uniquely identifies a tuple.\n• Primary Key: The single candidate key chosen by the database designer to uniquely identify each row (cannot be NULL).\n• Foreign Key: An attribute in a table that references the Primary Key of another table, enforcing referential integrity.'
    },
    {
      category: 'Triggers',
      question: 'What is the difference between Statement Triggers and Row Triggers?',
      answer: 'A Statement Trigger executes once per SQL statement regardless of how many rows are modified. A Row-Level Trigger (FOR EACH ROW) fires individually for every single row affected by the INSERT, UPDATE, or DELETE, and can access :OLD and :NEW pseudorecords.'
    },
    {
      category: 'ACID Properties',
      question: 'What are ACID properties in database management systems?',
      answer: '• Atomicity: All operations in a transaction succeed, or all are rolled back (all-or-nothing).\n• Consistency: Database remains in a valid state adhering to all constraints before and after transactions.\n• Isolation: Concurrent transactions do not interfere with each other.\n• Durability: Once committed, updates persist even across system failures or reboots.'
    }
  ];

  const filtered = selectedTopic === 'ALL' 
    ? vivaTopics 
    : vivaTopics.filter(t => t.category === selectedTopic);

  const categories = ['ALL', ...new Set(vivaTopics.map(t => t.category))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">PCS 503 Lab Viva-Voce & Oral Exam Prep</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Graphic Era Hill University Core DBMS Interview Questions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedTopic(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                selectedTopic === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Q&A Accordion */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded font-mono">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  Q#{idx + 1}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>{item.question}</span>
              </h4>

              <div className="pl-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/60 whitespace-pre-line shadow-2xs">
                {item.answer}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>PCS 503 Course File Evaluation Standard</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
