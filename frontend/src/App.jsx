import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import MaintenanceOverlay from "./components/MaintenanceOverlay";
import WhatsAppButton from "./components/ui/WhatsAppButton";

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
import StaffLayout     from "./layouts/StaffLayout";

/* guards */
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute     from "./components/auth/AdminRoute";
import StaffRoute     from "./components/auth/StaffRoute";
import IamRoleRoute   from "./components/auth/IamRoleRoute";

/* public auth pages */
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import PasswordUpdated from "./pages/PasswordUpdated";
import ResetLinkSent  from "./pages/ResetLinkSent";

/* new auth portal pages */
import AdminLogin from "./pages/auth/AdminLogin";
import StaffLogin from "./pages/auth/StaffLogin";
import AdminForgotPassword from "./pages/auth/AdminForgotPassword";
import StaffForgotPassword from "./pages/auth/StaffForgotPassword";
import ResetPasswordNew from "./pages/auth/ResetPassword";

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
import AdminWorkspace     from "./pages/admin/AdminWorkspace";
import Staff              from "./pages/admin/Staff";
import StaffAccess        from "./pages/admin/StaffAccess";
import SecurityLogs       from "./pages/admin/SecurityLogs";
import Reports            from "./pages/admin/Reports";
import SiteSettings       from "./pages/admin/SiteSettings";
import Maintenance        from "./pages/Maintenance";

/* staff pages */
import OperationsDashboard from "./pages/staff/OperationsDashboard";
import DeliveryDashboard from "./pages/staff/DeliveryDashboard";
import StaffWorkspace from "./pages/staff/StaffWorkspace";
import StaffOrders from "./pages/staff/StaffOrders";
import StaffProducts from "./pages/staff/StaffProducts";
import StaffNotifications from "./pages/staff/StaffNotifications";
import StaffSchedule from "./pages/staff/StaffSchedule";

export default function App() {
  return (
    <>
    <MaintenanceOverlay />
    <WhatsAppButton />
    <ScrollToTop />
    <Routes>

      {/* ===== MAINTENANCE PAGE ===== */}
      <Route path="/maintenance" element={<Maintenance />} />

      {/* ===== NEW AUTH PORTALS (Full-screen, no layout) ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/staff/forgot-password" element={<StaffForgotPassword />} />
      <Route path="/reset-password" element={<ResetPasswordNew />} />

      {/* ===== PUBLIC AUTH (Legacy, kept for compatibility) ===== */}
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
          <Route path="/admin/workspace"    element={<AdminWorkspace />} />
          <Route path="/admin/staff"        element={<Staff />} />
          <Route path="/admin/staff-access" element={<StaffAccess />} />
          <Route path="/admin/security"     element={<SecurityLogs />} />
          <Route path="/admin/reports"      element={<Reports />} />
          <Route path="/admin/settings"     element={<SiteSettings />} />
        </Route>
      </Route>

      {/* ===== STAFF WORKSPACE ===== */}
      <Route element={<StaffRoute />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff/workspace" element={<StaffWorkspace />} />
          <Route path="/staff/orders" element={<StaffOrders />} />
          <Route path="/staff/products" element={<StaffProducts />} />
          <Route path="/staff/notifications" element={<StaffNotifications />} />
          <Route path="/staff/schedule" element={<StaffSchedule />} />
          <Route path="/staff/profile" element={<Profile />} />
          <Route path="/staff/operations" element={<OperationsDashboard />} />
          <Route path="/staff/delivery" element={<DeliveryDashboard />} />
        </Route>
      </Route>

      {/* ===== 404 ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
    </>
  );
}
