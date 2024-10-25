import axios from "axios";
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
axios.defaults.withCredentials = true;

const CreateSnippet = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const [data, setData] = useState({
    title: "",
    desc: "",
    pl: "",
    code: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await axios.post(import.meta.env.VITE_URL + "/create", data);
      console.log(resp.data);
      toast.success("Snippet created successfully!");
      setLoading(false);
      setData({
        title: "",
        desc: "",
        pl: "",
        code: "",
      });
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
    }
  };
  if (!user) return <Navigate to="/" />
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
          Create a Code Snippet
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter title"
            />
          </div>

          {/* Programming Language Dropdown */}
          <div>
            <label
              htmlFor="pl"
              className="block text-sm font-medium text-gray-700"
            >
              Programming Language
            </label>
            <select
              id="pl"
              name="pl"
              value={data.pl}
              onChange={(e) => setData({ ...data, pl: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a language</option>
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="Go">Go</option>
              <option value="Dart">Dart</option>
              <option value="Javascript">Javascript</option>
            </select>
          </div>

          {/* Description Input */}
          <div>
            <label
              htmlFor="desc"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              value={data.desc}
              onChange={(e) => setData({ ...data, desc: e.target.value })}
              id="desc"
              name="desc"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Optional description..."
            />
          </div>

          {/* Code Input */}
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Code
            </label>
            <textarea
              id="code"
              name="code"
              value={data.code}
              onChange={(e) => setData({ ...data, code: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Paste your code here"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSnippet;
