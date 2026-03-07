import { useEffect, useState } from "react";
import Container from "../../components/layout/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import api from "../../api/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    let cancelled = false;

    api
      .get("/products")
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data);
        }
      })
      .catch((error) => {
        console.error("Failed to load admin products", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/admin/products/${id}`);
    load();
  };

  return (
    <Container>
      <div className="py-10 space-y-6">
        <h1 className="text-3xl font-bold">Products</h1>

        {products.map((p) => (
          <Card key={p.id}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-600">
                  {p.category}
                </p>
                <p className="text-sm">
                  ₹ {p.base_price} / sq ft
                </p>
              </div>

              <Button
                variant="danger"
                onClick={() => remove(p.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
