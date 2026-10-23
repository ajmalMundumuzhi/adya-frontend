
const rubyImage =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85';

const ivoryImage =
  'https://images.unsplash.com/photo-1583391733956-6c78276477e8?auto=format&fit=crop&w=1000&q=85';

const goldImage =
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85';

export const SAMPLE_PRODUCTS = [
  {
    id: 'kanjivaram-ruby',
    name: 'Ruby Kanjivaram Silk Saree',
    priceInr: 18500,
    compareAtInr: 21500,
    sku: 'KSS001',
    description: 'A timeless silk saree for special occasions.',
    category: 'Kanjivaram Saree',
    variants: [
      {
        name: 'Ruby',
        color: '#8B1E3F',
        images: [rubyImage, ivoryImage, goldImage],
      },
      {
        name: 'Teal',
        color: '#167D83',
        images: [goldImage, rubyImage, ivoryImage],
      },
      {
        name: 'Ivory',
        color: '#F2E7D5',
        images: [ivoryImage, goldImage, rubyImage],
      },
    ],
  },
  {
    id: 'banarasi-ivory',
    name: 'Ivory Banarasi Brocade Saree',
    priceInr: 12900,
    compareAtInr: null,
    sku: 'IBS002',
    description: 'An elegant Banarasi saree with a timeless traditional look.',
    category: 'Banarasi Saree',
    variants: [
      {
        name: 'Ivory',
        color: '#F2E7D5',
        images: [ivoryImage, goldImage, rubyImage],
      },
      {
        name: 'Ruby',
        color: '#8B1E3F',
        images: [rubyImage, ivoryImage, goldImage],
      },
    ],
  },
  {
    id: 'chanderi-gold',
    name: 'Gold Tissue Chanderi Saree',
    priceInr: 6400,
    compareAtInr: 7200,
    sku: 'GTC003',
    description: 'A lightweight occasion saree with a luminous finish.',
    category: 'Chanderi Saree',
    variants: [
      {
        name: 'Gold',
        color: '#C8A34D',
        images: [goldImage, ivoryImage, rubyImage],
      },
      {
        name: 'Ruby',
        color: '#8B1E3F',
        images: [rubyImage, goldImage, ivoryImage],
      },
    ],
  },
];

export const SAMPLE_PRODUCTS_BY_ID = Object.fromEntries(
  SAMPLE_PRODUCTS.map((product) => [product.id, product]),
);

export const INITIAL_CART_LINES = [
  { productId: 'kanjivaram-ruby', quantity: 1 },
  { productId: 'banarasi-ivory', quantity: 2 },
  { productId: 'chanderi-gold', quantity: 1 },
];
