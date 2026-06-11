import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Layers,
  Trash2,
  Plus,
  Printer,
  Sparkles,
  RefreshCw,
  Copy,
  Download,
  Image as ImageIcon,
  FolderOpen,
  PlusCircle,
  FileCode,
  PanelLeftOpen,
  PanelRightOpen,
  ArrowUpFromLine,
  ArrowDownToLine,
  X,
  GripVertical,
  Sun,
  Moon,
  Palette,
  Type,
  Grid3X3,
  FileDown,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function App() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [paperStyle, setPaperStyle] = useState('lined');
  const [handwrittenFont, setHandwrittenFont] = useState(true);
  const [scriptsLoaded] = useState({ html2canvas: true, jspdf: true });
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [slides, setSlides] = useState([
    {
      id: 'slide-1',
      title: 'Chapter 1: Why Learn DSA?',
      paragraph: 'Data Structures and Algorithms represent the foundational building blocks of programming. Choosing the right collection structure directly optimizes runtime complexity bounds.',
      bullets: [
        'Efficient CPU instruction management',
        'Contiguous vs Non-contiguous random access tradeoffs',
        'Optimal local storage cache utilization'
      ],
      code: `// C++ Container Access Example
#include <iostream>
#include <vector>

int main() {
    std::vector<int> nums = {10, 20, 30};
    std::cout << nums[0]; // Constant O(1) Access!
    return 0;
}`,
      visualType: 'array',
      visualData: '10, 20, 30, 40, 50',
    },
    {
      id: 'slide-2',
      title: 'Chapter 2: LIFO Stack Buffer',
      paragraph: 'A Stack represents a linear sequential block operating on the Last In First Out (LIFO) protocol. New elements are piled on top of previous layers.',
      bullets: [
        'Constant execution time O(1) for push() and pop()',
        'Direct tracking via a master TOP memory pointer',
        'Vital for backtracking graphs and compiler frame traces'
      ],
      code: `// C++ LIFO Stack Execution
#include <stack>
std::stack<std::string> callStack;
callStack.push("Frame_A");
callStack.push("Frame_B");
callStack.pop(); // Removes Frame_B!`,
      visualType: 'stack',
      visualData: 'Frame_A, Frame_B, Frame_C',
    },
    {
      id: 'slide-3',
      title: 'Chapter 3: Binary Tree Nodes',
      paragraph: 'A Binary tree is a branching network where every node can link to a maximum of two descendants. Essential structure for fast lookup balances.',
      bullets: [
        'Root Node forms the high point baseline anchor',
        'Left pointers represent smaller keys in search alignments',
        'In-order recursive walks output keys in sorted order'
      ],
      code: `// BST node pointer creation
struct Node {
    int value;
    Node* left;
    Node* right;
};`,
      visualType: 'tree',
      visualData: '50, 30, 70, 20, 40, 60, 80',
    }
  ]);

  const [bulkInput, setBulkInput] = useState(
`--- Slide 1: Quick Sorting Arrays ---
Merge Sort recursive subdivisions slice lists in halves, executing a Divide & Conquer paradigm.
✓ Divide: split arrays around midpoint offsets
✓ Conquer: compare and order elements sequentially
✓ Space requirements scale at linear O(n) bounds

data: [15, 30, 45, 60, 75]
[Array Visualizer]

--- Slide 2: FIFO Queue Tasks ---
A Queue is a linear system preserving structural FIFO execution order. Elements append rear-side and extract front-side.
✓ Standard task scheduling pipeline
✓ CPU multi-process buffers
✓ Linear memory space allocation

elements: [Job_A, Job_B, Job_C]
[Queue Visualizer]
`);

  const [liveStack, setLiveStack] = useState(['Frame_A', 'Frame_B', 'Frame_C']);
  const [newStackItem, setNewStackItem] = useState('');
  const [liveQueue, setLiveQueue] = useState(['Job_A', 'Job_B', 'Job_C']);
  const [newQueueItem, setNewQueueItem] = useState('');

  const activeSlideRef = useRef(null);

  const updateSlideField = (index, field, value) => {
    const updated = [...slides];
    updated[index][field] = value;
    setSlides(updated);
  };

  const handleAddNewSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      title: 'New Chapter Slide',
      paragraph: 'This is a blank slide note card template. Double-click here to insert your custom educational notes.',
      bullets: ['Custom list checklist item 1', 'Custom list checklist item 2'],
      code: `// Insert custom programming codes`,
      visualType: 'none',
      visualData: '',
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleDuplicateSlide = () => {
    const current = slides[activeSlideIndex];
    const duplicated = { ...current, id: `slide-${Date.now()}`, title: `${current.title} (Copy)` };
    const updated = [...slides];
    updated.splice(activeSlideIndex + 1, 0, duplicated);
    setSlides(updated);
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  const handleDeleteSlide = (indexToDelete) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, idx) => idx !== indexToDelete);
    setSlides(updated);
    if (activeSlideIndex >= updated.length) {
      setActiveSlideIndex(updated.length - 1);
    }
  };

  const handleBulkParse = () => {
    if (!bulkInput.trim()) return;
    const rawBlocks = bulkInput.split(/--- Slide \d+:\s*|---\s*Slide\s*|---\s*/i);
    const parsedSlides = rawBlocks.map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return null;
      const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let title = "New Chapter Header";
      let bullets = [];
      let paragraph = "";
      let visualType = "none";
      let visualData = "";
      const firstLine = lines[0];
      if (firstLine && !firstLine.startsWith('✓') && !firstLine.startsWith('data:') && !firstLine.startsWith('[')) {
        title = firstLine.replace(/---/g, '').trim();
        lines.shift();
      }
      lines.forEach((line) => {
        if (line.startsWith('✓') || line.startsWith('•') || line.startsWith('-')) {
          bullets.push(line.replace(/^[✓•\-]\s*/, ''));
        } else if (line.startsWith('data:') || line.startsWith('elements:') || line.startsWith('nodes:')) {
          visualData = line.substring(line.indexOf(':') + 1).replace(/[\[\]]/g, '').trim();
        } else if (line.startsWith('[') && line.endsWith(']')) {
          const check = line.toLowerCase();
          if (check.includes('array')) visualType = 'array';
          else if (check.includes('tree')) visualType = 'tree';
          else if (check.includes('stack')) visualType = 'stack';
          else if (check.includes('queue')) visualType = 'queue';
          else if (check.includes('complexity')) visualType = 'complexity';
        } else {
          paragraph += (paragraph ? " " : "") + line;
        }
      });
      return {
        id: `slide-bulk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title, paragraph, bullets,
        code: `// Custom algorithm representation`,
        visualType, visualData,
      };
    }).filter(Boolean);
    if (parsedSlides.length > 0) {
      setSlides(parsedSlides);
      setActiveSlideIndex(0);
    }
  };

  const getArrayFromData = (dataString) => {
    if (!dataString) return ['10', '20', '30'];
    return dataString.split(',').map(s => s.trim());
  };

  const handleExportAsImage = async (format = 'png') => {
    if (!scriptsLoaded.html2canvas) {
      setExportMessage("Loading Canvas Engine...");
      return;
    }
    setExporting(true);
    setExportMessage(`Rendering to ${format.toUpperCase()}...`);
    try {
      const canvas = await html2canvas(activeSlideRef.current, {
        scale: 2, backgroundColor: null, useCORS: true, logging: false
      });
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const fileExt = format === 'jpeg' ? 'jpg' : 'png';
      const imgData = canvas.toDataURL(mimeType, format === 'jpeg' ? 0.95 : undefined);
      const link = document.createElement('a');
      link.download = `${slides[activeSlideIndex].title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportMessage("Export successful!");
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      setExportMessage("Export failed!");
    } finally {
      setExporting(false);
    }
  };

  const handleExportAsPDF = async () => {
    if (!scriptsLoaded.html2canvas) {
      setExportMessage("Loading PDF Compiler...");
      return;
    }
    setExporting(true);
    setExportMessage("Compiling PDF...");
    try {
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [842, 595] });
      const canvas = await html2canvas(activeSlideRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#fafaf9'
      });
      const imgWidth = 842;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`handdrawn_notes_master.pdf`);
      setExportMessage("PDF ready!");
      setTimeout(() => setExportMessage(''), 3000);
    } catch (err) {
      setExportMessage("PDF failed!");
    } finally {
      setExporting(false);
    }
  };

  const pushToLiveStack = () => {
    if (!newStackItem.trim()) return;
    setLiveStack([...liveStack, newStackItem]);
    setNewStackItem('');
  };
  const popFromLiveStack = () => {
    if (liveStack.length === 0) return;
    const nextS = [...liveStack]; nextS.pop(); setLiveStack(nextS);
  };
  const enqueueToLiveQueue = () => {
    if (!newQueueItem.trim()) return;
    setLiveQueue([...liveQueue, newQueueItem]);
    setNewQueueItem('');
  };
  const dequeueFromLiveQueue = () => {
    if (liveQueue.length === 0) return;
    const nextQ = [...liveQueue]; nextQ.shift(); setLiveQueue(nextQ);
  };
  const handlePrint = () => window.print();

  const activeSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-blue-500/20">

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Caveat:wght@400;700&family=Fredoka:wght@300..700&family=JetBrains+Mono:wght@400;600&family=Quicksand:wght@400;600;700&display=swap');

        .font-handwritten { font-family: 'Caveat', cursive; }
        .font-sketch-heading { font-family: 'Architects Daughter', cursive; }
        .font-friendly { font-family: 'Fredoka', sans-serif; }
        .font-mono-custom { font-family: 'JetBrains Mono', monospace; }

        .paper-lined {
          background-image: linear-gradient(#b2ebf2 1px, transparent 1px);
          background-size: 100% 32px;
          line-height: 32px;
        }
        .paper-grid {
          background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .paper-plain { background-color: #fafaf9; }

        .gradient-text {
          background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-text-blue {
          background: linear-gradient(135deg, #60a5fa, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-text-green {
          background: linear-gradient(135deg, #34d399, #2dd4bf);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-text-purple {
          background: linear-gradient(135deg, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glass-strong {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .card-premium {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
        }

        .gradient-border {
          position: relative;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(96,165,250,0.3), rgba(167,139,250,0.3), rgba(244,114,182,0.3));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float 5s ease-in-out 1s infinite; }
        .animate-float-slow { animation: float 6s ease-in-out 2s infinite; }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />

      {/* Glass Header */}
      <header className="no-print fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-zinc-200 transition-all lg:hidden"
              >
                {sidebarOpen ? <PanelLeftOpen className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm md:text-base font-semibold tracking-tight flex items-center gap-2">
                    <span className="gradient-text">Slide-to-Sketch</span>
                    <span className="text-zinc-400 font-normal">Studio</span>
                    <span className="hidden sm:inline text-[10px] bg-white/5 text-zinc-400 px-2 py-0.5 rounded-full border border-white/10 font-mono">
                      v2.0
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/5">
                <span className="text-[10px] text-zinc-500 px-1.5 font-mono">Font</span>
                <button
                  onClick={() => setHandwrittenFont(true)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    handwrittenFont ? 'bg-white/10 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Type className="w-3 h-3 inline mr-1" />Handwritten
                </button>
                <button
                  onClick={() => setHandwrittenFont(false)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    !handwrittenFont ? 'bg-white/10 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Standard
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/5">
                <span className="text-[10px] text-zinc-500 px-1.5 font-mono">Paper</span>
                {['lined', 'grid', 'plain'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setPaperStyle(style)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-medium capitalize transition-all ${
                      paperStyle === style ? 'bg-white/10 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {style === 'lined' ? '≡' : style === 'grid' ? '▦' : '○'} {style}
                  </button>
                ))}
              </div>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-zinc-100 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14 md:h-16" />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 gap-6 py-6">
        {/* Sidebar */}
        <aside className={`no-print transition-all duration-300 shrink-0 ${
          sidebarOpen ? 'w-full lg:w-80 opacity-100' : 'w-0 opacity-0 lg:w-0 lg:opacity-0 overflow-hidden'
        } ${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
          <div className="flex flex-col gap-4 w-80">
            {/* Bulk Importer */}
            <div className="glass rounded-2xl p-4 card-premium">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2 mb-3">
                <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                Bulk Importer
              </h2>
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Paste slideshow content..."
                rows={4}
                className="w-full p-2.5 bg-black/30 border border-white/5 text-zinc-200 rounded-xl font-mono text-[11px] focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 resize-none leading-relaxed transition-all placeholder:text-zinc-600"
              />
              <button
                onClick={handleBulkParse}
                className="w-full mt-3 py-2 rounded-xl text-[11px] font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Parse Transcript
              </button>
            </div>

            {/* Slide Manager */}
            <div className="glass rounded-2xl p-4 card-premium flex-1 min-h-[300px] flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Slides ({slides.length})
                </h2>
                <button
                  onClick={handleAddNewSlide}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-emerald-400 transition-all"
                  title="Add new slide"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[360px]">
                {slides.map((slide, idx) => {
                  const isActive = activeSlideIndex === idx;
                  return (
                    <div
                      key={slide.id}
                      className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                        isActive
                          ? 'bg-blue-500/10 border-blue-500/30 text-zinc-100'
                          : 'bg-black/20 border-white/5 hover:bg-white/5 text-zinc-400 hover:text-zinc-200'
                      }`}
                      onClick={() => setActiveSlideIndex(idx)}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                        <span className={`text-[10px] font-mono w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-zinc-500'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs truncate font-medium">{slide.title || "Untitled"}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteSlide(idx); }}
                        className="p-1 rounded-md opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete slide"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleDuplicateSlide}
                className="w-full py-2 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-400 hover:text-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3 h-3" /> Duplicate Slide
              </button>
            </div>
          </div>
        </aside>

        {/* Sidebar toggle for desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="no-print hidden lg:flex mt-2 shrink-0 w-6 h-12 rounded-r-xl bg-white/5 border border-white/5 border-l-0 items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-all cursor-pointer"
        >
          {sidebarOpen ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
        </button>

        {/* Main Content */}
        <section className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Export Panel */}
          <div className="no-print glass rounded-2xl p-3 md:p-4 flex flex-wrap items-center justify-between gap-3 card-premium">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full font-semibold">
                #{activeSlideIndex + 1}
              </span>
              <p className="text-xs text-zinc-500 font-mono hidden sm:block">Ready to export</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleExportAsImage('png')}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-500/20"
              >
                <ImageIcon className="w-3.5 h-3.5" /> PNG
              </button>
              <button
                onClick={() => handleExportAsImage('jpeg')}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                <ImageIcon className="w-3.5 h-3.5" /> JPEG
              </button>
              <button
                onClick={handleExportAsPDF}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-purple-500/20"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>

          {/* Status message */}
          {exportMessage && (
            <div className="no-print glass rounded-xl px-4 py-2.5 border-l-2 border-blue-500 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> {exportMessage}
              </span>
            </div>
          )}

          {/* Notebook */}
          <div
            ref={activeSlideRef}
            className="relative bg-amber-50 rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col min-h-[520px] md:min-h-[600px] gradient-border"
          >
            {/* Spiral binding */}
            <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-amber-100/90 to-amber-50/20 border-r border-amber-200/50 pointer-events-none z-10 flex flex-col justify-between py-8">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="flex items-center justify-end pr-2 h-4">
                  <div className="w-3.5 h-4.5 bg-gradient-to-r from-zinc-500 to-zinc-300 rounded-full border border-zinc-600 shadow-md transform rotate-12"></div>
                  <div className="w-5 h-1 bg-zinc-300 -mr-1 border-t border-b border-zinc-400"></div>
                </div>
              ))}
            </div>

            {/* Red margin line */}
            <div className="absolute left-[72px] top-0 bottom-0 w-[1.5px] bg-rose-400/60 pointer-events-none z-10"></div>

            {/* Paper content */}
            <div className={`flex-1 pl-[88px] pr-8 md:pr-12 py-8 md:py-10 relative ${
              paperStyle === 'lined' ? 'paper-lined' : paperStyle === 'grid' ? 'paper-grid' : 'paper-plain'
            } ${handwrittenFont ? 'font-handwritten' : 'font-friendly text-[15px]'}`}>
              {/* Watermark */}
              <div className="absolute top-4 right-6 md:right-10 flex flex-col items-end opacity-80 select-none">
                <span className="gradient-text text-base md:text-lg font-bold tracking-tight font-sketch-heading">@CodeVerve ACADEMY</span>
                <span className="text-[8px] text-zinc-400 font-mono tracking-widest uppercase">Visual Learning Series</span>
              </div>

              <div className="space-y-5 pt-4">
                {/* Title */}
                <div className="border-b-2 border-red-800/30 pb-1">
                  <input
                    type="text"
                    value={activeSlide.title}
                    onChange={(e) => updateSlideField(activeSlideIndex, 'title', e.target.value)}
                    className="w-full bg-transparent text-2xl md:text-3xl font-black text-rose-900 border-none outline-none focus:ring-0 font-sketch-heading placeholder-rose-800/30 no-print"
                    placeholder="Type header title..."
                  />
                  <h2 className="hidden print-block text-2xl md:text-3xl font-black text-rose-900 font-sketch-heading">
                    {activeSlide.title}
                  </h2>
                </div>

                {/* Paragraph */}
                <div>
                  <textarea
                    value={activeSlide.paragraph}
                    onChange={(e) => updateSlideField(activeSlideIndex, 'paragraph', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-zinc-800 text-base md:text-lg leading-relaxed font-sans placeholder-zinc-400 resize-none no-print"
                    placeholder="Write your notes here..."
                  />
                  <p className="hidden print-block text-zinc-800 text-base md:text-lg leading-relaxed font-sans">
                    {activeSlide.paragraph}
                  </p>
                </div>

                {/* Bullets */}
                <div className="space-y-1.5">
                  {activeSlide.bullets?.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-base md:text-lg">
                      <span className="text-base md:text-lg font-bold mt-0.5 text-emerald-600">✓</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const updatedBullets = [...activeSlide.bullets];
                          updatedBullets[bIdx] = e.target.value;
                          updateSlideField(activeSlideIndex, 'bullets', updatedBullets);
                        }}
                        className="w-full bg-transparent border-none outline-none text-zinc-700 placeholder-zinc-400/50 focus:ring-0 no-print"
                        placeholder="Bullet item..."
                      />
                      <span className="hidden print-block text-zinc-700">{bullet}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const updatedBullets = [...(activeSlide.bullets || []), 'New item'];
                      updateSlideField(activeSlideIndex, 'bullets', updatedBullets);
                    }}
                    className="no-print text-[10px] text-zinc-400 hover:text-zinc-600 font-mono flex items-center gap-1 mt-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add item
                  </button>
                </div>

                {/* Visual selector */}
                <div className="no-print bg-amber-100/50 border border-amber-200 p-2 rounded-xl text-xs flex items-center justify-between gap-2">
                  <span className="font-medium text-zinc-600">Visualization:</span>
                  <select
                    value={activeSlide.visualType}
                    onChange={(e) => updateSlideField(activeSlideIndex, 'visualType', e.target.value)}
                    className="bg-white/80 border border-zinc-300 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-700 focus:outline-none focus:border-purple-400"
                  >
                    <option value="none">None</option>
                    <option value="array">Array</option>
                    <option value="stack">Stack</option>
                    <option value="queue">Queue</option>
                    <option value="tree">Binary Tree</option>
                    <option value="complexity">Complexity</option>
                  </select>
                </div>

                {/* Visual Components */}
                {activeSlide.visualType === 'array' && (
                  <div className="bg-white/60 p-3 md:p-4 rounded-xl border border-dashed border-zinc-300 text-center space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-500 font-sans block">Contiguous Array</span>
                    <div className="flex flex-wrap gap-2 justify-center py-1">
                      {getArrayFromData(activeSlide.visualData).map((val, cellIdx) => (
                        <div key={cellIdx} className="w-12 h-12 md:w-14 md:h-14 bg-amber-50 border-2 border-zinc-700 rounded-xl flex flex-col items-center justify-center font-bold text-base md:text-lg shadow-sm">
                          <span className="text-zinc-800">{val}</span>
                          <span className="text-[7px] text-zinc-400 font-mono -mt-0.5">{cellIdx}</span>
                        </div>
                      ))}
                    </div>
                    <div className="no-print flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-mono pt-1">
                      <span>Values:</span>
                      <input type="text" value={activeSlide.visualData}
                        onChange={(e) => updateSlideField(activeSlideIndex, 'visualData', e.target.value)}
                        className="border border-zinc-300 rounded-lg px-2 py-0.5 bg-white/80 text-zinc-700 text-[11px] font-medium focus:outline-none focus:border-purple-400"
                        placeholder="10, 20, 30" />
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'tree' && (
                  <div className="bg-white/60 p-3 md:p-4 rounded-xl border border-dashed border-zinc-300 flex flex-col items-center space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-500 font-sans block">Binary Tree</span>
                    <svg className="w-52 h-24 md:w-60 md:h-28" viewBox="0 0 200 100">
                      <line x1="100" y1="20" x2="60" y2="50" stroke="#a78bfa" strokeWidth="2" />
                      <line x1="100" y1="20" x2="140" y2="50" stroke="#a78bfa" strokeWidth="2" />
                      <circle cx="100" cy="20" r="14" fill="#fef08a" stroke="#1e293b" strokeWidth="2" />
                      <text x="100" y="24" textAnchor="middle" className="text-[10px] font-bold" fill="#0f172a">
                        {getArrayFromData(activeSlide.visualData)[0] || '50'}
                      </text>
                      <circle cx="60" cy="50" r="14" fill="#bfdbfe" stroke="#1e293b" strokeWidth="2" />
                      <text x="60" y="54" textAnchor="middle" className="text-[10px] font-bold" fill="#0f172a">
                        {getArrayFromData(activeSlide.visualData)[1] || '30'}
                      </text>
                      <circle cx="140" cy="50" r="14" fill="#fbcfe8" stroke="#1e293b" strokeWidth="2" />
                      <text x="140" y="54" textAnchor="middle" className="text-[10px] font-bold" fill="#0f172a">
                        {getArrayFromData(activeSlide.visualData)[2] || '70'}
                      </text>
                    </svg>
                    <div className="no-print flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                      <span>Nodes:</span>
                      <input type="text" value={activeSlide.visualData}
                        onChange={(e) => updateSlideField(activeSlideIndex, 'visualData', e.target.value)}
                        className="border border-zinc-300 rounded-lg px-2 py-0.5 bg-white/80 text-zinc-700 text-[11px] font-medium focus:outline-none focus:border-purple-400"
                        placeholder="50, 30, 70" />
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'stack' && (
                  <div className="bg-white/60 p-3 md:p-4 rounded-xl border border-dashed border-zinc-300">
                    <span className="text-[11px] font-semibold text-zinc-500 font-sans block text-center mb-3">Stack (LIFO)</span>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                      <div className="w-32 min-h-24 bg-amber-50/50 border-2 border-b-4 border-zinc-700 rounded-b-xl flex flex-col-reverse p-1.5 gap-1 justify-start">
                        {liveStack.map((element, eIdx) => (
                          <div key={eIdx} className="w-full py-1 bg-gradient-to-r from-purple-200 to-pink-200 border border-purple-700/30 rounded text-center text-[11px] font-bold font-mono text-zinc-800">
                            {element}
                            {eIdx === liveStack.length - 1 && <span className="text-[7px] text-purple-600 block -mt-0.5">TOP</span>}
                          </div>
                        ))}
                      </div>
                      <div className="no-print flex flex-col gap-1.5 text-[11px]">
                        <div className="flex gap-1">
                          <input type="text" value={newStackItem}
                            onChange={(e) => setNewStackItem(e.target.value)}
                            placeholder="Value" className="border border-zinc-300 rounded-lg px-2 py-1 w-20 bg-white/80 text-zinc-700 text-[11px] focus:outline-none focus:border-blue-400" />
                          <button onClick={pushToLiveStack} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-2.5 py-1 rounded-lg font-semibold text-[10px] transition-all active:scale-[0.98]">Push</button>
                        </div>
                        <button onClick={popFromLiveStack} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white py-1 rounded-lg font-semibold text-[10px] transition-all active:scale-[0.98]">Pop</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'queue' && (
                  <div className="bg-white/60 p-3 md:p-4 rounded-xl border border-dashed border-zinc-300">
                    <span className="text-[11px] font-semibold text-zinc-500 font-sans block text-center mb-3">Queue (FIFO)</span>
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-1 bg-amber-50/60 p-2 border border-zinc-300 rounded-xl min-w-[260px] shadow-inner justify-start overflow-x-auto">
                        <span className="text-[8px] text-zinc-400 font-mono shrink-0 mr-1">← Exit</span>
                        {liveQueue.map((val, qIdx) => (
                          <div key={qIdx} className={`px-2.5 py-1.5 border rounded-lg shadow-sm text-center text-[11px] font-bold font-mono shrink-0 ${
                            qIdx === 0 ? 'bg-blue-100 border-blue-300 text-blue-800' :
                            qIdx === liveQueue.length - 1 ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-zinc-300 text-zinc-600'
                          }`}>
                            <div>{val}</div>
                            <div className="text-[7px] text-zinc-400">{qIdx === 0 ? 'Front' : qIdx === liveQueue.length - 1 ? 'Rear' : qIdx}</div>
                          </div>
                        ))}
                        <span className="text-[8px] text-zinc-400 font-mono shrink-0 ml-1">Enter →</span>
                      </div>
                      <div className="no-print flex gap-1.5 text-[11px]">
                        <input type="text" value={newQueueItem}
                          onChange={(e) => setNewQueueItem(e.target.value)}
                          placeholder="Job" className="border border-zinc-300 rounded-lg px-2 py-1 w-20 bg-white/80 text-zinc-700 text-[11px] focus:outline-none focus:border-blue-400" />
                        <button onClick={enqueueToLiveQueue} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-2.5 py-1 rounded-lg font-semibold text-[10px] transition-all active:scale-[0.98]">Enqueue</button>
                        <button onClick={dequeueFromLiveQueue} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white px-2.5 py-1 rounded-lg font-semibold text-[10px] transition-all active:scale-[0.98]">Dequeue</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'complexity' && (
                  <div className="bg-white/60 p-3 md:p-4 rounded-xl border border-dashed border-zinc-300">
                    <span className="text-[11px] font-semibold text-zinc-500 font-sans block text-center mb-2">Complexity Growth</span>
                    <div className="w-full h-20 md:h-24 flex items-end justify-around bg-zinc-900 rounded-lg p-3 relative">
                      <div className="absolute top-1/4 left-0 right-0 h-px bg-zinc-800" />
                      <div className="absolute top-2/4 left-0 right-0 h-px bg-zinc-800" />
                      <div className="absolute top-3/4 left-0 right-0 h-px bg-zinc-800" />
                      <div className="flex flex-col items-center w-12 z-10">
                        <div className="w-5 bg-emerald-500 h-[8px] rounded-t border border-emerald-400" />
                        <span className="text-[7px] font-mono text-emerald-400 mt-0.5">O(1)</span>
                      </div>
                      <div className="flex flex-col items-center w-12 z-10">
                        <div className="w-5 bg-blue-500 h-6 rounded-t border border-blue-400" />
                        <span className="text-[7px] font-mono text-blue-400 mt-0.5">O(log n)</span>
                      </div>
                      <div className="flex flex-col items-center w-12 z-10">
                        <div className="w-5 bg-amber-500 h-14 rounded-t border border-amber-400" />
                        <span className="text-[7px] font-mono text-amber-400 mt-0.5">O(n)</span>
                      </div>
                      <div className="flex flex-col items-center w-12 z-10">
                        <div className="w-5 bg-rose-500 h-20 rounded-t border border-rose-400" />
                        <span className="text-[7px] font-mono text-rose-400 mt-0.5">O(n²)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Code block */}
                {activeSlide.code && (
                  <div className="mt-3 bg-zinc-950 p-3 md:p-4 rounded-xl border border-zinc-800 shadow-lg">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2 no-print">
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <FileCode className="w-3 h-3" /> code.cpp
                      </span>
                    </div>
                    <textarea
                      value={activeSlide.code}
                      onChange={(e) => updateSlideField(activeSlideIndex, 'code', e.target.value)}
                      rows={4}
                      className="w-full bg-transparent border-none outline-none focus:ring-0 text-zinc-300 text-[11px] leading-relaxed font-mono resize-none no-print"
                    />
                    <pre className="hidden print-block text-zinc-300 text-[11px] font-mono whitespace-pre-wrap">
                      {activeSlide.code}
                    </pre>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-10 text-center border-t border-zinc-300/30 pt-3 opacity-40 no-print">
                <p className="text-[10px] font-mono text-zinc-500">Slide-to-Sketch Studio &copy; 2026</p>
              </div>
            </div>

            {/* Page number */}
            <div className="absolute bottom-3 right-4 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200 font-mono text-[9px] text-zinc-500 pointer-events-none select-none shadow-sm z-10">
              {activeSlideIndex + 1} / {slides.length}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="no-print border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-[11px] text-zinc-600">
          <p>&copy; 2026 <span className="gradient-text font-medium">@CodeVerve ACADEMY</span></p>
          <p className="font-mono">Built with React + Vite + Tailwind</p>
        </div>
      </footer>
    </div>
  );
}
