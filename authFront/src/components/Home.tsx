import { Link } from "react-router-dom";

const Home = () => {
  const message = localStorage.getItem("welcomeMessage");

  return (
    <div className="p-6 text-center">
      {message && <h1 className="text-2xl font-bold mb-4">{message}</h1>}
      <Link to="/" className="text-indigo-600 hover:underline">
        Register
      </Link>
    </div>
  );
};

export default Home;