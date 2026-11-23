import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProblemPane from './components/ProblemPane';
import SqlEditor from './components/SqlEditor';
import OutputPane from './components/OutputPane';
import SchemaViewerModal from './components/SchemaViewerModal';
import VivaVoceModal from './components/VivaVoceModal';
import { labsData } from './data/labsData';
import { dbEngine } from './utils/dbEngine';
import { checkAnswer } from './utils/answerChecker';
import { ThemeProvider } from './context/ThemeContext';

function IDEContent() {
  const [activeLabId, setActiveLabId] = useState('lab-3');
  const [activeTaskId, setActiveTaskId] = useState('lab3-q1');
  const [userCode, setUserCode] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [expectedResult, setExpectedResult] = useState(null);
  const [diagnostic, setDiagnostic] = useState(null);
  const [completedTaskIds, setCompletedTaskIds] = useState(() => {
    try {
      const saved = localStorage.getItem('sql_ide_completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dbTables, setDbTables] = useState([]);
  const [problemTab, setProblemTab] = useState('problem');
  const [outputTab, setOutputTab] = useState('result');
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);

  // Resizable panel widths / heights
  const [problemPaneWidth, setProblemPaneWidth] = useState(380); // px
  const [editorHeightPct, setEditorHeightPct] = useState(46);    // % of right column

  // Drag state refs (no re-render during drag)
  const hDragRef = useRef(null); // horizontal drag (problem ↔ editor)
  const vDragRef = useRef(null); // vertical drag (editor ↔ output)
  const rightColRef = useRef(null);

  // ── Horizontal drag (problem pane ↔ right panel) ──────────────────────
  const startHDrag = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = problemPaneWidth;
    hDragRef.current = { startX, startW };

    const onMove = (ev) => {
      const delta = ev.clientX - hDragRef.current.startX;
      const newW = Math.max(240, Math.min(640, hDragRef.current.startW + delta));
      setProblemPaneWidth(newW);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [problemPaneWidth]);

  // ── Vertical drag (editor ↔ output) ───────────────────────────────────
  const startVDrag = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startPct = editorHeightPct;
    const colH = rightColRef.current?.clientHeight || 800;
    vDragRef.current = { startY, startPct, colH };

    const onMove = (ev) => {
      const delta = ev.clientY - vDragRef.current.startY;
      const deltaPct = (delta / vDragRef.current.colH) * 100;
      const newPct = Math.max(20, Math.min(78, vDragRef.current.startPct + deltaPct));
      setEditorHeightPct(newPct);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [editorHeightPct]);

  // Active lab and task
  const activeLab = useMemo(() => {
    return labsData.find(l => l.id === activeLabId) || labsData[0];
  }, [activeLabId]);

  const activeTask = useMemo(() => {
    return activeLab?.tasks?.find(t => t.id === activeTaskId) || activeLab?.tasks?.[0];
  }, [activeLab, activeTaskId]);

  const totalTasks = useMemo(() => {
    return labsData.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.length : 0), 0);
  }, []);

  // Save completed tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sql_ide_completed', JSON.stringify(Array.from(completedTaskIds)));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [completedTaskIds]);

  // Database seeder
  const refreshDatabase = useCallback(() => {
    if (!activeLab) return;
    dbEngine.initLabDatabase(activeLab);
    const tables = dbEngine.getTables();
    setDbTables(tables);
  }, [activeLab]);

  // Handle user code typing and auto-save draft
  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
    if (activeTaskId) {
      try {
        localStorage.setItem(`sql_ide_code_${activeTaskId}`, newCode);
      } catch (e) {
        // ignore storage error
      }
    }
  };

  // Switch task
  const handleSelectTask = (labId, taskId) => {
    const targetLab = labsData.find(l => l.id === labId);
    const targetTask = targetLab?.tasks?.find(t => t.id === taskId);
    
    setActiveLabId(labId);
    setActiveTaskId(taskId);
    setQueryResult(null);
    setDiagnostic(null);
    setProblemTab('problem');

    // Retrieve saved draft or use fresh starter template
    const savedDraft = localStorage.getItem(`sql_ide_code_${taskId}`);
    if (savedDraft !== null) {
      setUserCode(savedDraft);
    } else if (targetTask) {
      setUserCode(targetTask.starterCode || '');
    }

    // Re-seed DB
    dbEngine.initLabDatabase(targetLab);
    const tables = dbEngine.getTables();
    setDbTables(tables);

    // Pre-calculate expected result for grading
    if (targetTask?.solutionCode) {
      const exp = dbEngine.executeQuery(targetTask.solutionCode);
      setExpectedResult(exp);
      dbEngine.initLabDatabase(targetLab);
    }
  };

  // Initial load
  useEffect(() => {
    if (activeLab && activeTask) {
      dbEngine.initLabDatabase(activeLab);
      const savedDraft = localStorage.getItem(`sql_ide_code_${activeTask.id}`);
      setUserCode(savedDraft !== null ? savedDraft : (activeTask.starterCode || ''));
      const tables = dbEngine.getTables();
      setDbTables(tables);

      if (activeTask.solutionCode) {
        const exp = dbEngine.executeQuery(activeTask.solutionCode);
        setExpectedResult(exp);
        dbEngine.initLabDatabase(activeLab);
      }
    }
  }, []);

  // Simple Run Query (does not mark graded if user just wants to see output)
  const handleRunQuery = () => {
    if (!userCode || !userCode.trim()) return;

    // Run user query
    const res = dbEngine.executeQuery(userCode);
    setQueryResult(res);
    setOutputTab('result');

    // Update tables
    const tables = dbEngine.getTables();
    setDbTables(tables);

    // If expected result is ready, compute diagnostic
    if (activeTask?.solutionCode) {
      dbEngine.initLabDatabase(activeLab);
      const exp = dbEngine.executeQuery(activeTask.solutionCode);
      setExpectedResult(exp);

      dbEngine.initLabDatabase(activeLab);
      const reUser = dbEngine.executeQuery(userCode);
      setQueryResult(reUser);

      const diag = checkAnswer(reUser, exp);
      setDiagnostic(diag);
      if (diag.passed) {
        setCompletedTaskIds(prev => new Set([...prev, activeTask.id]));
      }
    }
  };

  // Check Answer Button (Grading + Detailed Diagnostic)
  const handleCheckAnswer = () => {
    if (!userCode || !userCode.trim()) {
      setDiagnostic({
        status: 'EMPTY_QUERY',
        passed: false,
        title: 'Empty Query',
        message: 'Please write your SQL query before clicking "Check Answer".',
        hint: 'Read the task requirements on the left, inspect the available columns, and formulate a SELECT statement.'
      });
      setOutputTab('result');
      return;
    }

    handleRunQuery();
  };

  // Reset code
  const handleResetCode = () => {
    if (activeTask) {
      setUserCode(activeTask.starterCode || '');
      localStorage.removeItem(`sql_ide_code_${activeTask.id}`);
      setQueryResult(null);
      setDiagnostic(null);
      refreshDatabase();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors">
      {/* Top Application Header */}
      <Header
        activeLab={activeLab}
        activeTask={activeTask}
        onRunQuery={handleRunQuery}
        onCheckAnswer={handleCheckAnswer}
        onResetDB={refreshDatabase}
        onOpenSchema={() => setIsSchemaModalOpen(true)}
        onOpenViva={() => setIsVivaModalOpen(true)}
        completedCount={completedTaskIds.size}
        totalTasks={totalTasks}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Multi-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Collapsible Sidebar */}
        {isSidebarOpen && (
          <Sidebar
            labs={labsData}
            activeLabId={activeLabId}
            activeTaskId={activeTaskId}
            onSelectTask={handleSelectTask}
            completedTaskIds={completedTaskIds}
          />
        )}

        {/* Center-Left: Problem Statement & ER Diagram */}
        <div style={{ width: problemPaneWidth, minWidth: 240, maxWidth: 640, flexShrink: 0 }} className="border-r border-slate-200 dark:border-slate-800 relative">
          <ProblemPane
            lab={activeLab}
            task={activeTask}
            dbTables={dbTables}
            expectedResult={expectedResult}
            onShowSchema={() => setIsSchemaModalOpen(true)}
            activeTab={problemTab}
            setActiveTab={setProblemTab}
          />
        </div>

        {/* Horizontal Drag Handle */}
        <div
          onMouseDown={startHDrag}
          className="w-1.5 shrink-0 bg-transparent hover:bg-blue-400/40 dark:hover:bg-blue-500/30 cursor-col-resize transition-colors active:bg-blue-500/50 group relative z-10"
          title="Drag to resize panels"
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors" />
        </div>

        {/* Right: Split View (SQL Editor Top, Output & Diagnostics Bottom) */}
        <div ref={rightColRef} className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top: Code Editor */}
          <div style={{ height: `${editorHeightPct}%`, minHeight: 180 }}>
            <SqlEditor
              value={userCode}
              onChange={handleCodeChange}
              onRun={handleRunQuery}
              onCheckAnswer={handleCheckAnswer}
              onReset={handleResetCode}
              solutionCode={activeTask?.solutionCode || ''}
            />
          </div>

          {/* Vertical Drag Handle */}
          <div
            onMouseDown={startVDrag}
            className="h-1.5 shrink-0 bg-transparent hover:bg-blue-400/40 dark:hover:bg-blue-500/30 cursor-row-resize transition-colors active:bg-blue-500/50 group relative z-10"
            title="Drag to resize editor / output"
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-400 dark:group-hover:bg-blue-500 transition-colors" />
          </div>

          {/* Bottom: Output & Step-by-Step Breakdown */}
          <div className="flex-1 min-h-[160px] overflow-hidden">
            <OutputPane
              queryResult={queryResult}
              expectedResult={expectedResult}
              diagnostic={diagnostic}
              task={activeTask}
              lab={activeLab}
              dbTables={dbTables}
              activeTab={outputTab}
              setActiveTab={setOutputTab}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SchemaViewerModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        tables={dbTables}
        onRefresh={refreshDatabase}
      />

      <VivaVoceModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <IDEContent />
    </ThemeProvider>
  );
}
