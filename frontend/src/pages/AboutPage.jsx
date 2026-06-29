import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Diamond, Award, Globe, ShieldCheck, Sparkles, Cog, Users, Handshake, TrendingUp, CheckCircle2, ArrowRight, Quote } from 'lucide-react';
import { buildWhatsappLink } from '../lib/api';

const STATS = [
  { icon: Diamond, n: '15+', l: 'Years in Industry' },
  { icon: Globe, n: '32+', l: 'Countries Served' },
  { icon: Award, n: '500+', l: 'Stones in Vault' },
  { icon: ShieldCheck, n: '100%', l: 'Certified Origin' },
];

const MISSION = [
  'Deliver exceptional natural and lab-grown diamond solutions to global markets.',
  'Provide reliable and efficient CVD diamond manufacturing and job work services.',
  'Maintain the highest standards of ethics, transparency, and professionalism.',
  'Build long-term relationships through trust, consistency, and personalized service.',
  'Invest in innovation, technology, and skilled craftsmanship to create sustainable growth.',
  'Contribute positively to the future of the diamond industry while preserving its timeless values.',
];

const WHY = [
  { icon: TrendingUp, t: '17+ Years of Industry Experience', d: 'Trusted since 2009' },
  { icon: Sparkles, t: 'Natural & Fancy Color Specialists', d: 'Curated rare-color inventory' },
  { icon: Cog, t: 'Advanced CVD Expertise', d: 'In-house manufacturing & job work' },
  { icon: Globe, t: 'Global Client Network', d: 'Jewelers, dealers, manufacturers' },
  { icon: ShieldCheck, t: 'Quality & Transparency', d: 'Full provenance, lab-certified' },
  { icon: Handshake, t: 'Long-Term Partnerships', d: 'Customer-focused approach' },
];

const BUSINESSES = [
  { t: 'Natural Fancy Color Diamonds', d: 'Earth-mined fancy colors — pinks, blues, yellows, greens — with full GIA grading.', a: '#C9A227' },
  { t: 'Natural White Diamonds', d: 'Colorless D-J range, brilliant precision-cut, all major lab certificates.', a: '#E5BB2E' },
  { t: 'CVD Lab-Grown Diamonds', d: 'Type IIa lab-grown stones with IGI/GIA reports — identical brilliance, modern value.', a: '#C9A227' },
  { t: 'CVD Manufacturing & Job Work', d: 'Professional cutting, polishing & finishing services for trade clients.', a: '#B8923A' },
];

