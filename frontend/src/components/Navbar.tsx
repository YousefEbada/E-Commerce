import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  let role: string | null = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload?.role ?? null;
    } catch {}
  }

  const isActive = (path: string) =>
    location.pathname.toLowerCase().startsWith(path.toLowerCase());

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
            <Link to="/Home" className="text-xl font-semibold text-indigo-700">
              NTI E-Commerce
            </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/Home"
              className={`text-sm ${isActive("/Home") ? "text-indigo-700 font-semibold" : "text-gray-600"}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`text-sm ${isActive("/products") ? "text-indigo-700 font-semibold" : "text-gray-600"}`}
            >
              Products
            </Link>
            <Link
              to="/cart"
              className={`text-sm ${isActive("/cart") ? "text-indigo-700 font-semibold" : "text-gray-600"}`}
            >
              Cart
            </Link>
          </div>          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
