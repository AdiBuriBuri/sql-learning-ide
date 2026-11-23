import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Search, 
  X, 
  Layers, 
  Sparkles,
  GitBranch,
  BookOpen
} from 'lucide-react';

export default function Sidebar({
  labs,
  activeLabId,
  activeTaskId,
  onSelectTask,
  completedTaskIds
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedLabIds, setExpandedLabIds] = useState(() => {
    return { [activeLabId]: true };
  });

  // Extract all categories
  const categories = useMemo(() => {
    const set = new Set();
    labs.forEach(lab => {
      if (lab.category) set.add(lab.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [labs]);

  // When searching, expand all matching labs automatically
  useEffect(() => {
    if (searchTerm.trim()) {
      const newExpanded = {};
      labs.forEach(lab => {
        newExpanded[lab.id] = true;
      });
      setExpandedLabIds(newExpanded);
    }
  }, [searchTerm, labs]);

  const toggleExpand = (labId) => {
    setExpandedLabIds(prev => ({
      ...prev,
      [labId]: !prev[labId]
    }));
  };

  // Filter labs and tasks
  const { filteredLabs, totalMatchingTasks } = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    let totalTasksFound = 0;

    const filtered = labs.map(lab => {
      // If user is searching, category is bypassed so search finds everything across the curriculum
      const matchCat = q ? true : (selectedCategory === 'ALL' || lab.category === selectedCategory);
      if (!matchCat) return null;

      if (!q) {
        totalTasksFound += (lab.tasks?.length || 0);
        return lab;
      }

      // Check if lab metadata matches
      const labMatch =
        lab.title.toLowerCase().includes(q) ||
        lab.labNumber.toLowerCase().includes(q) ||
        lab.category.toLowerCase().includes(q) ||
        (lab.description && lab.description.toLowerCase().includes(q));

      // Filter tasks that match
      const matchedTasks = (lab.tasks || []).filter(task => {
        return (
          labMatch ||
          task.title.toLowerCase().includes(q) ||
          task.prompt.toLowerCase().includes(q) ||
          (task.conceptExplanation && task.conceptExplanation.toLowerCase().includes(q)) ||
          (task.solutionCode && task.solutionCode.toLowerCase().includes(q))
        );
      });

      if (matchedTasks.length > 0) {
        totalTasksFound += matchedTasks.length;
        return {
          ...lab,
          filteredTasks: matchedTasks
        };
      }
      return null;
    }).filter(Boolean);

    return { filteredLabs: filtered, totalMatchingTasks: totalTasksFound };
  }, [labs, selectedCategory, searchTerm]);

  return (
    <aside className="w-80 bg-slate-50 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 flex flex-col h-[calc(100vh-53px)] shrink-0 overflow-hidden transition-colors">
      {/* Search Bar & Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800/80 space-y-2.5 bg-white/70 dark:bg-slate-950/60">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search queries (e.g. join, salary, triggers)..."
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-xs font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Count Notice */}
        {searchTerm ? (
          <div className="flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-medium px-1">
            <span>Found {totalMatchingTasks} matching question(s)</span>
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-500 dark:text-slate-400 hover:underline cursor-pointer text-[10px]"
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* Category Filter Pills */
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer font-medium text-[11px] ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-200/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lab List Accordion */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredLabs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <Search className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-600" />
            <p>No questions found for <strong className="text-slate-700 dark:text-slate-400">"{searchTerm}"</strong></p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
              className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredLabs.map((lab) => {
            const isExpanded = !!expandedLabIds[lab.id] || !!searchTerm;
            const tasksToShow = lab.filteredTasks || lab.tasks || [];
            const labTasks = lab.tasks || [];
            const labCompletedCount = labTasks.filter(t => completedTaskIds.has(t.id)).length;
            const isAllCompleted = labTasks.length > 0 && labCompletedCount === labTasks.length;
            const isCurrentLab = activeLabId === lab.id;

            return (
              <div
                key={lab.id}
                className={`rounded-xl border transition-all ${
                  isCurrentLab
                    ? 'border-blue-400 dark:border-blue-500/50 bg-white dark:bg-slate-900 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Lab Header */}
                <button
                  onClick={() => toggleExpand(lab.id)}
                  className="w-full text-left p-3 flex items-start justify-between cursor-pointer group"
                >
                  <div className="flex items-start space-x-2.5 flex-1 min-w-0 pr-2">
                    <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 mt-0.5">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-mono">
                          {lab.labNumber}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700 font-mono">
                          {lab.blooms}
                        </span>
                        {isAllCompleted && (
                          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-500/30 font-semibold">
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-white leading-snug">
                        {lab.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {lab.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0 font-medium">
                    {labCompletedCount}/{labTasks.length}
                  </div>
                </button>

                {/* Sub-Tasks / Questions */}
                {isExpanded && (
                  <div className="px-2 pb-2 pt-1 space-y-1 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 rounded-b-xl">
                    {tasksToShow.map((task) => {
                      const isTaskActive = activeTaskId === task.id;
                      const isCompleted = completedTaskIds.has(task.id);

                      return (
                        <button
                          key={task.id}
                          onClick={() => onSelectTask(lab.id, task.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition cursor-pointer ${
                            isTaskActive
                              ? 'bg-blue-600 text-white font-semibold shadow-xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2 min-w-0 pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isTaskActive ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'}`} />
                            ) : isTaskActive ? (
                              <Circle className="w-4 h-4 shrink-0 text-white fill-white/20" />
                            ) : (
                              <Circle className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-600" />
                            )}
                            <span className="truncate">{task.title}</span>
                          </div>
                          {task.erDiagram && (
                            <span className="text-[9px] bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded border border-purple-200 dark:border-purple-500/30 shrink-0 font-mono">
                              ER
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Graphic Era Hill Univ</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">PCS 503 DBMS Lab</span>
      </div>
    </aside>
  );
}
