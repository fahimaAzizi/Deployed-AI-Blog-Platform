import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${id}`
        );

        const post = response.data;

        if (post.author?.id !== token) {
          // Ownership is checked by the backend when saving.
        }

        setTitle(post.title);
        setContent(post.content);
        setPublished(post.published);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Could not load the post."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await axios.put(
        `http://localhost:5000/api/posts/${id}`,
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
          "Could not update the post."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  return (
    <div>
      <h1>Edit Post</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div>
          <label>Markdown Content</label>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows="15"
            required
          />
        </div>

        <div>
          <label>Preview</label>

          <div>
            <ReactMarkdown>
              {content || "Your Markdown preview will appear here..."}
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

          Published
        </label>

        {error && <p>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditPost;