import { Link, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav>
        <Link to="/">F4 AI Blog</Link>

        <div>
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.name}</span>

              <Link to="/create-post">
                Create Post
              </Link>

              <button onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route
  path="/create-post"
  element={
    <ProtectedRoute>
      <CreatePost />
    </ProtectedRoute>
  }
/>
        </Routes>
      </main>
    </>
  );
}

export default App;