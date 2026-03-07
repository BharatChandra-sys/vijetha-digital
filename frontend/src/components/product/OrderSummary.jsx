import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function OrderSummary({ config, price }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true });
      return;
    }

    if (user.role !== "customer") {
      alert("Only customers can place orders");
      return;
    }

    addToCart({
      config: {
        width: config.width,
        height: config.height,
        material: config.material,
        quantity: config.quantity,
        lamination: config.lamination ?? false,
        frame: config.frame ?? false,
      },
      price,
    });

    navigate("/cart");
  };

  return (
    <div className="border p-4 rounded-lg space-y-3">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <p>Size: {config.width} × {config.height} inches</p>
      <p>Material: {config.material}</p>
      <p>Quantity: {config.quantity}</p>

      <hr />

      <p className="text-2xl font-bold">₹ {price}</p>

      <button
        onClick={handleAddToCart}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Add to Cart
      </button>
    </div>
  );
}
