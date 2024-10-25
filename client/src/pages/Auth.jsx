import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
axios.defaults.withCredentials = true;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h1 onClick={()=>navigate("/")} className="text-3xl font-bold text-center mb-6 text-blue-600 cursor-pointer">
          Snippet.io
        </h1>

        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 font-semibold text-lg border-b-2 ${
              isLogin ? "border-blue-600" : "border-transparent"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`ml-4 px-4 py-2 font-semibold text-lg border-b-2 ${
              !isLogin ? "border-blue-600" : "border-transparent"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

function LoginForm() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const loginForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!data.email || !data.password) {
        setLoading(false);
        return toast.error("All fields are required");
      }
      const resp = await axios.post(import.meta.env.VITE_URL + "/login", data, {
        withCredentials: true,
      });
      toast.success("Login Successful");

      setLoading(false);
      console.log(resp.data);

      setUser(resp.data.user);
      setData({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response) {
        setLoading(false);
        return toast.error(error.response.data.error || "Server error");
      } else if (error.request) {
        setLoading(false);
        return toast.error("Network error");
      } else {
        setLoading(false);
        return toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={loginForm}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          type="email"
          placeholder="Enter your email"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          type="password"
          placeholder="Enter your password"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700"
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}

function RegisterForm() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const registerForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!data.email || !data.password) {
        setLoading(false);
        return toast.error("All fields are required");
      }
      await axios.post(import.meta.env.VITE_URL + "/register", data);
      toast.success("Registration successful , Now Login");
      setLoading(false);
      setData({ email: "", password: "" });
    } catch (error) {
      console.log(error);
      if (error.response) {
        setLoading(false);
        return toast.error(error.response.data.error || "Server error");
      } else if (error.request) {
        setLoading(false);
        return toast.error("Network error");
      } else {
        setLoading(false);
        return toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="space-y-4" onSubmit={registerForm}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="Enter your email"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          placeholder="Enter your password"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700"
      >
        {loading ? "Loading..." : "Register"}
      </button>
    </form>
  );
}

export default Auth;
