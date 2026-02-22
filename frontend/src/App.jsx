import { Routes, Route, Navigate } from "react-router-dom";

/* layouts */
import PublicLayout from "./layouts/PublicLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

/* guards */
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

/* public auth pages */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PasswordUpdated from "./pages/PasswordUpdated";
import ResetLinkSent from "./pages/ResetLinkSent"; // ✅ ADD THIS

/* public shop pages */
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

/* customer pages */
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

/* admin pages */
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminMaterials from "./pages/admin/Materials";
import AdminExtras from "./pages/admin/Extras";
import AdminProducts from "./pages/admin/Products";
import AdminCreateProduct from "./pages/admin/AdminCreateProduct";

export default function App() {
  return (
    <Routes>

      {/* ================= PUBLIC AUTH ================= */}
      <Route element={<PublicLayout />}>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Password Reset Flow */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/reset-link-sent" element={<ResetLinkSent />} />
        <Route path="/password-updated" element={<PasswordUpdated />} />

      </Route>

      {/* ================= PUBLIC SHOP ================= */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* ================= CUSTOMER PROTECTED ================= */}
      <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
        <Route element={<CustomerLayout />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Route>

      {/* ================= ADMIN PROTECTED ================= */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/materials" element={<AdminMaterials />} />
          <Route path="/admin/extras" element={<AdminExtras />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminCreateProduct />} />
        </Route>
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
