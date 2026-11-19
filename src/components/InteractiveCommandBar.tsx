import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Video,
  FileText,
  Globe,
  Terminal,
  Volume2,
  X,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react';
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

export interface DemoScene {
  id: string;
  label: string;
  command: string;
  item: CommandItem;
}

export const DEMO_SCENES: DemoScene[] = [
  {
    id: 'browser_preset',
    label: 'Browser Dev Preset',
    command: 'dev',
    item: {
      id: 'browser_preset',
      command: 'dev',
      title: 'Launch "dev" Workspace Preset',
      description: 'Open GitHub, Linear, Figma, and Docs together in Google Chrome',
      category: 'Browser Preset',
      result: 'Launched Dev Workspace Preset (4 tabs) in Google Chrome',
      detail: 'github.com · linear.app · figma.com · docs.google.com',
      icon: <Globe className="w-4 h-4 text-[#FF5722]" />,
    },
  },
  {
    id: 'youtube_search',
    label: 'YouTube Search Query',
    command: 'youtube python programming',
    item: {
      id: 'youtube_search',
      command: 'youtube python programming',
      title: 'Search YouTube: "python programming"',
      description: 'Instant web search query launched directly in Google Chrome',
      category: 'Web Query',
      result: 'Opened YouTube: "python programming" in Google Chrome',
      detail: 'https://www.youtube.com/results?search_query=python+programming',
      icon: <PlayCircle className="w-4 h-4 text-[#E62117]" />,
    },
  },
  {
    id: 'click_ripple',
    label: 'ASMR Clicks & Ripple',
    command: 'click ripple',
    item: {
      id: 'click_ripple',
      command: 'click ripple',
      title: 'Toggle Click Ripple Effect',
      description: 'Real-time tactile mouse wave ripples on desktop clicks',
      category: 'Live Feedback',
      result: 'Desktop Click Ripple & Mechanical ASMR Sound active',
      detail: 'Synthesizes smooth expanding shockwaves on every mouse click.',
      icon: <Volume2 className="w-4 h-4 text-[#292432]" />,
    },
  },
  {
    id: 'screen_record',
    label: 'Screen Studio',
    command: 'developer recording',
    item: {
      id: 'screen_record',
      command: 'developer recording',
      title: 'Developer Screen Recording',
      description: 'Record 60 FPS demo with smooth auto-zoom, click ripples & keystroke HUD',
      category: 'Screen Studio',
      result: 'Screen Studio ready — 60 FPS Developer Auto-Zoom enabled',
      detail: 'Preset: Developer · Zoom keys: Ctrl + G / S / M / F / I active.',
      icon: <Video className="w-4 h-4 text-[#292432]" />,
    },
  },
  {
    id: 'pdf_compress',
    label: 'Offline PDF Suite',
    command: 'compress pdf contract.pdf',
    item: {
      id: 'pdf_compress',
      command: 'compress pdf contract.pdf',
      title: 'Offline PDF Suite — Merge & Compress',
      description: 'Combine, split, OCR, watermark, or compress PDFs locally with zero uploads',
      category: 'PDF Suite',
      result: 'Compressed contract.pdf: 14.8 MB → 2.1 MB (86% reduction)',
      detail: 'Processed 100% offline in 0.42s with zero cloud uploads or data leaks.',
      icon: <FileText className="w-4 h-4 text-[#292432]" />,
    },
  },
  {
    id: 'kill_port',
    label: 'Kill Port',
    command: 'kill port 3000',
    item: {
      id: 'kill_port',
      command: 'kill port 3000',
      title: 'Kill Process by Port / PID',
      description: 'Instantly terminate hung Node, Next.js, Docker, or dev servers',
      category: 'Dev Utilities',
      result: 'Killed process node.exe (PID 18420) on port :3000',
      detail: 'Port 3000 successfully freed in 0.08s.',
      icon: <Terminal className="w-4 h-4 text-[#292432]" />,
    },
  },
];

interface RippleWave {
  id: number;
  x: number;
  y: number;
}

