export const HERO_SLIDES = [
  {
    eyebrow: 'The art of Indian elegance',
    title: 'Traditions, woven for today.',
    description:
      'Discover sarees that carry the poetry of Indian craft into every celebration.',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2200&q=85',
    alt: 'Indian woman wearing an elegant traditional saree',
    cta: 'Explore the collection',
    to: '/shop',
    position: 'center 35%',
  },
  {
    eyebrow: 'Made for meaningful moments',
    title: 'A little grandeur, every day.',
    description:
      'From quiet mornings to unforgettable evenings, find the drape that feels like you.',
    image:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=2200&q=85',
    alt: 'Richly coloured Indian traditional clothing and textile',
    cta: 'Find your saree',
    to: '/sarees',
    position: 'center 38%',
  },
  {
    eyebrow: 'A celebration of craft',
    title: 'Heritage in every thread.',
    description:
      'Explore timeless textures, thoughtful details and colours to treasure.',
    image:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2200&q=85',
    alt: 'Detailed traditional Indian textile in warm tones',
    cta: 'Shop new arrivals',
    to: '/shop',
    position: 'center 42%',
  },
];

export const SAREE_CATEGORIES = [
  {
    name: 'Kanjivaram Silk',
    label: 'Rich silk, lasting splendour',
    to: '/sarees/kanjivaram-silk',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    alt: 'Traditional silk saree in a rich jewel tone',
  },
  {
    name: 'Banarasi Sarees',
    label: 'A touch of woven opulence',
    to: '/sarees/banarasi-silk',
    image:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=900&q=80',
    alt: 'Traditional Indian occasion wear',
  },
  {
    name: 'Handloom Cotton',
    label: 'Ease in every drape',
    to: '/sarees/handloom-cotton',
    image:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
    alt: 'Close detail of Indian woven fabric',
  },
  {
    name: 'Linen Sarees',
    label: 'Quiet, effortless elegance',
    to: '/sarees/linen',
    image:
      'https://images.unsplash.com/photo-1610189012906-4c5b2a8b9e43?auto=format&fit=crop&w=900&q=80',
    alt: 'Minimal Indian fashion in soft natural colours',
  },
  {
    name: 'Organza Sarees',
    label: 'Light as a lovely thought',
    to: '/sarees/organza',
    image:
      'https://images.unsplash.com/photo-1610030469668-8e9f641aaf2b?auto=format&fit=crop&w=900&q=80',
    alt: 'Elegant festive saree with delicate details',
  },
  {
    name: 'Festive & Bridal',
    label: 'For the moments that matter',
    to: '/collections/wedding-edit',
    image:
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80',
    alt: 'Festive Indian traditional attire',
  },
];

export const HOME_PRODUCTS = [
  {
    id: 'kanjivaram-ruby',
    name: 'Ruby Kanjivaram Silk Saree',
    priceInr: 18500,
    compareAtInr: 21500,
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    backImage:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=900&q=80',
    tag: 'Bestseller',
    to: '/product/kanjivaram-ruby',
  },
  {
    id: 'banarasi-ivory',
    name: 'Ivory Banarasi Brocade Saree',
    priceInr: 12900,
    compareAtInr: null,
    image:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=900&q=80',
    backImage:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
    tag: 'Timeless',
    to: '/product/banarasi-ivory',
  },
  {
    id: 'chanderi-gold',
    name: 'Gold Tissue Chanderi Saree',
    priceInr: 6400,
    compareAtInr: 7200,
    image:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
    backImage:
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=80',
    tag: 'New arrival',
    to: '/product/chanderi-gold',
  },
  {
    id: 'rose-organza',
    name: 'Rose Organza Occasion Saree',
    priceInr: 8900,
    compareAtInr: null,
    image:
      'https://images.unsplash.com/photo-1610189012906-4c5b2a8b9e43?auto=format&fit=crop&w=900&q=80',
    backImage:
      'https://images.unsplash.com/photo-1610030469668-8e9f641aaf2b?auto=format&fit=crop&w=900&q=80',
    tag: 'Occasion wear',
    to: '/product/rose-organza',
  },
];

export const TRUST_BENEFITS = [
  {
    icon: 'PackageCheck',
    title: 'International delivery',
    text: 'Shipping options for customers across our supported destinations.',
  },
  {
    icon: 'ShieldCheck',
    title: 'A considered checkout',
    text: 'Clear order details and a straightforward shopping experience.',
  },
  {
    icon: 'MessageCircle',
    title: 'Here to help',
    text: 'Support for questions about your order and choosing your saree.',
  },
  {
    icon: 'RefreshCw',
    title: 'Clear policies',
    text: 'Review shipping, returns and exchange information before ordering.',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'The colour, drape and little details made this feel like a special find.',
    name: 'Placeholder customer',
    note: 'Sample review — replace with an approved customer testimonial',
  },
  {
    quote:
      'A beautiful addition to my occasion-wear wardrobe. I loved exploring the collection.',
    name: 'Placeholder customer',
    note: 'Sample review — replace with an approved customer testimonial',
  },
  {
    quote:
      'The styling inspiration made it easy to imagine how I would wear it.',
    name: 'Placeholder customer',
    note: 'Sample review — replace with an approved customer testimonial',
  },
];

export const SOCIAL_IMAGES = [
  {
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
    alt: 'Traditional saree styling inspiration',
  },
  {
    image:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=700&q=80',
    alt: 'Indian festive outfit inspiration',
  },
  {
    image:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=80',
    alt: 'Textile colour and weave inspiration',
  },
  {
    image:
      'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=700&q=80',
    alt: 'Traditional occasion-wear inspiration',
  },
  {
    image:
      'https://images.unsplash.com/photo-1610189012906-4c5b2a8b9e43?auto=format&fit=crop&w=700&q=80',
    alt: 'Soft-toned Indian fashion inspiration',
  },
];