export const About = () => {
  const navigate = useNavigate();
  return (
    <div data-testid="about-page">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#E8DFC2]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAF6E8] via-white to-[#FAF6E8]" />
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#C9A227]/8 rounded-full blur-[150px]"/>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="overline mb-4 text-[#C9A227]">About Rainbow Star</div>
          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6 max-w-4xl">
            Crafting Brilliance<br/><span className="refraction">Since 2009</span>
          </motion.h1>
          <p className="text-lg text-[#1A1505] max-w-2xl leading-relaxed">
            Rainbow Star is a trusted diamond company specializing in Natural Diamonds, CVD Lab-Grown Diamonds, and professional manufacturing services, delivering quality, reliability, and excellence to clients worldwide.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button onClick={() => navigate('/natural')} className="btn-gold" data-testid="about-cta-inventory">View Inventory <ArrowRight size={16}/></button>
            <button onClick={() => navigate('/contact')} className="btn-outline-gold" data-testid="about-cta-contact">Contact Us</button>
          </div>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: i*0.1}} className="bg-white/80 border border-[#D9CB94] p-5">
                <s.icon size={20} className="text-[#C9A227] mb-3"/>
                <div className="font-serif text-3xl text-[#E5BB2E]">{s.n}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#3D3520] mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About narrative */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="overline mb-3 text-[#C9A227]">Our Story</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-8">Built on integrity. Powered by craftsmanship.</h2>
        <div className="space-y-5 text-[#1A1505] leading-relaxed text-[15px]">
          <p>Since <span className="text-[#C9A227]">2009</span>, Rainbow Star has been actively serving the diamond industry with a commitment to quality, integrity, and long-term relationships.</p>
          <p>Based in <span className="text-[#C9A227]">Surat, Gujarat</span> — the world's leading diamond manufacturing hub — we have established ourselves as a reliable partner in Natural Fancy Color Diamonds, Natural White Diamonds, CVD Lab-Grown Diamonds, and CVD Diamond Manufacturing Services.</p>
          <p>Over the years, our company has developed extensive expertise across sourcing, manufacturing, processing, and supplying diamonds to clients across global markets. Whether serving jewelers, wholesalers, manufacturers, retailers, or investors, our focus remains the same: <span className="text-[#E5BB2E]">delivering exceptional value, consistent quality, and dependable service.</span></p>
          <p>Through continuous innovation, skilled craftsmanship, and a customer-first approach, Rainbow Star continues to evolve alongside the modern diamond industry while maintaining the trust and values upon which the company was founded.</p>
        </div>
      </section>

      {/* Core businesses */}
      <section className="border-y border-[#E8DFC2] bg-[#FAF6E8]/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="overline mb-3 text-[#C9A227]">Core Businesses</div>
          <h2 className="font-serif text-4xl md:text-5xl mb-12">Four pillars of expertise</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BUSINESSES.map((b, i) => (
              <motion.div key={i} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: i*0.1}} className="bg-white border border-[#D9CB94] p-6 hover:border-[#C9A227]/40 transition">
                <Diamond size={24} style={{color: b.a}} className="mb-4"/>
                <div className="font-serif text-xl mb-2 text-[#1A1505]">{b.t}</div>
                <div className="text-sm text-[#1A1505] leading-relaxed">{b.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chairman */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="overline mb-3 text-[#C9A227] text-center">Message From The Chairman</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-12 text-center">Leadership rooted in vision</h2>
        <div className="grid md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-2">
            <div className="aspect-[3/4] bg-gradient-to-br from-[#FFF8E1] to-white border border-[#D9CB94] relative overflow-hidden">
              <img src="https://customer-assets.emergentagent.com/job_argyle-blue-elite/artifacts/jy31ay20_79E5BFC6-6CCB-4504-AAE0-63BA73627589.png" alt="Jayesh Kavathiya, Chairman of Rainbow Star" className="w-full h-full object-cover"/>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent p-5">
                <div className="font-serif text-2xl text-white">Jayesh Kavathiya</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/90 mt-1">Chairman · Rainbow Star</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 relative">
            <Quote size={48} className="text-[#C9A227]/20 absolute -top-4 -left-2"/>
            <div className="space-y-5 text-[#1A1505] leading-relaxed text-[15px] relative pl-6 border-l border-[#D9CB94]">
              <p>Since our establishment in 2009, we have worked tirelessly to create a company that combines traditional values with modern innovation. From natural diamonds to advanced CVD diamond manufacturing, our goal has been to provide clients with quality products, transparent dealings, and long-term value.</p>
              <p>The diamond industry continues to evolve, and we remain committed to growing alongside it while maintaining the standards of integrity, reliability, and excellence that define our company.</p>
              <p>We are grateful to our customers, partners, and team members who have contributed to our success, and we look forward to building an even brighter future together.</p>
              <div className="pt-2">
                <div className="font-serif text-2xl text-[#E5BB2E]">— Jayesh Kavathiya</div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#1A1505] mt-1">Chairman, Rainbow Star</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="border-y border-[#E8DFC2] bg-[#FAF6E8]/50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <div className="overline mb-3 text-[#C9A227]">Our Vision</div>
            <h3 className="font-serif text-3xl md:text-4xl mb-5">A globally respected diamond company.</h3>
            <p className="text-[#1A1505] leading-relaxed">To become a globally respected diamond company recognized for excellence in Natural Diamonds, CVD Lab-Grown Diamonds, and Manufacturing Services while setting benchmarks for quality, trust, innovation, and customer satisfaction.</p>
          </div>
          <div>
            <div className="overline mb-3 text-[#C9A227]">Our Mission</div>
            <h3 className="font-serif text-3xl md:text-4xl mb-5">Six commitments that guide us.</h3>
            <ul className="space-y-3">
              {MISSION.map((m, i) => (
                <li key={i} className="flex gap-3 text-[#1A1505] text-sm leading-relaxed"><CheckCircle2 size={18} className="text-[#C9A227] shrink-0 mt-0.5"/>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="overline mb-3 text-[#C9A227]">Why Choose Rainbow Star</div>
        <h2 className="font-serif text-4xl md:text-5xl mb-12">Nine reasons trade partners trust us.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY.map((w, i) => (
            <motion.div key={i} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay: i*0.08}} className="bg-white border border-[#E8DFC2] p-6 hover:border-[#C9A227]/35 transition">
              <w.icon size={22} className="text-[#C9A227] mb-3"/>
              <div className="font-serif text-xl mb-1">{w.t}</div>
              <div className="text-sm text-[#3D3520]">{w.d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="border-t border-[#E8DFC2] bg-gradient-to-br from-[#FAF6E8] via-white to-[#FAF6E8] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Let's build something brilliant together.</h2>
          <p className="text-[#1A1505] mb-8">Trade enquiries, manufacturing partnerships, or bespoke sourcing — our team is one message away.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={buildWhatsappLink('Hello Rainbow Star, I would like to learn more.')} target="_blank" rel="noreferrer" className="btn-gold">Talk to Our Trade Desk <ArrowRight size={14}/></a>
            <button onClick={() => navigate('/request')} className="btn-outline-gold">Request a Stone</button>
          </div>
        </div>
      </section>
    </div>
  );
};
