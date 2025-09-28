import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();
  const message = localStorage.getItem("welcomeMessage");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("welcomeMessage");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-[40px]">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Welcome to Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {message}
            </div>
          )}
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              You are now logged in and your email is verified!
            </h2>
            <p className="text-gray-600">
              This is a protected route that only authenticated and verified users can access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;