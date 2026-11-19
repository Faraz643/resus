import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Clapperboard, Layers, Zap, ArrowRight, Terminal } from 'lucide-react';

interface WorkflowTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  headline: string;
  summary: string;
  commands: { cmd: string; outcome: string }[];
  highlightMetric: string;
  highlightLabel: string;
}

const WORKFLOW_TABS: WorkflowTab[] = [
  {
    id: 'devs',
    label: 'Developers',
    icon: <Code2 className="w-4 h-4" />,
    headline: 'Ship faster without leaving your editor',
    summary:
      'Kill hung dev ports, generate UUIDs and SHA-256 hashes, encode Base64, launch repo workspaces, and record 60 FPS bug walkthroughs with Developer Auto-Zoom.',
    commands: [
      { cmd: 'screen record', outcome: '60 FPS demo with Ctrl+G/S/M/F/I live zoom & keystroke HUD' },
      { cmd: 'kill port 3000', outcome: 'Instantly terminates hung Node, Docker, or dev servers' },
      { cmd: 'open dev', outcome: 'Launches GitHub, localhost, Linear & docs in one shot' },
      { cmd: 'uuid / sha256', outcome: 'Generates & copies instant dev tokens to clipboard' },
    ],
    highlightMetric: '< 50ms',
    highlightLabel: 'Native WPF launch & command execution',
  },
  {
    id: 'creators',
    label: 'Content Creators',
    icon: <Clapperboard className="w-4 h-4" />,
    headline: 'Studio-grade product demos, built right in',
    summary:
      'No bloated video editors needed. Record tutorials with smooth cursor enhancement, custom click ripple colors, subtle ASMR click audio, and automatic zoom-out.',
    commands: [
      { cmd: 'record region', outcome: 'Captures clean app windows or custom screen regions' },
      { cmd: 'asmr clicks', outcome: 'Real-time mechanical click audio & visual ripple feedback' },
      { cmd: 'compress video', outcome: 'Shrinks MP4 recordings locally for fast X / Discord sharing' },
      { cmd: 'screenshot mode', outcome: 'Continuous [S] / [R] captures for docs & threads' },
    ],
    highlightMetric: '60 FPS',
    highlightLabel: 'Hardware-accelerated MP4 & auto-zoom compositing',
  },
  {
    id: 'designers',
    label: 'Designers & PMs',
    icon: <Layers className="w-4 h-4" />,
    headline: 'Convert, merge, and organize assets in seconds',
    summary:
      'Turn PNGs to WebP, merge client PDF decks, OCR design mockups, and compress heavy presentations locally with zero cloud uploads.',
    commands: [
      { cmd: 'convert png to webp', outcome: 'Batch-converts images locally with crisp quality' },
      { cmd: 'merge pdfs', outcome: 'Combines proposals & specs into one clean PDF' },
      { cmd: 'compress pdf', outcome: 'Reduces heavy decks without uploading confidential files' },
      { cmd: 'ocr screen text', outcome: 'Extracts non-selectable text & copy directly from Figma or mockups' },
    ],
    highlightMetric: '100%',
    highlightLabel: 'Offline PDF & media processing — zero cloud uploads',
  },
  {
    id: 'power',
    label: 'Power Users',
    icon: <Zap className="w-4 h-4" />,
    headline: 'One command bar to rule your entire Windows desktop',
    summary:
      'Replace half a dozen single-purpose tray apps. Resus stays asleep in your system tray until you summon it—then gets out of your way.',
    commands: [
      { cmd: 'open study', outcome: 'Opens your custom multi-tab focus preset instantly' },
      { cmd: 'ocr pdf', outcome: 'Extracts searchable text from scanned documents locally' },
      { cmd: 'word count', outcome: 'Instant character, word & reading-time stats from clipboard' },
      { cmd: 'what is my ip', outcome: 'Instantly displays active local network interfaces & IP addresses' },
    ],
    highlightMetric: '16+',
    highlightLabel: 'Built-in offline PDF, media & productivity tools',
  },
];

export const WorkflowShowcase: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('devs');
  const active = WORKFLOW_TABS.find((t) => t.id === activeId) ?? WORKFLOW_TABS[0];

  return (
    <div className="w-full">
      {/* Tab Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
        {WORKFLOW_TABS.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#292432] text-[#F5F0E8] border-[#292432] shadow-md'
                  : 'bg-white/60 hover:bg-white/85 text-[#554B5D] hover:text-[#292432] border-[#292432]/12'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="aurora-card rounded-[24px] p-6 sm:p-9"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DEF6]/80 border border-[#B9A2E8]/60 text-xs font-semibold text-[#292432]">
                {active.icon}
                <span>{active.label} Workflow</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#292432] leading-tight">
                {active.headline}
              </h3>

              <p className="text-[15px] leading-relaxed text-[#554B5D]">
                {active.summary}
              </p>

              <div className="pt-2 border-t border-[#292432]/10 flex items-baseline gap-3">
                <span className="font-display text-3xl font-extrabold text-[#292432]">
                  {active.highlightMetric}
                </span>
                <span className="text-xs font-medium text-[#554B5D]">
                  {active.highlightLabel}
                </span>
              </div>
            </div>

            {/* Right Command List */}
            <div className="lg:col-span-7 space-y-3">
              {active.commands.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-4 rounded-2xl bg-[#FAF7F2]/85 border border-[#292432]/10 hover:border-[#B9A2E8] transition-colors"
                >
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-[#E8DEF6] border border-[#B9A2E8]/60 flex items-center justify-center">
                      <Terminal className="w-3.5 h-3.5 text-[#292432]" />
                    </div>
                    <code className="font-mono text-[13px] font-semibold text-[#292432]">
                      {item.cmd}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#554B5D]">
                    <ArrowRight className="w-3.5 h-3.5 text-[#827786] hidden sm:block shrink-0" />
                    <span>{item.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
