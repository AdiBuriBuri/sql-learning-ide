import React from 'react';
import { Key, ArrowRight, Layers, GitBranch, Database } from 'lucide-react';

export default function ERDiagramViewer({ erData }) {
  if (!erData) return null;

  return (
    <div className="space-y-4">
      {/* ER Model Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
            <GitBranch className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{erData.title || 'Entity-Relationship Diagram'}</span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Graphic Era Hill University Lab ER Specification
          </p>
        </div>
        <span className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 px-2 py-0.5 rounded font-mono">
          Chen / Crow's Foot Model
        </span>
      </div>

      {/* Visual Relationship Graph */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Entity Relationships & Cardinality</span>
        </span>

        <div className="grid grid-cols-1 gap-2.5">
          {erData.relationships?.map((rel, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition text-xs shadow-2xs"
            >
              <div className="flex items-center space-x-2">
                <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 px-2 py-1 rounded">
                  {rel.from}
                </span>
                <span className="text-slate-400 flex items-center space-x-1 text-[11px]">
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium px-1 bg-slate-100 dark:bg-slate-800/60 rounded">
                    {rel.label}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2 py-1 rounded">
                  {rel.to}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 px-2 py-0.5 rounded">
                {rel.cardinality}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Entities & Attributes Detail Cards */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-300 flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Entity Schemas & Key Attributes</span>
        </span>

        <div className="grid grid-cols-1 gap-3">
          {erData.entities?.map((ent, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
            >
              <div className="bg-slate-50 dark:bg-slate-900/90 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {ent.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Entity #{idx + 1}
                </span>
              </div>

              <div className="p-3 space-y-2 text-xs">
                {/* Keys */}
                {ent.keys && ent.keys.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1 mr-1">
                      <Key className="w-2.5 h-2.5" />
                      <span>Primary Key:</span>
                    </span>
                    {ent.keys.map((k, kidx) => (
                      <span
                        key={kidx}
                        className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                )}

                {/* Attributes */}
                {ent.attributes && ent.attributes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mr-1">
                      Attributes:
                    </span>
                    {ent.attributes.map((attr, aidx) => (
                      <span
                        key={aidx}
                        className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
