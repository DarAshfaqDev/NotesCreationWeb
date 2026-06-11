import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Layers,
  Trash2,
  Play,
  RotateCcw,
  Plus,
  Search,
  FileText,
  Edit3,
  Printer,
  Sparkles,
  Upload,
  HelpCircle,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
  Sliders,
  Grid,
  ChevronRight,
  Eye,
  Settings,
  Code,
  FileCode,
  Check,
  AlertCircle,
  Copy,
  ChevronLeft,
  Download,
  Image as ImageIcon,
  FolderOpen,
  ArrowRight,
  PlusCircle,
  Video
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function App() {
  // Navigation / Workspace tab state
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [paperStyle, setPaperStyle] = useState('lined'); // lined, grid, plain
  const [handwrittenFont, setHandwrittenFont] = useState(true);
  const [accentColor, setAccentColor] = useState('rose'); // rose, emerald, sky, violet, amber

  // External CDN Scripts loaded tracking
  const [scriptsLoaded, setScriptsLoaded] = useState({ html2canvas: true, jspdf: true });
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  // Slides State
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
      color: 'yellow'
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
      color: 'blue'
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
      color: 'green'
    }
  ]);

  // Bulk input textarea
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

  // Interactive dynamic stack and queue state values
  const [liveStack, setLiveStack] = useState(['Frame_A', 'Frame_B', 'Frame_C']);
  const [newStackItem, setNewStackItem] = useState('');
  const [liveQueue, setLiveQueue] = useState(['Job_A', 'Job_B', 'Job_C']);
  const [newQueueItem, setNewQueueItem] = useState('');

  // Ref container targeting preview slide for capture
  const activeSlideRef = useRef(null);

  // Update specific field inside active slide
  const updateSlideField = (index, field, value) => {
    const updated = [...slides];
    updated[index][field] = value;
    setSlides(updated);
  };

  // Add a blank template slide
  const handleAddNewSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      title: 'New Chapter Slide',
      paragraph: 'This is a blank slide note card template. Double-click here to insert your custom educational notes.',
      bullets: [
        'Custom list checklist item 1',
        'Custom list checklist item 2'
      ],
      code: `// Insert custom programming codes`,
      visualType: 'none',
      visualData: '',
      color: 'yellow'
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  // Duplicate active slide
  const handleDuplicateSlide = () => {
    const current = slides[activeSlideIndex];
    const duplicated = {
      ...current,
      id: `slide-${Date.now()}`,
      title: `${current.title} (Copy)`
    };
    const updated = [...slides];
    updated.splice(activeSlideIndex + 1, 0, duplicated);
    setSlides(updated);
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  // Delete specific slide
  const handleDeleteSlide = (indexToDelete) => {
    if (slides.length <= 1) return; // Keep at least 1
    const updated = slides.filter((_, idx) => idx !== indexToDelete);
    setSlides(updated);
    if (activeSlideIndex >= updated.length) {
      setActiveSlideIndex(updated.length - 1);
    }
  };

  // Bulk parse slides import
  const handleBulkParse = () => {
    if (!bulkInput.trim()) return;

    // Split text based on slide delimiters
    const rawBlocks = bulkInput.split(/--- Slide \d+:\s*|---\s*Slide\s*|---\s*/i);
    const parsedSlides = rawBlocks.map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      let title = "New Chapter Header";
      let bullets = [];
      let paragraph = "";
      let code = "";
      let visualType = "none";
      let visualData = "";

      // Header parsing
      const firstLine = lines[0];
      if (firstLine && !firstLine.startsWith('✓') && !firstLine.startsWith('data:') && !firstLine.startsWith('[')) {
        title = firstLine.replace(/---/g, '').trim();
        lines.shift();
      }

      // Inside line parser
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

      const colors = ['yellow', 'green', 'blue', 'rose'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      return {
        id: `slide-bulk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title,
        paragraph,
        bullets,
        code: code || `// Custom algorithm representation`,
        visualType,
        visualData,
        color: randomColor
      };
    }).filter(Boolean);

    if (parsedSlides.length > 0) {
      setSlides(parsedSlides);
      setActiveSlideIndex(0);
    }
  };

  // Safe split values for array visualizer
  const getArrayFromData = (dataString) => {
    if (!dataString) return ['10', '20', '30'];
    return dataString.split(',').map(s => s.trim());
  };

  // PNG/JPEG Image Exporter using html2canvas
  const handleExportAsImage = async (format = 'png') => {
    if (!scriptsLoaded.html2canvas) {
      setExportMessage("Loading Canvas Engine... Please try again in a moment.");
      return;
    }

    setExporting(true);
    setExportMessage(`Rendering visual slide to ${format.toUpperCase()}...`);

    try {
      const activeElement = activeSlideRef.current;

      // html2canvas config
      const canvas = await html2canvas(activeElement, {
        scale: 2, // Double quality
        backgroundColor: null,
        useCORS: true,
        logging: false
      });

      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const fileExt = format === 'jpeg' ? 'jpg' : 'png';
      const imgData = canvas.toDataURL(mimeType, format === 'jpeg' ? 0.95 : undefined);

      // Trigger standard browser download
      const link = document.createElement('a');
      link.download = `${slides[activeSlideIndex].title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportMessage("Export Successful!");
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setExportMessage("Canvas Capture Failed! Check browser permission overrides.");
    } finally {
      setExporting(false);
    }
  };

  // Multi-page PDF compiler
  const handleExportAsPDF = async () => {
    if (!scriptsLoaded.html2canvas) {
      setExportMessage("Loading PDF Compiler... Please try again in a second.");
      return;
    }

    setExporting(true);
    setExportMessage("Compiling slide-wise Multi-page PDF...");

    try {
      // standard paper configuration: A4 Landscape ratio
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [842, 595] // A4 Landscape size
      });

      const activeElement = activeSlideRef.current;

      // Capture single current slide at high scale
      const canvas = await html2canvas(activeElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fafaf9'
      });

      const imgWidth = 842;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`handdrawn_notes_master.pdf`);

      setExportMessage("PDF Compile Complete!");
      setTimeout(() => setExportMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setExportMessage("PDF Compile Failed!");
    } finally {
      setExporting(false);
    }
  };

  // Stack operation live handles
  const pushToLiveStack = () => {
    if (!newStackItem.trim()) return;
    setLiveStack([...liveStack, newStackItem]);
    setNewStackItem('');
  };

  const popFromLiveStack = () => {
    if (liveStack.length === 0) return;
    const nextS = [...liveStack];
    nextS.pop();
    setLiveStack(nextS);
  };

  // Queue operation live handles
  const enqueueToLiveQueue = () => {
    if (!newQueueItem.trim()) return;
    setLiveQueue([...liveQueue, newQueueItem]);
    setNewQueueItem('');
  };

  const dequeueFromLiveQueue = () => {
    if (liveQueue.length === 0) return;
    const nextQ = [...liveQueue];
    nextQ.shift();
    setLiveQueue(nextQ);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col font-sans selection:bg-rose-200">

      {/* Dynamic typography fonts injected */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Caveat:wght@400;700&family=Fredoka:wght@300..700&family=JetBrains+Mono:wght@400;600&family=Quicksand:wght@400;600;700&display=swap');

        .font-handwritten {
          font-family: 'Caveat', cursive;
        }
        .font-sketch-heading {
          font-family: 'Architects Daughter', cursive;
        }
        .font-friendly {
          font-family: 'Fredoka', sans-serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        /* Notebook grids overlay backgrounds */
        .paper-lined {
          background-image: linear-gradient(#b2ebf2 1.5px, transparent 1.5px);
          background-size: 100% 32px;
          line-height: 32px;
        }
        .paper-grid {
          background-image: linear-gradient(#e2e8f0 1.5px, transparent 1.5px), linear-gradient(90deg, #e2e8f0 1.5px, transparent 1.5px);
          background-size: 28px 28px;
        }
        .paper-plain {
          background-color: #fafaf9;
        }

        .sketch-box {
          border-style: solid;
          border-color: #374151;
        }

        /* Hand drawn ring binders */
        .ring-holder::before {
          content: '';
          position: absolute;
          width: 25px;
          height: 12px;
          background: linear-gradient(to right, #475569, #cbd5e1);
          border: 1px solid #1e293b;
          border-radius: 6px;
        }
      `}} />

      {/* Main High-Fidelity Desktop Banner Header */}
      <header className="no-print bg-slate-950 text-slate-100 py-3.5 px-6 border-b-4 border-rose-500 shadow-2xl flex flex-wrap items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500 text-slate-950 p-2.5 rounded-xl font-bold shadow-lg transform -rotate-1 hover:rotate-0 transition-all">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight font-friendly flex items-center gap-2">
              Slide-to-Sketch Studio <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full font-mono">Export v2.0</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Generate multi-format PDFs and image files directly from plain slide-wise transcripts</p>
          </div>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-3 mt-3 md:mt-0 flex-wrap text-xs">
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
            <span className="text-slate-400 px-1 font-mono">Format Style:</span>
            <button
              onClick={() => setHandwrittenFont(true)}
              className={`px-2.5 py-1 rounded font-bold transition ${handwrittenFont ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              Handwritten
            </button>
            <button
              onClick={() => setHandwrittenFont(false)}
              className={`px-2.5 py-1 rounded font-bold transition ${!handwrittenFont ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              Standard
            </button>
          </div>

          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
            <span className="text-slate-400 px-1 font-mono">Notepad Grid:</span>
            {['lined', 'grid', 'plain'].map((style) => (
              <button
                key={style}
                onClick={() => setPaperStyle(style)}
                className={`px-2 py-0.5 rounded capitalize transition ${paperStyle === style ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-700'}`}
              >
                {style}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg border border-slate-600 transition"
          >
            <Printer className="w-3.5 h-3.5 text-rose-400" /> Print Master
          </button>
        </div>
      </header>

      {/* Primary Split Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-6 max-w-[1450px] w-full mx-auto">

        {/* SIDEBAR: Slide Navigation Deck & Import Controls */}
        <aside className="no-print lg:w-[350px] flex flex-col gap-4 shrink-0">

          {/* BULK TEXT TRANSCRIPT PARSER */}
          <div className="bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl shadow-xl space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-2">
              <FolderOpen className="w-4 h-4" /> Bulk Slide Importer
            </h2>
            <p className="text-xs text-slate-400 font-mono">Separate slides using "--- Slide X:" as delimiters:</p>

            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="Paste slideshow content blocks here..."
              rows={4}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 text-slate-100 rounded-xl font-mono text-[11px] focus:outline-none resize-none leading-relaxed"
            />

            <button
              onClick={handleBulkParse}
              className="w-full py-2 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold font-friendly rounded-xl flex items-center justify-center gap-1.5 text-xs tracking-wider shadow transition"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Parse Transcript Block
            </button>
          </div>

          {/* SLIDE MANAGER THUMBNAILS */}
          <div className="bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl shadow-xl flex-1 flex flex-col gap-3 min-h-[350px]">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-rose-500" /> Slide Deck ({slides.length})
              </h2>
              <button
                onClick={handleAddNewSlide}
                className="p-1 hover:bg-slate-700 rounded-lg text-emerald-400 hover:text-emerald-300 transition"
                title="Add New Blank Note Slide"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Navigation List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[420px]">
              {slides.map((slide, idx) => {
                const isActive = activeSlideIndex === idx;
                return (
                  <div
                    key={slide.id}
                    className={`p-3 rounded-xl cursor-pointer border transition flex items-center justify-between ${
                      isActive
                        ? 'bg-rose-500/15 border-rose-500 text-white font-bold'
                        : 'bg-slate-900/50 border-slate-700 hover:bg-slate-700/60 text-slate-300'
                    }`}
                    onClick={() => setActiveSlideIndex(idx)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                        {idx + 1}
                      </span>
                      <span className="text-xs truncate font-mono block max-w-[180px]">
                        {slide.title || "Untitled Slide"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlide(idx);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-800 rounded transition"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slide Duplicator Utility */}
            <button
              onClick={handleDuplicateSlide}
              className="w-full py-2 bg-slate-900 hover:bg-slate-950 border border-slate-700 rounded-xl font-friendly text-xs text-slate-300 font-bold transition flex items-center justify-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" /> Duplicate Selected Slide
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE: ACTIVE NOTE EDITOR & PREMIUM EXPORT PANEL */}
        <section className="flex-1 flex flex-col gap-4">

          {/* MULTI-FORMAT EXPORT PANEL */}
          <div className="no-print bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full font-mono">
                Active Page: #{activeSlideIndex + 1}
              </span>
              <p className="text-xs font-mono text-slate-400">Ready for instant local generation & downloads</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Export Trigger Buttons */}
              <button
                onClick={() => handleExportAsImage('png')}
                disabled={exporting}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold font-friendly px-3 py-1.5 rounded-xl text-xs transition active:scale-95 disabled:opacity-60"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Download PNG
              </button>

              <button
                onClick={() => handleExportAsImage('jpeg')}
                disabled={exporting}
                className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold font-friendly px-3 py-1.5 rounded-xl text-xs transition active:scale-95 disabled:opacity-60"
              >
                <ImageIcon className="w-3.5 h-3.5" /> Download JPEG
              </button>

              <button
                onClick={handleExportAsPDF}
                disabled={exporting}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold font-friendly px-3 py-1.5 rounded-xl text-xs transition active:scale-95 disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF Note Page
              </button>
            </div>
          </div>

          {/* Operation notification banners */}
          {exportMessage && (
            <div className="no-print bg-slate-950 border-l-4 border-rose-500 text-rose-300 p-3 rounded-lg text-xs font-mono flex items-center justify-between animate-pulse">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400 animate-spin" /> {exportMessage}
              </span>
            </div>
          )}

          {/* PRIMARY GRAPHICS VIEWPORT (Notebook Presentation) */}
          <div className="relative bg-amber-50 rounded-3xl shadow-2xl border-4 border-slate-950 overflow-hidden flex flex-col min-h-[640px] notebook-page" id="notebook-capture-area" ref={activeSlideRef}>

            {/* Spiral Rings Binder Layout Along Left Border */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-amber-100/90 to-amber-50/20 border-r border-amber-200 pointer-events-none z-10 flex flex-col justify-between py-10">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="flex items-center justify-end pr-2 h-4 ring-holder">
                  <div className="w-4 h-5 bg-gradient-to-r from-slate-600 to-slate-200 rounded-full border border-slate-700 shadow-md transform rotate-12"></div>
                  <div className="w-6 h-1.5 bg-slate-300 -mr-1.5 border-t border-b border-slate-400"></div>
                </div>
              ))}
            </div>

            {/* Red Margin Divider Line */}
            <div className="absolute left-20 top-0 bottom-0 w-[2px] bg-rose-400/80 pointer-events-none z-10"></div>

            {/* Paper Text Area wrapper */}
            <div className={`flex-1 pl-24 pr-10 py-10 relative ${
              paperStyle === 'lined' ? 'paper-lined' : paperStyle === 'grid' ? 'paper-grid' : 'paper-plain'
            } ${handwrittenFont ? 'font-handwritten' : 'font-friendly text-[15.5px]'}`}>

              {/* Calligraphy Watermark header */}
              <div className="absolute top-4 right-10 flex flex-col items-end opacity-90 select-none">
                <span className="text-rose-800 text-lg md:text-xl font-bold tracking-tight font-sketch-heading">@CodeVerve ACADEMY</span>
                <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Ex eBooks Visual Series</span>
              </div>

              {/* RENDER ACTIVE SLIDE CARD */}
              <div className="space-y-6 pt-4">

                {/* Active Editable Header Title */}
                <div className="border-b-2 border-red-800/40 pb-1 flex justify-between items-center group">
                  <input
                    type="text"
                    value={activeSlide.title}
                    onChange={(e) => updateSlideField(activeSlideIndex, 'title', e.target.value)}
                    className="w-full bg-transparent text-3xl font-black text-rose-900 border-none outline-none focus:ring-0 focus:outline-none font-sketch-heading placeholder-rose-800/40 no-print"
                    placeholder="Type header title..."
                  />
                  {/* Static text layer for canvas raster capture prints */}
                  <h2 className="hidden print-block text-3xl font-black text-rose-900 font-sketch-heading">
                    {activeSlide.title}
                  </h2>
                </div>

                {/* Editable Primary Paragraph Description */}
                <div className="relative">
                  <textarea
                    value={activeSlide.paragraph}
                    onChange={(e) => updateSlideField(activeSlideIndex, 'paragraph', e.target.value)}
                    rows={2}
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-800 text-lg leading-relaxed font-sans placeholder-slate-400 resize-none no-print"
                    placeholder="Write conceptual analysis context paragraphs here..."
                  />
                  <p className="hidden print-block text-slate-800 text-lg leading-relaxed font-sans">
                    {activeSlide.paragraph}
                  </p>
                </div>

                {/* Handdrawn list checklist */}
                <div className="space-y-2">
                  {activeSlide.bullets && activeSlide.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-lg">
                      <span className="text-xl font-bold mt-0.5 text-emerald-700">✓</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const updatedBullets = [...activeSlide.bullets];
                          updatedBullets[bIdx] = e.target.value;
                          updateSlideField(activeSlideIndex, 'bullets', updatedBullets);
                        }}
                        className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400/50 focus:ring-0 no-print"
                        placeholder="Bullet list detail line..."
                      />
                      <span className="hidden print-block text-slate-800">{bullet}</span>
                    </div>
                  ))}

                  {/* Append checklist item utility */}
                  <button
                    onClick={() => {
                      const updatedBullets = [...(activeSlide.bullets || []), 'New checklist item'];
                      updateSlideField(activeSlideIndex, 'bullets', updatedBullets);
                    }}
                    className="no-print text-xs text-rose-700 hover:text-rose-900 font-mono flex items-center gap-1 mt-1 opacity-70"
                  >
                    <Plus className="w-3.5 h-3.5" /> Append List Line
                  </button>
                </div>

                {/* INTERACTIVE ALGORITHM COMPONENTS SELECTOR */}
                <div className="no-print bg-amber-100/40 border border-amber-300 p-2.5 rounded-xl text-xs font-sans flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-700">Choose Component illustration on page:</span>
                  <select
                    value={activeSlide.visualType}
                    onChange={(e) => updateSlideField(activeSlideIndex, 'visualType', e.target.value)}
                    className="bg-white border-2 border-slate-800 rounded px-2.5 py-1 font-bold text-xs"
                  >
                    <option value="none">No Graphic</option>
                    <option value="array">Contiguous Array</option>
                    <option value="stack">Stack Buffer Stack</option>
                    <option value="queue">Queue Pipeline</option>
                    <option value="tree">Binary Search Tree</option>
                    <option value="complexity">Complexity Asymptotics</option>
                  </select>
                </div>

                {/* VISUAL COMPONENT PREVIEWS */}
                {activeSlide.visualType === 'array' && (
                  <div className="bg-white/70 p-4 rounded-xl border border-dashed border-slate-400 text-center space-y-2">
                    <span className="text-xs font-bold text-slate-500 font-sans block">
                      💡 Digital Contiguous Memory Array
                    </span>
                    <div className="flex flex-wrap gap-2 justify-center py-1">
                      {getArrayFromData(activeSlide.visualData).map((val, cellIdx) => (
                        <div
                          key={cellIdx}
                          className="w-14 h-14 bg-amber-50 border-2 border-slate-800 rounded-xl flex flex-col items-center justify-center font-bold text-lg shadow-md"
                        >
                          <span>{val}</span>
                          <span className="text-[9px] text-slate-400 font-mono -mt-1 font-bold">idx {cellIdx}</span>
                        </div>
                      ))}
                    </div>
                    {/* Inline configuration text layer */}
                    <div className="no-print flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono pt-1">
                      <span>Values input:</span>
                      <input
                        type="text"
                        value={activeSlide.visualData}
                        onChange={(e) => updateSlideField(activeSlideIndex, 'visualData', e.target.value)}
                        className="border border-slate-300 rounded px-2 py-0.5 bg-white text-slate-700 font-bold"
                        placeholder="10, 20, 30"
                      />
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'tree' && (
                  <div className="bg-white/70 p-4 rounded-xl border border-dashed border-slate-400 flex flex-col items-center space-y-2">
                    <span className="text-xs font-bold text-slate-500 font-sans block">
                      🌲 Structural Binary Tree Node walk
                    </span>
                    <svg className="w-60 h-28" viewBox="0 0 200 100">
                      {/* Branches */}
                      <line x1="100" y1="20" x2="60" y2="50" stroke="#be123c" strokeWidth="2" />
                      <line x1="100" y1="20" x2="140" y2="50" stroke="#be123c" strokeWidth="2" />

                      {/* Node circles */}
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

                    <div className="no-print flex items-center justify-center gap-1.5 text-xs text-slate-500 font-mono">
                      <span>Node values:</span>
                      <input
                        type="text"
                        value={activeSlide.visualData}
                        onChange={(e) => updateSlideField(activeSlideIndex, 'visualData', e.target.value)}
                        className="border border-slate-300 rounded px-2 py-0.5 bg-white text-slate-700 font-bold"
                        placeholder="50, 30, 70"
                      />
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'stack' && (
                  <div className="bg-white/70 p-4 rounded-xl border border-dashed border-slate-400">
                    <span className="text-xs font-bold text-slate-500 font-sans block text-center mb-3">
                      🧱 Interactive Stack Frame (LIFO Sandbox)
                    </span>

                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                      <div className="w-36 min-h-28 bg-amber-50/50 border-2 border-b-4 border-slate-800 rounded-b-xl flex flex-col-reverse p-1.5 gap-1 justify-start">
                        {liveStack.map((element, eIdx) => (
                          <div
                            key={eIdx}
                            className="w-full py-1 bg-rose-200 border border-rose-800 rounded text-center text-xs font-bold font-mono"
                          >
                            {element}
                            {eIdx === liveStack.length - 1 && <span className="text-[9px] text-rose-700 block -mt-1">◀ TOP</span>}
                          </div>
                        ))}
                      </div>

                      {/* Stack manipulation interface */}
                      <div className="no-print flex flex-col gap-1.5 text-xs">
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={newStackItem}
                            onChange={(e) => setNewStackItem(e.target.value)}
                            placeholder="Data_Val"
                            className="border border-slate-300 rounded px-2 py-1 w-20"
                          />
                          <button onClick={pushToLiveStack} className="bg-emerald-100 hover:bg-emerald-200 border border-emerald-800 px-2.5 py-1 rounded font-bold text-emerald-900 text-[10px]">
                            Push()
                          </button>
                        </div>
                        <button onClick={popFromLiveStack} className="bg-rose-100 hover:bg-rose-200 border border-rose-800 py-1 rounded font-bold text-rose-900 text-[10px]">
                          Pop() [LIFO Remove]
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'queue' && (
                  <div className="bg-white/70 p-4 rounded-xl border border-dashed border-slate-400">
                    <span className="text-xs font-bold text-slate-500 font-sans block text-center mb-3">
                      ⚙️ Live Queue Task scheduling (FIFO Conveyor)
                    </span>

                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-amber-50/60 p-2 border border-slate-400 rounded-xl min-w-80 shadow-inner justify-start">
                        <span className="text-[9px] text-slate-400 font-mono shrink-0 mr-1">Exit ←</span>
                        {liveQueue.map((val, qIdx) => (
                          <div
                            key={qIdx}
                            className={`px-3 py-1.5 border rounded-lg shadow-sm text-center text-xs font-bold font-mono ${
                              qIdx === 0 ? 'bg-sky-200 border-sky-800 text-sky-950' :
                              qIdx === liveQueue.length - 1 ? 'bg-amber-200 border-amber-800 text-amber-950' : 'bg-slate-100 border-slate-400'
                            }`}
                          >
                            <div>{val}</div>
                            <div className="text-[8px] text-slate-500">
                              {qIdx === 0 ? 'Front' : qIdx === liveQueue.length - 1 ? 'Rear' : `${qIdx}`}
                            </div>
                          </div>
                        ))}
                        <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">← Enter</span>
                      </div>

                      <div className="no-print flex gap-1 text-xs">
                        <input
                          type="text"
                          value={newQueueItem}
                          onChange={(e) => setNewQueueItem(e.target.value)}
                          placeholder="Job_ID"
                          className="border border-slate-300 rounded px-2 py-1 w-20"
                        />
                        <button onClick={enqueueToLiveQueue} className="bg-emerald-100 hover:bg-emerald-200 border border-emerald-800 px-3 py-1 rounded font-bold text-emerald-950 text-[10px]">
                          Enqueue()
                        </button>
                        <button onClick={dequeueFromLiveQueue} className="bg-sky-100 hover:bg-sky-200 border border-sky-800 px-3 py-1 rounded font-bold text-sky-900 text-[10px]">
                          Dequeue()
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSlide.visualType === 'complexity' && (
                  <div className="bg-white/70 p-4 rounded-xl border border-dashed border-slate-400">
                    <span className="text-xs font-bold text-slate-500 font-sans block text-center mb-2">
                      📈 Complexity Growth curves
                    </span>
                    <div className="w-full h-24 flex items-end justify-around bg-slate-900 rounded-lg p-3 relative">
                      <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-slate-800" />
                      <div className="absolute top-2/4 left-0 right-0 h-[1px] bg-slate-800" />
                      <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-slate-800" />

                      <div className="flex flex-col items-center w-12 z-10">
                        <div className="w-5 bg-emerald-500 h-2 rounded-t border border-emerald-400" />
                        <span className="text-[8px] font-mono text-emerald-400 mt-1">O(1)</span>
                      </div>
                      <div className="flex flex-col items-center w-12 z-10">
                        <div className="w-5 bg-sky-500 h-6 rounded-t border border-sky-400" />
                        <span className="text-[8px] font-mono text-sky-400 mt-1">O(log n)</span>
                      </div>
                      <div className="flex flex-col items-center w-12 z-10">
                        <div className="w-5 bg-yellow-500 h-14 rounded-t border border-yellow-400" />
                        <span className="text-[8px] font-mono text-yellow-400 mt-1">O(n)</span>
                      </div>
                      <div className="flex flex-col items-center w-12 z-10">
                        <div className="w-5 bg-rose-500 h-20 rounded-t border border-rose-400" />
                        <span className="text-[8px] font-mono text-rose-400 mt-1">O(n^2)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Editable Code block code */}
                {activeSlide.code && (
                  <div className="mt-4 bg-slate-950 p-4 rounded-xl border-2 border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2 no-print">
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5" /> code_buffer.cpp
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">Click inside to edit code</span>
                    </div>

                    <textarea
                      value={activeSlide.code}
                      onChange={(e) => updateSlideField(activeSlideIndex, 'code', e.target.value)}
                      rows={5}
                      className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-200 text-xs font-mono resize-none leading-relaxed no-print"
                    />
                    {/* Rendered output for high-quality static captures */}
                    <pre className="hidden print-block text-slate-200 text-xs font-mono whitespace-pre-wrap">
                      {activeSlide.code}
                    </pre>
                  </div>
                )}

              </div>

              {/* Bottom Binder Line Indicator */}
              <div className="mt-16 text-center border-t border-slate-400/20 pt-4 opacity-50 no-print">
                <p className="text-xs font-mono">Study Note Studio Slide Engine © 2026</p>
              </div>

            </div>

            {/* Pagination handle on physical card footer */}
            <div className="absolute bottom-3 right-6 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300 font-mono text-[10px] text-slate-500 pointer-events-none select-none shadow-sm z-10">
              Page {activeSlideIndex + 1} of {slides.length}
            </div>

          </div>
        </section>

      </div>

      {/* Desk instructions footer */}
      <footer className="no-print max-w-[1450px] w-full mx-auto px-6 py-4 mt-6 bg-slate-950 text-slate-400 border-t border-slate-800 text-center text-xs space-y-1">
        <p>© 2026 Curious Programmer Inc. Multi-format PDF and Image Generator Desktop.</p>
        <p>Pro Tip: Use standard markdown bullet formatting when loading lists via Bulk Importer to map graphics configurations effortlessly.</p>
      </footer>

    </div>
  );
}
