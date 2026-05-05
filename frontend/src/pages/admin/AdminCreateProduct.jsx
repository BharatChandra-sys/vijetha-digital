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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.category || !product.base_price) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("category", product.category);
      formData.append("base_price", Number(product.base_price));
      if (image) {
        formData.append("image", image);
      }

      await api.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product created successfully");
      setProduct({ name: "", category: "", base_price: "" });
      setImage(null);
      setPreview(null);
    } catch (error) {
      alert("Failed to create product: " + (error.response?.data?.detail || error.message));
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image (Optional)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                JPEG, PNG, or WebP (max 5MB)
              </p>
              {preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-xs h-auto rounded border"
                  />
                </div>
              )}
            </div>

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
