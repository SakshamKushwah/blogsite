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
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateAlignment = async (alignment) => {
    if (!selectedPost) return;
    try {
      const res = await API.patch(`/posts/${selectedPost._id}`, { imageAlignment: alignment });
      setPosts(posts.map(p => (p._id === selectedPost._id ? res.data : p)));
      setSelectedPost(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to update alignment");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
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
                src={`https://blogsite-9nr5-b.vercel.app/${p.imageUrl.replace(/^\/+/, "")}`}
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
                src={`https://blogsite-9nr5-b.vercel.app/${selectedPost.imageUrl.replace(/^\/+/, "")}`}
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

