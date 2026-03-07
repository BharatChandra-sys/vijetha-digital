import { useState } from "react";
import Container from "../../components/layout/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api from "../../api/axios";

export default function AdminCreateProduct() {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    base_price: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.category || !product.base_price) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/admin/products", {
        name: product.name,
        category: product.category,
        base_price: Number(product.base_price),
      });

      alert("Product created successfully");
      setProduct({ name: "", category: "", base_price: "" });
    } catch {
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-10 max-w-xl mx-auto">
        <Card>
          <h1 className="text-2xl font-bold mb-4">
            Add New Product
          </h1>

          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Product Name"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />

            <Input
              label="Category"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            />

            <Input
              label="Base Price (₹ / sq ft)"
              type="number"
              value={product.base_price}
              onChange={(e) =>
                setProduct({
                  ...product,
                  base_price: e.target.value,
                })
              }
            />

            <Button
              className="w-full"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating…" : "Create Product"}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
