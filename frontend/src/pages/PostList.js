import React, { useEffect, useState } from "react";
import API from "../api";
import "./PostList.css";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
  const res = await API.get("/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

 const updateAlignment = async (alignment) => {
  if (!selectedPost) return;

  try {
    const token = localStorage.getItem("token"); // get user token
    if (!token) {
      alert("You are not authorized to update this post.");
      return;
    }

    const res = await API.patch(
      `/api/posts/${selectedPost._id}`,
      { imageAlignment: alignment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if backend returned the updated post
    const updatedPost = res.data.post || res.data; // adjust based on backend response
    if (!updatedPost) {
      alert("Backend did not return updated post.");
      return;
    }

    // Update frontend state
    setPosts(posts.map(p => (p._id === selectedPost._id ? updatedPost : p)));
    setSelectedPost(updatedPost);

  } catch (err) {
    console.error("Update Alignment Error:", err.response || err);
    alert(err.response?.data?.msg || "Failed to update alignment");
  }
};


  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
  await API.delete(`/api/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
      setSelectedPost(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to delete post");
    }
  };

  return (
    <div className="post-list-container">
      <h2 className="page-title">📚 Latest Blog Posts</h2>

      <div className="post-grid">
        {posts.length === 0 && <p>No posts available</p>}

        {posts.map((p) => (
          <div
            key={p._id}
            className="post-card"
            onClick={() => setSelectedPost(p)}
          >
            {p.imageUrl && (
              <img
                className="post-card-img"
                src={`https://backend-blog-h5cb.onrender.com/${p.imageUrl.replace(/^\/+/, "")}`}
                alt={p.title}
              />
            )}
            <div className="post-card-content">
              <h3>{p.title}</h3>
              <p className="post-preview">{p.content.slice(0, 100)}...</p>
              <div className="post-meta">
                <span>✍️ {p.author?.name || "Unknown"}</span>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPost && (
        <div className="modal" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.content}</p>
            <small>
              By: {selectedPost.author?.name || "Unknown"} |{" "}
              {new Date(selectedPost.createdAt).toLocaleString()}
            </small>

            {selectedPost.imageUrl && (
              <img
                className={`modal-img ${selectedPost.imageAlignment || "left"}`}
                src={`https://backend-blog-h5cb.onrender.com/${selectedPost.imageUrl.replace(/^\/+/, "")}`}
                alt={selectedPost.title}
              />
            )}

            {(user?.role === "admin" || user?._id === selectedPost.author?._id) &&
              selectedPost.imageUrl && (
                <div className="alignment-controls">
                  <p>🖼 Change Image Alignment:</p>
                  <button onClick={() => updateAlignment("left")}>Left</button>
                  <button onClick={() => updateAlignment("center")}>Center</button>
                  <button onClick={() => updateAlignment("right")}>Right</button>
                </div>
              )}

            {(user?.role === "admin" || user?._id === selectedPost.author?._id) && (
              <button className="delete-btn" onClick={() => deletePost(selectedPost._id)}>
                🗑 Delete Post
              </button>
            )}

            <span className="close" onClick={() => setSelectedPost(null)}>
              &times;
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

