
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import RoutePlaceholder from './pages/RoutePlaceholder';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route
          path="wishlist"
          element={<PlaceholderPage title="Wishlist" />}
        />
        <Route path="*" element={<RoutePlaceholder />} />
      </Route>
    </Routes>
  );
}
