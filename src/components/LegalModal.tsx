import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, RotateCcw } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export type LegalDocType = 'privacy' | 'terms' | 'refund' | null;

interface LegalModalProps {
  activeDoc: LegalDocType;
  onClose: () => void;
  onSwitchDoc: (doc: LegalDocType) => void;
}

export function LegalModal({ activeDoc, onClose, onSwitchDoc }: LegalModalProps) {
  return (
    <AnimatePresence>
      {activeDoc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#292432]/55 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="resus-pill rounded-[24px] max-w-2xl w-full max-h-[85vh] flex flex-col relative bg-[#FAF7F2] shadow-2xl border border-[#292432]/15 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-[#292432]/10 flex items-center justify-between gap-4 bg-white/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#292432]/5 border border-[#292432]/10 flex items-center justify-center text-[#8B2346]">
                  {activeDoc === 'privacy' && <ShieldCheck className="w-4.5 h-4.5" />}
                  {activeDoc === 'terms' && <FileText className="w-4.5 h-4.5" />}
                  {activeDoc === 'refund' && <RotateCcw className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#292432]">
                    {activeDoc === 'privacy' && 'Privacy Policy'}
                    {activeDoc === 'terms' && 'Terms of Service'}
                    {activeDoc === 'refund' && 'Refund Policy'}
                  </h3>
                  <p className="text-[11px] text-[#827786]">
                    Last updated: November 2026 · {SITE_CONFIG.brandName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close legal modal"
                className="w-8 h-8 rounded-full bg-[#F5F0E8] border border-[#827786]/30 flex items-center justify-center hover:bg-white cursor-pointer shrink-0"
              >
                <X className="w-4 h-4 text-[#292432]" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="px-6 sm:px-8 py-2.5 bg-[#F5F0E8]/70 border-b border-[#292432]/10 flex items-center gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onSwitchDoc('privacy')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeDoc === 'privacy'
                    ? 'bg-[#292432] text-[#F5F0E8]'
                    : 'text-[#554B5D] hover:text-[#292432] hover:bg-white/70'
                }`}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => onSwitchDoc('terms')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeDoc === 'terms'
                    ? 'bg-[#292432] text-[#F5F0E8]'
                    : 'text-[#554B5D] hover:text-[#292432] hover:bg-white/70'
                }`}
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => onSwitchDoc('refund')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeDoc === 'refund'
                    ? 'bg-[#292432] text-[#F5F0E8]'
                    : 'text-[#554B5D] hover:text-[#292432] hover:bg-white/70'
                }`}
              >
                Refund Policy
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto text-xs sm:text-[13px] text-[#3F3748] leading-relaxed space-y-4 resus-scrollbar">
              {activeDoc === 'privacy' && (
                <>
                  <p>
                    <strong>{SITE_CONFIG.brandName}</strong> is built with a strict local-first architecture. Your files, screen recordings, screenshots, and workflows stay on your Windows PC.
                  </p>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">1. Local Data &amp; Zero File Uploads</h4>
                    <p>
                      All core utilities—including screen recording, audio capture, PDF processing, media conversion, and command bar actions—run 100% locally on your machine. We do not collect, upload, or sell your personal files or usage history.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">2. Optional Bring-Your-Own-Key (BYOK) AI</h4>
                    <p>
                      If you choose to configure an optional AI provider key in settings, prompts are sent directly from your computer to your selected AI provider using your own credentials.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">3. Payments &amp; License Verification</h4>
                    <p>
                      Purchases are securely processed by <strong>Dodo Payments</strong> (our Merchant of Record). We do not store your credit card or banking details. When you activate a Pro license key, Resus sends your key and a hashed machine identifier to Dodo Payments solely to verify validity and enforce the {SITE_CONFIG.pricing.deviceLimit}-PC activation limit.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">4. Website Currency Detection</h4>
                    <p>
                      This website uses your browser&apos;s timezone/locale and a lightweight country-code lookup to display accurate regional pricing (USD or INR) and saves your manual currency preference in local browser storage.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">5. Real Human Support</h4>
                    <p>
                      Have questions about your privacy or data? Reach out to real human support directly at{' '}
                      <a
                        href={`mailto:${SITE_CONFIG.supportEmail}?subject=Resus%20Privacy%20Question`}
                        className="font-semibold text-[#8B2346] underline"
                      >
                        {SITE_CONFIG.supportEmail}
                      </a>.
                    </p>
                  </div>
                </>
              )}

              {activeDoc === 'terms' && (
                <>
                  <p>
                    By downloading, installing, or purchasing <strong>{SITE_CONFIG.brandName}</strong>, you agree to the following terms:
                  </p>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">1. Perpetual License (&ldquo;{SITE_CONFIG.pricing.model}&rdquo;)</h4>
                    <p>
                      A Resus Pro license grants you a non-exclusive, perpetual license to use Resus on up to <strong>{SITE_CONFIG.pricing.deviceLimit} personal or work Windows PCs</strong> owned or controlled by you. There are no recurring subscriptions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">2. Software Updates ({SITE_CONFIG.pricing.updatesMonths} Months Included)</h4>
                    <p>
                      Your one-time purchase includes <strong>{SITE_CONFIG.pricing.updatesMonths} months of continuous software updates</strong> and new features from the date of purchase. After that period, you own the software version you received forever.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">3. {SITE_CONFIG.trialDays}-Day Free Trial</h4>
                    <p>
                      Resus includes an unrestricted {SITE_CONFIG.trialDays}-day free trial so you can evaluate all features on your hardware before purchasing a license key.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">4. Acceptable Use &amp; Restrictions</h4>
                    <p>
                      You may not redistribute, resell, publicly share your license key beyond the {SITE_CONFIG.pricing.deviceLimit}-device limit, or attempt to bypass license validation mechanisms.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">5. Disclaimer of Warranty</h4>
                    <p>
                      Resus is provided &ldquo;as is&rdquo; without warranty of any kind. Always keep backups of critical files before running batch file operations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">6. Support Contact</h4>
                    <p>
                      Need help or clarification on these terms? Contact real human support anytime at{' '}
                      <a
                        href={`mailto:${SITE_CONFIG.supportEmail}?subject=Resus%20Terms%20Inquiry`}
                        className="font-semibold text-[#8B2346] underline"
                      >
                        {SITE_CONFIG.supportEmail}
                      </a>.
                    </p>
                  </div>
                </>
              )}

              {activeDoc === 'refund' && (
                <>
                  <p>
                    We want you to be completely confident before and after purchasing <strong>{SITE_CONFIG.brandName} Pro</strong>.
                  </p>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">1. {SITE_CONFIG.trialDays}-Day Unrestricted Free Trial</h4>
                    <p>
                      Every download includes a full {SITE_CONFIG.trialDays}-day free trial with no credit card required so you can verify compatibility and features on your Windows 10/11 PC first.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">2. 14-Day Money-Back Guarantee</h4>
                    <p>
                      If you experience a technical issue we cannot resolve, or are unsatisfied with your purchase for any reason within <strong>14 days of purchase</strong>, simply reach out with your Dodo Payments order/payment ID and we will issue a full refund.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292432] mb-1">3. How to Request a Refund (Real Human Support)</h4>
                    <p>
                      Email our team directly for human support at{' '}
                      <a
                        href={`mailto:${SITE_CONFIG.supportEmail}?subject=Resus%20Refund%20Request`}
                        className="font-semibold text-[#8B2346] underline"
                      >
                        {SITE_CONFIG.supportEmail}
                      </a>{' '}
                      with your purchase email and payment ID. A real human will process your request promptly, deactivate the license key, and return the funds to your original payment method.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-[#292432]/10 bg-white/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="text-[#554B5D] flex items-center gap-1.5 flex-wrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                <span>Questions? Real human support:</span>{' '}
                <a
                  href={`mailto:${SITE_CONFIG.supportEmail}`}
                  className="font-semibold text-[#8B2346] hover:text-[#292432] underline"
                >
                  {SITE_CONFIG.supportEmail}
                </a>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#292432] text-[#F5F0E8] font-semibold hover:bg-[#3B3447] cursor-pointer shrink-0 self-end sm:self-auto"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
