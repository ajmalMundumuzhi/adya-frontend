import { useEffect, useState } from 'react';
import HeroSlideshow from '../components/home/HeroSlideshow';
import CategorySection from '../components/home/CategorySection';
import ProductSection from '../components/home/ProductSection';
import BrandStory from '../components/home/BrandStory';
import TrustBenefits from '../components/home/TrustBenefits';
import Testimonials from '../components/home/Testimonials';
import SocialGallery from '../components/home/SocialGallery';
import Newsletter from '../components/home/Newsletter';
import SeasonalBanner from '../components/home/SeasonalBanner';
import { getProducts } from '../services/store.service';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError('');

        const data = await getProducts({ limit: 12 });

        const formattedProducts = data
          .filter((product) => product.isActive !== false)
          .map((product) => ({
            id: product.slug || product._id,
            name: product.name,
            priceInr: product.price,
            compareAtInr: product.compareAtPrice,
            image:
              product.imagePath ||
              product.images?.[0] ||
              '',
            backImage: product.images?.[1] || '',
            tag: product.stock > 0 ? 'In stock' : 'Sold out',
            to: `/product/${product.slug || product._id}`,
          }));

        if (!cancelled) {
          setProducts(formattedProducts);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to load products. Please try again later.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const arrivals = products.slice(0, 4);
  const bestsellers = products.slice(0, 3);

  return (
    <div>
      <HeroSlideshow />
      <CategorySection />

      <ProductSection
        eyebrow="Just arrived"
        title="New arrivals"
        description="Fresh finds selected to bring a new perspective to timeless dressing."
        products={arrivals}
        linkTo="/shop"
        linkLabel="View all new arrivals"
      />

      {loading && (
        <p className="py-8 text-sm text-center text-gray-500">
          Loading products...
        </p>
      )}

      {error && (
        <p className="py-8 text-sm text-center text-red-600">
          {error}
        </p>
      )}

      <BrandStory />

      <ProductSection
        eyebrow="Our collection"
        title="Explore our sarees"
        description="Discover timeless pieces from the ADYA collection."
        products={bestsellers}
        linkTo="/shop"
        linkLabel="Shop all sarees"
        tone="soft"
      />

      <SeasonalBanner />
      <TrustBenefits />
      <Testimonials />
      {/* <SocialGallery /> */}
      <Newsletter />
    </div>
  );
}
