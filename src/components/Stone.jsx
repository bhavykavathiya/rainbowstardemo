import React from 'react';
import { Diamond, MessageCircle, FileText, Plus, Check } from 'lucide-react';
import { useBasket } from '../context/BasketContext';
import { buildWhatsappLink } from '../lib/api';

export const StoneCard = ({ stone, accent = '#b8960c', argyleClass = '' }) => {
  const { add, has } = useBasket();
  const inBasket = has(stone.id);
  const waText = `Hello Rainbow Star, I'm interested in stone ${stone.stock_id} (${stone.carat}ct ${stone.shape} ${stone.color} ${stone.clarity}).`;
  return (
    <div className={`stone-card group relative bg-white border border-[#e8e0d0] hover:border-[#b8960c]/40 transition-all ${argyleClass}`} data-testid={`stone-card-${stone.stock_id}`}>
      <div className="aspect-square bg-gradient-to-br from-[#FFF8E1] to-white flex items-center justify-center relative overflow-hidden">
        {stone.image_url ? (
          <img src={stone.image_url} alt={`${stone.carat}ct ${stone.shape} ${stone.color} ${stone.clarity} diamond ${stone.stock_id}`} className="w-full h-full object-cover" />
        ) : (
          <Diamond size={64} strokeWidth={0.8} style={{ color: accent }} className="opacity-60 group-hover:scale-110 transition" />
        )}
        <div className="absolute top-3 left-3 px-2 py-0.5 text-[10px] uppercase tracking-widest border" style={{ borderColor: accent, color: accent }}>{stone.certificate_lab || 'No Cert'}</div>
        <div className="absolute top-3 right-3 font-mono text-xs text-[#1A1505]">{stone.stock_id}</div>
      </div>
      <div className="p-4">
        <div className="font-serif text-lg leading-tight">{stone.carat}ct {stone.shape}</div>
        <div className="text-xs text-[#1A1505] mt-0.5 truncate">{stone.color} · {stone.clarity}</div>
        <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] text-[#3D3520] uppercase tracking-wider">
          <div><div className="text-[#1A1505]">Cut</div><div className="text-[#1A1505]">{stone.cut?.slice(0,2) || '—'}</div></div>
          <div><div className="text-[#1A1505]">Pol</div><div className="text-[#1A1505]">{stone.polish?.slice(0,2) || '—'}</div></div>
          <div><div className="text-[#1A1505]">Sym</div><div className="text-[#1A1505]">{stone.symmetry?.slice(0,2) || '—'}</div></div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="font-mono text-lg" style={{ color: accent }}>${stone.total_price?.toLocaleString()}</div>
          <div className="text-[10px] text-[#3D3520]">${stone.price_per_carat?.toLocaleString()}/ct</div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => add(stone)} disabled={inBasket} className={`flex-1 text-xs py-2 px-2 border transition flex items-center justify-center gap-1 ${inBasket ? 'border-[#D9CB94] text-[#1A1505]' : 'border-[#b8960c]/40 text-[#1A1505] hover:border-[#8a7009]'}`} data-testid={`add-to-basket-${stone.stock_id}`}>
            {inBasket ? <><Check size={12}/> Added</> : <><Plus size={12}/> Enquiry</>}
          </button>
          <a href={buildWhatsappLink(waText)} target="_blank" rel="noreferrer" className="btn-whatsapp !py-2 !px-2.5 !text-[11px]" data-testid={`wa-${stone.stock_id}`}><MessageCircle size={12}/> WA</a>
        </div>
        {stone.certificate_url && (
          <a href={stone.certificate_url} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-1 text-[10px] text-[#3D3520] hover:text-[#b8960c]"><FileText size={11}/> View Certificate</a>
        )}
      </div>
    </div>
  );
};

export const StoneRow = ({ stone, accent = '#b8960c' }) => {
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
      <td className="text-[#1A1505]">{stone.cut?.slice(0,3) || '—'}</td>
      <td className="text-[#1A1505]">{stone.polish?.slice(0,3) || '—'}</td>
      <td className="text-[#1A1505]">{stone.symmetry?.slice(0,3) || '—'}</td>
      <td className="text-[#1A1505]">{stone.fluorescence || '—'}</td>
      <td className="text-[10px] uppercase tracking-wider" style={{ color: accent }}>{stone.certificate_lab || '—'}</td>
      <td className="font-mono text-right">${stone.price_per_carat?.toLocaleString()}</td>
      <td className="font-mono text-right font-semibold" style={{ color: accent }}>${stone.total_price?.toLocaleString()}</td>
      <td>
        <div className="flex gap-1.5 justify-end">
          <button onClick={() => add(stone)} disabled={inBasket} className={`px-2.5 py-1 text-[10px] border transition ${inBasket ? 'border-[#D9CB94] text-[#1A1505]' : 'border-[#b8960c]/40 hover:border-[#8a7009]'}`} data-testid={`row-add-${stone.stock_id}`}>{inBasket ? '✓' : '+ Add'}</button>
          <a href={buildWhatsappLink(waText)} target="_blank" rel="noreferrer" className="btn-whatsapp !py-1 !px-2 !text-[10px]" data-testid={`row-wa-${stone.stock_id}`}>WA</a>
        </div>
      </td>
    </tr>
  );
};
