import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatApiErrorDetail, fetchDiamonds, fetchEnquiries, createDiamond, updateDiamond, archiveDiamond } from '../lib/api';
import { toast } from 'sonner';
import { Plus, Trash2, Mail, X } from 'lucide-react';

const EMPTY = {
  stock_id: '', category: 'cvd', shape: 'ROUND', carat: 1.0, color: 'D', clarity: 'VS1',
  cut: 'Excellent', polish: 'Excellent', symmetry: 'Excellent', fluorescence: 'None',
  certificate_lab: 'IGI', certificate_number: '', certificate_url: '',
  price_per_carat: 0, total_price: 0, origin: '', diamond_type: '', treatment: '',
  is_fancy_color: false, fancy_color: '', fancy_intensity: '',
  image_url: '', video_url: '', notes: '', status: 'available'
};

const AdminPanel = () => {
  const { user, checking } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('stock');
  const [stones, setStones] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (checking) return;
    if (!user || user.role !== 'admin') navigate('/login');
  }, [user, checking, navigate]);

  const loadAll = async () => {
    const [d, e] = await Promise.all([fetchDiamonds({ limit: 1000 }), fetchEnquiries().catch(() => [])]);
    setStones(d); setEnquiries(e);
  };
  useEffect(() => { if (user && user.role === 'admin') loadAll(); }, [user]);

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, carat: parseFloat(form.carat) || 0, price_per_carat: parseFloat(form.price_per_carat) || 0, total_price: parseFloat(form.total_price) || 0 };
      if (editing) await updateDiamond(editing, payload);
      else await createDiamond(payload);
      toast.success(editing ? 'Updated' : 'Added');
      setForm(EMPTY); setEditing(null); loadAll();
    } catch (e) { toast.error(e.message || 'Failed'); }
  };

  const del = async (id) => {
    if (!window.confirm('Archive this stone?')) return;
    await archiveDiamond(id); toast.success('Archived'); loadAll();
  };

  const startEdit = (s) => { setEditing(s.id); setForm(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (checking || !user) return <div className="py-32 text-center text-[#1A1505]">Loading…</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="admin-panel">
      <div className="flex items-center justify-between mb-8">
        <div><div className="overline text-[#b8960c]">Admin Panel</div><h1 className="font-serif text-4xl">Inventory Control</h1></div>
        <div className="flex gap-2">
          <button onClick={() => setTab('stock')} className={`px-4 py-2 text-xs uppercase tracking-wider border ${tab === 'stock' ? 'bg-[#b8960c] text-white border-[#b8960c]' : 'border-[#b8960c]/40 text-[#1A1505]'}`} data-testid="tab-stock">Stock</button>
          <button onClick={() => setTab('enquiries')} className={`px-4 py-2 text-xs uppercase tracking-wider border ${tab === 'enquiries' ? 'bg-[#b8960c] text-white border-[#b8960c]' : 'border-[#b8960c]/40 text-[#1A1505]'}`} data-testid="tab-enquiries"><Mail size={12} className="inline mr-1"/>Enquiries ({enquiries.length})</button>
        </div>
      </div>

      {tab === 'stock' && (
        <>
          <form onSubmit={save} className="bg-white border border-[#E8DFC2] p-6 mb-8" data-testid="admin-form">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl">{editing ? 'Edit Diamond' : 'Add Diamond'}</h2>
              {editing && <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }} className="text-xs text-[#1A1505] hover:text-[#1A1505]">Cancel</button>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input required placeholder="Stock ID *" value={form.stock_id} onChange={e => setForm({...form, stock_id: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm" data-testid="form-stockid"/>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm" data-testid="form-category">
                <option value="cvd">CVD</option><option value="natural">Natural</option>
                <option value="argyle_pink">Argyle Pink</option><option value="argyle_blue">Argyle Blue</option>
              </select>
              <input required placeholder="Shape" value={form.shape} onChange={e => setForm({...form, shape: e.target.value.toUpperCase()})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input required type="number" step="0.01" placeholder="Carat" value={form.carat} onChange={e => setForm({...form, carat: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Clarity" value={form.clarity} onChange={e => setForm({...form, clarity: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Cut" value={form.cut} onChange={e => setForm({...form, cut: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Polish" value={form.polish} onChange={e => setForm({...form, polish: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Symmetry" value={form.symmetry} onChange={e => setForm({...form, symmetry: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Fluorescence" value={form.fluorescence} onChange={e => setForm({...form, fluorescence: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Cert Lab" value={form.certificate_lab} onChange={e => setForm({...form, certificate_lab: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Cert #" value={form.certificate_number} onChange={e => setForm({...form, certificate_number: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input type="number" placeholder="$/ct" value={form.price_per_carat} onChange={e => setForm({...form, price_per_carat: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input type="number" placeholder="Total $" value={form.total_price} onChange={e => setForm({...form, total_price: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Origin" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
              <input placeholder="Treatment" value={form.treatment} onChange={e => setForm({...form, treatment: e.target.value})} className="bg-white border border-[#D9CB94] px-3 py-2 text-sm"/>
            </div>
            <button type="submit" className="btn-gold mt-4" data-testid="form-submit"><Plus size={14}/>{editing ? 'Update' : 'Add'} Diamond</button>
          </form>

          <div className="overflow-x-auto bg-white border border-[#E8DFC2]">
            <table className="stock-table w-full text-xs" data-testid="admin-stock-table">
              <thead><tr><th>ID</th><th>Cat</th><th>Shape</th><th>Carat</th><th>Color</th><th>Clarity</th><th>Cert</th><th>$</th><th>Action</th></tr></thead>
              <tbody>{stones.slice(0, 100).map(s => (
                <tr key={s.id}>
                  <td className="font-mono text-[#b8960c]">{s.stock_id}</td>
                  <td>{s.category}</td><td>{s.shape}</td><td>{s.carat}</td>
                  <td className="max-w-[160px] truncate" title={s.color}>{s.color}</td><td>{s.clarity}</td>
                  <td>{s.certificate_lab}</td><td className="font-mono">${s.total_price?.toLocaleString()}</td>
                  <td className="flex gap-1">
                    <button onClick={() => startEdit(s)} className="px-2 py-1 border border-[#D9CB94] text-[10px]" data-testid={`edit-${s.stock_id}`}>Edit</button>
                    <button onClick={() => del(s.id)} className="px-2 py-1 border border-red-500/30 text-red-400 text-[10px]" data-testid={`del-${s.stock_id}`}><Trash2 size={10}/></button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
            <div className="px-4 py-3 text-xs text-[#3D3520]">Showing {Math.min(100, stones.length)} of {stones.length}</div>
          </div>
        </>
      )}

      {tab === 'enquiries' && (
        <div className="space-y-3" data-testid="enquiry-list">
          {enquiries.length === 0 && <div className="text-[#1A1505] py-12 text-center">No enquiries yet</div>}
          {enquiries.map(e => (
            <div key={e.id} className="bg-white border border-[#E8DFC2] p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <div className="font-serif text-xl">{e.name} {e.company && <span className="text-[#3D3520] text-sm">· {e.company}</span>}</div>
                  <div className="text-xs text-[#1A1505] mt-1">{e.email} · {e.phone || '—'} · {new Date(e.created_at).toLocaleString()}</div>
                  {e.message && <div className="text-sm text-[#1A1505] mt-3 whitespace-pre-wrap">{e.message}</div>}
                </div>
                <div className="text-right text-xs">
                  <div className="text-[#b8960c]">{e.stone_ids?.length || 0} stones</div>
                  <div className="text-[#3D3520]">via {e.source}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
