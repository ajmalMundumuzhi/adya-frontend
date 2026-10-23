import ProductGrid from '../products/ProductGrid';
import SectionHeading from './SectionHeading';

export default function ProductSection({ eyebrow, title, description, products, linkTo = '/shop', linkLabel = 'View all sarees', tone = 'default' }) {
  return <section className={tone === 'soft' ? 'bg-ivory-50/65' : ''}><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"><SectionHeading eyebrow={eyebrow} title={title} description={description} linkTo={linkTo} linkLabel={linkLabel} /><ProductGrid products={products} /></div></section>;
}
