import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Popup = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  if (user || location.pathname === "/auth") return null;
  return (
    <nav className="bg-slate-800 shadow-md sticky top-0 z-30">
      <div className="container mx-auto py-4 flex items-center justify-between px-4">
        <p className="text-white text-xl font-semibold">
          To create snippets, please Login
        </p>
        <Link
          to={"/auth"}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Popup;
