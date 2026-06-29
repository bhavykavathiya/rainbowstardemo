import React, { useEffect, useMemo, useState } from 'react';
import { api, CATEGORY_META } from '../lib/api';
import FilterPanel from '../components/FilterPanel';
import { StoneCard, StoneRow } from '../components/Stone';
import { Grid3X3, Rows, Search, Loader2 } from 'lucide-react';

const StockBrowser = ({ category, accent, title, subtitle, headerBg, extra, argyleClass, certLabs }) => {
  const [filters, setFilters] = useState({});
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = { category, ...filters };
    Object.keys(params).forEach(k => (params[k] === '' || params[k] == null) && delete params[k]);
    if (search) params.search = search;
    api.get('/diamonds', { params }).then(({ data }) => setStones(data)).finally(() => setLoading(false));
  }, [category, filters, search]);

  const stats = useMemo(() => {
    const total = stones.length;
    const ct = stones.reduce((s, x) => s + (x.carat || 0), 0);
    const val = stones.reduce((s, x) => s + (x.total_price || 0), 0);
    return { total, ct: ct.toFixed(2), val: val.toLocaleString() };
  }, [stones]);

  return (
    <div data-testid={`stock-page-${category}`}>
      <div className="relative border-b border-white/5 overflow-hidden" style={{ background: headerBg }}>
        <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <div className="overline mb-3" style={{ color: accent }}>Inventory</div>
          <h1 className="font-serif text-5xl md:text-6xl mb-2">{title}</h1>
          <p className="text-white/75 max-w-2xl">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-8 font-mono text-sm">
            <div><div className="text-[10px] uppercase tracking-widest text-white/65">In Stock</div><div className="text-2xl" style={{ color: accent }}>{stats.total}</div></div>
            <div><div className="text-[10px] uppercase tracking-widest text-white/65">Total Carats</div><div className="text-2xl text-white">{stats.ct}</div></div>
            <div><div className="text-[10px] uppercase tracking-widest text-white/65">Inventory Value</div><div className="text-2xl text-white">${stats.val}</div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        <FilterPanel filters={filters} setFilters={setFilters} accentColor={accent} extra={extra || {}} certLabs={certLabs} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/65"/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Stock ID or certificate #…" className="w-full bg-[#1F1B12] border border-white/10 pl-9 pr-3 py-2 text-sm rounded-sm" data-testid="stock-search"/>
            </div>
            <div className="flex gap-1 bg-[#1F1B12] border border-white/10 p-0.5 rounded-sm">
              <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-xs flex items-center gap-1 ${view === 'grid' ? 'bg-[#E5C158] text-[#14110A]' : 'text-white/75'}`} data-testid="view-grid"><Grid3X3 size={13}/> Grid</button>
              <button onClick={() => setView('table')} className={`px-3 py-1.5 text-xs flex items-center gap-1 ${view === 'table' ? 'bg-[#E5C158] text-[#14110A]' : 'text-white/75'}`} data-testid="view-table"><Rows size={13}/> Table</button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-white/70"><Loader2 className="animate-spin inline mr-2" size={16}/> Loading inventory…</div>
          ) : stones.length === 0 ? (
            <div className="py-20 text-center text-white/70 border border-dashed border-white/10">No stones match these filters. Adjust your selection.</div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="stock-grid">
              {stones.map(s => <StoneCard key={s.id} stone={s} accent={accent} argyleClass={argyleClass} />)}
            </div>
          ) : (
            <div className="overflow-x-auto border border-white/5">
              <table className="stock-table w-full" data-testid="stock-table">
                <thead><tr>
                  <th>Stock ID</th><th>Shape</th><th>Carat</th><th>Color</th><th>Clarity</th>
                  <th>Cut</th><th>Pol</th><th>Sym</th><th>Fluo</th><th>Cert</th>
                  <th className="text-right">$/ct</th><th className="text-right">Total $</th><th className="text-right">Action</th>
                </tr></thead>
                <tbody>{stones.map(s => <StoneRow key={s.id} stone={s} accent={accent} />)}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockBrowser;