export const InteractiveCommandBar: React.FC = () => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [browserMode, setBrowserMode] = useState(false);
  const [activeResult, setActiveResult] = useState<CommandItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUserActive, setIsUserActive] = useState(false);

  // Ripple effect enabled state (only becomes true after 'click ripple' executes)
  const [isRippleFeatureActive, setIsRippleFeatureActive] = useState(false);

  // Simulated cursor & ripple particles
  const [cursorPos, setCursorPos] = useState({ x: 380, y: 160 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<RippleWave[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.25 });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const userIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeScene = DEMO_SCENES[sceneIndex];

  // Spawn visual ripple wave (called only when ripple effect is active)
  const spawnRipple = (x: number, y: number) => {
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-5), { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 900);
  };

  // Click handler that checks whether ripple feature is active
  const triggerClick = (x: number, y: number, forceRipple = false) => {
    setIsClicking(true);
    if (isRippleFeatureActive || forceRipple) {
      spawnRipple(x, y);
    }
    setTimeout(() => {
      setIsClicking(false);
    }, 160);
  };

  // Suggestions drawer list: keeps active item highlighted with surrounding context
  const displayItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const catalog = DEMO_SCENES.map((s) => s.item);

    if (!q) {
      if (!isUserActive) {
        const curIdx = sceneIndex;
        if (curIdx < 3) return catalog.slice(0, 4);
        return catalog.slice(curIdx - 2, curIdx + 2);
      }
      return catalog.slice(0, 4);
    }

    const matched = catalog.filter(
      (c) =>
        c.command.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
    return matched.length > 0 ? matched.slice(0, 4) : catalog.slice(0, 4);
  }, [query, isUserActive, sceneIndex]);

  // Main Demo Video Animation Timeline
  useEffect(() => {
    if (isUserActive || !isInView) {
      setIsCursorVisible(false);
      return;
    }

    let isCancelled = false;
    const scene = DEMO_SCENES[sceneIndex];
    setIsCursorVisible(true);

    const safeTimeout = (fn: () => void, ms: number) => {
      timelineTimeoutRef.current = setTimeout(() => {
        if (!isCancelled) fn();
      }, ms);
    };

    // Stage 1: Initial state reset
    setQuery('');
    setActiveResult(null);
    setSelectedIndex(0);

    if (scene.id === 'browser_preset') {
      // Starting the loop: reset ripple feature to false until 'click ripple' is typed
      setIsRippleFeatureActive(false);
      setBrowserMode(false);
      setCursorPos({ x: 380, y: 160 });

      // Move cursor to globe button
      safeTimeout(() => {
        setCursorPos({ x: 54, y: 29 }); // Globe icon coordinate

        // Click globe icon (no ripple yet because ripple is not yet activated)
        safeTimeout(() => {
          triggerClick(54, 29, false);
          setBrowserMode(true);

          // Move cursor to input field
          safeTimeout(() => {
            setCursorPos({ x: 135, y: 29 });

            // Type 'dev'
            safeTimeout(() => {
              let charIndex = 0;
              const text = 'dev';
              const typeDev = () => {
                if (isCancelled) return;
                if (charIndex < text.length) {
                  charIndex++;
                  setQuery(text.slice(0, charIndex));
                  safeTimeout(typeDev, 90);
                } else {
                  // Executed: show Dev Preset result
                  safeTimeout(() => {
                    setActiveResult(scene.item);

                    // Hold result drawer
                    safeTimeout(() => {
                      // Move cursor to clear button
                      setCursorPos({ x: 26, y: 29 });
                      safeTimeout(() => {
                        triggerClick(26, 29, false);
                        setQuery('');
                        setActiveResult(null);
                        safeTimeout(() => {
                          setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length);
                        }, 250);
                      }, 400);
                    }, 2400);
                  }, 500);
                }
              };
              typeDev();
            }, 300);
          }, 450);
        }, 600);
      }, 400);
    } else if (scene.id === 'youtube_search') {
      // Scene 2: YouTube Query Search
      setBrowserMode(true);
      setCursorPos({ x: 135, y: 29 });

      safeTimeout(() => {
        let charIndex = 0;
        const text = scene.command; // 'youtube python programming'
        const typeQuery = () => {
          if (isCancelled) return;
          if (charIndex < text.length) {
            charIndex++;
            setQuery(text.slice(0, charIndex));
            safeTimeout(typeQuery, 40);
          } else {
            // Execution
            safeTimeout(() => {
              setActiveResult(scene.item);

              safeTimeout(() => {
                // Clear and reset browser mode
                setCursorPos({ x: 26, y: 29 });
                safeTimeout(() => {
                  triggerClick(26, 29, false);
                  setQuery('');
                  setActiveResult(null);
                  setBrowserMode(false);
                  safeTimeout(() => {
                    setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length);
                  }, 250);
                }, 400);
              }, 2500);
            }, 550);
          }
        };
        typeQuery();
      }, 400);
    } else if (scene.id === 'click_ripple') {
      // Scene 3: Click Ripple & ASMR Clicks Demonstration
      setBrowserMode(false);
      setCursorPos({ x: 135, y: 29 });

      safeTimeout(() => {
        let charIndex = 0;
        const text = scene.command; // 'click ripple'
        const typeRipple = () => {
          if (isCancelled) return;
          if (charIndex < text.length) {
            charIndex++;
            setQuery(text.slice(0, charIndex));
            safeTimeout(typeRipple, 55);
          } else {
            // Execute command -> RIPPLE EFFECT IS NOW ENABLED!
            safeTimeout(() => {
              setActiveResult(scene.item);
              setIsRippleFeatureActive(true); // <--- Activated only now!

              // Showcase cursor clicking in 3 different spots with visible ripple waves
              safeTimeout(() => {
                // Click Spot 1
                setCursorPos({ x: 140, y: 195 });
                safeTimeout(() => {
                  triggerClick(140, 195, true);

                  // Click Spot 2
                  safeTimeout(() => {
                    setCursorPos({ x: 380, y: 140 });
                    safeTimeout(() => {
                      triggerClick(380, 140, true);

                      // Click Spot 3
                      safeTimeout(() => {
                        setCursorPos({ x: 510, y: 210 });
                        safeTimeout(() => {
                          triggerClick(510, 210, true);

                          // Finish ripple scene & advance
                          safeTimeout(() => {
                            setCursorPos({ x: 26, y: 29 });
                            safeTimeout(() => {
                              triggerClick(26, 29, true);
                              setQuery('');
                              setActiveResult(null);
                              safeTimeout(() => {
                                setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length);
                              }, 250);
                            }, 400);
                          }, 900);
                        }, 500);
                      }, 350);
                    }, 500);
                  }, 350);
                }, 450);
              }, 700);
            }, 550);
          }
        };
        typeRipple();
      }, 400);
    } else {
      // Scene 4, 5, 6: Screen Studio, Offline PDF, Kill Port
      setBrowserMode(false);
      setCursorPos({ x: 135, y: 29 });

      safeTimeout(() => {
        let charIndex = 0;
        const text = scene.command;
        const typeStandard = () => {
          if (isCancelled) return;
          if (charIndex < text.length) {
            charIndex++;
            setQuery(text.slice(0, charIndex));
            safeTimeout(typeStandard, 45);
          } else {
            safeTimeout(() => {
              setActiveResult(scene.item);

              safeTimeout(() => {
                setCursorPos({ x: 26, y: 29 });
                safeTimeout(() => {
                  triggerClick(26, 29, isRippleFeatureActive);
                  setQuery('');
                  setActiveResult(null);
                  safeTimeout(() => {
                    setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length);
                  }, 250);
                }, 400);
              }, 2300);
            }, 500);
          }
        };
        typeStandard();
      }, 400);
    }

    return () => {
      isCancelled = true;
      if (timelineTimeoutRef.current) clearTimeout(timelineTimeoutRef.current);
    };
  }, [sceneIndex, isUserActive, isInView]);

  // Handle user manual interaction (pauses video, allows direct typing)
  const handleUserInteract = () => {
    setIsUserActive(true);
    setIsCursorVisible(false);
    if (timelineTimeoutRef.current) clearTimeout(timelineTimeoutRef.current);
    if (userIdleTimeoutRef.current) clearTimeout(userIdleTimeoutRef.current);

    userIdleTimeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
      setIsCursorVisible(true);
      setSceneIndex((prev) => (prev + 1) % DEMO_SCENES.length);
    }, 9000);
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
    <div ref={containerRef} className="w-full max-w-[660px] mx-auto">
      {/* Main Resus Video Simulation Container */}
      <div className="relative">
        {/* Animated Simulated OS Cursor Pointer */}
        {isCursorVisible && !isUserActive && (
          <motion.div
            animate={{
              x: cursorPos.x,
              y: cursorPos.y,
            }}
            transition={{
              duration: 0.55,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute top-0 left-0 pointer-events-none z-50 select-none"
          >
            <motion.div
              animate={{ scale: isClicking ? 0.8 : 1 }}
              transition={{ duration: 0.12 }}
              className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3L10.07 20.97L12.58 13.58L19.97 11.07L3 3Z"
                  fill="#1E1B24"
                  stroke="#FFFFFF"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        )}

        {/* Live Ripple Shockwave Rings */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0.2, opacity: 0.95 }}
            animate={{ scale: 3.4, opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-[#FF5722] bg-[#FF5722]/15 z-40"
            style={{ left: ripple.x, top: ripple.y }}
          />
        ))}

        {/* Main Command Palette Card */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[24px] bg-[#FAF7F2]/95 backdrop-blur-xl border border-[#292432]/10 shadow-[0_22px_55px_rgba(41,36,50,0.14),0_1px_0_rgba(255,255,255,0.85)_inset] overflow-hidden text-left"
        >
          {/* Top Input Capsule Row */}
          <div className="h-[58px] px-4 sm:px-5 flex items-center gap-3">
            {/* Left Controls: Clear (X) + Globe Browser Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  handleUserInteract();
                  setQuery('');
                  setActiveResult(null);
                }}
                title="Clear"
                className="w-[30px] h-[30px] rounded-full bg-white/70 border border-[#827786]/20 hover:bg-white hover:border-[#FF5722] flex items-center justify-center transition-colors cursor-pointer"
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
                    ? 'bg-[#FFF0EB] border-[#FF5722] text-[#FF5722] shadow-[0_0_12px_rgba(255,87,34,0.45)]'
                    : 'bg-white/70 border-[#827786]/20 hover:bg-white hover:border-[#FF5722] text-[#292432]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Input with Natural Moving Caret */}
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
                  placeholder={
                    browserMode
                      ? 'Type websites, presets, or search queries…'
                      : 'Make something happen...'
                  }
                  aria-label="Interactive Resus command bar"
                  className="w-full bg-transparent text-[#292432] placeholder-[#554B5D]/75 text-[16px] font-medium focus:outline-none"
                />
              ) : (
                <div className="flex items-center min-w-0 select-none">
                  {query.length === 0 ? (
                    <span className="text-[#554B5D]/75 text-[16px] font-normal truncate">
                      {browserMode
                        ? 'Type websites, presets, or search queries…'
                        : 'Make something happen...'}
                    </span>
                  ) : (
                    <div className="flex items-center min-w-0">
                      <span className="text-[#292432] text-[16px] font-medium tracking-tight whitespace-pre truncate">
                        {query}
                      </span>
                      <span className="inline-block w-[2px] h-[19px] bg-[#FF5722] animate-pulse ml-[1px] rounded-full shrink-0" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Controls: In Desktop / Browser Mode Badge + Logo Squircle */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span
                className={`hidden sm:inline-flex items-center px-3 py-1 rounded-[10px] border text-[11.5px] font-semibold transition-colors ${
                  browserMode
                    ? 'bg-[#FFF0EB] border-[#FF5722]/30 text-[#FF5722]'
                    : 'bg-white/60 border border-[#827786]/20 text-[#3F3748]'
                }`}
              >
                {browserMode ? 'Browser Mode' : 'In Desktop'}
              </span>

              <div className="w-[34px] h-[34px] rounded-[10px] bg-white border border-[#292432]/10 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center justify-center shrink-0 p-1.5">
                <ResusLogo className="w-full h-full" tile={false} />
              </div>
            </div>
          </div>

          {/* Status Result Drawer when executed */}
          <AnimatePresence mode="wait">
            {activeResult && (
              <motion.div
                key={activeResult.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-[#827786]/15 px-5 py-3 bg-[#FAF7F2]/90"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1E6B48] shrink-0" />
                  <p className="text-[13.5px] font-semibold text-[#292432] truncate">
                    {activeResult.result}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SMART ACTIONS Section */}
          <div className="border-t border-[#827786]/15">
            <div className="px-5 pt-3.5 pb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#554B5D]">
                {browserMode ? 'BROWSER ACTIONS & QUERIES' : 'SMART ACTIONS'}
              </span>
              <span className="text-[11px] font-medium text-[#554B5D]">
                ↑↓ Navigate · ↵ Run
              </span>
            </div>

            <div className="px-3 pb-3 space-y-1.5">
              {displayItems.map((item, idx) => {
                const isSelected =
                  (!isUserActive && activeScene.item.id === item.id) ||
                  (isUserActive &&
                    (selectedIndex === idx || activeResult?.id === item.id));

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRun(item)}
                    onMouseEnter={() => {
                      handleUserInteract();
                      setSelectedIndex(idx);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[16px] text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[1.5px] border-[#FF5722] bg-[#FFF6F3]/95 shadow-[0_0_12px_rgba(255,87,34,0.12)]'
                        : 'border border-transparent bg-transparent hover:bg-white/50 hover:border-[#827786]/20'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-[11px] bg-white/80 border border-[#827786]/20 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-[#292432] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11.5px] text-[#554B5D] truncate leading-tight mt-0.5">
                        {item.description}
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex px-3 py-1 rounded-[9px] bg-white/60 border border-[#827786]/20 text-[11px] font-medium text-[#554B5D] shrink-0">
                      {item.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
