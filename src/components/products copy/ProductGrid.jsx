import ProductCard from './ProductCard';

export default function ProductGrid({ products, columns = 4 }) {
  const columnClass = columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4';
  return <div className={`grid ${columnClass} gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10`}>{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
