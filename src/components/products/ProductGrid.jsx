import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], columns = 4 }) {
  const columnStyles = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      className={`grid ${
        columnStyles[columns] || columnStyles[4]
      } gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
