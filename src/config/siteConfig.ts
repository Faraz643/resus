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
  pricing: {
    model: 'Pay Once, Own Forever',
    modelDescription: 'Pay once, own forever. Includes 6 months of software updates. Valid on up to 2 PCs.',
    earlyBirdSeatsTotal: 20,
    earlyBirdCouponCode: 'EARLY20',
    standardPrice: 9,
    earlyBirdPrice: 6,
    currencySymbol: '$',
    discountPercent: '33% OFF',
    deviceLimit: 2,
    updatesMonths: 6,
  },

  // Dodo Payments Configuration
  // TODO (Faraz): Replace with your live Dodo Payments Checkout URL once product is created in Dodo dashboard.
  // Example: 'https://checkout.dodopayments.com/buy/pdt_xxxxxxxxxxxxx'
  dodoCheckoutUrl: '' as string,
} as const;
