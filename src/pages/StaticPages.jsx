import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Diamond, Award, Globe, ShieldCheck, MessageCircle, Mail, MapPin, Send } from 'lucide-react';
import { CONTACT, buildWhatsappLink, createStoneRequest } from '../lib/api';
import { useBasket } from '../context/BasketContext';
import { toast } from 'sonner';

export const About = () => (
  <div className="max-w-5xl mx-auto px-6 py-20" data-testid="about-page">
    <div className="overline mb-3 text-[#b8960c]">Our Story</div>
    <h1 className="font-serif text-5xl md:text-6xl mb-8 leading-tight">A B2B house built on<br/>rarity, value &amp; trust.</h1>
    <div className="grid md:grid-cols-2 gap-12">
      <div className="space-y-5 text-[#1A1505] leading-relaxed">
        <p>Rainbow Star is a wholesale diamond house based in Surat, India — the world's diamond cutting capital. We specialize in three categories that define rarity in the modern trade: <span className="text-[#b8960c]">CVD lab-grown</span>, <span className="text-[#b8960c]">Natural fancy colors</span>, and the world's rarest <span className="text-[#B7536B]">Argyle Pink</span> &amp; <span className="text-[#2F8FCB]">Argyle Blue</span> stones.</p>
        <p>With the closure of the Argyle Mine in late 2020, we hold a tightly curated inventory of certified Argyle goods — some of the last available globally. Every Argyle stone in our vault is documented, traceable, and accompanied by full provenance papers.</p>
        <p>We work directly with jewelers, dealers, designers, and collectors across India, the US, the UAE, Japan, and Europe. No retail markup. Trade pricing only.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Diamond, n: '500+', l: 'Stones in vault' },
          { icon: Award, n: '100%', l: 'Lab certified' },
          { icon: Globe, n: '32+', l: 'Countries served' },
          { icon: ShieldCheck, n: 'Tier 1', l: 'Argyle access' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white border border-[#E8DFC2] p-6">
            <s.icon size={20} className="text-[#b8960c] mb-3"/>
            <div className="font-serif text-3xl text-[#b8960c]">{s.n}</div>
            <div className="text-xs uppercase tracking-widest text-[#3D3520] mt-1">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export const RequestStone = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', shape: '', carat_min: '', carat_max: '', color: '', clarity: '', budget: '', notes: '' });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await createStoneRequest({ ...form, carat_min: form.carat_min ? parseFloat(form.carat_min) : null, carat_max: form.carat_max ? parseFloat(form.carat_max) : null }); toast.success('Request received. Our trade desk will get back to you.'); setForm({ name: '', email: '', phone: '', company: '', shape: '', carat_min: '', carat_max: '', color: '', clarity: '', budget: '', notes: '' }); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (
    <div className="max-w-3xl mx-auto px-6 py-20" data-testid="request-page">
      <div className="overline mb-3 text-[#b8960c]">Bespoke Sourcing</div>
      <h1 className="font-serif text-5xl mb-3">Request a Stone</h1>
      <p className="text-[#1A1505] mb-10">Looking for a specific cut, color, or carat we don't have in stock? Submit your spec — our buyers have direct access to mines, polishers, and private collections worldwide.</p>
      <form onSubmit={submit} className="space-y-4 bg-white border border-[#E8DFC2] p-8">
        <div className="grid md:grid-cols-2 gap-3">
          <input required placeholder="Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm" data-testid="req-name"/>
          <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm" data-testid="req-email"/>
          <input placeholder="Phone / WhatsApp" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm"/>
          <input placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm"/>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <input placeholder="Shape preference" value={form.shape} onChange={e => setForm({...form, shape: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm" data-testid="req-shape"/>
          <input placeholder="Budget" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm"/>
          <input type="number" step="0.01" placeholder="Carat min" value={form.carat_min} onChange={e => setForm({...form, carat_min: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm"/>
          <input type="number" step="0.01" placeholder="Carat max" value={form.carat_max} onChange={e => setForm({...form, carat_max: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm"/>
          <input placeholder="Color preference" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm"/>
          <input placeholder="Clarity preference" value={form.clarity} onChange={e => setForm({...form, clarity: e.target.value})} className="bg-white border border-[#D9CB94] px-4 py-3 text-sm"/>
        </div>
        <textarea rows={4} placeholder="Notes — origin, certificate preferences, urgency, etc." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-white border border-[#D9CB94] px-4 py-3 text-sm resize-none" data-testid="req-notes"/>
        <button disabled={busy} className="btn-gold" data-testid="req-submit"><Send size={14}/> {busy ? 'Sending…' : 'Submit Request'}</button>
      </form>
    </div>
  );
};

export const Contact = () => (
  <div className="max-w-5xl mx-auto px-6 py-20" data-testid="contact-page">
    <div className="overline mb-3 text-[#b8960c]">Trade Desk</div>
    <h1 className="font-serif text-5xl mb-12">Get in touch</h1>
    <div className="grid md:grid-cols-3 gap-5">
      <a href={buildWhatsappLink('Hello Rainbow Star')} target="_blank" rel="noreferrer" className="bg-white border border-[#E8DFC2] hover:border-[#25D366] p-8 transition" data-testid="contact-whatsapp">
        <MessageCircle size={28} className="text-[#25D366] mb-4"/>
        <div className="overline mb-1">WhatsApp</div>
        <div className="font-serif text-2xl text-[#25D366]">{CONTACT.whatsappDisplay}</div>
        <div className="text-xs text-[#1A1505] mt-2">Fastest response · 9am-9pm IST</div>
      </a>
      <a href={`mailto:${CONTACT.email}`} className="bg-white border border-[#E8DFC2] hover:border-[#b8960c] p-8 transition" data-testid="contact-email">
        <Mail size={28} className="text-[#b8960c] mb-4"/>
        <div className="overline mb-1">Email</div>
        <div className="font-serif text-2xl text-[#b8960c]">{CONTACT.email}</div>
        <div className="text-xs text-[#1A1505] mt-2">For formal trade enquiries</div>
      </a>
      <div className="bg-white border border-[#E8DFC2] p-8">
        <MapPin size={28} className="text-[#B7536B] mb-4"/>
        <div className="overline mb-1">Office</div>
        <div className="font-serif text-2xl text-[#B7536B]">Surat, India</div>
        <div className="text-xs text-[#1A1505] mt-2">Diamond cutting capital · Gujarat</div>
      </div>
    </div>
  </div>
);

export const BasketPage = () => {
  const { items, remove, clear } = useBasket();
  return (
    <div className="max-w-5xl mx-auto px-6 py-20" data-testid="basket-page">
      <div className="overline mb-3 text-[#b8960c]">Your Selection</div>
      <h1 className="font-serif text-5xl mb-8">Enquiry Basket</h1>
      {items.length === 0 ? (
        <div className="bg-white border border-dashed border-[#D9CB94] p-12 text-center text-[#1A1505]">Your basket is empty. Browse stones and click <span className="text-[#b8960c]">+ Enquiry</span> to add them.</div>
      ) : (
        <div className="space-y-2">
          {items.map(s => (
            <div key={s.id} className="bg-white border border-[#E8DFC2] p-4 flex items-center gap-4">
              <Diamond size={32} className="text-[#b8960c]"/>
              <div className="flex-1">
                <div className="font-mono text-sm text-[#b8960c]">{s.stock_id}</div>
                <div className="font-serif text-lg">{s.carat}ct {s.shape} · <span className="text-[#1A1505]">{s.color} · {s.clarity}</span></div>
              </div>
              <div className="font-mono text-lg text-[#b8960c]">${s.total_price?.toLocaleString()}</div>
              <button onClick={() => remove(s.id)} className="text-[#3D3520] hover:text-red-400 p-2"><MessageCircle size={16}/></button>
            </div>
          ))}
          <button onClick={clear} className="text-xs text-[#3D3520] mt-4">Clear basket</button>
        </div>
      )}
    </div>
  );
};
