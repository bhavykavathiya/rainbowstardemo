import React from 'react';
import { Diamond } from 'lucide-react';

const SHAPES = ['ROUND','PRINCESS','OVAL','CUSHION','EMERALD','PEAR','RADIANT','MARQUISE','ASSCHER','HEART'];
const COLORS_WHITE = ['D','E','F','G','H','I','J'];
const CLARITY = ['IF','VVS1','VVS2','VS1','VS2','SI1','SI2'];
const QUALITY = ['Excellent','Very Good','Good'];
const FLUO = ['None','Faint','Medium','Strong'];

const Section = ({ title, children }) => (
  <div className="border-b border-white/5 pb-5 mb-5">
    <div className="overline mb-3">{title}</div>
    {children}
  </div>
);

const Chip = ({ active, onClick, children, color = '#E5C158', testid }) => (
  <button onClick={onClick} data-testid={testid}
    style={active ? { background: color, color: '#14110A', borderColor: color } : {}}
    className={`px-2.5 py-1 text-xs border border-white/10 rounded-sm transition hover:border-white/30 ${active ? 'font-semibold' : 'text-white/70'}`}>
    {children}
  </button>
);

const FilterPanel = ({ filters, setFilters, accentColor = '#E5C158', extra = {}, certLabs = ['IGI','GIA','GCAL'] }) => {
  const update = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const toggle = (key, val) => setFilters(f => ({ ...f, [key]: f[key] === val ? '' : val }));

  return (
    <aside className="w-full lg:w-72 lg:shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] overflow-y-auto pr-2" data-testid="filter-panel">
      <div className="flex items-center gap-2 mb-5">
        <Diamond size={16} style={{ color: accentColor }} />
        <span className="font-serif text-lg">Refine Inventory</span>
      </div>

      <Section title="Shape">
        <div className="flex flex-wrap gap-1.5">
          {SHAPES.map(s => <Chip key={s} active={filters.shape === s} color={accentColor} onClick={() => toggle('shape', s)} testid={`filter-shape-${s}`}>{s.slice(0,4)}</Chip>)}
        </div>
      </Section>

      <Section title={`Carat — ${filters.carat_min || 0} to ${filters.carat_max || 10}`}>
        <div className="flex gap-2">
          <input type="number" step="0.01" placeholder="Min" value={filters.carat_min || ''} onChange={e => update('carat_min', e.target.value)} className="w-1/2 bg-[#1F1B12] border border-white/10 px-2 py-1.5 text-xs rounded-sm" data-testid="filter-carat-min"/>
          <input type="number" step="0.01" placeholder="Max" value={filters.carat_max || ''} onChange={e => update('carat_max', e.target.value)} className="w-1/2 bg-[#1F1B12] border border-white/10 px-2 py-1.5 text-xs rounded-sm" data-testid="filter-carat-max"/>
        </div>
      </Section>

      {extra.fancyColor && (
        <Section title="Fancy Color Search">
          <input type="text" placeholder="e.g. yellow, pink" value={filters.fancy_color || ''} onChange={e => update('fancy_color', e.target.value)} className="w-full bg-[#1F1B12] border border-white/10 px-2 py-1.5 text-xs rounded-sm" data-testid="filter-fancy-color"/>
        </Section>
      )}

      {!extra.skipColorClarity && (
        <>
          <Section title="Color">
            <div className="flex flex-wrap gap-1.5">
              {COLORS_WHITE.map(c => <Chip key={c} active={filters.color === c} color={accentColor} onClick={() => toggle('color', c)} testid={`filter-color-${c}`}>{c}</Chip>)}
            </div>
          </Section>
          <Section title="Clarity">
            <div className="flex flex-wrap gap-1.5">
              {CLARITY.map(c => <Chip key={c} active={filters.clarity === c} color={accentColor} onClick={() => toggle('clarity', c)} testid={`filter-clarity-${c}`}>{c}</Chip>)}
            </div>
          </Section>
        </>
      )}

      <Section title="Cut / Polish / Symmetry">
        {['cut','polish','symmetry'].map(k => (
          <div key={k} className="mb-2">
            <div className="text-[10px] uppercase tracking-wider text-white/65 mb-1">{k}</div>
            <div className="flex flex-wrap gap-1.5">
              {QUALITY.map(q => <Chip key={q} active={filters[k] === q} color={accentColor} onClick={() => toggle(k, q)} testid={`filter-${k}-${q.replace(/\s/g,'')}`}>{q.split(' ')[0]}</Chip>)}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Fluorescence">
        <div className="flex flex-wrap gap-1.5">
          {FLUO.map(f => <Chip key={f} active={filters.fluorescence === f} color={accentColor} onClick={() => toggle('fluorescence', f)} testid={`filter-fluo-${f}`}>{f}</Chip>)}
        </div>
      </Section>

      <Section title="Certificate">
        <div className="flex flex-wrap gap-1.5">
          {certLabs.map(l => <Chip key={l} active={filters.certificate_lab === l} color={accentColor} onClick={() => toggle('certificate_lab', l)} testid={`filter-cert-${l.replace(/\s/g,'')}`}>{l}</Chip>)}
        </div>
      </Section>

      {extra.origin && (
        <Section title="Origin">
          <div className="flex flex-wrap gap-1.5">
            {['Canada','Russia','Botswana','South Africa','India','Argyle — Australia'].map(o => (
              <Chip key={o} active={filters.origin === o} color={accentColor} onClick={() => toggle('origin', o)} testid={`filter-origin-${o.split(' ')[0]}`}>{o.split(' ')[0]}</Chip>
            ))}
          </div>
        </Section>
      )}

      <Section title={`Price USD — ${filters.price_min || 0} to ${filters.price_max || '∞'}`}>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.price_min || ''} onChange={e => update('price_min', e.target.value)} className="w-1/2 bg-[#1F1B12] border border-white/10 px-2 py-1.5 text-xs rounded-sm" data-testid="filter-price-min"/>
          <input type="number" placeholder="Max" value={filters.price_max || ''} onChange={e => update('price_max', e.target.value)} className="w-1/2 bg-[#1F1B12] border border-white/10 px-2 py-1.5 text-xs rounded-sm" data-testid="filter-price-max"/>
        </div>
      </Section>

      <button onClick={() => setFilters({})} className="w-full btn-outline-gold !text-xs !py-2" data-testid="filter-clear">Clear all filters</button>
    </aside>
  );
};

export default FilterPanel;
