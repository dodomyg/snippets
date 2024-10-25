import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Popup from "./components/Popup";
import Auth from "./pages/Auth";
import SingleSnippet from "./pages/SingleSnippet";
import { CiCirclePlus } from "react-icons/ci";
import CreateSnippet from "./pages/CreateSnippet";
import Loading from "./components/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateSnippet from "./pages/UpdateSnippet";
axios.defaults.withCredentials = true;

const App = () => {
  const { user, loading, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = async () => {
    try {
      await axios.post(import.meta.env.VITE_URL + "/logout");
      toast.success("Logged Out!");
      setUser(null);
      navigate("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  // Show loading screen while checking user state
  if (loading) {
    return <Loading />;
  }

  // Popup condition: show only if user is not logged in and not on the auth page
  const shouldShowPopup = !user && location.pathname !== "/auth";

  return (
    <div>
      {shouldShowPopup && <Popup />}

      {user && (
        <button
          onClick={logOut}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 absolute top-4 right-4"
        >
          Logout
        </button>
      )}

      {user && (
        <p
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 font-semibold cursor-pointer"
        >
          Welcome {user?.email}
        </p>
      )}

      {user && (
        <p className="fixed bottom-4 right-4 font-semibold">
          <CiCirclePlus
            className="hover:scale-105 transition duration-300"
            size={64}
            cursor={"pointer"}
            onClick={() => navigate("/create")}
          />
        </p>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/snippet/:id" element={<SingleSnippet />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateSnippet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update/:id"
          element={
            <ProtectedRoute>
              <UpdateSnippet />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={user ? <Home /> : <Navigate to="/auth" />} /> */}
      </Routes>
    </div>
  );
};

export default App;
