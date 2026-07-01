import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Shield, ShieldCheck, Globe, ArrowRight, Gem } from 'lucide-react';
import { DiamondDust } from '../components/DiamondDust';
import { CONTACT, buildWhatsappLink, fetchDiamonds, fetchDiamondStats, subscribeNewsletter } from '../lib/api';
import { toast } from 'sonner';

const TILES = [
  { to: '/cvd', label: 'CVD Diamonds', accent: '#b8960c', desc: 'Lab-grown, certified, type IIa' },
  { to: '/natural', label: 'Natural Diamonds', accent: '#b8960c', desc: 'Fancy color, GIA graded' },
  { to: '/argyle-pink', label: 'Argyle Pink', accent: '#B7536B', desc: 'The world\'s rarest pinks', pink: true },
  { to: '/argyle-blue', label: 'Argyle Blue', accent: '#2F8FCB', desc: 'Whispers of violet & ocean', blue: true },
  { to: '/request', label: 'Request a Stone', accent: '#b8960c', desc: 'Bespoke sourcing service' },
  { to: '/contact', label: 'Contact', accent: '#b8960c', desc: 'WhatsApp, email, trade desk' },
];

const GiaSvg = () => (
  <svg width="80" height="32" viewBox="0 0 80 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="32" rx="4" fill="#b8960c"/>
    <text x="40" y="22" fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="2">GIA</text>
  </svg>
);
const IgiSvg = () => (
  <svg width="80" height="32" viewBox="0 0 80 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="32" rx="4" fill="#b8960c"/>
    <text x="40" y="22" fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="2">IGI</text>
  </svg>
);

const BADGES = [
  { type: 'svg', Svg: GiaSvg, alt: 'GIA Certified', label: 'GIA Certified' },
  { type: 'svg', Svg: IgiSvg, alt: 'IGI Certified', label: 'IGI Certified' },
  { type: 'icon', Icon: ShieldCheck, alt: 'Conflict Free', label: 'Conflict Free', sub: 'Kimberley Certified', color: '#b8960c' },
  { type: 'icon', Icon: Globe, alt: 'Worldwide Shipping', label: 'Worldwide Shipping', sub: '32+ Countries', color: '#b8960c' },
];

