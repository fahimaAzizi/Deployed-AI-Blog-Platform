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
      <h1>Latest Posts</h1>

      {loading && <p>Loading posts...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p>No published posts yet.</p>
      )}

      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>

          <p>
            By {post.author?.name || "Unknown author"}
          </p>

          {user?.id === post.author?.id && (
            <div>
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

          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </article>
      ))}
    </div>
  );
}

export default Home;