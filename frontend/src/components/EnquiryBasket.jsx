import React, { useState } from 'react';
import { useBasket } from '../context/BasketContext';
import { ShoppingBag, X, MessageCircle, Send } from 'lucide-react';
import { buildWhatsappLink, api, formatApiErrorDetail } from '../lib/api';
import { toast } from 'sonner';

const EnquiryBasket = () => {
  const { items, remove, clear } = useBasket();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [sending, setSending] = useState(false);

  if (items.length === 0) return null;

  const totalValue = items.reduce((s, i) => s + (i.total_price || 0), 0);
  const stockIds = items.map(i => i.stock_id).join(', ');

  const buildWaText = () => {
    const lines = [
      `Hello Rainbow Star,`,
      ``,
      `I would like to enquire about the following stones:`,
      ``,
      ...items.map((s, i) => `${i+1}. ${s.stock_id} — ${s.carat}ct ${s.shape} ${s.color} ${s.clarity} — $${s.total_price?.toLocaleString()}`),
      ``,
      form.name ? `Name: ${form.name}` : '',
      form.company ? `Company: ${form.company}` : '',
      form.email ? `Email: ${form.email}` : '',
      form.phone ? `Phone: ${form.phone}` : '',
      form.message ? `Message: ${form.message}` : '',
    ].filter(Boolean);
    return lines.join('\n');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/enquiries', {
        ...form,
        stone_ids: items.map(i => i.stock_id),
        source: 'website',
        message: `${form.message || ''}\n\nStones: ${stockIds}`,
      });
      toast.success('Enquiry submitted! We will contact you soon.');
      const url = buildWhatsappLink(buildWaText());
      window.open(url, '_blank');
      clear();
      setOpen(false);
      setForm({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || 'Failed to submit');
    } finally { setSending(false); }
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 bg-[#E5C158] text-[#14110A] px-5 py-3 rounded-sm shadow-2xl hover:bg-[#F1D67A] transition flex items-center gap-2 font-semibold" data-testid="enquiry-basket-fab">
          <ShoppingBag size={18}/>
          <span>{items.length} {items.length === 1 ? 'stone' : 'stones'}</span>
          <span className="font-mono text-xs opacity-70">·  ${totalValue.toLocaleString()}</span>
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[80vh] glass border border-[#E5C158]/30 rounded-sm shadow-2xl flex flex-col" data-testid="enquiry-basket-panel">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div>
              <div className="font-serif text-xl text-[#E5C158]">Enquiry Basket</div>
              <div className="text-[10px] text-white/65 uppercase tracking-widest">{items.length} stones · ${totalValue.toLocaleString()}</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/75 hover:text-white" data-testid="enquiry-close"><X size={18}/></button>
          </div>
          <div className="overflow-y-auto p-3 space-y-2 max-h-[200px]">
            {items.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 bg-[#2A2418] text-xs" data-testid={`basket-item-${s.stock_id}`}>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[#E5C158]">{s.stock_id}</div>
                  <div className="text-white/75 truncate">{s.carat}ct {s.shape} · {s.color}</div>
                </div>
                <div className="font-mono text-white/80">${s.total_price?.toLocaleString()}</div>
                <button onClick={() => remove(s.id)} className="text-white/65 hover:text-red-400" data-testid={`basket-remove-${s.stock_id}`}><X size={14}/></button>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="p-4 border-t border-white/5 space-y-2">
            <input required placeholder="Your name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#1F1B12] border border-white/10 px-3 py-2 text-xs rounded-sm" data-testid="enquiry-name"/>
            <div className="grid grid-cols-2 gap-2">
              <input required type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-[#1F1B12] border border-white/10 px-3 py-2 text-xs rounded-sm" data-testid="enquiry-email"/>
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-[#1F1B12] border border-white/10 px-3 py-2 text-xs rounded-sm" data-testid="enquiry-phone"/>
            </div>
            <input placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-[#1F1B12] border border-white/10 px-3 py-2 text-xs rounded-sm" data-testid="enquiry-company"/>
            <textarea placeholder="Message (optional)" value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={2} className="w-full bg-[#1F1B12] border border-white/10 px-3 py-2 text-xs rounded-sm resize-none" data-testid="enquiry-message"/>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={sending} className="flex-1 btn-gold !text-xs !py-2 disabled:opacity-50" data-testid="enquiry-submit"><Send size={12}/> {sending ? 'Sending…' : 'Send + WhatsApp'}</button>
              <button type="button" onClick={clear} className="text-xs text-white/65 hover:text-white px-2" data-testid="enquiry-clear">Clear</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EnquiryBasket;
