import HeroSlideshow from '../components/home/HeroSlideshow';
import CategorySection from '../components/home/CategorySection';
import ProductSection from '../components/home/ProductSection';
import BrandStory from '../components/home/BrandStory';
import TrustBenefits from '../components/home/TrustBenefits';
import Testimonials from '../components/home/Testimonials';
import SocialGallery from '../components/home/SocialGallery';
import Newsletter from '../components/home/Newsletter';
import SeasonalBanner from '../components/home/SeasonalBanner';
import { HOME_PRODUCTS } from '../data/homepage';

export default function Home() {
  const seasonal = HOME_PRODUCTS.slice(0, 4);
  const arrivals = [HOME_PRODUCTS[2], HOME_PRODUCTS[3], HOME_PRODUCTS[1], HOME_PRODUCTS[0]];
  const bestsellers = [HOME_PRODUCTS[0], HOME_PRODUCTS[1], HOME_PRODUCTS[2]];

  return (
    <div>
      <HeroSlideshow />
      <CategorySection />
      <ProductSection eyebrow="Seasonal selection" title="Seasonal elegance" description="A curated edit of sarees for celebrations, thoughtful gifting and moments worth remembering." products={seasonal} linkTo="/collections/festive-edit" linkLabel="Explore the edit" tone="soft" />
      <BrandStory />
      <ProductSection eyebrow="Just arrived" title="New arrivals" description="Fresh finds selected to bring a new perspective to timeless dressing." products={arrivals} linkTo="/shop" linkLabel="View all new arrivals" />
      <SeasonalBanner />
      <ProductSection eyebrow="Loved classics" title="Bestsellers" description="Discover a few of our sample collection favourites. Product details are placeholders for frontend review." products={bestsellers} linkTo="/shop" linkLabel="Shop all sarees" tone="soft" />
      <TrustBenefits />
      <Testimonials />
      <SocialGallery />
      <Newsletter />
    </div>
  );
}
