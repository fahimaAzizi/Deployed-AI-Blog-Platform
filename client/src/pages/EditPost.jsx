import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
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
       const response = await api.get(`/api/posts/${id}`);

        const post = response.data;

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
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
     await api.put(
  `/api/posts/${id}`,
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
    <div className="editor-page">
      <div className="editor-header">
        <div>
          <p className="auth-label">EDITOR</p>
          <h1>Edit Post</h1>
        </div>

        <Link className="back-link" to="/">
          ← Back to posts
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="editor-form">
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
            rows="18"
            required
          />
        </div>

        <div className="preview-box">
          <div className="preview-header">
            <h3>Live Preview</h3>
            <span>Markdown</span>
          </div>

          <div className="markdown-preview">
            <ReactMarkdown>
              {content || "Your Markdown preview will appear here..."}
            </ReactMarkdown>
          </div>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) =>
              setPublished(event.target.checked)
            }
          />
          Published
        </label>

        {error && <p className="error-message">{error}</p>}

        <button
          className="save-button"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditPost;