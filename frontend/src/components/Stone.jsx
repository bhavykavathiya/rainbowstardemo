import React from 'react';
import { Diamond, MessageCircle, FileText, Plus, Check } from 'lucide-react';
import { useBasket } from '../context/BasketContext';
import { buildWhatsappLink } from '../lib/api';

export const StoneCard = ({ stone, accent = '#E5C158', argyleClass = '' }) => {
  const { add, has } = useBasket();
  const inBasket = has(stone.id);
  const waText = `Hello Rainbow Star, I'm interested in stone ${stone.stock_id} (${stone.carat}ct ${stone.shape} ${stone.color} ${stone.clarity}).`;
  return (
    <div className={`group relative bg-[#1F1B12] border border-white/5 hover:border-white/15 transition-all ${argyleClass}`} data-testid={`stone-card-${stone.stock_id}`}>
      <div className="aspect-square bg-gradient-to-br from-[#2A2418] to-[#14110A] flex items-center justify-center relative overflow-hidden">
        {stone.image_url ? (
          <img src={stone.image_url} alt={stone.stock_id} className="w-full h-full object-cover" />
        ) : (
          <Diamond size={64} strokeWidth={0.8} style={{ color: accent }} className="opacity-60 group-hover:scale-110 transition" />
        )}
        <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] uppercase tracking-widest border" style={{ borderColor: accent, color: accent }}>{stone.certificate_lab || 'No Cert'}</div>
        <div className="absolute top-3 right-3 font-mono text-xs text-white/75">{stone.stock_id}</div>
      </div>
      <div className="p-4">
        <div className="font-serif text-lg leading-tight">{stone.carat}ct {stone.shape}</div>
        <div className="text-xs text-white/75 mt-0.5 truncate">{stone.color} · {stone.clarity}</div>
        <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] text-white/65 uppercase tracking-wider">
          <div><div className="text-white/75">Cut</div><div className="text-white/70">{stone.cut?.slice(0,2) || '—'}</div></div>
          <div><div className="text-white/75">Pol</div><div className="text-white/70">{stone.polish?.slice(0,2) || '—'}</div></div>
          <div><div className="text-white/75">Sym</div><div className="text-white/70">{stone.symmetry?.slice(0,2) || '—'}</div></div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="font-mono text-lg" style={{ color: accent }}>${stone.total_price?.toLocaleString()}</div>
          <div className="text-[10px] text-white/65">${stone.price_per_carat?.toLocaleString()}/ct</div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => add(stone)} disabled={inBasket} className={`flex-1 text-xs py-2 px-2 border transition flex items-center justify-center gap-1 ${inBasket ? 'border-white/10 text-white/75' : 'border-white/15 text-white/80 hover:border-white/40'}`} data-testid={`add-to-basket-${stone.stock_id}`}>
            {inBasket ? <><Check size={12}/> Added</> : <><Plus size={12}/> Enquiry</>}
          </button>
          <a href={buildWhatsappLink(waText)} target="_blank" rel="noreferrer" className="btn-whatsapp !py-2 !px-2.5 !text-[11px]" data-testid={`wa-${stone.stock_id}`}><MessageCircle size={12}/> WA</a>
        </div>
        {stone.certificate_url && (
          <a href={stone.certificate_url} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 text-[10px] text-white/65 hover:text-[#E5C158]"><FileText size={11}/> View Certificate</a>
        )}
      </div>
    </div>
  );
};

export const StoneRow = ({ stone, accent = '#E5C158' }) => {
  const { add, has } = useBasket();
  const inBasket = has(stone.id);
  const waText = `Hello Rainbow Star, enquiry for ${stone.stock_id}`;
  return (
    <tr data-testid={`stone-row-${stone.stock_id}`}>
      <td className="font-mono text-xs" style={{ color: accent }}>{stone.stock_id}</td>
      <td>{stone.shape}</td>
      <td className="font-mono">{stone.carat}</td>
      <td className="max-w-[180px] truncate" title={stone.color}>{stone.color}</td>
      <td>{stone.clarity}</td>
      <td className="text-white/75">{stone.cut?.slice(0,3) || '—'}</td>
      <td className="text-white/75">{stone.polish?.slice(0,3) || '—'}</td>
      <td className="text-white/75">{stone.symmetry?.slice(0,3) || '—'}</td>
      <td className="text-white/75">{stone.fluorescence || '—'}</td>
      <td className="text-[10px] uppercase tracking-wider" style={{ color: accent }}>{stone.certificate_lab || '—'}</td>
      <td className="font-mono text-right">${stone.price_per_carat?.toLocaleString()}</td>
      <td className="font-mono text-right font-semibold" style={{ color: accent }}>${stone.total_price?.toLocaleString()}</td>
      <td>
        <div className="flex gap-1.5 justify-end">
          <button onClick={() => add(stone)} disabled={inBasket} className={`px-2.5 py-1 text-[10px] border transition ${inBasket ? 'border-white/10 text-white/75' : 'border-white/15 hover:border-white/40'}`} data-testid={`row-add-${stone.stock_id}`}>{inBasket ? '✓' : '+ Add'}</button>
          <a href={buildWhatsappLink(waText)} target="_blank" rel="noreferrer" className="btn-whatsapp !py-1 !px-2 !text-[10px]" data-testid={`row-wa-${stone.stock_id}`}>WA</a>
        </div>
      </td>
    </tr>
  );
};
