import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileText,
  Video,
  Camera,
  Globe,
  FolderCog,
  LayoutGrid,
  ShieldCheck,
  Keyboard,
  ArrowUpRight,
  Monitor,
  MousePointerClick,
  Volume2,
  X,
  Copy,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { ResusLogo } from './components/ResusLogo';
import { InteractiveCommandBar } from './components/InteractiveCommandBar';
import { WorkflowShowcase } from './components/WorkflowShowcase';
import { PricingSection } from './components/PricingSection';
import { LegalModal, type LegalDocType } from './components/LegalModal';
import { useLatestRelease } from './hooks/useLatestRelease';
import { SITE_CONFIG } from './config/siteConfig';
import { playResusAsmrClick } from './utils/asmrSound';

const FEATURE_CARDS = [
  {
    icon: <FileText className="w-5 h-5 text-[#292432]" />,
    title: 'File & PDF Studio',
    desc: 'Convert images, PDFs, audio, and video locally in seconds. Merge, split, OCR, watermark, or compress with zero cloud uploads.',
    tag: '100% Offline',
  },
  {
    icon: <Video className="w-5 h-5 text-[#292432]" />,
    title: 'Screen Studio',
    desc: 'Record 60 FPS product demos with smooth auto-zoom, click ripple effects, ASMR click audio, and a live keystroke HUD.',
    tag: 'Auto-Zoom',
  },
  {
    icon: <Camera className="w-5 h-5 text-[#292432]" />,
    title: 'Rapid Capture',
    desc: 'Continuous back-to-back full screen or custom region screenshots on a single key press, copied straight to your clipboard.',
    tag: 'Instant',
  },
  {
    icon: <Globe className="w-5 h-5 text-[#292432]" />,
    title: 'Browser Control',
    desc: 'Launch multi-tab workspace presets and instant web searches in Google Chrome or Microsoft Edge from one command.',
    tag: 'Presets',
  },
  {
    icon: <FolderCog className="w-5 h-5 text-[#292432]" />,
    title: 'System & File Automation',
    desc: 'Organize folders, batch-rename or zip archives, toggle system controls, and clean duplicates—from one command.',
    tag: 'Desktop',
  },
  {
    icon: <LayoutGrid className="w-5 h-5 text-[#292432]" />,
    title: 'And Much More',
    desc: 'Dozens of additional utilities—from system cleanup and silent auto-updates to DPAPI-encrypted local security.',
    tag: 'Growing Toolkit',
  },
];

const SHORTCUTS = [
  { keys: ['Ctrl', 'Alt', 'Space'], label: 'Summon Resus Command Bar from anywhere' },
  { keys: ['Ctrl', 'G / S / M / F / I'], label: 'Switch live Screen Studio zoom presets on the fly' },
  { keys: ['S'], label: 'Burst screenshot capture in Screenshot Mode' },
  { keys: ['R'], label: 'Drag custom region capture in Screenshot Mode' },
];

const ZOOM_PRESETS = [
  { name: 'Gentle', key: 'Ctrl+G', scale: '1.20x' },
  { name: 'Subtle', key: 'Ctrl+S', scale: '1.35x' },
  { name: 'Moderate', key: 'Ctrl+M', scale: '1.50x' },
  { name: 'Focused', key: 'Ctrl+F', scale: '1.65x' },
  { name: 'Intense', key: 'Ctrl+I', scale: '1.90x' },
];

