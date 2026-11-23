import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Database, 
  Workflow, 
  Copy, 
  Check, 
  Download, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  Info, 
  HelpCircle, 
  ChevronRight,
  Columns,
  SplitSquareVertical,
  TableProperties
} from 'lucide-react';
import StepExplainer from './StepExplainer';

export default function OutputPane({
  queryResult,
  expectedResult,
  diagnostic,
  task,
  lab,
  dbTables,
  activeTab,
  setActiveTab
}) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('user'); // 'user' | 'expected' | 'split'

  const copyToClipboard = () => {
    if (!queryResult || !queryResult.rows) return;
    const text = JSON.stringify(queryResult.rows, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = () => {
    if (!queryResult || !queryResult.rows || queryResult.rows.length === 0) return;
    const cols = queryResult.columns;
    const csvRows = [];
    csvRows.push(cols.join(','));
    queryResult.rows.forEach(r => {
      csvRows.push(cols.map(c => `"${r[c] !== undefined ? r[c] : ''}"`).join(','));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_result_${task?.id || 'export'}.csv`;
    a.click();
  };

  const renderDataTable = (resultData, title, highlightType = 'default') => {
    if (!resultData || !resultData.success) return null;
    if (resultData.rows.length === 0) {
      return (
        <div className="p-6 text-center text-slate-500 text-xs">
          0 rows returned.
        </div>
      );
    }

    return (
      <div className={`rounded-xl border overflow-hidden shadow-sm ${
        highlightType === 'expected' 
          ? 'border-emerald-800/60 bg-emerald-950/10' 
          : 'border-slate-800 bg-slate-900/60'
      }`}>
        <div className={`px-3 py-1.5 border-b flex items-center justify-between text-xs ${
          highlightType === 'expected'
            ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300 font-semibold'
            : 'bg-slate-900 border-slate-800 text-slate-300 font-semibold'
        }`}>
          <span>{title}</span>
          <span className="font-mono text-[11px] opacity-80">{resultData.rowCount} row(s)</span>
        </div>
        <div className="overflow-x-auto max-h-[260px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 uppercase tracking-wider text-[10px] font-mono sticky top-0 z-10">
                <th className="py-2 px-3 w-10 text-slate-600 bg-slate-950">#</th>
                {resultData.columns.map((col, idx) => (
                  <th key={idx} className={`py-2 px-3 font-semibold bg-slate-950 ${
                    highlightType === 'expected' ? 'text-emerald-400' : 'text-blue-400'
                  }`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {resultData.rows.map((row, rIdx) => (
                <tr 
                  key={rIdx} 
                  className="hover:bg-blue-600/5 transition even:bg-slate-900/30 text-slate-300"
                >
                  <td className="py-2 px-3 text-slate-600 text-[10px]">
                    {rIdx + 1}
                  </td>
                  {resultData.columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                      {row[col] === null || row[col] === undefined ? (
                        <span className="text-slate-600 italic font-sans text-[10px]">NULL</span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Output Navigation Header Tabs */}
      <div className="px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('result')}
            className={`px-3 py-2 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'result'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Output & Diagnostic</span>
            {queryResult && queryResult.success && (
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono ml-1">
                {queryResult.rowCount} rows
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-2 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'explanation'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">How Did We Reach The Solution?</span>
            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded ml-1 border border-emerald-500/30">
              Pipeline
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-2 text-xs font-semibold flex items-center space-x-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'tables'
                ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Active DB Tables</span>
          </button>
        </div>

        {/* View Switcher and Action icons */}
        <div className="flex items-center space-x-2 text-xs">
          {activeTab === 'result' && expectedResult && expectedResult.type === 'SELECT' && queryResult?.success && (
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px]">
              <button
                onClick={() => setViewMode('user')}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${
                  viewMode === 'user' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Your Output
              </button>
              <button
                onClick={() => setViewMode('expected')}
                className={`px-2 py-0.5 rounded cursor-pointer transition ${
                  viewMode === 'expected' ? 'bg-emerald-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Expected Output
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-2 py-0.5 rounded cursor-pointer transition flex items-center space-x-1 ${
                  viewMode === 'split' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <SplitSquareVertical className="w-3 h-3" />
                <span>Side-by-Side</span>
              </button>
            </div>
          )}

          {activeTab === 'result' && queryResult && queryResult.success && queryResult.rows.length > 0 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={copyToClipboard}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                title="Copy JSON to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={downloadCSV}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                title="Download CSV"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: Query Result & Diagnostic */}
      {activeTab === 'result' && (
        <div className="flex-1 overflow-auto flex flex-col p-3 space-y-3">
          {/* Detailed Diagnostic Banner */}
          {diagnostic && diagnostic.status !== 'NOT_RUN' && (
            <div className={`p-4 rounded-xl border transition-all text-xs space-y-2 ${
              diagnostic.passed
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200 shadow-sm'
                : 'bg-rose-950/25 border-rose-500/40 text-rose-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  {diagnostic.passed ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300">{diagnostic.title}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span className="text-rose-300">{diagnostic.title}</span>
                    </>
                  )}
                </div>

                {queryResult && (
                  <div className="flex items-center space-x-2 text-[11px] font-mono opacity-80">
                    <Clock className="w-3 h-3" />
                    <span>{queryResult.executionTime} ms</span>
                  </div>
                )}
              </div>

              <p className="leading-relaxed">
                {diagnostic.message}
              </p>

              {/* Actionable Diagnostic Hint explaining WHERE it is wrong */}
              {diagnostic.hint && (
                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-[11px] space-y-1 mt-1 text-slate-300">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-300">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Where is the mistake?</span>
                  </div>
                  <p className="leading-relaxed font-sans">{diagnostic.hint}</p>
                </div>
              )}

              {/* Column diff if columns mismatched */}
              {diagnostic.diff?.expectedColumns && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                  <div className="p-2 bg-slate-950 rounded border border-emerald-800/40">
                    <span className="text-emerald-400 font-bold block mb-0.5">Expected Columns:</span>
                    <span>[{diagnostic.diff.expectedColumns.join(', ')}]</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-rose-800/40">
                    <span className="text-rose-400 font-bold block mb-0.5">Your Columns:</span>
                    <span>[{diagnostic.diff.actualColumns.join(', ')}]</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Result Content Table or Empty State */}
          {!queryResult ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2 py-8">
              <Database className="w-8 h-8 text-slate-700" />
              <p>Write your SQL code above and click <strong>"Check Answer"</strong>.</p>
              <span className="text-[11px] text-slate-600 font-mono">
                Keyboard Shortcut: Ctrl + Enter
              </span>
            </div>
          ) : !queryResult.success ? (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs text-rose-200 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-rose-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>SQL Engine Error</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg text-rose-300 font-mono text-[11px] whitespace-pre-wrap border border-rose-900/50">
                {queryResult.error}
              </pre>
            </div>
          ) : queryResult.type === 'DML/DDL' ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Statement Executed Successfully</span>
              </div>
              <p>{queryResult.message}</p>
            </div>
          ) : (
            <>
              {/* Split Mode / User Mode / Expected Mode */}
              {viewMode === 'split' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {renderDataTable(queryResult, 'Your Query Output', 'default')}
                  {renderDataTable(expectedResult, 'Expected Output Reference', 'expected')}
                </div>
              ) : viewMode === 'expected' ? (
                renderDataTable(expectedResult, 'Expected Output Reference (Target Structure)', 'expected')
              ) : (
                renderDataTable(queryResult, 'Your Query Output Data', 'default')
              )}
            </>
          )}
        </div>
      )}

      {/* Tab 2: How Did We Reach The Solution */}
      {activeTab === 'explanation' && (
        <StepExplainer task={task} lab={lab} />
      )}

      {/* Tab 3: Active DB Tables */}
      {activeTab === 'tables' && (
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200">
              Tables in Current Laboratory Sandbox
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {dbTables.length} tables found
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {dbTables.map((tbl, idx) => (
              <div key={idx} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
                <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-400 font-mono">
                    {tbl.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {tbl.rowCount} rows
                  </span>
                </div>
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                        {tbl.columns.map((c, cidx) => (
                          <th key={cidx} className="py-1.5 px-2 font-semibold">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-slate-300">
                      {tbl.sampleData.map((row, ridx) => (
                        <tr key={ridx} className="hover:bg-slate-800/40">
                          {tbl.columns.map((c, cidx) => (
                            <td key={cidx} className="py-1 px-2 whitespace-nowrap">
                              {row[c] !== null && row[c] !== undefined ? String(row[c]) : <span className="text-slate-600 italic">NULL</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