const Home = () => {
  const [stats, setStats] = useState({ total: 0, by_category: {} });
  const [featured, setFeatured] = useState([]);
  const [displayCount, setDisplayCount] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchDiamondStats().then(setStats);
    fetchDiamonds({ limit: 8 }).then(data => {
      setFeatured(data.filter(d => d.total_price > 3000).slice(0, 8));
    });
  }, []);

  useEffect(() => {
    if (!stats.total) return;
    const target = stats.total;
    let i = 0;
    const step = Math.max(1, Math.floor(target / 50));
    const id = setInterval(() => {
      i += step;
      if (i >= target) { setDisplayCount(target); clearInterval(id); }
      else setDisplayCount(i);
    }, 30);
    return () => clearInterval(id);
  }, [stats.total]);

  const submitNewsletter = async (e) => {
    e.preventDefault();
    try {
      await subscribeNewsletter(email);
      toast.success('Subscribed! Trade updates coming your way.');
      setEmail('');
    } catch { toast.error('Could not subscribe'); }
  };

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FFF8E1] to-[#FAF6E8]" />
        <div className="absolute inset-0 grain opacity-40" />
        <DiamondDust count={70} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b8960c]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B7536B]/8 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }} className="font-serif leading-[0.95] text-5xl sm:text-6xl md:text-7xl mb-6">
              Rare Diamonds.<br/>Real Value.<br/>
              <span className="refraction">Rainbow Star.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[#1A1505] text-lg max-w-xl leading-relaxed">
              A trusted B2B house for loose diamonds — CVD, Natural Fancy Color, and the world's rarest Argyle Pink &amp; Argyle Blue inventory. Direct from our vault to your trade.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-10 flex flex-wrap gap-4">
              <Link to="/natural" className="btn-gold" data-testid="hero-explore-natural">Explore Inventory <ArrowRight size={16}/></Link>
              <a href={buildWhatsappLink('Hello Rainbow Star, I would like to view your diamond inventory.')} target="_blank" rel="noreferrer" className="btn-outline-gold" data-testid="hero-whatsapp">WhatsApp Trade Desk</a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12 inline-flex items-baseline gap-3 border-l-2 pl-5" style={{ borderColor: '#b8960c' }} data-testid="hero-stock-counter">
              <span className="font-mono text-5xl font-light text-[#b8960c]">{Math.max(displayCount,5000)}+</span>
              <span className="text-xs uppercase tracking-[0.3em] text-[#1A1505]">Diamonds in stock — updated live</span>
            </motion.div>
          </div>
          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[640px]">
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
              <defs>
                <filter id="rs-key-white">
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 3" />
                </filter>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[560px] h-[560px] rounded-full bg-[#b8960c]/15 blur-3xl"/>
            </div>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} className="relative w-[620px] h-[620px] flex items-center justify-center">
              <img src="https://customer-assets.emergentagent.com/job_argyle-blue-elite/artifacts/6i4nnfax_IMG_3671.jpeg" alt="Rainbow Star diamond logo" className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(184,150,12,0.5)]" style={{ mixBlendMode: 'multiply' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-[#0d0d0d] py-10" data-testid="trust-badges">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map(b => (
            <div key={b.label} className="trust-badge" data-testid={`badge-${b.label.replace(/\s+/g,'-').toLowerCase()}`}>
              {b.type === 'svg' ? (
                <div className="badge-icon" aria-label={b.alt}><b.Svg /></div>
              ) : (
                <div className="badge-icon"><b.Icon size={40} strokeWidth={1.5} style={{ color: b.color }} /></div>
              )}
              <div className="badge-label">{b.label}</div>
              {b.sub && <div className="badge-sub">{b.sub}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* NAVIGATION TILES */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:py-32" data-testid="quick-tiles">
        <div className="overline mb-2">Inventory Sections</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-12">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TILES.map((t, i) => (
            <motion.div key={t.to} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link to={t.to} className={`block relative p-8 bg-white border border-[#E8DFC2] hover:border-[#b8960c]/50 transition-all nav-tile group ${t.pink ? 'argyle-glow-pink' : t.blue ? 'argyle-glow-blue' : ''}`} data-testid={`tile-${t.to.replace('/','')}`}>
                <Gem size={28} style={{ color: t.accent }} className="mb-4"/>
                <div className="font-serif text-2xl mb-1" style={{ color: t.accent }}>{t.label}</div>
                <div className="text-sm text-[#1A1505] mb-6">{t.desc}</div>
                <div className="text-xs uppercase tracking-widest text-[#3D3520] flex items-center gap-1 group-hover:text-[#b8960c] transition">View <ArrowRight size={12}/></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED CAROUSEL */}
      {featured.length > 0 && (
        <section className="border-t border-[#E8DFC2] bg-white py-24 lg:py-32" data-testid="featured-stones">
          <div className="max-w-7xl mx-auto px-6">
            <div className="overline mb-2">Hero Stones</div>
            <h2 className="font-serif text-4xl md:text-5xl mb-12">Featured This Week</h2>
            <div className="overflow-x-auto -mx-6 px-6 pb-4">
              <div className="flex gap-5">
                {featured.map(s => {
                  const accent = s.category === 'argyle_pink' ? '#B7536B' : s.category === 'argyle_blue' ? '#2F8FCB' : '#b8960c';
                  return (
                    <Link key={s.id} to={s.category === 'argyle_pink' ? '/argyle-pink' : s.category === 'argyle_blue' ? '/argyle-blue' : s.category === 'cvd' ? '/cvd' : '/natural'} className="shrink-0 w-72 bg-white border border-[#E8DFC2] hover:border-[#b8960c]/40 transition" data-testid={`featured-${s.stock_id}`}>
                      <div className="aspect-square bg-gradient-to-br from-[#FFF8E1] to-white flex items-center justify-center">
                        <Diamond size={72} strokeWidth={0.6} style={{ color: accent }} />
                      </div>
                      <div className="p-4">
                        <div className="font-mono text-xs" style={{ color: accent }}>{s.stock_id}</div>
                        <div className="font-serif text-xl mt-1">{s.carat}ct {s.shape}</div>
                        <div className="text-xs text-[#1A1505] truncate">{s.color}</div>
                        <div className="font-mono text-lg mt-3" style={{ color: accent }}>${s.total_price?.toLocaleString()}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="max-w-3xl mx-auto px-6 py-24 lg:py-32 text-center" data-testid="newsletter">
        <div className="overline mb-3">Trade Desk</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-3">New stones arrive weekly</h2>
        <p className="text-[#1A1505] mb-8">Subscribe to receive private trade updates, new Argyle parcels, and exclusive stock previews. For dealers and jewelers only.</p>
        <form onSubmit={submitNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@trade-email.com" className="flex-1 bg-white border border-[#D9CB94] px-4 py-3 text-sm rounded-sm" data-testid="newsletter-email"/>
          <button className="btn-gold" data-testid="newsletter-submit">Subscribe</button>
        </form>
      </section>
    </div>
  );
};

export default Home;
