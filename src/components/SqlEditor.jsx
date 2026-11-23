import React, { useRef, useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Code2, 
  CheckCheck,
  Terminal,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';

export default function SqlEditor({
  value,
  onChange,
  onRun,
  onCheckAnswer,
  onReset,
  solutionCode
}) {
  const textareaRef = useRef(null);
  const [showSolutionConfirm, setShowSolutionConfirm] = useState(false);
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);

  // Keyboard shortcut listener (Ctrl+Enter or Cmd+Enter to run / check answer)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onCheckAnswer();
    }
    // Allow Tab key indent in textarea
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // SQL Formatter (Upper-case SQL keywords)
  const formatSQL = () => {
    if (!value) return;
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 
      'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 
      'CROSS JOIN', 'JOIN', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 
      'BETWEEN', 'LIKE', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 
      'MIN', 'MAX', 'UPDATE', 'SET', 'DELETE', 'INSERT INTO', 'VALUES',
      'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'ADD COLUMN'
    ];

    let formatted = value;
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, kw);
    });

    onChange(formatted);
  };

  const lines = (value || '').split('\n');

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Editor Toolbar */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            SQL Query Editor
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
            (Write your solution)
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={formatSQL}
            className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium transition cursor-pointer flex items-center space-x-1 border border-slate-200 dark:border-slate-700/60 shadow-2xs"
            title="Auto-capitalize SQL keywords"
          >
            <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">Format</span>
          </button>

          <button
            onClick={onReset}
            className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-[11px] font-medium transition cursor-pointer flex items-center space-x-1 border border-slate-200 dark:border-slate-700/60 shadow-2xs"
            title="Reset code template"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Reveal Solution Button (Guarded) */}
          <button
            onClick={() => {
              if (isSolutionRevealed) {
                setIsSolutionRevealed(false);
              } else {
                setShowSolutionConfirm(true);
              }
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer flex items-center space-x-1 border shadow-2xs ${
              isSolutionRevealed
                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/80'
                : 'bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700/60'
            }`}
            title="Reveal solution if you are completely stuck"
          >
            {isSolutionRevealed ? <Unlock className="w-3 h-3 text-purple-600 dark:text-purple-400" /> : <Lock className="w-3 h-3 text-slate-400" />}
            <span>{isSolutionRevealed ? 'Hide Solution' : 'Reveal Solution'}</span>
          </button>

          <button
            onClick={onRun}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold border border-slate-300 dark:border-slate-700 transition cursor-pointer flex items-center space-x-1"
            title="Test run query"
          >
            <Play className="w-3 h-3" />
            <span>Run</span>
          </button>

          <button
            onClick={onCheckAnswer}
            className="px-3 py-1 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-bold shadow-md shadow-emerald-900/30 transition cursor-pointer flex items-center space-x-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Check Answer</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal to Reveal Solution */}
      {showSolutionConfirm && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 p-3 flex items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Try writing the query first! Are you sure you want to reveal the model answer?</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowSolutionConfirm(false)}
              className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white font-medium text-[11px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsSolutionRevealed(true);
                setShowSolutionConfirm(false);
              }}
              className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] cursor-pointer"
            >
              Yes, Show Me
            </button>
          </div>
        </div>
      )}

      {/* Revealed Solution Drawer */}
      {isSolutionRevealed && (
        <div className="bg-purple-50/60 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-800/50 p-3 shrink-0 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>Model Solution Query:</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onChange(solutionCode)}
                className="text-[11px] text-purple-600 dark:text-purple-300 hover:underline cursor-pointer font-medium"
              >
                Copy to Editor
              </button>
              <button
                onClick={() => setIsSolutionRevealed(false)}
                className="text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                Hide
              </button>
            </div>
          </div>
          <pre className="text-xs font-mono text-purple-900 dark:text-purple-200 bg-white dark:bg-purple-950/70 p-2.5 rounded-lg border border-purple-200 dark:border-purple-800/60 overflow-x-auto whitespace-pre-wrap">
            {solutionCode}
          </pre>
        </div>
      )}

      {/* Editor Body with Line Numbers */}
      <div className="flex-1 relative flex overflow-hidden font-mono text-xs">
        <div className="w-10 bg-slate-50 dark:bg-slate-950/90 text-slate-400 dark:text-slate-600 py-3 text-right pr-2.5 select-none border-r border-slate-200 dark:border-slate-800/60 shrink-0 font-mono text-[11px] leading-5">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="-- Write your SQL query here...\n-- Press Ctrl+Enter or Cmd+Enter to check your answer."
          className="flex-1 h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 leading-5 resize-none focus:outline-none selection:bg-blue-600 selection:text-white font-mono text-xs whitespace-pre overflow-auto"
          spellCheck="false"
          autoCapitalize="none"
          autoComplete="off"
        />
      </div>

      {/* Quick SQL Keyword Inserts */}
      <div className="p-1.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800/80 flex items-center space-x-1 overflow-x-auto scrollbar-none text-[10px] text-slate-500 dark:text-slate-400">
        <span className="text-slate-600 dark:text-slate-500 font-semibold px-1 shrink-0">Snippets:</span>
        {['SELECT * FROM', 'WHERE', 'INNER JOIN', 'LEFT JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'COUNT(*)', 'DISTINCT'].map((snip) => (
          <button
            key={snip}
            onClick={() => onChange(value + (value.endsWith(' ') || value.endsWith('\n') ? '' : ' ') + snip + ' ')}
            className="px-2 py-0.5 rounded bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400 font-mono whitespace-nowrap cursor-pointer transition border border-slate-200 dark:border-slate-700/60 shadow-2xs"
          >
            {snip}
          </button>
        ))}
      </div>
    </div>
  );
}
