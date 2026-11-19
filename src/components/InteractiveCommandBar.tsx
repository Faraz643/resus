import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, FileText, Camera, Globe, Terminal, Volume2, Pin, X, CheckCircle2 } from 'lucide-react';
import { ResusLogo } from './ResusLogo';

export interface CommandItem {
  id: string;
  command: string;
  title: string;
  description: string;
  category: string;
  result: string;
  detail: string;
  icon: React.ReactNode;
}

export const DEMO_COMMANDS: CommandItem[] = [
  {
    id: 'record',
    command: 'screen record',
    title: 'Start Screen Studio Recording',
    description: 'Record 60 FPS demo with smooth auto-zoom, click ripples & keystroke HUD',
    category: 'Screen Studio',
    result: 'Screen Studio ready — 60 FPS Developer Auto-Zoom & ASMR Clicks enabled',
    detail: 'Preset: Developer · Zoom keys: Ctrl + G / S / M / F / I active.',
    icon: <Video className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'pdf',
    command: 'compress pdf contract.pdf',
    title: 'Offline PDF Suite — Extreme Compression',
    description: 'Shrink PDFs by up to 85% locally with zero cloud uploads or data leaks',
    category: 'PDF Suite',
    result: 'Compressed contract.pdf: 14.8 MB → 2.1 MB (86% reduction)',
    detail: 'Processed 100% offline in 0.42s using local PDF engine.',
    icon: <FileText className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'ocr',
    command: 'ocr screen to clipboard',
    title: 'Optical Character Recognition (OCR)',
    description: 'Extract non-selectable text, code snippets & tables directly from screen',
    category: 'OCR & Vision',
    result: 'Extracted 34 lines of code from screen → Copied to clipboard',
    detail: 'Recognized English text with 99.8% precision in 0.18s.',
    icon: <Camera className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'browser',
    command: 'open dev workspace',
    title: 'Launch Workspace Tab Preset',
    description: 'Open GitHub, Linear, Figma, and Docs simultaneously in your browser',
    category: 'Browser Control',
    result: 'Launched Dev Preset (4 tabs) in Google Chrome',
    detail: 'github.com · linear.app · figma.com · localhost:3000',
    icon: <Globe className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'port',
    command: 'kill port 3000',
    title: 'Kill Process by Port / PID',
    description: 'Instantly terminate hung Node, Next.js, Docker, or Python dev servers',
    category: 'Dev Utilities',
    result: 'Killed process node.exe (PID 18420) on port :3000',
    detail: 'Port 3000 successfully freed in 0.08s.',
    icon: <Terminal className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'ripple',
    command: 'click ripple on',
    title: 'ASMR Click Sound & Ripple Feedback',
    description: 'Real-time tactile mouse wave ripples & mechanical switch keystroke audio',
    category: 'Live Feedback',
    result: 'Desktop Ripple & ASMR Click Sounds active',
    detail: 'Synthesizes mechanical switch clicks in real time with zero latency.',
    icon: <Volume2 className="w-4 h-4 text-[#292432]" />,
  },
  {
    id: 'pin',
    command: 'pin window on top',
    title: 'Keep Active Window Always on Top',
    description: 'Pin editors, video calls, or reference documents above all other apps',
    category: 'Window Manager',
    result: 'Pinned Visual Studio Code to Always On Top',
    detail: 'Window frame locked topmost · Toggle anytime via Ctrl + Alt + Space.',
    icon: <Pin className="w-4 h-4 text-[#292432]" />,
  },
];

