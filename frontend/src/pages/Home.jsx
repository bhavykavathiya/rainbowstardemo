import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Diamond, Shield, Globe, Award, ArrowRight, Sparkles, Gem } from 'lucide-react';
import { DiamondDust } from '../components/DiamondDust';
import { api, CONTACT, buildWhatsappLink } from '../lib/api';
import { toast } from 'sonner';

const TILES = [
  { to: '/cvd', label: 'CVD Diamonds', accent: '#E5C158', desc: 'Lab-grown, certified, type IIa' },
  { to: '/natural', label: 'Natural Diamonds', accent: '#E5C158', desc: 'Earth-mined, GIA graded' },
  { to: '/argyle-pink', label: 'Argyle Pink', accent: '#C68997', desc: 'The world\'s rarest pinks', pink: true },
  { to: '/argyle-blue', label: 'Argyle Blue', accent: '#6DD0F8', desc: 'Whispers of violet & ocean', blue: true },
  { to: '/request', label: 'Request a Stone', accent: '#E5C158', desc: 'Bespoke sourcing service' },
  { to: '/contact', label: 'Contact', accent: '#E5C158', desc: 'WhatsApp, email, trade desk' },
];

const BADGES = [
  { icon: Award, label: 'GIA Certified' },
  { icon: Award, label: 'IGI Certified' },
  { icon: Sparkles, label: 'Argyle Certified' },
  { icon: Shield, label: 'Conflict Free' },
  { icon: Globe, label: 'Worldwide Shipping' },
];

