import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";

export default function AdminLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-warm-white px-4 sm:px-6 lg:px-10 py-6 font-display">
        <Outlet />
      </main>
    </>
  );
}