export const InteractiveCommandBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [browserMode, setBrowserMode] = useState(false);
  const [activeResult, setActiveResult] = useState<CommandItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUserActive, setIsUserActive] = useState(false);
  const [demoCycle, setDemoCycle] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentDemoIndexRef = useRef(0);

  // Dynamic suggestions list: prominently show the active/matched command
  const displayItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      if (!isUserActive) {
        const activeItem = DEMO_COMMANDS[currentDemoIndexRef.current];
        const others = DEMO_COMMANDS.filter((c) => c.id !== activeItem.id);
        return [activeItem, ...others.slice(0, 3)];
      }
      return DEMO_COMMANDS.slice(0, 4);
    }
    const matched = DEMO_COMMANDS.filter(
      (c) =>
        c.command.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
    return matched.length > 0 ? matched.slice(0, 4) : DEMO_COMMANDS.slice(0, 4);
  }, [query, isUserActive, demoCycle]);

  // Live typing animation cycling through the 7 features
  useEffect(() => {
    if (isUserActive) return;

    let isCancelled = false;
    let charIndex = 0;
    const targetItem = DEMO_COMMANDS[currentDemoIndexRef.current];
    const fullText = targetItem.command;

    setActiveResult(null);
    setQuery('');
    setSelectedIndex(0);

    const typeNextChar = () => {
      if (isCancelled) return;

      if (charIndex < fullText.length) {
        charIndex++;
        setQuery(fullText.slice(0, charIndex));
        setSelectedIndex(0);
        typingTimeoutRef.current = setTimeout(typeNextChar, 50 + Math.random() * 25);
      } else {
        // Finished typing. Pause briefly with cursor blinking at the end, then simulate Enter execution
        typingTimeoutRef.current = setTimeout(() => {
          if (isCancelled) return;
          setActiveResult(targetItem);

          // Display the live result drawer for 3.2 seconds
          typingTimeoutRef.current = setTimeout(() => {
            if (isCancelled) return;
            setActiveResult(null);

            // Natural backspace deletion moving cursor back with the letters
            const deleteNextChar = () => {
              if (isCancelled) return;
              if (charIndex > 0) {
                charIndex--;
                setQuery(fullText.slice(0, charIndex));
                typingTimeoutRef.current = setTimeout(deleteNextChar, 22);
              } else {
                currentDemoIndexRef.current = (currentDemoIndexRef.current + 1) % DEMO_COMMANDS.length;
                typingTimeoutRef.current = setTimeout(() => {
                  if (!isCancelled) {
                    setDemoCycle((c) => c + 1);
                  }
                }, 400);
              }
            };
            deleteNextChar();
          }, 3200);
        }, 650);
      }
    };

    typingTimeoutRef.current = setTimeout(typeNextChar, 450);

    return () => {
      isCancelled = true;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [isUserActive, demoCycle]);

  // Pause live animation when user interacts, resume after 8s of inactivity
  const handleUserInteract = () => {
    setIsUserActive(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

    idleTimeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
      currentDemoIndexRef.current = (currentDemoIndexRef.current + 1) % DEMO_COMMANDS.length;
      setDemoCycle((c) => c + 1);
    }, 8000);
  };

  const handleRun = (item: CommandItem) => {
    handleUserInteract();
    setQuery(item.command);
    setActiveResult(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleUserInteract();
    if (e.key === 'ArrowDown' && displayItems.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % displayItems.length);
    } else if (e.key === 'ArrowUp' && displayItems.length > 0) {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
    } else if (e.key === 'Enter' && displayItems.length > 0) {
      e.preventDefault();
      handleRun(displayItems[Math.min(selectedIndex, displayItems.length - 1)]);
    } else if (e.key === 'Escape') {
      setQuery('');
      setActiveResult(null);
    }
  };

  return (
    <div className="w-full max-w-[660px] mx-auto">
      {/* Main Resus Command Bar Replica */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="resus-pill rounded-[28px] overflow-hidden text-left"
      >
        {/* Top Input Capsule Row */}
        <div className="h-[58px] px-4 sm:px-5 flex items-center gap-3">
          {/* Left Controls: Clear (X) Button + Minimal Globe Browser Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setQuery('');
                setActiveResult(null);
              }}
              title="Clear"
              className="w-[28px] h-[28px] rounded-full bg-[#F5F0E8]/90 border border-[#827786]/30 hover:bg-white hover:border-[#FF4500] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-[#292432]" />
            </button>

            <button
              type="button"
              onClick={() => {
                handleUserInteract();
                setBrowserMode((v) => !v);
              }}
              title="Toggle Browser Mode"
              className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                browserMode
                  ? 'bg-[#FFF0EB] border-[#FF4500] text-[#FF4500] shadow-[0_0_12px_rgba(255,69,0,0.45)]'
                  : 'bg-[#F5F0E8]/90 border-[#827786]/30 hover:bg-white hover:border-[#FF4500] text-[#292432]'
              }`}
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>

          {/* Live Typing Input with Caret moving strictly with the letters */}
          <div
            className="flex-1 flex items-center min-w-0 h-full cursor-text"
            onClick={() => {
              handleUserInteract();
              inputRef.current?.focus();
            }}
          >
            {isUserActive ? (
              <input
                ref={inputRef}
                type="text"
                value={query}
                autoFocus
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                  setActiveResult(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Make something happen..."
                aria-label="Interactive Resus command bar"
                className="w-full bg-transparent text-[#292432] placeholder-[#554B5D] text-[16.5px] font-medium focus:outline-none"
              />
            ) : (
              <div className="flex items-center min-w-0 select-none">
                {query.length === 0 ? (
                  <div className="flex items-center">
                    <span className="text-[#554B5D] text-[16.5px] font-medium">
                      Make something happen...
                    </span>
                    <span className="inline-block w-[2px] h-[19px] bg-[#FF4500] animate-pulse ml-1 rounded-full shrink-0" />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-[#292432] text-[16.5px] font-medium tracking-tight whitespace-pre">
                      {query}
                    </span>
                    <span className="inline-block w-[2px] h-[19px] bg-[#FF4500] animate-pulse ml-[1.5px] rounded-full shrink-0" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Controls: In Desktop Context Badge + Logo Squircle Tile */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-[11px] bg-[#F5F0E8]/90 border border-[#827786]/30 text-[11px] font-semibold text-[#292432]">
              In Desktop
            </span>

            <div className="w-9 h-9 rounded-[9px] bg-white border border-[#292432]/10 shadow-sm flex items-center justify-center shrink-0 p-1">
              <ResusLogo className="w-full h-full" tile={false} />
            </div>
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
              className="border-t border-[#827786]/25 px-5 py-3.5 bg-[#FAF7F2]/75"
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
            {displayItems.map((item, idx) => {
              const isSelected =
                idx === selectedIndex ||
                item.command.toLowerCase().startsWith(query.toLowerCase().trim()) ||
                activeResult?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRun(item)}
                  onMouseEnter={() => {
                    handleUserInteract();
                    setSelectedIndex(idx);
                  }}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-[11px] border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFF0EB]/95 border-[#FF4500] shadow-[0_0_10px_rgba(255,69,0,0.14)]'
                      : 'bg-transparent border-transparent hover:bg-[#F5F0E8]/85 hover:border-[#FF4500]/40'
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};
