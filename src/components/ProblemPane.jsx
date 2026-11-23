import React, { useState } from 'react';
import {
  FileText,
  Table,
  HelpCircle,
  Eye,
  EyeOff,
  GitBranch,
  Sparkles,
  ChevronRight,
  Database,
  Code2,
  TableProperties,
  ChevronDown,
  CheckSquare,
  LayoutList
} from 'lucide-react';
import ERDiagramViewer from './ERDiagramViewer';

export default function ProblemPane({
  lab,
  task,
  dbTables = [],
  expectedResult,
  onShowSchema,
  activeTab,
  setActiveTab
}) {
  const [showHint, setShowHint] = useState(false);
  const [tableDisplayMode, setTableDisplayMode] = useState('data'); // 'data' | 'ddl'
  const [collapsedTables, setCollapsedTables] = useState({});
  const [showExpected, setShowExpected] = useState(true);
  const [taskCollapsed, setTaskCollapsed] = useState(false);
  const [tablesCollapsed, setTablesCollapsed] = useState(false);
  const [expectedCollapsed, setExpectedCollapsed] = useState(false);

  if (!lab || !task) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-slate-400 text-sm">
        Select an experiment from the sidebar to view questions.
      </div>
    );
  }

  const hasERDiagram = !!lab.erDiagram;

  const toggleTableCollapse = (tableName) => {
    setCollapsedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const expRows = expectedResult?.rows || [];
  const expCols = expectedResult?.columns || [];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Pane Navigation Tabs */}
      <div className="flex items-center justify-between px-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('problem')}
            className={`px-3 py-2 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'problem'
                ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Problem & Tables</span>
          </button>

          {hasERDiagram && (
            <button
              onClick={() => setActiveTab('er')}
              className={`px-3 py-2 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition cursor-pointer ${
                activeTab === 'er'
                  ? 'border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-500/5'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>ER Diagram</span>
            </button>
          )}
        </div>

        {/* Quick Schema Trigger */}
        <button
          onClick={onShowSchema}
          className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1 px-2 py-1 rounded bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 cursor-pointer transition font-medium"
        >
          <Table className="w-3 h-3" />
          <span>Full DB ({dbTables.length})</span>
        </button>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'er' && hasERDiagram ? (
          <div className="p-4">
            <ERDiagramViewer erData={lab.erDiagram} />
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">

            {/* ── SECTION 1: Task Info & Requirement ── */}
            <div>
              <button
                onClick={() => setTaskCollapsed(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Task Requirement</span>
                  <div className="flex items-center gap-1 ml-1">
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-1.5 py-0.5 rounded">
                      {lab.labNumber}
                    </span>
                    <span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 px-1.5 py-0.5 rounded">
                      {lab.co}
                    </span>
                  </div>
                </div>
                {taskCollapsed
                  ? <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white" />
                  : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
                }
              </button>

              {!taskCollapsed && (
                <div className="px-4 py-3 space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-mono">
                      {lab.blooms}
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {lab.category}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-dashed border-slate-300 dark:border-slate-700">
                      {lab.week}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {task.title}
                  </h2>
                  <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-500/5 border border-blue-200/60 dark:border-blue-500/20">
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {task.prompt}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── SECTION 2: Input Tables ── */}
            <div>
              <button
                onClick={() => setTablesCollapsed(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <Database className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Input Table(s) & Sample Data</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">({dbTables.length} tables)</span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* View Switcher inline */}
                  {!tablesCollapsed && (
                    <div
                      className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-md p-0.5 border border-slate-200 dark:border-slate-700 text-[10px]"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setTableDisplayMode('data')}
                        className={`px-2 py-0.5 rounded cursor-pointer transition flex items-center space-x-1 ${
                          tableDisplayMode === 'data'
                            ? 'bg-emerald-600 text-white font-semibold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        <TableProperties className="w-2.5 h-2.5" />
                        <span>Data</span>
                      </button>
                      <button
                        onClick={() => setTableDisplayMode('ddl')}
                        className={`px-2 py-0.5 rounded cursor-pointer transition flex items-center space-x-1 ${
                          tableDisplayMode === 'ddl'
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
                        }`}
                      >
                        <Code2 className="w-2.5 h-2.5" />
                        <span>DDL</span>
                      </button>
                    </div>
                  )}
                  {tablesCollapsed
                    ? <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white" />
                    : <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />
                  }
                </div>
              </button>

              {!tablesCollapsed && (
                <div className="px-3 py-3 space-y-2">
                  {tableDisplayMode === 'data' ? (
                    dbTables.length === 0 ? (
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
                        Loading tables...
                      </div>
                    ) : (
                      dbTables.map((tbl) => {
                        const isCollapsed = !!collapsedTables[tbl.name];
                        return (
                          <div
                            key={tbl.name}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 overflow-hidden shadow-xs"
                          >
                            <button
                              onClick={() => toggleTableCollapse(tbl.name)}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-left cursor-pointer group"
                            >
                              <div className="flex items-center space-x-2">
                                {isCollapsed
                                  ? <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white" />
                                  : <ChevronDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                }
                                <span className="font-bold text-xs font-mono text-slate-900 dark:text-white">{tbl.name}</span>
                              </div>
                              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-300 dark:border-slate-700">
                                {tbl.rowCount} row(s)
                              </span>
                            </button>

                            {!isCollapsed && (
                              <div className="overflow-x-auto max-h-[200px]">
                                <table className="w-full text-left text-[11px] font-mono border-collapse">
                                  <thead>
                                    <tr className="bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] sticky top-0 z-10">
                                      <th className="py-1.5 px-2.5 w-8 text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900">#</th>
                                      {tbl.columns.map((col, cIdx) => (
                                        <th key={cIdx} className="py-1.5 px-2.5 font-semibold text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-slate-900 whitespace-nowrap">
                                          {col}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {tbl.sampleData.map((row, rIdx) => (
                                      <tr
                                        key={rIdx}
                                        className="hover:bg-blue-50/60 dark:hover:bg-blue-600/5 even:bg-slate-50/50 dark:even:bg-slate-900/30 text-slate-700 dark:text-slate-300"
                                      >
                                        <td className="py-1.5 px-2.5 text-slate-400 dark:text-slate-600 text-[10px]">{rIdx + 1}</td>
                                        {tbl.columns.map((col, cIdx) => (
                                          <td key={cIdx} className="py-1.5 px-2.5 whitespace-nowrap">
                                            {row[col] === null || row[col] === undefined
                                              ? <span className="text-slate-400 dark:text-slate-600 italic text-[10px]">NULL</span>
                                              : String(row[col])
                                            }
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )
                  ) : (
                    /* DDL Code View */
                    <div className="p-3 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800 font-mono text-xs shadow-inner">
                      <pre className="text-[11px] text-emerald-300 whitespace-pre-wrap overflow-x-auto p-2 bg-slate-950 dark:bg-slate-900 rounded-lg border border-slate-800">
                        {lab.ddl?.trim() || '-- No DDL available'}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── SECTION 3: Expected Output ── */}
            <div>
              <button
                onClick={() => setExpectedCollapsed(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-3.5 h-3.5 text-violet-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Expected Output</span>
                  {expRows.length > 0 && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">({expRows.length} row{expRows.length !== 1 ? 's' : ''})</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!expectedCollapsed && expRows.length > 0 && (
                    <button
                      onClick={e => { e.stopPropagation(); setShowExpected(v => !v); }}
                      className="flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 hover:bg-violet-200 dark:hover:bg-violet-500/20 transition font-medium"
                    >
                      {showExpected ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                      <span>{showExpected ? 'Hide' : 'Reveal'}</span>
                    </button>
                  )}
                  {expectedCollapsed
                    ? <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white" />
                    : <ChevronDown className="w-3.5 h-3.5 text-violet-500" />
                  }
                </div>
              </button>

              {!expectedCollapsed && (
                <div className="px-3 py-3">
                  {expRows.length === 0 ? (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
                      Run your query or select a task to see the expected output.
                    </div>
                  ) : !showExpected ? (
                    <button
                      onClick={() => setShowExpected(true)}
                      className="w-full p-3 rounded-lg border border-dashed border-violet-300 dark:border-violet-500/30 bg-violet-50/40 dark:bg-violet-500/5 text-violet-600 dark:text-violet-400 text-xs font-medium flex items-center justify-center space-x-2 hover:bg-violet-100 dark:hover:bg-violet-500/10 cursor-pointer transition"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Click to reveal expected output ({expRows.length} rows)</span>
                    </button>
                  ) : (
                    <div className="rounded-xl border border-violet-200 dark:border-violet-500/20 overflow-hidden">
                      <div className="px-3 py-1.5 bg-violet-50 dark:bg-violet-500/10 border-b border-violet-200 dark:border-violet-500/20 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wider">Expected Result</span>
                        <span className="text-[10px] text-violet-500 font-mono">{expCols.length} col(s) · {expRows.length} row(s)</span>
                      </div>
                      <div className="overflow-x-auto max-h-[220px]">
                        <table className="w-full text-left text-[11px] font-mono border-collapse">
                          <thead>
                            <tr className="bg-violet-50/80 dark:bg-violet-900/20 border-b border-violet-200 dark:border-violet-500/20 text-[10px] uppercase tracking-wider sticky top-0 z-10">
                              <th className="py-1.5 px-2.5 w-8 text-slate-400 dark:text-slate-600">#</th>
                              {expCols.map((col, i) => (
                                <th key={i} className="py-1.5 px-2.5 font-semibold text-violet-600 dark:text-violet-400 whitespace-nowrap">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-violet-100 dark:divide-violet-500/10">
                            {expRows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="hover:bg-violet-50/50 dark:hover:bg-violet-500/5 even:bg-slate-50/40 dark:even:bg-slate-900/30 text-slate-700 dark:text-slate-300"
                              >
                                <td className="py-1.5 px-2.5 text-slate-400 dark:text-slate-600 text-[10px]">{rIdx + 1}</td>
                                {expCols.map((col, cIdx) => {
                                  const val = row[col] !== undefined ? row[col]
                                    : Object.entries(row).find(([k]) => k.toLowerCase() === col.toLowerCase())?.[1];
                                  return (
                                    <td key={cIdx} className="py-1.5 px-2.5 whitespace-nowrap">
                                      {val === null || val === undefined
                                        ? <span className="text-slate-400 dark:text-slate-600 italic text-[10px]">NULL</span>
                                        : String(val)
                                      }
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── SECTION 4: Hint ── */}
            <div>
              <button
                onClick={() => setShowHint(v => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Need a Clue / SQL Hint?</span>
                </div>
                {showHint
                  ? <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
                  : <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white" />
                }
              </button>

              {showHint && (
                <div className="px-4 py-3 bg-amber-50/50 dark:bg-amber-950/10 border-t border-amber-200/60 dark:border-amber-500/10 space-y-1.5">
                  <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200/90">
                    <span className="font-bold text-amber-700 dark:text-amber-300">Target Concept: </span>
                    {task.conceptExplanation}
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400/80">
                    💡 Tip: Check the table columns and sample rows above before writing your query!
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
