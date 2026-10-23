import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import RoutePlaceholder from './pages/RoutePlaceholder';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<PlaceholderPage title="Home" showPreview />} />
        <Route path="cart" element={<PlaceholderPage title="Cart" showPreview />} />
        <Route path="*" element={<RoutePlaceholder />} />
      </Route>
    </Routes>
  );
}