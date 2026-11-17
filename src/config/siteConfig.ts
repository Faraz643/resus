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

  // Dodo Payments Configuration
  // TODO (Faraz): Replace with your live Dodo Payments Checkout URL once product is created.
  // Example: 'https://checkout.dodopayments.com/buy/pdt_xxxxxxxxxxxxx'
  dodoCheckoutUrl: '',
  proPriceDisplay: '$19',
  proBillingLabel: 'one-time lifetime license',
  trialDays: 7,
} as const;
