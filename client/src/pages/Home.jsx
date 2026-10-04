import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchPosts();
  }, []);

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

          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </article>
      ))}
    </div>
  );
}

export default Home;