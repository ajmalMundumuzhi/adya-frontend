import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import RoutePlaceholder from './pages/RoutePlaceholder';
import Home from './pages/Home';
import Shop from './pages/Shop';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<PlaceholderPage title="Cart" showPreview />} />
        <Route path="*" element={<RoutePlaceholder />} />
      </Route>
    </Routes>
  );
}