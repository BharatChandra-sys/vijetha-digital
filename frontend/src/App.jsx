import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

/* Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* layouts */
import PublicLayout    from "./layouts/PublicLayout";
import HomeLayout      from "./layouts/HomeLayout";
import CustomerLayout  from "./layouts/CustomerLayout";
import AdminLayout     from "./layouts/AdminLayout";

/* guards */
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute     from "./components/auth/AdminRoute";

/* public auth pages */
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import PasswordUpdated from "./pages/PasswordUpdated";
import ResetLinkSent  from "./pages/ResetLinkSent";

/* public shop pages */
import Home          from "./pages/Home";
import About         from "./pages/About";
import Contact       from "./pages/Contact";
import Products      from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart          from "./pages/Cart";

/* legal pages */
import PrivacyPolicy   from "./pages/PrivacyPolicy";
import TermsOfService  from "./pages/TermsOfService";
import Sitemap         from "./pages/Sitemap";

/* customer pages */
import Checkout          from "./pages/Checkout";
import Orders            from "./pages/Orders";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder        from "./pages/TrackOrder";
import Profile           from "./pages/Profile";

/* admin pages */
import AdminDashboard     from "./pages/admin/AdminDashboard";
import AdminOrders        from "./pages/admin/Orders";
import AdminMaterials     from "./pages/admin/Materials";
import AdminExtras        from "./pages/admin/Extras";
import AdminProducts      from "./pages/admin/Products";
import AdminCreateProduct from "./pages/admin/AdminCreateProduct";

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>

      {/* ===== PUBLIC AUTH ===== */}
      <Route element={<PublicLayout />}>
        <Route path="/login"                    element={<Login />} />
        <Route path="/register"                 element={<Register />} />
        <Route path="/forgot-password"          element={<ForgotPassword />} />
        <Route path="/reset-password/:token"    element={<ResetPassword />} />
        <Route path="/reset-link-sent"          element={<ResetLinkSent />} />
        <Route path="/password-updated"         element={<PasswordUpdated />} />
      </Route>

      {/* ===== PUBLIC SHOP (full-width — no Container) ===== */}
      <Route element={<HomeLayout />}>
        <Route path="/"             element={<Home />} />
        <Route path="/about"        element={<About />} />
        <Route path="/contact"      element={<Contact />} />
        <Route path="/products"     element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms"        element={<TermsOfService />} />
        <Route path="/sitemap"      element={<Sitemap />} />
      </Route>

      {/* ===== CART (conventional layout) ===== */}
      <Route element={<CustomerLayout />}>
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* ===== CUSTOMER PROTECTED ===== */}
      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route element={<CustomerLayout />}>
          <Route path="/checkout"                 element={<Checkout />} />
          <Route path="/orders"                    element={<Orders />} />
          <Route path="/orders/:orderId"            element={<TrackOrder />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Route>
      </Route>

      {/* ===== PROFILE (customer + admin) ===== */}
      <Route element={<ProtectedRoute allowedRoles={["customer", "admin"]} />}>
        <Route element={<CustomerLayout />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* ===== ADMIN PROTECTED ===== */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard"    element={<AdminDashboard />} />
          <Route path="/admin/orders"       element={<AdminOrders />} />
          <Route path="/admin/materials"    element={<AdminMaterials />} />
          <Route path="/admin/extras"       element={<AdminExtras />} />
          <Route path="/admin/products"     element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminCreateProduct />} />
        </Route>
      </Route>

      {/* ===== 404 ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
    </>
  );
}
