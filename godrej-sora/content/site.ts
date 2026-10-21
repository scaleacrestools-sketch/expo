/**
 * Operator-configurable site settings — read from environment at build/runtime.
 * No placeholder IDs: integrations are inactive until set in .env.local.
 */
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL || '',
  advertiser: {
    name: process.env.NEXT_PUBLIC_ADVERTISER_NAME || '',
    rera: process.env.NEXT_PUBLIC_ADVERTISER_RERA || '',
    isDeveloper: process.env.NEXT_PUBLIC_ADVERTISER_IS_DEVELOPER === 'true',
  },
  contact: {
    phone: process.env.NEXT_PUBLIC_SALES_PHONE || '',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
    email: process.env.NEXT_PUBLIC_SALES_EMAIL || '',
  },
  analytics: {
    ga4: process.env.NEXT_PUBLIC_GA4_ID || '',
    metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  },
};

export const nav = [
  { label: 'Overview', href: '#overview' },
  { label: 'The Sora Philosophy', href: '#philosophy' },
  { label: 'Residences', href: '#residences' },
  { label: 'Shiki Club', href: '#shiki-club' },
  { label: 'Location', href: '#location' },
  { label: 'Gallery', href: '#gallery' },
];

export const whatsappLink = (text: string) =>
  site.contact.whatsapp ? `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}` : '';

export const telLink = () => (site.contact.phone ? `tel:+${site.contact.phone.replace(/^\+/, '')}` : '');
