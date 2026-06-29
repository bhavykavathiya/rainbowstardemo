import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBasket } from '../context/BasketContext';

const NAT_SUBNAV = [
  { to: '/natural?type=white', label: 'White / Colorless' },
  { to: '/natural?type=fancy', label: 'Fancy Color' },
  { to: '/argyle-pink', label: 'Argyle Pink', pink: true },
  { to: '/argyle-blue', label: 'Argyle Blue', blue: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [natOpen, setNatOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useBasket();
  const navigate = useNavigate();
  const loc = useLocation();

  const linkClass = (active) =>
    `nav-tile px-3 py-2 text-sm tracking-wider uppercase ${active ? 'text-[#E5C158]' : 'text-white/80 hover:text-white'}`;

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#14110A]/85 backdrop-blur-xl" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-testid="nav-logo">
          <div className="w-9 h-9 border border-[#E5C158] rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#E5C158] rotate-45" />
          </div>
          <div>
            <div className="font-serif text-xl tracking-wide refraction">Rainbow Star</div>
            <div className="text-[9px] tracking-[0.3em] text-white/65 uppercase -mt-1">B2B Diamond House</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/" className={linkClass(loc.pathname === '/')} data-testid="nav-home">Home</Link>
          <Link to="/cvd" className={linkClass(loc.pathname === '/cvd')} data-testid="nav-cvd">CVD Diamonds</Link>
          <div className="relative" onMouseEnter={() => setNatOpen(true)} onMouseLeave={() => setNatOpen(false)}>
            <button className={`${linkClass(loc.pathname.startsWith('/natural') || loc.pathname.startsWith('/argyle'))} flex items-center gap-1`} data-testid="nav-natural-trigger">
              Natural <ChevronDown size={14} />
            </button>
            {natOpen && (
              <div className="absolute top-full left-0 pt-2 w-64" data-testid="nav-natural-menu">
                <div className="glass border border-white/10 py-2">
                  {NAT_SUBNAV.map(n => (
                    <Link key={n.to} to={n.to} className={`block px-5 py-2.5 text-sm hover:bg-white/5 transition ${n.pink ? 'text-[#C68997]' : n.blue ? 'text-[#6DD0F8]' : 'text-white/80'}`} data-testid={`nav-sub-${n.label.replace(/\s+/g, '-').toLowerCase()}`}>
                      {n.pink || n.blue ? '◆ ' : ''}{n.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link to="/about" className={linkClass(loc.pathname === '/about')} data-testid="nav-about">About</Link>
          <Link to="/request" className={linkClass(loc.pathname === '/request')} data-testid="nav-request">Request a Stone</Link>
          <Link to="/contact" className={linkClass(loc.pathname === '/contact')} data-testid="nav-contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/basket" className="relative p-2 hover:bg-white/5 rounded" data-testid="nav-basket">
            <ShoppingBag size={20} className="text-[#E5C158]" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E5C158] text-[#14110A] text-[10px] font-bold rounded-full flex items-center justify-center" data-testid="nav-basket-count">{items.length}</span>
            )}
          </Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className="hidden sm:inline-flex btn-outline-gold !py-2 !px-3 !text-xs" data-testid="nav-admin">Admin</Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="hidden sm:inline-flex items-center gap-1 text-sm text-white/70 hover:text-white" data-testid="nav-logout"><LogOut size={14}/> Logout</button>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex btn-outline-gold !py-2 !px-4 !text-xs" data-testid="nav-login">Login</Link>
          )}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2" data-testid="nav-mobile-toggle">
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-white/5 px-6 py-4 space-y-1 bg-[#14110A]" data-testid="nav-mobile-menu">
          {[['/','Home'],['/cvd','CVD Diamonds'],['/natural','Natural'],['/argyle-pink','Argyle Pink'],['/argyle-blue','Argyle Blue'],['/about','About'],['/request','Request a Stone'],['/contact','Contact']].map(([to,label]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className="block py-2 text-sm uppercase tracking-wider text-white/80 hover:text-[#E5C158]">{label}</Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