const Home = () => {
  const [stats, setStats] = useState({ total: 0, by_category: {} });
  const [featured, setFeatured] = useState([]);
  const [displayCount, setDisplayCount] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    api.get('/diamonds/stats').then(({ data }) => setStats(data));
    api.get('/diamonds', { params: { limit: 8 } }).then(({ data }) => {
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
      await api.post('/newsletter', { email });
      toast.success('Subscribed! Trade updates coming your way.');
      setEmail('');
    } catch { toast.error('Could not subscribe'); }
  };

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#14110A] via-[#1A160E] to-[#14110A]" />
        <div className="absolute inset-0 grain opacity-40" />
        <DiamondDust count={70} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E5C158]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C68997]/8 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="overline mb-5" style={{ color: '#E5C158' }}>Rainbow Star · Est. Surat, India</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }} className="font-serif leading-[0.95] text-5xl sm:text-6xl md:text-7xl mb-6">
              Rare Diamonds.<br/>Real Value.<br/>
              <span className="refraction">Rainbow Star.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/75 text-lg max-w-xl leading-relaxed">
              A trusted B2B house for loose diamonds — CVD, Natural Fancy Color, and the world's rarest Argyle Pink &amp; Argyle Blue inventory. Direct from our vault to your trade.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-10 flex flex-wrap gap-4">
              <Link to="/natural" className="btn-gold" data-testid="hero-explore-natural">Explore Inventory <ArrowRight size={16}/></Link>
              <a href={buildWhatsappLink('Hello Rainbow Star, I would like to view your diamond inventory.')} target="_blank" rel="noreferrer" className="btn-outline-gold" data-testid="hero-whatsapp">WhatsApp Trade Desk</a>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12 inline-flex items-baseline gap-3 border-l-2 pl-5" style={{ borderColor: '#E5C158' }} data-testid="hero-stock-counter">
              <span className="font-mono text-5xl font-light text-[#E5C158]">{displayCount}+</span>
              <span className="text-xs uppercase tracking-[0.3em] text-white/70">Diamonds in stock — updated live</span>
            </motion.div>
          </div>
          <div className="lg:col-span-5 relative hidden lg:block">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="aspect-square relative">
              <div className="absolute inset-0 border border-[#E5C158]/30 rotate-45"/>
              <div className="absolute inset-8 border border-[#C68997]/30 rotate-12"/>
              <div className="absolute inset-16 border border-[#6DD0F8]/30 -rotate-12"/>
              <div className="absolute inset-0 flex items-center justify-center">
                <Diamond size={140} strokeWidth={0.4} className="text-[#E5C158]" style={{ filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.4))' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="border-y border-white/5 bg-[#1F1B12] py-6" data-testid="trust-badges">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-around gap-6">
          {BADGES.map(b => (
            <div key={b.label} className="flex items-center gap-2 text-white/70">
              <b.icon size={16} className="text-[#E5C158]"/>
              <span className="text-xs uppercase tracking-widest">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* NAVIGATION TILES */}
      <section className="max-w-7xl mx-auto px-6 py-24" data-testid="quick-tiles">
        <div className="overline mb-2 text-[#E5C158]">Inventory Sections</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-12">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TILES.map((t, i) => (
            <motion.div key={t.to} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link to={t.to} className={`block relative p-8 bg-[#1F1B12] border border-white/5 hover:border-white/20 transition-all nav-tile group ${t.pink ? 'argyle-glow-pink' : t.blue ? 'argyle-glow-blue' : ''}`} data-testid={`tile-${t.to.replace('/','')}`}>
                <Gem size={28} style={{ color: t.accent }} className="mb-4"/>
                <div className="font-serif text-2xl mb-1" style={{ color: t.accent }}>{t.label}</div>
                <div className="text-sm text-white/70 mb-6">{t.desc}</div>
                <div className="text-xs uppercase tracking-widest text-white/65 flex items-center gap-1 group-hover:text-[#E5C158] transition">View <ArrowRight size={12}/></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED CAROUSEL */}
      {featured.length > 0 && (
        <section className="border-t border-white/5 bg-[#1F1B12] py-24" data-testid="featured-stones">
          <div className="max-w-7xl mx-auto px-6">
            <div className="overline mb-2 text-[#E5C158]">Hero Stones</div>
            <h2 className="font-serif text-4xl md:text-5xl mb-12">Featured This Week</h2>
            <div className="overflow-x-auto -mx-6 px-6 pb-4">
              <div className="flex gap-5">
                {featured.map(s => {
                  const accent = s.category === 'argyle_pink' ? '#C68997' : s.category === 'argyle_blue' ? '#6DD0F8' : '#E5C158';
                  return (
                    <Link key={s.id} to={s.category === 'argyle_pink' ? '/argyle-pink' : s.category === 'argyle_blue' ? '/argyle-blue' : s.category === 'cvd' ? '/cvd' : '/natural'} className="shrink-0 w-72 bg-[#1F1B12] border border-white/5 hover:border-white/15 transition" data-testid={`featured-${s.stock_id}`}>
                      <div className="aspect-square bg-gradient-to-br from-[#2A2418] to-[#14110A] flex items-center justify-center">
                        <Diamond size={72} strokeWidth={0.6} style={{ color: accent }} />
                      </div>
                      <div className="p-4">
                        <div className="font-mono text-xs" style={{ color: accent }}>{s.stock_id}</div>
                        <div className="font-serif text-xl mt-1">{s.carat}ct {s.shape}</div>
                        <div className="text-xs text-white/70 truncate">{s.color}</div>
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
      <section className="max-w-3xl mx-auto px-6 py-24 text-center" data-testid="newsletter">
        <div className="overline mb-3 text-[#E5C158]">Trade Desk</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-3">New stones arrive weekly</h2>
        <p className="text-white/75 mb-8">Subscribe to receive private trade updates, new Argyle parcels, and exclusive stock previews. For dealers and jewelers only.</p>
        <form onSubmit={submitNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@trade-email.com" className="flex-1 bg-[#1F1B12] border border-white/10 px-4 py-3 text-sm rounded-sm" data-testid="newsletter-email"/>
          <button className="btn-gold" data-testid="newsletter-submit">Subscribe</button>
        </form>
      </section>
    </div>
  );
};

export default Home;
