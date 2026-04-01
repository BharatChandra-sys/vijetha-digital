import { Outlet } from "react-router-dom";
import StaffHeader from "../components/layout/StaffHeader";
import Footer from "../components/layout/Footer";

export default function StaffLayout() {
  return (
    <>
      <StaffHeader />
      <main className="min-h-screen bg-warm-white px-4 sm:px-6 lg:px-10 py-6 font-display">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
