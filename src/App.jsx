
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import PlaceholderPage from './pages/PlaceholderPage';
import RoutePlaceholder from './pages/RoutePlaceholder';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import OurStory from './pages/OurStory';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import Terms from './pages/Terms';
import Policy from './pages/Policy';
import RefundPolicy from './pages/RefundPolicy';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route
          path="wishlist"
          element={<PlaceholderPage title="Wishlist" />}
        />
        <Route path="/our-story" element={<OurStory />} />
        <Route path='/terms-and-conditions' element={<Terms />} />
        <Route path='/privacy-policy' element={<Policy />} />
        <Route path='/return-policy' element={<RefundPolicy />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<RoutePlaceholder />} />
      </Route>
    </Routes>
  );
}
