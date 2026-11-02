
import { Route, Routes, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import RoutePlaceholder from "./pages/RoutePlaceholder";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import OurStory from "./pages/OurStory";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Terms from "./pages/Terms";
import Policy from "./pages/Policy";
import RefundPolicy from "./pages/RefundPolicy";
import Checkout from "./pages/Checkout";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./components/admin/layout/AdminProtectedRoutes";
import AdminLayout from "./components/admin/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Product";
import AdminAddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetails from "./pages/admin/OrderDetails";
import AdminCustomers from "./pages/admin/Customers";
import AdminCategories from "./pages/admin/Categories";
import AdminInventory from "./pages/admin/Inventory";
import AdminSettings from "./pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="our-story" element={<OurStory />} />
        <Route path="terms-and-conditions" element={<Terms />} />
        <Route path="privacy-policy" element={<Policy />} />
        <Route path="return-policy" element={<RefundPolicy />} />
        <Route path="account" element={<Account />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* <Route path="*" element={<RoutePlaceholder />} /> */}
      </Route>

      <Route path="admin">
        <Route index element={<Navigate to="/admin/login" replace />} />
        <Route path="login" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AdminAddProduct />} />
            <Route path="products/:id/edit" element={<AdminAddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
