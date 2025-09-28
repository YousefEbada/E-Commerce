import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import ProductCard from "./ProductCard";

// Configurable API (set VITE_API_URL, VITE_PRODUCTS_PATH, VITE_CART_PATH in .env if your backend differs)
const API_BASE = (import.meta as any)?.env?.VITE_API_URL || "http://localhost:5000";
const PRODUCTS_PATH = (import.meta as any)?.env?.VITE_PRODUCTS_PATH || "/products";
const CART_PATH = (import.meta as any)?.env?.VITE_CART_PATH || "/cart";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  amount: number; // local selected quantity for purchase only
}

const Products = () => {
  const token = localStorage.getItem("token");

  const role = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.role ?? null;
    } catch {
      return null;
    }
  }, [token]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "" });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const client = axios.create({
    baseURL: API_BASE,
    headers: token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" },
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await client.get(PRODUCTS_PATH);
      const raw = Array.isArray(res.data) ? res.data : res.data.products || [];
      setProducts(raw.map((p: any) => ({ ...p, amount: 1 })));
      setError("");
    } catch (e: any) {
      const msg = e?.response?.data?.message || `${e?.response?.status || ""} ${e?.response?.statusText || ""}` || "Failed to load products";
      setError(`Failed to load products: ${msg}`);
      console.error("Load products error:", e?.response || e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string, quantity: number) => {
    try {
      await client.post(`${CART_PATH}/add`, { productId, quantity });
      alert("Added to cart");
    } catch (e: any) {
      console.error("Add to cart error:", e?.response || e);
      alert(e?.response?.data?.message || `Failed to add to cart: ${e?.response?.status || ""}`);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (role !== "admin") {
      setCreateError("Only admins can create products");
      return;
    }
    const priceNum = Number(newProduct.price);
    if (!newProduct.title.trim() || !newProduct.description.trim() || !Number.isFinite(priceNum) || priceNum < 0) {
      setCreateError("Please enter valid title, description and a non-negative price");
      return;
    }
    try {
      setCreating(true);
      const body = {
        title: newProduct.title.trim(),
        description: newProduct.description.trim(),
        price: priceNum,
      };
      await client.post(PRODUCTS_PATH, body);
      setNewProduct({ title: "", description: "", price: "" });
      await fetchProducts();
      alert("Product created");
    } catch (e: any) {
      console.error("Create product error:", e?.response || e);
      const status = e?.response?.status;
      const endpoint = `${API_BASE}${PRODUCTS_PATH}`;
      const msg = e?.response?.data?.message || (status === 404 ? `Endpoint not found: ${endpoint}` : e?.message) || "Failed to create product";
      setCreateError(msg);
      alert(msg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Products</h1>

        {role === "admin" && (
          <div id="add" className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">Add New Product</h2>
            {createError && (
              <div className="text-red-600 text-sm mb-2">{createError}</div>
            )}
            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                required
                placeholder="Title"
                className="border rounded px-3 py-2"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              />
              <input
                required
                placeholder="Description"
                className="border rounded px-3 py-2"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <input
                required
                type="number"
                placeholder="Price"
                className="border rounded px-3 py-2"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                min={0}
                step={0.01}
              />
              <button disabled={creating} className="bg-indigo-600 disabled:opacity-60 text-white px-4 py-2 rounded md:col-span-3">
                {creating ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-gray-600">Loading products...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((p, idx) => (
              <ProductCard
                key={p._id}
                product={p}
                onChangeAmount={(next) =>
                  setProducts((prev) => prev.map((it, i) => (i === idx ? { ...it, amount: next } : it)))
                }
                onAddToCart={(qty) => handleAddToCart(p._id, Math.max(1, qty))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
