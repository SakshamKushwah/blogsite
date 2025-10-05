import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

export default function CreatePost() {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [alignment, setAlignment] = useState('left');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('content', content);
      formData.append('imageAlignment', alignment);
      if (imageFile) formData.append('image', imageFile);

      // ✅ FIXED: Correct backend route
      await API.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true, // optional if you're using cookies or auth
      });

      alert('✅ Post created successfully!');
      nav('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '❌ Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create Your Post</h2>

      <form onSubmit={submit} className="create-post-form">
        <label>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
        />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="News">News</option>
        </select>

        <label>Content *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
        ></textarea>

        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <label>Image Alignment</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="align"
              value="left"
              checked={alignment === 'left'}
              onChange={() => setAlignment('left')}
            />{' '}
            Left
          </label>
          <label>
            <input
              type="radio"
              name="align"
              value="center"
              checked={alignment === 'center'}
              onChange={() => setAlignment('center')}
            />{' '}
            Center
          </label>
          <label>
            <input
              type="radio"
              name="align"
              value="right"
              checked={alignment === 'right'}
              onChange={() => setAlignment('right')}
            />{' '}
            Right
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  );
}
