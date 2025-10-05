import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // import the CSS

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
  const res = await API.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={submit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
