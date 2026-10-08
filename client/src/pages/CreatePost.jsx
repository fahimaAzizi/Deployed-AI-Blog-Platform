import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

function CreatePost() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuggestTitles = async () => {
    if (!content.trim()) {
      setError("Write some blog content first.");
      return;
    }

    setError("");
    setAiLoading(true);
    setSuggestions([]);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/suggest-titles",
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Could not generate AI suggestions."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/posts",
        {
          title,
          content,
          published,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Could not create the post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Post</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter your post title"
            required
          />
        </div>

        <div>
          <label>Markdown Content</label>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your post using Markdown..."
            rows="15"
            required
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleSuggestTitles}
            disabled={aiLoading}
          >
            {aiLoading
              ? "Generating titles..."
              : "✨ Suggest Titles with AI"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div>
            <h3>AI Title Suggestions</h3>

            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setTitle(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div>
          <label>Preview</label>

          <div>
            <ReactMarkdown>
              {content ||
                "Your Markdown preview will appear here..."}
            </ReactMarkdown>
          </div>
        </div>

        <label>
          <input
            type="checkbox"
            checked={published}
            onChange={(event) =>
              setPublished(event.target.checked)
            }
          />
          Publish immediately
        </label>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;