import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, token } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/posts"
      );

      setPosts(response.data);
    } catch (error) {
      console.error(error);
      setError("Could not load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId)
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Could not delete the post."
      );
    }
  };

  return (
    <div>
      <section className="hero">
        <p className="hero-label">F4 AI BLOG PLATFORM</p>

        <h1>Ideas, stories, and knowledge.</h1>

        <p>
          Discover thoughtful articles and use AI to turn your
          ideas into better blog posts.
        </p>

        {user && (
          <Link className="hero-button" to="/create">
            Write a Post
          </Link>
        )}
      </section>

      <section>
        <div className="section-heading">
          <h2>Latest Posts</h2>
          <span>{posts.length} published</span>
        </div>

        {loading && <p>Loading posts...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <div className="empty-state">
            <h3>No published posts yet</h3>
            <p>Be the first person to publish a story.</p>

            {user && (
              <Link to="/create">
                Create your first post
              </Link>
            )}
          </div>
        )}

        <div className="post-grid">
          {posts.map((post) => (
            <article className="post-card" key={post.id}>
              <div className="post-card-content">
                <p className="post-author">
                  By {post.author?.name || "Unknown author"}
                </p>

                <h3>{post.title}</h3>

                <div className="post-preview">
                  <ReactMarkdown>
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>

              {user?.id === post.author?.id && (
                <div className="post-actions">
                  <Link to={`/edit/${post.id}`}>
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;