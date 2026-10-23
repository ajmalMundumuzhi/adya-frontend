import { useLocation } from 'react-router-dom';
import PlaceholderPage from './PlaceholderPage';

export default function RoutePlaceholder() {
  const { pathname } = useLocation();
  const title = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, ' '))
    .join(' / ');

  return <PlaceholderPage title={title || 'Page not found'} />;
}