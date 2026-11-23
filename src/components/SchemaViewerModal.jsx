import React, { useState } from 'react';
import { X, Database, Table, Layers, Search, RefreshCw } from 'lucide-react';

export default function SchemaViewerModal({ isOpen, onClose, tables, onRefresh }) {
  const [activeTableIndex, setActiveTableIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const currentTable = tables[activeTableIndex] || tables[0];

  const filteredRows = currentTable
    ? currentTable.sampleData.filter(row => {
        if (!searchTerm) return true;
        return Object.values(row).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Database Schema & Table Viewer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live in-memory relational sandbox tables</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Refresh database state"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Table List Sidebar */}
          <div className="w-56 bg-slate-50 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800 p-3 space-y-1 overflow-y-auto shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-1">
              Active Tables ({tables.length})
            </span>
            {tables.map((tbl, idx) => (
              <button
                key={tbl.name}
                onClick={() => setActiveTableIndex(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                  activeTableIndex === idx
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800/60 hover:text-black dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Table className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tbl.name}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-sans ${
                  activeTableIndex === idx 
                    ? 'bg-blue-700 text-blue-100' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-500'
                }`}>
                  {tbl.rowCount}
                </span>
              </button>
            ))}
          </div>

          {/* Table Data Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
            {currentTable ? (
              <>
                {/* Search & Metadata Bar */}
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`Search in ${currentTable.name}...`}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-md pl-8 pr-3 py-1 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Columns: <strong className="text-slate-800 dark:text-slate-200">{currentTable.columns.length}</strong></span>
                    <span>•</span>
                    <span>Rows: <strong className="text-slate-800 dark:text-slate-200">{currentTable.rowCount}</strong></span>
                  </div>
                </div>

                {/* Table Grid */}
                <div className="flex-1 overflow-auto p-3">
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          <th className="py-2 px-3 w-10 text-slate-400 dark:text-slate-600">#</th>
                          {currentTable.columns.map((c, idx) => (
                            <th key={idx} className="py-2 px-3 font-semibold text-blue-600 dark:text-blue-400">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                        {filteredRows.map((row, ridx) => (
                          <tr key={ridx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 even:bg-slate-50/50 dark:even:bg-slate-950/30 text-slate-700 dark:text-slate-300">
                            <td className="py-1.5 px-3 text-slate-400 dark:text-slate-600 text-[10px]">{ridx + 1}</td>
                            {currentTable.columns.map((c, cidx) => (
                              <td key={cidx} className="py-1.5 px-3 whitespace-nowrap">
                                {row[c] !== null && row[c] !== undefined ? String(row[c]) : (
                                  <span className="text-slate-400 dark:text-slate-600 italic">NULL</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No tables found in database.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
