
import { useEffect, useState } from "react";
import HeroSlideshow from "../components/home/HeroSlideshow";
import CategorySection from "../components/home/CategorySection";
import ProductSection from "../components/home/ProductSection";
import BrandStory from "../components/home/BrandStory";
import TrustBenefits from "../components/home/TrustBenefits";
import Testimonials from "../components/home/Testimonials";
import Newsletter from "../components/home/Newsletter";
import SeasonalBanner from "../components/home/SeasonalBanner";
import useHomepageSettings from "../hooks/useHomeSettings";
import { getProducts } from "../services/store.service";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const homepage = useHomepageSettings();

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({ limit: 12 });

        const formattedProducts = data
          .filter((product) => product.isActive !== false)
          .map((product) => ({
            id: product.slug || product._id,
            name: product.name,
            price: Number(product.price) || 0,
            compareAtPrice: product.compareAtPrice ?? null,
            image: product.imagePath || product.images?.[0] || "",
            backImage: product.images?.[1] || "",
            tag: product.stock > 0 ? "In stock" : "Sold out",
            to: `/product/${product.slug || product._id}`,
          }));

        if (!cancelled) setProducts(formattedProducts);
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load products. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
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
        eyebrow={homepage.arrivals.eyebrow}
        title={homepage.arrivals.title}
        description={homepage.arrivals.description}
        products={arrivals}
        linkTo="/shop"
        linkLabel={homepage.arrivals.linkLabel}
      />

      {loading && (
        <p className="py-8 text-sm text-center text-gray-500">
          Loading products...
        </p>
      )}

      {error && (
        <p className="py-8 text-sm text-center text-red-600">{error}</p>
      )}

      <BrandStory />
      
      <ProductSection
        eyebrow="LOVED CLASSICS"
        title="Bestsellers"
        description="Discover timeless pieces from the ADYA collection."
        products={bestsellers}
        linkTo="/shop"
        linkLabel="Shop all sarees"
        tone="soft"
      />

      <SeasonalBanner />
      <TrustBenefits />
      {/* <Testimonials /> */}
      <Newsletter />
    </div>
  );
}
