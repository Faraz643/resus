import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, FileText, Camera, Globe, Braces, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { ResusLogo } from './ResusLogo';

interface CommandItem {
  id: string;
  command: string;
  title: string;
  description: string;
  category: string;
  result: string;
  detail: string;
  icon: React.ReactNode;
}

const DEMO_COMMANDS: CommandItem[] = [
  {
    id: 'record',
    command: 'screen record',
    title: 'Start Screen Studio Recording',
    description: 'Record 60 FPS demo with smooth auto-zoom, click ripples & keystroke HUD',
    category: 'Screen Studio',
    result: 'Screen Studio ready — Developer Auto-Zoom & ASMR Clicks enabled',
    detail: 'Press Ctrl + G / S / M / F / I anytime during capture to switch zoom presets.',
    icon: <Video className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'pdf',
    command: 'merge pdfs on desktop',
    title: 'Offline PDF Suite — Merge & Compress',
    description: 'Combine, split, OCR, watermark, or compress PDFs locally with zero uploads',
    category: 'PDF Suite',
    result: 'Merged 4 PDFs -> Desktop\\Combined_Brief.pdf (1.4 MB)',
    detail: 'Processed 100% offline in 0.42s using local PDF engine.',
    icon: <FileText className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'screenshot',
    command: 'screenshot mode',
    title: 'Rapid Capture Screenshot Mode',
    description: 'Back-to-back full screen [S] or region [R] captures with instant clipboard copy',
    category: 'Rapid Capture',
    result: 'Screenshot Mode active — Press [S] for Full Screen or [R] for Region',
    detail: 'Every capture copies to clipboard and saves automatically to Pictures\\Resus.',
    icon: <Camera className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'browser',
    command: 'open work',
    title: 'Launch Workspace Tab Preset',
    description: 'Open GitHub, Linear, Figma, and Docs together in Chrome or Edge',
    category: 'Browser Control',
    result: 'Opened 4 tabs in Google Chrome (Preset: Work)',
    detail: 'github.com · linear.app · figma.com · notion.so',
    icon: <Globe className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'json',
    command: 'format json',
    title: 'Format & Validate Clipboard JSON',
    description: 'Prettify, minify, or convert JSON payloads directly from your clipboard',
    category: 'Dev Utilities',
    result: 'Formatted 142 lines of JSON and copied back to clipboard',
    detail: 'Valid JSON • Indented with 2 spaces • 0 syntax errors.',
    icon: <Braces className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'ai',
    command: 'rewrite concise',
    title: 'AI Text Rewrite & Summarize',
    description: 'Polish emails, fix grammar, or summarize selected text with one command',
    category: 'Text & AI',
    result: 'Rewritten text copied to clipboard & ready to paste',
    detail: 'Tone: Concise & Professional • 38% shorter.',
    icon: <Sparkles className="w-4 h-4 text-[#292432]" />,
  },
];

export const InteractiveCommandBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [browserMode, setBrowserMode] = useState(false);
  const [activeResult, setActiveResult] = useState<CommandItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEMO_COMMANDS.slice(0, 4);
    return DEMO_COMMANDS.filter(
      (c) =>
        c.command.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [query]);

  const handleRun = (item: CommandItem) => {
    setQuery(item.command);
    setActiveResult(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && filtered.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp' && filtered.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      handleRun(filtered[Math.min(selectedIndex, filtered.length - 1)]);
    } else if (e.key === 'Escape') {
      setQuery('');
      setActiveResult(null);
    }
  };

  return (
    <div className="w-full max-w-[660px] mx-auto">
      {/* Quick try chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <span className="text-xs font-medium text-[#554B5D] mr-1">Try a command:</span>
        {DEMO_COMMANDS.slice(0, 5).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleRun(item)}
            className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-[#F5F0E8]/90 hover:bg-white text-[#292432] border border-[#292432]/12 hover:border-[#B9A2E8] transition-all cursor-pointer shadow-xs"
          >
            {item.command}
          </button>
        ))}
      </div>

      {/* Main Resus Command Bar Replica */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="resus-pill rounded-[28px] overflow-hidden text-left"
      >
        {/* Top Input Capsule Row */}
        <div className="h-[58px] px-4 sm:px-5 flex items-center gap-3.5">
          {/* Logo Tile */}
          <div className="w-9 h-9 rounded-[9px] bg-white border border-[#292432]/10 shadow-sm flex items-center justify-center shrink-0 p-1">
            <ResusLogo className="w-full h-full" tile={false} />
          </div>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
              setActiveResult(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Make something happen..."
            aria-label="Interactive Resus command bar preview"
            className="flex-1 bg-transparent text-[#292432] placeholder-[#554B5D] text-[16.5px] font-medium focus:outline-none min-w-0"
          />

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-[11px] bg-[#F5F0E8]/90 border border-[#827786]/30 text-[11px] font-semibold text-[#292432]">
              In Desktop
            </span>

            <button
              type="button"
              onClick={() => setBrowserMode((v) => !v)}
              title="Toggle Browser Mode"
              className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                browserMode
                  ? 'bg-[#E8DEF6] border-[#B9A2E8] shadow-[0_0_12px_rgba(185,162,232,0.5)]'
                  : 'bg-[#F5F0E8]/90 border-[#827786]/30 hover:bg-[#F5F0E8]'
              }`}
            >
              <Globe className="w-4 h-4 text-[#292432]" />
            </button>

            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActiveResult(null);
              }}
              title="Clear"
              className="w-[28px] h-[28px] rounded-full bg-[#F5F0E8]/90 border border-[#827786]/30 hover:bg-[#F5F0E8] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-[#292432]" />
            </button>
          </div>
        </div>

        {/* Status Drawer when executed */}
        <AnimatePresence mode="wait">
          {activeResult && (
            <motion.div
              key={activeResult.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[#827786]/25 px-5 py-3.5 bg-[#FAF7F2]/65"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#1E6B48] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13.5px] font-semibold text-[#292432]">{activeResult.result}</p>
                  <p className="text-[12px] text-[#554B5D] mt-0.5">{activeResult.detail}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions List Drawer */}
        <div className="border-t border-[#827786]/25 px-4 py-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10.5px] font-bold tracking-wider uppercase text-[#554B5D]">
              {browserMode ? 'Browser Mode Suggestions' : 'Smart Actions'}
            </span>
            <span className="text-[10.5px] font-medium text-[#554B5D]">
              ↑↓ Navigate · ↵ Run
            </span>
          </div>

          <div className="space-y-1">
            {filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedIndex(idx);
                    handleRun(item);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-[11px] border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E8DEF6]/90 border-[#B9A2E8]'
                      : 'bg-transparent border-transparent hover:bg-[#F5F0E8]/85 hover:border-[#827786]/30'
                  }`}
                >
                  <div className="w-8 h-8 rounded-[9px] bg-[#F5F0E8] border border-[#827786]/30 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#292432] truncate">{item.title}</div>
                    <div className="text-[11.5px] text-[#3F3748] truncate">{item.description}</div>
                  </div>
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-[7px] bg-[#F5F0E8] border border-[#827786]/30 text-[10.5px] font-semibold text-[#554B5D] shrink-0">
                    {item.category}
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-[#554B5D]">
                No matching demo command. Try <span className="font-mono font-semibold text-[#292432]">screen record</span> or{' '}
                <span className="font-mono font-semibold text-[#292432]">pdf</span>.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
