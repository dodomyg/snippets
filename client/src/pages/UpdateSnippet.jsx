import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const UpdateSnippet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState({
    title: "",
    pl: "",
    code: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/get_single/${id}`
        );
        setSnippet({
          title: response.data.title,
          pl: response.data.pl,
          code: response.data.code,
          description: response.data.description || "",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippet();
  }, [id]);

  const handleChange = (e) => {
    setSnippet({ ...snippet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`${import.meta.env.VITE_URL}/update/${id}`, snippet);
      toast.success("Snippet updated successfully!");
      navigate("/");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Failed to update snippet.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Snippet</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-semibold"
            >
              Snippet Title:
            </label>
            <input
              type="text"
              name="title"
              value={snippet.title}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="pl" className="block text-gray-700 font-semibold">
              Programming Language:
            </label>
            <select
              name="pl"
              value={snippet.pl}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Language</option>
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="Go">Go</option>
              <option value="Dart">Dart</option>
              <option value="Javascript">Javascript</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-semibold"
            >
              Description:
            </label>
            <textarea
              name="description"
              value={snippet.description}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="code" className="block text-gray-700 font-semibold">
              Code:
            </label>
            <textarea
              name="code"
              value={snippet.code}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              rows="6"
              required
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            {loading ? "Updating..." : "Update Snippet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSnippet;
