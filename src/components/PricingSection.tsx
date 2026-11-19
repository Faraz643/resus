import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Sparkles,
  Download,
  ArrowRight,
  Copy,
  CheckCircle2,
  Shield,
  Clock,
  Infinity as InfinityIcon,
  HelpCircle,
  Laptop,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

type CurrencyKey = 'usd' | 'inr';
type PlanKey = 'trial' | 'pro';

function detectInitialCurrency(): CurrencyKey {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('resus_currency_pref');
      if (stored === 'usd' || stored === 'inr') return stored;

      // 1. Instant zero-latency detection via Timezone
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('Calcutta') || tz.includes('Kolkata')) {
        return 'inr';
      }

      // 2. Check navigator locale
      const lang = navigator.language || '';
      if (lang.includes('en-IN') || lang.includes('hi')) {
        return 'inr';
      }
    }
  } catch {
    // fallback
  }
  return 'usd';
}

interface PricingSectionProps {
  downloadUrl: string;
  version: string;
  onOpenDodoModal: () => void;
}

export function PricingSection({ downloadUrl, version, onOpenDodoModal }: PricingSectionProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyKey>(detectInitialCurrency);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('pro');
  const [copiedCode, setCopiedCode] = useState(false);

  const pricing = SITE_CONFIG.pricing;
  const activePricing = pricing[selectedCurrency];
  const couponCode = pricing.earlyBirdCouponCode;

  // Background IP lookup for secondary verification
  useEffect(() => {
    try {
      if (localStorage.getItem('resus_currency_pref')) return;
    } catch {
      // ignore
    }

    let isMounted = true;
    fetch('https://api.country.is')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data && data.country === 'IN') {
          setSelectedCurrency('inr');
        }
      })
      .catch(() => {
        // Fallback secondary check
        fetch('https://ipapi.co/country/')
          .then((res) => res.text())
          .then((code) => {
            if (!isMounted) return;
            if (code && code.trim() === 'IN') {
              setSelectedCurrency('inr');
            }
          })
          .catch(() => {});
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectCurrency = (curr: CurrencyKey) => {
    setSelectedCurrency(curr);
    try {
      localStorage.setItem('resus_currency_pref', curr);
    } catch {
      // ignore
    }
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCheckout = () => {
    if (SITE_CONFIG.dodoCheckoutUrl) {
      const currentUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}${window.location.pathname}`
          : 'https://resus.space/';
      const redirectParam = `redirect_url=${encodeURIComponent(currentUrl)}`;
      const separator = SITE_CONFIG.dodoCheckoutUrl.includes('?') ? '&' : '?';
      const checkoutUrlWithCoupon = `${SITE_CONFIG.dodoCheckoutUrl}${separator}coupon=${couponCode}&${redirectParam}`;
      window.open(checkoutUrlWithCoupon, '_blank', 'noopener,noreferrer');
    } else {
      onOpenDodoModal();
    }
  };

  return (
    <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20">
      {/* Section Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B9A2E8]/20 border border-[#B9A2E8]/50 text-xs font-semibold text-[#292432] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#292432]" />
          <span>Simple, Honest Pricing</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-3xl sm:text-4xl font-bold text-[#292432] tracking-tight mb-3"
        >
          Start Free. Pay Once. Own Forever.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[#554B5D] text-[15px] max-w-2xl mx-auto mb-6"
        >
          {SITE_CONFIG.trialDays}-day unrestricted free trial with zero credit card required. Upgrade
          to a perpetual license whenever you are ready—no monthly subscription traps.
        </motion.p>

        {/* Currency Switcher Pill with smooth sliding indicator */}
        <div className="inline-flex items-center p-1 rounded-full bg-white/75 border border-[#292432]/15 backdrop-blur-md shadow-xs relative">
          <button
            type="button"
            onClick={() => handleSelectCurrency('usd')}
            className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCurrency === 'usd' ? 'text-[#F5F0E8]' : 'text-[#554B5D] hover:text-[#292432]'
            }`}
          >
            {selectedCurrency === 'usd' && (
              <motion.div
                layoutId="activeCurrencyIndicator"
                className="absolute inset-0 bg-[#292432] rounded-full -z-10 shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            🌐 Global ($ USD)
          </button>
          <button
            type="button"
            onClick={() => handleSelectCurrency('inr')}
            className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCurrency === 'inr' ? 'text-[#F5F0E8]' : 'text-[#554B5D] hover:text-[#292432]'
            }`}
          >
            {selectedCurrency === 'inr' && (
              <motion.div
                layoutId="activeCurrencyIndicator"
                className="absolute inset-0 bg-[#292432] rounded-full -z-10 shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            🇮🇳 India (₹ INR)
          </button>
        </div>
      </div>

      {/* Early Bird Launch Special Banner with Subtle Shimmer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.008 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className="resus-card rounded-2xl p-4 sm:p-5 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#B9A2E8]/40 bg-gradient-to-r from-white/90 via-[#F5F0E8]/90 to-white/90 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 relative z-10">
          <motion.div
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-10 h-10 rounded-xl bg-[#292432] text-[#F5F0E8] flex items-center justify-center font-bold text-lg shadow-sm shrink-0"
          >
            ⚡
          </motion.div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-[#292432]">
                Launch Special: First {pricing.earlyBirdSeatsTotal} Customers
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D9A0B0]/30 text-[#8B2346] border border-[#D9A0B0]/60 animate-pulse">
                {activePricing.discountLabel}
              </span>
            </div>
            <p className="text-xs text-[#554B5D] mt-0.5">
              Use code <strong className="text-[#292432] font-mono">{couponCode}</strong> at checkout
              to get Resus Pro for only{' '}
              <strong className="text-[#9B2C48]">
                {activePricing.currencySymbol}
                {activePricing.earlyBirdPrice}
              </strong>{' '}
              (normally {activePricing.currencySymbol}
              {activePricing.standardPrice}).
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleCopyCoupon}
          className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#292432]/15 text-xs font-semibold text-[#292432] hover:bg-[#F5F0E8] transition-colors shadow-xs cursor-pointer whitespace-nowrap"
        >
          {copiedCode ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>Copied {couponCode}!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#554B5D]" />
              <span>Copy Code: {couponCode}</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Interactive Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: 7-Day Free Trial */}
        <motion.div
          onClick={() => setSelectedPlan('trial')}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350, damping: 22 } }}
          viewport={{ once: true }}
          className={`resus-card rounded-[24px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
            selectedPlan === 'trial'
              ? 'border-2 border-[#292432] bg-white shadow-[0_20px_45px_rgba(41,36,50,0.14)] ring-2 ring-[#292432]/10'
              : 'border border-[#292432]/10 bg-white/70 backdrop-blur-md hover:border-[#292432]/30'
          }`}
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
              {[
                'Lightning-fast Command Bar with app launcher & math',
                'Screen Studio 60 FPS recording with auto-zoom & click ASMR',
                'Burst screenshot capture in Screenshot Mode & custom region snip',
                'Local PDF & media conversion with OCR text extraction',
                '100% offline local processing on Windows 10 & 11',
              ].map((feature, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-2.5 transition-transform"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.a
            href={downloadUrl}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm transition-all shadow-xs ${
              selectedPlan === 'trial'
                ? 'bg-[#292432] text-[#F5F0E8] hover:bg-[#3B3447]'
                : 'bg-white border border-[#292432]/20 hover:bg-[#F5F0E8] text-[#292432]'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Resus {version} Free</span>
          </motion.a>
        </motion.div>

        {/* Card 2: Resus Pro (Pay Once, Own Forever) */}
        <motion.div
          onClick={() => setSelectedPlan('pro')}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -8, transition: { type: 'spring', stiffness: 350, damping: 22 } }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className={`resus-card rounded-[24px] p-7 sm:p-8 flex flex-col justify-between relative transition-all duration-300 cursor-pointer ${
            selectedPlan === 'pro'
              ? 'border-2 border-[#FF5722] bg-gradient-to-b from-white to-[#FFF6F2] shadow-[0_24px_55px_-10px_rgba(255,87,34,0.22)] ring-2 ring-[#FF5722]/20'
              : 'border-2 border-[#292432]/20 bg-gradient-to-b from-white/95 to-[#F5F0E8]/90 hover:border-[#FF5722]/50'
          }`}
        >
          {/* Highlight Badge */}
          <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#FF5722] text-white text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Pay Once, Own Forever</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFF0EB] text-[#FF5722] border border-[#FF5722]/30">
                6 Months Updates + Keep Forever
              </span>
              <span className="text-xs font-semibold text-[#8B2346] flex items-center gap-1">
                <span>{activePricing.flag}</span>
                <span>{activePricing.regionLabel}</span>
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold text-[#292432] mb-1">
              Resus Pro
            </h3>
            <p className="text-xs text-[#554B5D] mb-6">
              Pay once. Includes 6 months of continuous updates, and keep your version forever.
            </p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-xl sm:text-2xl text-[#827786] line-through font-bold">
                {activePricing.currencySymbol}
                {activePricing.standardPrice}
              </span>
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#292432]">
                {activePricing.currencySymbol}
                {activePricing.earlyBirdPrice}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#FF5722]">
                  Early Bird with code {couponCode}
                </span>
                <span className="text-[11px] text-[#554B5D]">one-time payment</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 text-xs text-[#292432] font-medium">
              {[
                {
                  icon: <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
                  title: 'Lifetime Ownership:',
                  desc: 'Your installed version never expires, locks, or forces a recurring subscription.',
                },
                {
                  icon: <Clock className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />,
                  title: '6 Months of Continuous Updates:',
                  desc: 'Every new feature, optimization, and tool released for 180 days.',
                },
                {
                  icon: <InfinityIcon className="w-4 h-4 text-[#292432] shrink-0 mt-0.5" />,
                  title: 'Valid on up to 2 PCs:',
                  desc: 'Use your license key across your personal desktop and laptop.',
                },
                {
                  icon: <Shield className="w-4 h-4 text-[#292432] shrink-0 mt-0.5" />,
                  title: 'DPAPI Secured & 100% Offline:',
                  desc: 'Validated locally on your device with zero cloud tracking.',
                },
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-2.5 transition-transform"
                >
                  {item.icon}
                  <span>
                    <strong>{item.title}</strong> {item.desc}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.button
            type="button"
            onClick={handleCheckout}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#292432] hover:bg-[#1E1B24] text-[#F5F0E8] font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>
              Get Resus Pro ({activePricing.currencySymbol}
              {activePricing.earlyBirdPrice})
            </span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Model & Multi-PC Explanation */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="resus-card rounded-2xl p-5 border border-[#292432]/10 bg-white/60">
          <div className="flex items-center gap-2.5 mb-2">
            <HelpCircle className="w-4 h-4 text-[#292432]" />
            <h4 className="text-xs font-bold text-[#292432] uppercase tracking-wider">
              How does "Pay Once, Own Forever" work?
            </h4>
          </div>
          <p className="text-xs text-[#554B5D] leading-relaxed">
            When you purchase Resus Pro, you own that version for life. You also receive 6 months of
            all new features, updates, and speed improvements. When those 6 months end, you can continue
            using your version forever without paying another cent, or optionally renew updates later
            at a heavy discount.
          </p>
        </div>

        <div className="resus-card rounded-2xl p-5 border border-[#292432]/10 bg-white/60">
          <div className="flex items-center gap-2.5 mb-2">
            <Laptop className="w-4 h-4 text-[#292432]" />
            <h4 className="text-xs font-bold text-[#292432] uppercase tracking-wider">
              Can I use my license on multiple computers?
            </h4>
          </div>
          <p className="text-xs text-[#554B5D] leading-relaxed">
            Yes! A single Resus Pro license key can be activated on up to 2 of your personal Windows
            devices (for example, your main desktop and personal laptop) simultaneously.
          </p>
        </div>
      </div>
    </section>
  );
}
