import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminDashboard(){
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(()=> {
    API.get('/posts').then(res => setPosts(res.data)).catch(console.error);
  }, []);

  const del = async (id) => {
    if (!window.confirm('Delete post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      setPosts(p => p.filter(x => x._id !== id));
    } catch (err) { alert('Delete failed'); }
  };

  if (!user || user.role !== 'admin') return <p>Admin only</p>;

  return (
    <div>
      <h2>Admin - Manage Posts</h2>
      {posts.map(p => (
        <div key={p._id} style={{ border:'1px solid #ccc', marginBottom:12, padding:8 }}>
          <h4>{p.title}</h4>
          <p>{p.content.slice(0,200)}...</p>
          <button onClick={()=>del(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
// hi 