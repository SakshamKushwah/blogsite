import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // import the CSS

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
  const res = await API.post('/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={submit}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({...form, name:e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email:e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({...form, password:e.target.value})}
          required
        />
        <select
          value={form.role}
          onChange={e => setForm({...form, role:e.target.value})}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
