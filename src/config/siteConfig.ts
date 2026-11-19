export const SITE_CONFIG = {
  brandName: 'Resus',
  tagline: 'Your desktop. On another level.',
  subTagline: 'One command. Countless possibilities.',

  // GitHub Releases (automatically synced at runtime via GitHub Releases API)
  releasesRepo: 'Faraz643/resus-releases',
  releasesApiUrl: 'https://api.github.com/repos/Faraz643/resus-releases/releases/latest',
  releasesPageUrl: 'https://github.com/Faraz643/resus-releases/releases',
  fallbackVersion: 'v1.0.24',
  fallbackDownloadUrl:
    'https://github.com/Faraz643/resus-releases/releases/download/v1.0.24/Resus-Setup-1.0.24.exe',
  supportEmail: 'support@resus.space',

  // 7-Day Zero Friction Trial
  trialDays: 7,

  // Monetization & Dodo Payments Architecture
  pricing: {
    model: 'Pay Once, Own Forever',
    modelDescription: 'Pay once, own forever. Includes 6 months of software updates. Valid on up to 2 PCs.',
    earlyBirdSeatsTotal: 20,
    earlyBirdCouponCode: 'EARLY20',
    deviceLimit: 2,
    updatesMonths: 6,
    usd: {
      currencySymbol: '$',
      currencyCode: 'USD',
      standardPrice: 7.49,
      earlyBirdPrice: 6.42,
      discountLabel: 'SAVE $1.07',
      regionLabel: 'Global (USD)',
      flag: '🌐',
    },
    inr: {
      currencySymbol: '₹',
      currencyCode: 'INR',
      standardPrice: 250,
      earlyBirdPrice: 200,
      discountLabel: 'SAVE ₹50',
      regionLabel: 'India (INR)',
      flag: '🇮🇳',
    },
  },

  // Dodo Payments Configuration
  dodoCheckoutUrl: 'https://test.checkout.dodopayments.com/buy/pdt_0NsDA18IkLSnadxEwBgY9' as string,
} as const;
