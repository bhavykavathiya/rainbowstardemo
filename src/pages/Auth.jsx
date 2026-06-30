import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatApiErrorDetail } from '../lib/api';
import { toast } from 'sonner';
import { Diamond } from 'lucide-react';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { const u = await login(form.email, form.password); toast.success('Welcome back'); navigate(u.role === 'admin' ? '/admin' : '/natural'); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };
  const guest = () => { loginAsGuest(); toast.success('Browsing as Guest'); navigate('/natural'); };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12" data-testid="login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Diamond size={32} className="text-[#C9A227] mx-auto mb-3" strokeWidth={0.8}/>
          <h1 className="font-serif text-4xl mb-1">Sign In</h1>
          <p className="text-[#1A1505] text-sm">Sign in to your trade account, or continue as a guest</p>
        </div>
        <button onClick={guest} type="button" className="w-full btn-outline-gold justify-center mb-3" data-testid="login-guest">Continue as Guest →</button>
        <div className="flex items-center gap-3 my-4 text-[10px] uppercase tracking-widest text-[#6B5F3D]"><div className="flex-1 h-px bg-[#E8DFC2]"/>or sign in<div className="flex-1 h-px bg-[#E8DFC2]"/></div>
        <form onSubmit={submit} className="space-y-3 bg-white border border-[#E8DFC2] p-8">
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white border border-[#D9CB94] px-4 py-3 text-sm rounded-sm" data-testid="login-email"/>
          <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-white border border-[#D9CB94] px-4 py-3 text-sm rounded-sm" data-testid="login-password"/>
          {err && <div className="text-xs text-red-400" data-testid="login-error">{err}</div>}
          <button disabled={busy} className="w-full btn-gold justify-center" data-testid="login-submit">{busy ? 'Signing in…' : 'Sign In'}</button>
        </form>
        <div className="text-center mt-5 text-sm text-[#1A1505]">No account? <Link to="/register" className="text-[#C9A227] hover:underline" data-testid="goto-register">Create a trade account</Link></div>
      </div>
    </div>
  );
};

export const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', phone: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const { register } = useAuth(); const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await register(form); toast.success('Account created'); navigate('/'); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12" data-testid="register-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Diamond size={32} className="text-[#C9A227] mx-auto mb-3" strokeWidth={0.8}/>
          <h1 className="font-serif text-4xl mb-1">Create Account</h1>
          <p className="text-[#1A1505] text-sm">Trade accounts — for jewelers, dealers, and collectors</p>
        </div>
        <form onSubmit={submit} className="space-y-3 bg-white border border-[#E8DFC2] p-8">
          <input required placeholder="Full name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white border border-[#D9CB94] px-4 py-3 text-sm" data-testid="reg-name"/>
          <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white border border-[#D9CB94] px-4 py-3 text-sm" data-testid="reg-email"/>
          <input required type="password" placeholder="Password * (min 6)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-white border border-[#D9CB94] px-4 py-3 text-sm" data-testid="reg-password"/>
          <input placeholder="Company / Trade name" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-white border border-[#D9CB94] px-4 py-3 text-sm" data-testid="reg-company"/>
          <input placeholder="Phone / WhatsApp" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white border border-[#D9CB94] px-4 py-3 text-sm" data-testid="reg-phone"/>
          {err && <div className="text-xs text-red-400">{err}</div>}
          <button disabled={busy} className="w-full btn-gold justify-center" data-testid="reg-submit">{busy ? 'Creating…' : 'Create account'}</button>
        </form>
        <div className="text-center mt-5 text-sm text-[#1A1505]">Have an account? <Link to="/login" className="text-[#C9A227] hover:underline">Sign in</Link></div>
      </div>
    </div>
  );
};
