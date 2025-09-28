import "./App.css";
import Register from "./components/Register";
import Home from "./components/Home";
import ProtectedRoute from "./components/protectedRoute";
import EmailVerification from "./components/EmailVerification";
import Products from "./components/Products";
import Cart from "./components/Cart";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/Home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products" 
          element={<Products />} 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Register />} />
        <Route path="/verify/:token" element={<EmailVerification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
