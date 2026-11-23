import React, { useState } from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  HelpCircle, 
  Lightbulb, 
  CheckCircle, 
  Layers, 
  Workflow, 
  BookOpen, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function StepExplainer({ task, lab }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!task || !task.stepBreakdown) {
    return (
      <div className="p-6 text-center text-slate-500 text-xs">
        No step breakdown available for this task.
      </div>
    );
  }

  const steps = task.stepBreakdown;
  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="h-full flex flex-col bg-slate-50/50 dark:bg-slate-900 overflow-y-auto p-4 space-y-4 transition-colors">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-500/20 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Workflow className="w-4 h-4" />
          <span>How Did We Reach The Solution?</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          SQL queries execute in a specific <strong>logical pipeline</strong> (not top-to-bottom). 
          Explore each phase below to see how the database processes and evaluates your records.
        </p>
      </div>

      {/* Interactive Step Navigation Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Execution Pipeline Stages</span>
          <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
            Step {activeStepIndex + 1} of {steps.length}
          </span>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {steps.map((st, idx) => {
            const isCurrent = idx === activeStepIndex;
            const isPassed = idx < activeStepIndex;

            return (
              <button
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer relative shadow-2xs ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-500 text-blue-950 dark:text-white font-semibold'
                    : isPassed
                    ? 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    : 'bg-white/50 dark:bg-slate-950/30 border-slate-200/80 dark:border-slate-800/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded ${
                    isCurrent 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    #{idx + 1}
                  </span>
                  {st.rowsAffected && (
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">
                      {st.rowsAffected}
                    </span>
                  )}
                </div>
                <div className="text-xs font-medium truncate">
                  {st.phase}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Deep-Dive Card */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-blue-200 dark:border-blue-500/30 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              {activeStepIndex + 1}
            </span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {currentStep.phase}
            </h4>
          </div>
          {currentStep.rowsAffected && (
            <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-mono">
              Status: {currentStep.rowsAffected}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {currentStep.desc}
        </p>

        {/* Navigation buttons between steps */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
            disabled={activeStepIndex === 0}
            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition shadow-2xs"
          >
            ← Previous Step
          </button>
          <button
            onClick={() => setActiveStepIndex(Math.min(steps.length - 1, activeStepIndex + 1))}
            disabled={activeStepIndex === steps.length - 1}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition font-medium shadow-xs"
          >
            Next Step →
          </button>
        </div>
      </div>

      {/* Logical Execution Order Cheatsheet */}
      <div className="bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Layers className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>SQL Execution Order (Why it works)</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          In SQL, the query is written starting with <code className="text-blue-600 dark:text-blue-300 font-bold">SELECT</code>, but 
          the relational engine processes clauses in this mandatory order:
        </p>

        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-1 rounded">1. FROM & JOIN</span>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-1 rounded">2. WHERE</span>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-1 rounded">3. GROUP BY</span>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-1 rounded">4. HAVING</span>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-1 rounded">5. SELECT</span>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-1 rounded">6. ORDER BY</span>
        </div>

        <p className="text-[10px] text-slate-500 italic">
          💡 This explains why you cannot use aliases defined in SELECT inside the WHERE clause—WHERE is executed before SELECT ever runs!
        </p>
      </div>

      {/* Conceptual Explanation Box */}
      <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2 shadow-2xs">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <Lightbulb className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>Core Concept & Theoretical Foundation</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {task.conceptExplanation}
        </p>
      </div>

      {/* University Viva Voce Preparation */}
      {task.vivaTips && (
        <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3.5 space-y-2 shadow-2xs">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
            <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Graphic Era Hill University • Viva Voce Insight</span>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed font-sans">
            {task.vivaTips}
          </p>
        </div>
      )}
    </div>
  );
}
