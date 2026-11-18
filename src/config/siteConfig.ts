export const SITE_CONFIG = {
  brandName: 'Resus',
  tagline: 'Your desktop. On another level.',
  subTagline: 'One command. Countless possibilities.',

  // GitHub Releases (automatically synced at runtime via GitHub Releases API)
  releasesRepo: 'Faraz643/resus-releases',
  releasesApiUrl: 'https://api.github.com/repos/Faraz643/resus-releases/releases/latest',
  releasesPageUrl: 'https://github.com/Faraz643/resus-releases/releases',
  fallbackVersion: 'v1.0.23',
  fallbackDownloadUrl:
    'https://github.com/Faraz643/resus-releases/releases/download/v1.0.23/Resus-Setup-1.0.23.exe',

  // 7-Day Zero Friction Trial
  trialDays: 7,

  // Monetization & Dodo Payments Architecture
  // Model 2: 7-Day Free Trial -> Perpetual Fallback (1 Year Updates + Keep Forever)
  pricing: {
    model: 'Perpetual Fallback',
    modelDescription: 'Pay once, own forever. Includes 1 full year of software updates.',
    earlyBirdSeatsTotal: 20,
    earlyBirdCouponCode: 'EARLY20',
    tier1: {
      name: 'Global / Tier 1 (US, EU, UK, CA, AU)',
      standardPrice: 9,
      earlyBirdPrice: 6,
      currencySymbol: '$',
      discountPercent: '33% OFF',
    },
    tier2: {
      name: 'PPP / Tier 2 (India, Brazil, LATAM, SEA)',
      standardPrice: 5,
      earlyBirdPrice: 3,
      currencySymbol: '$',
      discountPercent: '40% OFF',
    },
  },

  // Dodo Payments Configuration
  // TODO (Faraz): Replace with your live Dodo Payments Checkout URL once product is created in Dodo dashboard.
  // Example: 'https://checkout.dodopayments.com/buy/pdt_xxxxxxxxxxxxx'
  dodoCheckoutUrl: '' as string,
} as const;
