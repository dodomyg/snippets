import { FaPython, FaJs, FaJava, FaCuttlefish, FaCode } from "react-icons/fa"; // Icons for programming languages
import moment from "moment"; // For formatting the created date
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { UserContext } from "../context/UserContext";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";
axios.defaults.withCredentials = true;

const getLanguageIcon = (pl) => {
  switch (pl) {
    case "Python":
      return <FaPython className="text-blue-600" />;
    case "Javascript":
      return <FaJs className="text-yellow-400" />;
    case "Java":
      return <FaJava className="text-red-500" />;
    case "C":
    case "C++":
      return <FaCuttlefish className="text-blue-800" />;
    default:
      return <FaCode className="text-gray-500" />;
  }
};

const Home = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [pl, setPl] = useState("all");

  const deleteSnippet = async (id) => {
    setLoading(true);
    try {
      const resp = await axios.delete(
        import.meta.env.VITE_URL + `/delete/${id}`,
        { withCredentials: true }
      );
      console.log(resp.data);

      toast.success("Snippet deleted successfully");
      setSnippets(snippets.filter((s) => s._id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchSnippets = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(import.meta.env.VITE_URL + "/get", {
          withCredentials: true,
        });

        setSnippets(resp.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);

  const filteredSnippets = snippets.filter((s) => {
    return (
      s.title.toLowerCase().includes(search.toLowerCase()) &&
      (pl === "all" ||
        (pl !== "all" && s.pl.toLowerCase() === pl.toLowerCase()))
    );
  });

  const clearFilters = () => {
    if (pl !== "" || search !== "") {
      setPl("all");
      setSearch("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">All Snippets</h1>

      {loading && <Loading />}

      <div className="flex items-center justify-center space-x-4 my-5">
        {/* Search Input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search snippets"
          className="border rounded-lg px-4 py-2 w-64"
        />

        {/* Language Filter Dropdown */}
        <select
          value={pl}
          onChange={(e) => setPl(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All</option>
          <option value="Python">Python</option>
          <option value="Javascript">Javascript</option>
          <option value="Java">Java</option>
          <option value="Go">Go</option>
          <option value="C">C</option>
          <option value="C++">C++</option>
        </select>

        {/* Clear Filters Button */}
        {(search || pl !== "all") && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredSnippets?.length === 0 && (
        <h1 className="text-center text-2xl font-medium text-gray-600">
          No Snippets 😥
        </h1>
      )}
      {filteredSnippets &&
        filteredSnippets.map((snippet) => (
          <div
            key={snippet._id}
            className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto cursor-pointer hover:scale-105 transition duration-500"
          >
            <div className="flex items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-semibold">{snippet.title}</h2>
                    <p className="text-gray-600 flex items-center mb-2">
                      {getLanguageIcon(snippet.pl)}
                      <span className="ml-2">{snippet.pl}</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 mr-4 flex flex-col items-start">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-bold">
                        <p className="text-center">
                          {snippet.author.email.charAt(0).toUpperCase()}
                        </p>
                      </div>
                      <p>{snippet.author.email}</p>
                    </div>
                    <p className="text-gray-500 text-sm text-center mt-2">
                      {moment(snippet.createdAt).format("MMM DD, YYYY")}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{snippet.desc}</p>

                <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-auto">
                  <code>{snippet?.code}</code>
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between">
            {user?._id === snippet?.author?._id && (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(`/update/${snippet._id}`)}>
                  <FaRegEdit color="blue" size={24} />
                </button>
                <button onClick={() => deleteSnippet(snippet._id)}>
                  <MdDelete color="red" size={24} />
                </button>
              </div>
            )}
            <button onClick={() => navigate(`/snippet/${snippet._id}`)}>
              View More
            </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Home;
