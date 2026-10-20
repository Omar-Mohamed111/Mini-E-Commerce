import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";

const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const About = lazy(() => import("./pages/About"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Register = lazy(() => import("./pages/Register"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const Login = lazy(() => import("./pages/Login"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<ProductDetail />} />
          <Route path="category/:id" element={<CategoryPage />} />
          <Route path="about" element={<About />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />

          <Route path="admin/products" element={<AdminProducts />} />

          <Route path="register" element={<Register />} />
          <Route path="verify-otp" element={<VerifyOTP />} />
          <Route path="login" element={<Login />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
