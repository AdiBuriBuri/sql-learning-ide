import React from 'react';
import { 
  Database, 
  Play, 
  RotateCcw, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  PanelLeftClose, 
  PanelLeft,
  Sparkles,
  CheckCheck,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header({
  activeLab,
  activeTask,
  onRunQuery,
  onCheckAnswer,
  onResetDB,
  onOpenSchema,
  onOpenViva,
  completedCount,
  totalTasks,
  isSidebarOpen,
  onToggleSidebar
}) {
  const { theme, toggleTheme, isDark } = useTheme();
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-xs select-none sticky top-0 z-30 transition-colors">
      {/* Left: Branding & Sidebar Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4 text-blue-500 dark:text-blue-400" />}
        </button>

        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-sm">
          <Database className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">SQL Lab IDE</h1>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded-full font-mono">
              PCS 503 DBMS Lab
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden lg:inline">
              Graphic Era Hill University
            </span>
          </div>
        </div>
      </div>

      {/* Center: Progress Tracker */}
      <div className="hidden md:flex items-center space-x-3 bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 px-3.5 py-1.5 rounded-full">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        <div className="text-xs">
          <span className="text-slate-500 dark:text-slate-400">Solved: </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</span>
          <span className="text-slate-400 dark:text-slate-500"> / {totalTasks}</span>
        </div>
        <div className="w-24 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{progressPercent}%</span>
      </div>

      {/* Right: Quick Action Controls + Theme Toggle */}
      <div className="flex items-center space-x-2">
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700/80 transition cursor-pointer shadow-2xs"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenSchema}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium border border-slate-200 dark:border-slate-700/80 transition cursor-pointer"
          title="Inspect live database tables & schemas"
        >
          <Layers className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span className="hidden sm:inline">Tables</span>
        </button>

        <button
          onClick={onOpenViva}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium border border-slate-200 dark:border-slate-700/80 transition cursor-pointer"
          title="Viva Voce questions & oral prep"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span className="hidden sm:inline">Viva Notes</span>
        </button>

        <button
          onClick={onResetDB}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700/80 transition cursor-pointer"
          title="Reset database to original seed state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Reset DB</span>
        </button>

        <button
          onClick={onRunQuery}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition cursor-pointer"
          title="Run query to test output"
        >
          <Play className="w-3 h-3 text-slate-600 dark:text-slate-300" />
          <span>Run</span>
        </button>

        <button
          onClick={onCheckAnswer}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition cursor-pointer"
          title="Check your solution against expected answer (Ctrl+Enter)"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Check Answer</span>
          <span className="text-[10px] opacity-75 hidden sm:inline font-mono">↵</span>
        </button>
      </div>
    </header>
  );
}
