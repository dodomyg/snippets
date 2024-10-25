import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import toast from "react-hot-toast"; // For notifications
import { FaCopy } from "react-icons/fa"; // Copy icon

const SingleSnippet = () => {
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchSingleSnippet = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(import.meta.env.VITE_URL + `/get_single/${id}`);
        setSnippet(resp.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleSnippet();
  }, [id]);

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy code.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!snippet) {
    return <div className="text-center text-xl mt-8">No snippet found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{snippet.title}</h1>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Created by</span>
            {/* Avatar with the first letter of email */}
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg">
              {snippet.author.email.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-500">{snippet.author.email}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Created at: {new Date(snippet.createdAt).toLocaleDateString()}
        </p>

        <p className="mb-4 text-gray-800">{snippet.description}</p>

        <div className="relative">
          <button
            onClick={() => copyToClipboard(snippet.code)}
            className="absolute top-2 right-2 bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-lg flex items-center"
          >
            <FaCopy className="mr-2" />
            Copy Code
          </button>
          <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-auto">
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SingleSnippet;
