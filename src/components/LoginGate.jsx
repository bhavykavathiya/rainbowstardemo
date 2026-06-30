import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Diamond, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginGate = ({ children }) => {
  const { user, checking, loginAsGuest } = useAuth();
  if (checking) return <div className="py-32 text-center text-[#6B5F3D]">Loading…</div>;
  if (user && user !== false) return children;
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center" data-testid="login-gate">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF8E1] border border-[#C9A227]/40 mb-6">
        <Lock size={26} className="text-[#9B7A14]"/>
      </div>
      <div className="overline mb-3">Trade access only</div>
      <h1 className="font-serif text-4xl md:text-5xl mb-4">Sign in to view the full vault</h1>
      <p className="text-[#3D3520] max-w-md mx-auto mb-8">Our complete inventory of 5000+ certified diamonds — including rare Argyle Pink &amp; Argyle Blue — is reserved for verified trade buyers and guests.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={loginAsGuest} className="btn-outline-gold" data-testid="gate-guest">Continue as Guest <ArrowRight size={14}/></button>
        <Link to="/login" className="btn-gold" data-testid="gate-login">Sign In <ArrowRight size={14}/></Link>
        <Link to="/register" className="text-sm text-[#6B5F3D] underline-offset-4 hover:underline self-center sm:ml-2" data-testid="gate-register">or create a trade account →</Link>
      </div>
      <div className="mt-12 flex justify-center gap-2 opacity-60">
        <Diamond size={14} className="text-[#C9A227]"/>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B5F3D]">GIA · IGI · HRD certified inventory</span>
        <Diamond size={14} className="text-[#C9A227]"/>
      </div>
    </div>
  );
};

export default LoginGate;
