export const MOBILE_MENU_BUTTON_ID = 'mobile-menu-button';

export const PRIMARY_NAV = [
  { key: 'home', label: 'Home', to: '/' },
  { key: 'shop', label: 'Shop All', to: '/shop' },
  {
    key: 'sarees',
    label: 'Sarees',
    to: '/sarees',
    children: [
      { label: 'Banarasi Silk', to: '/sarees/banarasi-silk' },
      { label: 'Kanjivaram Silk', to: '/sarees/kanjivaram-silk' },
      { label: 'Chanderi', to: '/sarees/chanderi' },
      { label: 'Handloom Cotton', to: '/sarees/handloom-cotton' },
      { label: 'Georgette & Chiffon', to: '/sarees/georgette-chiffon' },
    ],
  },
  {
    key: 'collections',
    label: 'Collections',
    to: '/collections',
    children: [
      { label: 'Wedding Edit', to: '/collections/wedding-edit' },
      { label: 'Festive Edit', to: '/collections/festive-edit' },
      { label: 'Everyday Heritage', to: '/collections/everyday-heritage' },
      { label: 'New Arrivals', to: '/collections/new-arrivals' },
    ],
  },
  { key: 'story', label: 'Our Story', to: '/our-story' },
];

export const SHOP_LINKS = [
  { label: 'Banarasi Silk', to: '/sarees/banarasi-silk' },
  { label: 'Kanjivaram Silk', to: '/sarees/kanjivaram-silk' },
  { label: 'Chanderi', to: '/sarees/chanderi' },
  { label: 'Handloom Cotton', to: '/sarees/handloom-cotton' },
  { label: 'Wedding Edit', to: '/collections/wedding-edit' },
  { label: 'Festive Edit', to: '/collections/festive-edit' },
];

export const SERVICE_LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Shipping', to: '/shipping' },
  { label: 'Returns and Exchange Policy', to: '/returns-and-exchange' },
];

export const COMPANY_LINKS = [
  { label: 'Our Story', to: '/our-story' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
];

export const SOCIAL_LINKS = [
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/' },
];