export const SAMPLE_PRODUCTS = [
  { id: 'kanjivaram-ruby', name: 'Ruby Kanjivaram Silk Saree', priceInr: 18500, compareAtInr: 21500 },
  { id: 'banarasi-ivory', name: 'Ivory Banarasi Brocade Saree', priceInr: 12900, compareAtInr: null },
  { id: 'chanderi-gold', name: 'Gold Tissue Chanderi Saree', priceInr: 6400, compareAtInr: 7200 },
];

export const SAMPLE_PRODUCTS_BY_ID = Object.fromEntries(
  SAMPLE_PRODUCTS.map((product) => [product.id, product]),
);

export const INITIAL_CART_LINES = [
  { productId: 'kanjivaram-ruby', quantity: 1 },
  { productId: 'banarasi-ivory', quantity: 2 },
  { productId: 'chanderi-gold', quantity: 1 },
];