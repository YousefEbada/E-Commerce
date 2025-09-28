import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
  };
  quantity: number;
}

const Cart = () => {
  const token = localStorage.getItem("token");
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data.items || res.data || []);
      setError("");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (productId: string, quantity: number) => {
    try {
      await axios.patch(
        "http://localhost:5000/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5000/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to remove item");
    }
  };

  const total = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart</h1>
        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.product.title}</h3>
                    <p className="text-sm text-gray-600">Unit price: ${item.product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-800 mt-1">
                      Subtotal: {item.quantity} × ${item.product.price.toFixed(2)} =
                      <span className="font-semibold"> ${(item.quantity * item.product.price).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQty(item.product._id, Number(e.target.value))}
                      className="border rounded px-2 py-1 w-20"
                    />
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="bg-red-600 text-white px-3 py-1.5 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total</span>
              <span className="text-xl font-bold text-indigo-700">${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;