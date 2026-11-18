import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  Download,
  ArrowRight,
  Globe2,
  Copy,
  CheckCircle2,
  Shield,
  Clock,
  Infinity as InfinityIcon,
  HelpCircle,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface PricingSectionProps {
  downloadUrl: string;
  version: string;
  onOpenDodoModal: () => void;
}

export function PricingSection({ downloadUrl, version, onOpenDodoModal }: PricingSectionProps) {
  const [selectedTier, setSelectedTier] = useState<'tier1' | 'tier2'>('tier1');
  const [copiedCode, setCopiedCode] = useState(false);

  const tierData = SITE_CONFIG.pricing[selectedTier];
  const couponCode = SITE_CONFIG.pricing.earlyBirdCouponCode;

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCheckout = () => {
    if (SITE_CONFIG.dodoCheckoutUrl) {
      const checkoutUrlWithCoupon = `${SITE_CONFIG.dodoCheckoutUrl}${
        SITE_CONFIG.dodoCheckoutUrl.includes('?') ? '&' : '?'
      }coupon=${couponCode}`;
      window.open(checkoutUrlWithCoupon, '_blank', 'noopener,noreferrer');
    } else {
      onOpenDodoModal();
    }
  };

  return (
    <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B9A2E8]/20 border border-[#B9A2E8]/50 text-xs font-semibold text-[#292432] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#292432]" />
          <span>Simple, Honest &amp; Fair Pricing</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl sm:text-4xl font-bold text-[#292432] tracking-tight mb-3"
        >
          Start Free. Pay Once. Keep Forever.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#554B5D] text-[15px] max-w-2xl mx-auto"
        >
          {SITE_CONFIG.trialDays}-day unrestricted free trial with zero credit card required. Upgrade
          to a perpetual license whenever you are ready—no recurring subscription traps.
        </motion.p>
      </div>

      {/* Early Bird & PPP Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="resus-card rounded-2xl p-4 sm:p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#B9A2E8]/40 bg-gradient-to-r from-white/90 via-[#F5F0E8]/90 to-white/90 shadow-sm"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#292432] text-[#F5F0E8] flex items-center justify-center font-bold text-lg shadow-sm">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-[#292432]">
                Launch Special: First {SITE_CONFIG.pricing.earlyBirdSeatsTotal} Customers
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D9A0B0]/30 text-[#8B2346] border border-[#D9A0B0]/60">
                {tierData.discountPercent}
              </span>
            </div>
            <p className="text-xs text-[#554B5D] mt-0.5">
              Use code <strong className="text-[#292432] font-mono">{couponCode}</strong> at checkout
              to get Tier 1 for $6 or Tier 2 with PPP for $3.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyCoupon}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#292432]/15 text-xs font-semibold text-[#292432] hover:bg-[#F5F0E8] transition-colors shadow-xs cursor-pointer whitespace-nowrap"
        >
          {copiedCode ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Copied {couponCode}!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#554B5D]" />
              <span>Copy Code: {couponCode}</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Purchasing Power Parity (PPP) Selector Toggle */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="flex items-center gap-1.5 text-xs text-[#554B5D] mb-3">
          <Globe2 className="w-3.5 h-3.5 text-[#292432]" />
          <span>Purchasing Power Parity (PPP) Geo-Pricing:</span>
        </div>
        <div className="inline-flex rounded-xl p-1 bg-white/80 border border-[#292432]/15 shadow-xs backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setSelectedTier('tier1')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTier === 'tier1'
                ? 'bg-[#292432] text-[#F5F0E8] shadow-xs'
                : 'text-[#554B5D] hover:text-[#292432]'
            }`}
          >
            Tier 1: Global / US, EU, UK ($9)
          </button>
          <button
            type="button"
            onClick={() => setSelectedTier('tier2')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTier === 'tier2'
                ? 'bg-[#292432] text-[#F5F0E8] shadow-xs'
                : 'text-[#554B5D] hover:text-[#292432]'
            }`}
          >
            Tier 2: PPP / India, LATAM, SEA ($5)
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: 7-Day Free Trial */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="resus-card rounded-[24px] p-7 sm:p-8 flex flex-col justify-between border border-[#292432]/10 bg-white/70 backdrop-blur-md"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#292432]/5 text-[#292432] border border-[#292432]/10">
                Zero Friction
              </span>
              <span className="text-xs text-[#554B5D]">No card required</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-[#292432] mb-1">
              7-Day Free Trial
            </h3>
            <p className="text-xs text-[#554B5D] mb-6">
              Full, unrestricted access to every single feature right after installation.
            </p>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#292432]">
                $0
              </span>
              <span className="text-xs text-[#554B5D]">for 7 days</span>
            </div>

            <ul className="space-y-3 mb-8 text-xs text-[#3F3748]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Lightning-fast Command Bar with app launcher &amp; math</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Screen Studio 60 FPS recording with auto-zoom &amp; click ASMR</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant full screen &amp; region screenshot capture</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Local PDF &amp; media conversion with OCR text extraction</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>100% offline local processing on Windows 10 &amp; 11</span>
              </li>
            </ul>
          </div>

          <motion.a
            href={downloadUrl}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-white border border-[#292432]/20 hover:bg-[#F5F0E8] text-[#292432] font-bold text-sm transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Resus {version} Free</span>
          </motion.a>
        </motion.div>

        {/* Card 2: Perpetual Fallback Pro License */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="resus-card rounded-[24px] p-7 sm:p-8 flex flex-col justify-between border-2 border-[#292432] bg-gradient-to-b from-white/95 to-[#F5F0E8]/90 relative shadow-[0_16px_36px_-12px_rgba(41,36,50,0.18)]"
        >
          {/* Highlight Badge */}
          <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#292432] text-[#F5F0E8] text-[11px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#D9A0B0]" />
            <span>Perpetual Fallback</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#B9A2E8]/30 text-[#292432] border border-[#B9A2E8]/60">
                1 Year Updates + Keep Forever
              </span>
              <span className="text-xs font-semibold text-[#8B2346]">
                {selectedTier === 'tier2' ? 'Tier 2 (PPP Price)' : 'Tier 1 Standard'}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-[#292432] mb-1">
              Resus Pro Perpetual
            </h3>
            <p className="text-xs text-[#554B5D] mb-6">
              Pay once. Includes 1 full year of continuous updates, and keep your version forever.
            </p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-xl sm:text-2xl text-[#827786] line-through font-bold">
                ${tierData.standardPrice}
              </span>
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#292432]">
                ${tierData.earlyBirdPrice}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#8B2346]">
                  Early Bird with code {couponCode}
                </span>
                <span className="text-[11px] text-[#554B5D]">one-time payment</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 text-xs text-[#292432] font-medium">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Perpetual License:</strong> Your installed version never expires or locks
                  you out.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#292432] shrink-0 mt-0.5" />
                <span>
                  <strong>1 Year of Updates:</strong> Every new feature and optimization released
                  for 365 days.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <InfinityIcon className="w-4 h-4 text-[#292432] shrink-0 mt-0.5" />
                <span>
                  <strong>Valid on up to 3 PCs:</strong> Use your key across your desktop and
                  laptop.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#292432] shrink-0 mt-0.5" />
                <span>
                  <strong>DPAPI Secured &amp; Offline:</strong> Validated locally with zero cloud
                  tracking.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe2 className="w-4 h-4 text-[#292432] shrink-0 mt-0.5" />
                <span>
                  <strong>Automatic Geo-Pricing:</strong> Fair localized checkout via Dodo Payments.
                </span>
              </li>
            </ul>
          </div>

          <motion.button
            type="button"
            onClick={handleCheckout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#292432] hover:bg-[#3B3447] text-[#F5F0E8] font-bold text-sm transition-colors shadow-md cursor-pointer"
          >
            <span>Get Perpetual License (${tierData.earlyBirdPrice})</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Model 2 Perpetual Fallback & PPP Explanation Accordion */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="resus-card rounded-2xl p-5 border border-[#292432]/10 bg-white/60">
          <div className="flex items-center gap-2.5 mb-2">
            <HelpCircle className="w-4 h-4 text-[#292432]" />
            <h4 className="text-xs font-bold text-[#292432] uppercase tracking-wider">
              How does the Perpetual Fallback work?
            </h4>
          </div>
          <p className="text-xs text-[#554B5D] leading-relaxed">
            When you purchase Resus Pro, you own that version for life. You also receive 1 year of
            all new features, updates, and improvements. When the year concludes, you can continue
            using your version forever without paying another cent, or renew updates at a discount.
          </p>
        </div>

        <div className="resus-card rounded-2xl p-5 border border-[#292432]/10 bg-white/60">
          <div className="flex items-center gap-2.5 mb-2">
            <Globe2 className="w-4 h-4 text-[#292432]" />
            <h4 className="text-xs font-bold text-[#292432] uppercase tracking-wider">
              How does Purchasing Power Parity (PPP) work?
            </h4>
          </div>
          <p className="text-xs text-[#554B5D] leading-relaxed">
            Software should be accessible worldwide. Through our Merchant of Record, Dodo Payments,
            customers from Tier 2 economies (such as India, Brazil, Southeast Asia, and LATAM)
            automatically receive local pricing ($3–$5 or local currency) at checkout.
          </p>
        </div>
      </div>
    </section>
  );
}