export function App() {
  const release = useLatestRelease();
  const [showDodoModal, setShowDodoModal] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>(null);
  const [successLicenseKey, setSuccessLicenseKey] = useState<string | null>(null);
  const [copiedSuccessKey, setCopiedSuccessKey] = useState(false);
  const [activeZoom, setActiveZoom] = useState('Focused');
  const [elapsedSec, setElapsedSec] = useState(42);
  const [isStudioRippleActive, setIsStudioRippleActive] = useState(false);
  const [isStudioAsmrActive, setIsStudioAsmrActive] = useState(false);
  const [studioRipples, setStudioRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const spawnStudioRipple = (clientX: number, clientY: number) => {
    const id = Date.now() + Math.random();
    setStudioRipples((prev) => [...prev.slice(-6), { id, x: clientX, y: clientY }]);
    setTimeout(() => {
      setStudioRipples((prev) => prev.filter((r) => r.id !== id));
    }, 900);
  };

  // Global click feedback when Screen Studio ripple or ASMR is active
  useEffect(() => {
    if (!isStudioRippleActive && !isStudioAsmrActive) return;

    const handleGlobalClick = (e: MouseEvent) => {
      if (isStudioAsmrActive) {
        playResusAsmrClick();
      }
      if (isStudioRippleActive) {
        spawnStudioRipple(e.clientX, e.clientY);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [isStudioRippleActive, isStudioAsmrActive]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const key = params.get('license_key');
      if (key) {
        setSuccessLicenseKey(key);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSec((prev) => (prev + 1) % 3600);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const activePresetObj = ZOOM_PRESETS.find((z) => z.name === activeZoom) ?? ZOOM_PRESETS[3];

  return (
    <div className="min-h-screen aurora-canvas relative selection:bg-[#B9A2E8]/40 selection:text-[#292432]">
      {/* Subtle Film Grain Overlay */}
      <div className="fixed inset-0 film-grain z-0" />

      {/* Ambient Floating Aurora Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-[#FF4500]/22 blur-[120px] animate-aurora-blob" />
        <div
          className="absolute top-20 -right-24 w-[420px] h-[420px] rounded-full bg-[#D9A0B0]/25 blur-[110px] animate-aurora-blob"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-[450px] h-[450px] rounded-full bg-[#B9A2E8]/25 blur-[120px] animate-aurora-blob"
          style={{ animationDelay: '5s' }}
        />
      </div>

      {/* Floating Transparent Frosted Navbar */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <nav className="max-w-5xl mx-auto rounded-full bg-white/25 backdrop-blur-2xl border border-white/55 shadow-[0_8px_32px_rgba(41,36,50,0.08),inset_0_1px_0_rgba(255,255,255,0.65)] px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[9px] bg-white border border-[#292432]/10 shadow-xs flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <ResusLogo className="w-full h-full" tile={false} />
            </div>
            <span className="font-display font-bold text-[17px] text-[#292432]">Resus</span>
            <span className="hidden sm:inline-flex text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#E8DEF6]/80 text-[#292432] border border-[#B9A2E8]/60">
              {release.version}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-[#554B5D]">
            <a href="#features" className="hover:text-[#292432] transition-colors">
              Features
            </a>
            <a href="#workflows" className="hover:text-[#292432] transition-colors">
              Use Cases
            </a>
            <a href="#shortcuts" className="hover:text-[#292432] transition-colors">
              Shortcuts
            </a>
            <a href="#pricing" className="hover:text-[#292432] transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={SITE_CONFIG.releasesPageUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-[13px] font-medium text-[#554B5D] hover:text-[#292432] px-3 py-1.5 rounded-full hover:bg-white/60 transition-colors"
            >
              <span>Releases</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={release.downloadUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#292432] hover:bg-[#3B3447] text-[#F5F0E8] text-[13px] font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.99]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-10 sm:pt-14 pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center">
          {/* Welcome-Card Style Centered Brand Hero Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.06, rotate: -2 }}
              className="w-[88px] h-[88px] rounded-[22px] bg-white border border-[#827786]/25 shadow-[0_22px_45px_-10px_rgba(41,36,50,0.18)] flex items-center justify-center p-2.5 cursor-pointer"
            >
              <ResusLogo className="w-full h-full" tile={false} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-[#292432]/12 shadow-xs mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#1E6B48] animate-pulse" />
            <span className="text-xs font-semibold text-[#292432]">
              {release.version} Available · Windows 10 &amp; 11 (x64)
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-display text-4xl sm:text-6xl lg:text-[66px] font-extrabold text-[#292432] tracking-tight leading-[1.06] max-w-4xl mx-auto"
          >
            Your desktop.
            <br />
            <span className="bg-gradient-to-r from-[#292432] via-[#624B8A] to-[#9B4D6A] bg-clip-text text-transparent">
              On another level.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-6 text-base sm:text-lg text-[#554B5D] max-w-2xl mx-auto leading-relaxed"
          >
            One command. Countless possibilities. Convert files and PDFs offline, record
            studio-grade demos with smooth auto-zoom, capture rapid screenshots, and launch
            browser presets — right from your keyboard.
          </motion.p>

          {/* Primary Download CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <a
              href={release.downloadUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#292432] hover:bg-[#3B3447] text-[#F5F0E8] font-semibold text-[15px] shadow-[0_14px_32px_-8px_rgba(41,36,50,0.38)] transition-all hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>Download for Windows</span>
              <span className="text-xs font-mono opacity-80 bg-white/15 px-2 py-0.5 rounded-md">
                {release.version}
              </span>
            </a>

            <a
              href="#workflows"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F5F0E8]/90 hover:bg-white text-[#292432] border border-[#292432]/15 font-semibold text-[15px] shadow-xs transition-all hover:-translate-y-0.5"
            >
              <span>Explore Use Cases</span>
            </a>
          </motion.div>

          <p className="mt-3 text-xs text-[#827786] font-medium">
            {release.fileSizeLabel} · 7-day full-access free trial · No credit card required
          </p>

          {/* Interactive Live Command Bar */}
          <div className="mt-16 sm:mt-20">
            <h2 className="font-display text-xl sm:text-2xl lg:text-[24px] font-semibold text-[#292432] max-w-2xl mx-auto mb-6 text-center leading-snug tracking-tight">
              Everything you used to open five different apps or websites for—unified into one fast, native Windows command center.
            </h2>
            <InteractiveCommandBar />
          </div>
        </section>

        {/* FEATURES BENTO GRID */}
        <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#554B5D]">
              A Growing Toolkit
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#292432] mt-2">
              Small command. Big possibilities.
            </h2>
            <p className="text-[15px] text-[#554B5D] mt-3">
              Instant offline utilities, smart system automations, and distraction-free developer workflows built right into your keyboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="aurora-card rounded-[20px] p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#E8DEF6]/80 border border-[#B9A2E8]/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#E8DEF6] transition-all duration-200">
                      {card.icon}
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F5F0E8] border border-[#292432]/10 text-[#554B5D]">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#292432] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-[#554B5D]">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SCREEN STUDIO SPOTLIGHT */}
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="aurora-card rounded-[28px] p-7 sm:p-11 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0E0E8] border border-[#D9A0B0]/70 text-xs font-bold text-[#292432]">
                  <span className="w-2 h-2 rounded-full bg-[#9B2C48]" />
                  <span>Built-In Screen Studio</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#292432] leading-tight">
                  Record demos that feel hand-edited—automatically.
                </h2>

                <p className="text-[15px] leading-relaxed text-[#554B5D]">
                  Switch zoom intensities in real time while recording, highlight every click with
                  custom ripples and crisp ASMR click audio, and display a macOS-style keystroke
                  HUD so viewers can follow every shortcut.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/70 border border-[#292432]/10">
                    <Monitor className="w-4 h-4 text-[#292432] mb-2" />
                    <div className="text-xs font-bold text-[#292432]">5 Zoom Presets</div>
                    <div className="text-[11px] text-[#554B5D] mt-0.5">Gentle to Intense</div>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const next = !isStudioRippleActive;
                      setIsStudioRippleActive(next);
                      if (next) {
                        spawnStudioRipple(e.clientX, e.clientY);
                        if (isStudioAsmrActive) playResusAsmrClick();
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isStudioRippleActive
                        ? 'bg-[#FFF0EB] border-2 border-[#FF5722] shadow-[0_0_18px_rgba(255,87,34,0.3)] ring-2 ring-[#FF5722]/20'
                        : 'bg-white/70 hover:bg-white border-[#292432]/10 hover:border-[#FF5722]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <MousePointerClick
                        className={`w-4 h-4 ${
                          isStudioRippleActive ? 'text-[#FF5722]' : 'text-[#292432]'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isStudioRippleActive
                            ? 'bg-[#FF5722] text-white'
                            : 'bg-[#F5F0E8] text-[#554B5D]'
                        }`}
                      >
                        {isStudioRippleActive ? 'Active' : 'Try'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#292432]">Click Ripples</div>
                    <div className="text-[11px] text-[#554B5D] mt-0.5">
                      {isStudioRippleActive ? 'Ripples active on click' : 'Lavender, Rose & Sky'}
                    </div>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const next = !isStudioAsmrActive;
                      setIsStudioAsmrActive(next);
                      if (next) {
                        playResusAsmrClick();
                        if (isStudioRippleActive) spawnStudioRipple(e.clientX, e.clientY);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isStudioAsmrActive
                        ? 'bg-[#FFF0EB] border-2 border-[#FF5722] shadow-[0_0_18px_rgba(255,87,34,0.3)] ring-2 ring-[#FF5722]/20'
                        : 'bg-white/70 hover:bg-white border-[#292432]/10 hover:border-[#FF5722]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Volume2
                        className={`w-4 h-4 ${
                          isStudioAsmrActive ? 'text-[#FF5722]' : 'text-[#292432]'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isStudioAsmrActive
                            ? 'bg-[#FF5722] text-white'
                            : 'bg-[#F5F0E8] text-[#554B5D]'
                        }`}
                      >
                        {isStudioAsmrActive ? 'Active' : 'Try'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#292432]">ASMR Clicks</div>
                    <div className="text-[11px] text-[#554B5D] mt-0.5">
                      {isStudioAsmrActive ? 'Audio active on click' : 'Real-time tactile audio'}
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Studio HUD Preview Mockup */}
              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-[#F5F0E8]/85 via-[#E8DEF6]/80 to-[#F0E0E8]/85 p-6 border border-[#292432]/12 shadow-inner space-y-4">
                  {/* Floating HUD Bar Replica */}
                  <div className="rounded-full bg-[#FAF7F2]/95 border border-[#827786]/35 px-4 py-2.5 shadow-md flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#9B2C48] animate-pulse" />
                      <span className="text-xs font-bold text-[#292432]">REC</span>
                      <span className="font-mono text-xs font-semibold text-[#292432] tabular-nums">
                        {formatTimer(elapsedSec)}
                      </span>
                      <motion.span
                        key={activePresetObj.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-[#B9A2E8]/35 border border-[#B9A2E8] text-[10.5px] font-semibold text-[#292432]"
                      >
                        {activePresetObj.name} · {activePresetObj.scale}
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#F5F0E8] border border-[#827786]/30 text-[11px] font-semibold text-[#292432]">
                        Pause
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#F5F0E8] border border-[#827786]/30 text-[11px] font-semibold text-[#292432]">
                        Shot
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#9B2C48] text-[11px] font-semibold text-[#F5F0E8]">
                        Stop
                      </span>
                    </div>
                  </div>

                  {/* Interactive Zoom Presets Row Replica */}
                  <div className="grid grid-cols-5 gap-2">
                    {ZOOM_PRESETS.map((preset) => {
                      const isActive = preset.name === activeZoom;
                      return (
                        <motion.button
                          key={preset.name}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveZoom(preset.name)}
                          className={`rounded-xl p-2.5 text-center border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#B9A2E8]/45 border-[#B9A2E8] shadow-xs'
                              : 'bg-white/60 hover:bg-white/85 border-white/80'
                          }`}
                        >
                          <div className="text-[11px] font-bold text-[#292432]">{preset.name}</div>
                          <div className="text-[9.5px] font-mono text-[#554B5D] mt-0.5">
                            {preset.key}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOWS BY ROLE */}
        <section id="workflows" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#554B5D]">
              Use Cases
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#292432] mt-2">
              Built for how you actually work{' '}
              <span className="text-base sm:text-lg font-normal text-[#827786] tracking-normal font-sans align-middle inline-block ml-1">
                (but not limited to)
              </span>
            </h2>
            <p className="text-[15px] text-[#554B5D] mt-3">
              See how developers, creators, and teams use Resus every day to save hours of context
              switching.
            </p>
          </div>

          <WorkflowShowcase />
        </section>

        {/* KEYBOARD-FIRST SHORTCUTS */}
        <section id="shortcuts" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="aurora-card rounded-[24px] p-7 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#554B5D] mb-1.5">
                  <Keyboard className="w-4 h-4 text-[#292432]" />
                  <span>Keyboard-First Speed</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#292432]">
                  Zero mouse friction. Instant muscle memory.
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5F0E8] border border-[#292432]/12 text-xs font-semibold text-[#292432]">
                <ShieldCheck className="w-4 h-4 text-[#1E6B48]" />
                <span>DPAPI Local Encryption</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SHORTCUTS.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2, borderColor: 'rgba(185, 162, 232, 0.7)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/70 border border-[#292432]/10 transition-colors"
                >
                  <span className="text-[13.5px] font-medium text-[#292432]">{item.label}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.keys.map((k, ki) => (
                      <React.Fragment key={ki}>
                        <kbd className="kbd-key">{k}</kbd>
                        {ki < item.keys.length - 1 && (
                          <span className="text-xs text-[#827786]">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING & DODO PAYMENTS SECTION */}
        <PricingSection
          downloadUrl={release.downloadUrl}
          version={release.version}
          onOpenDodoModal={() => setShowDodoModal(true)}
        />

        {/* FINAL DOWNLOAD CTA (Visibly Translucent Aurora Card + Larger Crisp Black Logo) */}
        <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="rounded-[28px] bg-gradient-to-br from-[#F5F0E8]/45 via-[#E8DEF6]/40 to-[#F0E0E8]/45 backdrop-blur-2xl border border-white/65 text-[#292432] p-8 sm:p-14 text-center relative overflow-hidden shadow-[0_24px_60px_-12px_rgba(41,36,50,0.14),inset_0_1px_0_rgba(255,255,255,0.75)]"
          >
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#B9A2E8]/35 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#D9A0B0]/35 blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.07, rotate: 2 }}
                className="w-20 h-20 rounded-[20px] bg-white border border-[#827786]/25 p-2.5 mx-auto mb-6 shadow-[0_14px_34px_-6px_rgba(41,36,50,0.16)] flex items-center justify-center"
              >
                <ResusLogo className="w-full h-full" tile={false} />
              </motion.div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-[#292432]">
                Ready to upgrade your Windows workflow?
              </h2>
              <p className="text-[#554B5D] text-[15px] mb-8">
                Download Resus {release.version} for Windows 10 &amp; 11 and start your{' '}
                {SITE_CONFIG.trialDays}-day free trial in under 30 seconds.
              </p>
              <motion.a
                href={release.downloadUrl}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#292432] hover:bg-[#3B3447] text-[#F5F0E8] font-bold text-[15px] shadow-[0_14px_32px_-8px_rgba(41,36,50,0.38)] transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Resus {release.version} (.exe)</span>
              </motion.a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#292432]/10 mt-10 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#554B5D]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-white border border-[#292432]/10 p-0.5 flex items-center justify-center">
              <ResusLogo className="w-full h-full" tile={false} />
            </div>
            <span className="font-semibold text-[#292432]">Resus</span>
            <span>·</span>
            <span>A growing toolkit packed with useful features.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-medium">
            <a href="#features" className="hover:text-[#292432] transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-[#292432] transition-colors">
              Pricing
            </a>
            <a
              href={SITE_CONFIG.releasesPageUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#292432] transition-colors"
            >
              GitHub Releases
            </a>
            <span className="text-[#292432]/20 hidden sm:inline">|</span>
            <button
              type="button"
              onClick={() => setActiveLegalDoc('privacy')}
              className="hover:text-[#292432] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveLegalDoc('terms')}
              className="hover:text-[#292432] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => setActiveLegalDoc('refund')}
              className="hover:text-[#292432] transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <a
              href={`mailto:${SITE_CONFIG.supportEmail}`}
              className="hover:text-[#292432] transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </footer>

      {/* Dodo Payments Checkout Pending Modal (shown if dodoCheckoutUrl is not yet set) */}
      <AnimatePresence>
        {showDodoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#292432]/45 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowDodoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="resus-pill rounded-[24px] max-w-md w-full p-7 relative"
            >
              <button
                type="button"
                onClick={() => setShowDodoModal(false)}
                aria-label="Close modal"
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F0E8] border border-[#827786]/30 flex items-center justify-center hover:bg-white cursor-pointer"
              >
                <X className="w-4 h-4 text-[#292432]" />
              </button>

              <div className="w-11 h-11 rounded-xl bg-white border border-[#292432]/10 p-1.5 mb-4 shadow-xs">
                <ResusLogo className="w-full h-full" tile={false} />
              </div>

              <h3 className="font-display text-xl font-bold text-[#292432] mb-1">
                Resus Pro · Pay Once, Own Forever
              </h3>
              <p className="text-xs font-semibold text-[#8B2346] mb-3">
                Early Bird Offer: Code {SITE_CONFIG.pricing.earlyBirdCouponCode} (First {SITE_CONFIG.pricing.earlyBirdSeatsTotal} Customers)
              </p>
              <div className="rounded-xl bg-[#FAF7F2] p-3.5 border border-[#292432]/10 mb-4 text-xs space-y-1.5 text-[#3F3748]">
                <div className="flex justify-between items-center">
                  <span>Global (USD):</span>
                  <span className="font-bold text-[#292432] text-sm">
                    ${SITE_CONFIG.pricing.usd.earlyBirdPrice}{' '}
                    <span className="line-through text-[#827786] font-normal text-xs">
                      ${SITE_CONFIG.pricing.usd.standardPrice}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[#292432]/10">
                  <span>India (INR):</span>
                  <span className="font-bold text-[#292432] text-sm">
                    ₹{SITE_CONFIG.pricing.inr.earlyBirdPrice}{' '}
                    <span className="line-through text-[#827786] font-normal text-xs">
                      ₹{SITE_CONFIG.pricing.inr.standardPrice}
                    </span>
                  </span>
                </div>
                <div className="text-[11px] text-[#554B5D] pt-1 border-t border-[#292432]/10">
                  Pay once, own forever · 6 months of continuous updates included · Valid on 2 PCs.
                </div>
              </div>
              <p className="text-xs text-[#554B5D] leading-relaxed mb-5">
                Dodo Payments product checkout link will be attached shortly. You can start right now with the {SITE_CONFIG.trialDays}-day unrestricted free trial!
              </p>

              <div className="flex items-center gap-3">
                <a
                  href={release.downloadUrl}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#292432] text-[#F5F0E8] text-sm font-semibold hover:bg-[#3B3447] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Free Trial</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowDodoModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#F5F0E8] border border-[#292432]/15 text-sm font-semibold text-[#292432] hover:bg-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {successLicenseKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSuccessLicenseKey(null)}
            className="fixed inset-0 z-50 bg-[#292432]/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="resus-pill rounded-[28px] max-w-lg w-full p-8 relative shadow-2xl border-2 border-[#8B2346]/20 bg-[#FAF7F2]"
            >
              <button
                type="button"
                onClick={() => setSuccessLicenseKey(null)}
                aria-label="Close modal"
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F0E8] border border-[#827786]/30 flex items-center justify-center hover:bg-white cursor-pointer"
              >
                <X className="w-4 h-4 text-[#292432]" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Payment Verified
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#292432] mt-0.5">
                    Welcome to Resus Pro!
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#554B5D] leading-relaxed mb-5">
                Thank you for choosing Resus! Your lifetime license includes 6 months of continuous updates and can be activated on up to 2 personal PCs.
              </p>

              {/* License Key Box */}
              <div className="rounded-2xl bg-white border border-[#292432]/15 p-4 mb-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#827786] flex items-center gap-1.5 uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5 text-[#8B2346]" />
                    Your Pro License Key
                  </span>
                  <span className="text-[11px] text-[#827786]">2 PC Activations</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm sm:text-base font-bold text-[#292432] bg-[#FAF7F2] px-3.5 py-2.5 rounded-xl border border-[#292432]/10 select-all overflow-x-auto break-all">
                    {successLicenseKey}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(successLicenseKey);
                      setCopiedSuccessKey(true);
                      setTimeout(() => setCopiedSuccessKey(false), 2500);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#292432] text-[#F5F0E8] hover:bg-[#3B3447] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedSuccessKey ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Activation Steps */}
              <div className="rounded-2xl bg-[#F5F0E8] border border-[#292432]/10 p-4 mb-6">
                <h4 className="text-xs font-bold text-[#292432] uppercase tracking-wider mb-2.5">
                  How to activate inside the app:
                </h4>
                <ol className="text-xs text-[#554B5D] space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#292432]/20 text-[11px] font-mono text-[#292432]">Ctrl + Alt + Space</kbd> to open Resus
                  </li>
                  <li>
                    Click the tray icon or command bar menu → <strong className="text-[#292432]">License & Trial...</strong>
                  </li>
                  <li>
                    Paste your license key and click <strong className="text-[#292432]">Activate License</strong>
                  </li>
                </ol>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={release.downloadUrl}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#292432] text-[#F5F0E8] text-sm font-semibold hover:bg-[#3B3447] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resus Installer</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSuccessLicenseKey(null)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#292432]/15 text-sm font-semibold text-[#292432] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LegalModal
        activeDoc={activeLegalDoc}
        onClose={() => setActiveLegalDoc(null)}
        onSwitchDoc={setActiveLegalDoc}
      />

      {/* Studio Live Click Ripples Overlay */}
      {studioRipples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0.15, opacity: 0.95 }}
          animate={{ scale: 3.2, opacity: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-[#FF5722] bg-[#FF5722]/20 z-50"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </div>
  );
}

export default App;
