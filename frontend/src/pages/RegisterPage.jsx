import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Phone number is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch {
      setError('Registration failed. The email may already be used.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-2xl font-bold">Register</h1>
          <p className="mt-1 text-sm text-slate-500">Create an account to post and manage jobs.</p>
        </div>
        {error && <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">{error}</div>}
        <label className="space-y-2 block">
          <span className="label">Name</span>
          <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </label>
        <label className="space-y-2 block">
          <span className="label">Email</span>
          <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="space-y-2 block">
          <span className="label">Phone</span>
          <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+996 555 123 456" required />
        </label>
        <label className="space-y-2 block">
          <span className="label">Password</span>
          <input className="field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Already registered? <Link className="font-semibold text-brand-700 dark:text-brand-100" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
