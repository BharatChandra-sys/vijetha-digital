import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/layout/Container";
import api from "../../api/axios";

export default function StaffProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/products")
      .then((res) => {
        if (!cancelled) setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <Container>
        <div className="py-12 flex items-center justify-center gap-3 text-[#6E6E73]">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Loading products…
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12 space-y-8">
        <div>
          <button
            onClick={() => navigate("/staff/workspace")}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#6E6E73] hover:text-[#3B2F63] transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Workspace
          </button>
          <h1 className="text-4xl font-bold text-[#1C1C1C] mb-2">Products Catalog</h1>
          <p className="text-[#6E6E73]">
            Browse product inventory, view specifications, categories, and current pricing
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6E73]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or categories…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#E6E3DD] bg-[#F8F7F4] text-sm focus:outline-none focus:border-[#3B2F63] transition-colors"
          />
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#6E6E73]">
            <span className="material-symbols-outlined text-5xl mb-3 block">inventory_2</span>
            <p className="font-medium">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl bg-gradient-to-br from-[#F8F7F4] to-[#F0EEEB] border-2 border-[#E6E3DD] p-6 hover:border-[#FF6B5E] transition-all hover:shadow-lg"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}
                <h3 className="font-bold text-[#1C1C1C] text-lg mb-1">{p.name}</h3>
                <p className="text-sm text-[#6E6E73] mb-2">{p.category}</p>
                {p.description && (
                  <p className="text-sm text-[#6E6E73] mb-3 line-clamp-2">{p.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#3B2F63]">
                    ₹ {p.base_price}
                    <span className="text-xs font-normal text-[#6E6E73]"> / {p.unit || "sq ft"}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
