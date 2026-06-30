import { supabase } from './supabase';

export const CONTACT = {
  whatsapp: '919825928587',
  whatsappDisplay: '+91 98259 28587',
  salesWhatsapp: '919712193000',
  salesDisplay: '+91 97121 93000',
  logoUrl: 'https://customer-assets.emergentagent.com/job_argyle-blue-elite/artifacts/6i4nnfax_IMG_3671.jpeg',
  email: 'info@rainbowstar.in',
  brand: 'Rainbow Star',
  domain: 'rainbowstar.in',
};

export const buildWhatsappLink = (text) => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const CATEGORY_META = {
  cvd: { label: 'CVD Diamonds', accent: '#C9A227', tagline: 'Lab-grown brilliance, certified perfection' },
  natural: { label: 'Natural Diamonds', accent: '#C9A227', tagline: 'Earth\'s rarest treasures, ethically sourced' },
  argyle_pink: { label: 'Argyle Pink', accent: '#B7536B', tagline: 'The rarest pinks from a closed mine' },
  argyle_blue: { label: 'Argyle Blue', accent: '#2F8FCB', tagline: 'Whispers of violet, depths of ocean' },
};

export const formatApiErrorDetail = (detail) => {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map(e => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
};

// ---- Diamonds ----

export const fetchDiamonds = async (params = {}) => {
  let query = supabase.from('diamonds').select('*').neq('status', 'archived');

  if (params.categories) {
    const cats = params.categories.split(',').map(c => c.trim()).filter(Boolean);
    if (cats.length) query = query.in('category', cats);
  } else if (params.category) {
    query = query.eq('category', params.category);
  }
  if (params.parcel_type) query = query.eq('parcel_type', params.parcel_type);
  if (params.shape) query = query.ilike('shape', params.shape);
  if (params.color) query = query.ilike('color', `%${params.color}%`);
  if (params.clarity) query = query.eq('clarity', params.clarity);
  if (params.certificate_lab) query = query.eq('certificate_lab', params.certificate_lab);
  if (params.fluorescence) query = query.eq('fluorescence', params.fluorescence);
  if (params.origin) query = query.eq('origin', params.origin);
  if (params.fancy_color) query = query.ilike('fancy_color', `%${params.fancy_color}%`);
  if (params.fancy_intensity) query = query.eq('fancy_intensity', params.fancy_intensity);
  if (params.is_fancy_color !== undefined && params.is_fancy_color !== null && params.is_fancy_color !== '') {
    query = query.eq('is_fancy_color', params.is_fancy_color === true || params.is_fancy_color === 'true');
  }
  if (params.carat_min) query = query.gte('carat', parseFloat(params.carat_min));
  if (params.carat_max) query = query.lte('carat', parseFloat(params.carat_max));
  if (params.price_min) query = query.gte('total_price', parseFloat(params.price_min));
  if (params.price_max) query = query.lte('total_price', parseFloat(params.price_max));
  if (params.search) {
    query = query.or(`stock_id.ilike.%${params.search}%,certificate_number.ilike.%${params.search}%,color.ilike.%${params.search}%`);
  }
  if (params.cut) query = query.eq('cut', params.cut);
  if (params.polish) query = query.eq('polish', params.polish);
  if (params.symmetry) query = query.eq('symmetry', params.symmetry);

  const limit = params.limit ? parseInt(params.limit) : 500;
  query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const fetchDiamondStats = async () => {
  const { count: total, error: e1 } = await supabase
    .from('diamonds')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'archived');
  if (e1) throw e1;

  const by_category = {};
  for (const cat of ['cvd', 'natural', 'argyle_pink', 'argyle_blue']) {
    const { count, error } = await supabase
      .from('diamonds')
      .select('*', { count: 'exact', head: true })
      .eq('category', cat)
      .neq('status', 'archived');
    if (error) throw error;
    by_category[cat] = count || 0;
  }
  return { total: total || 0, by_category };
};

export const fetchDiamond = async (id) => {
  const { data, error } = await supabase.from('diamonds').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
};

export const createDiamond = async (payload) => {
  const { data, error } = await supabase.from('diamonds').insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateDiamond = async (id, payload) => {
  const { data, error } = await supabase.from('diamonds').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const archiveDiamond = async (id) => {
  const { error } = await supabase.from('diamonds').update({ status: 'archived' }).eq('id', id);
  if (error) throw error;
  return { ok: true };
};

// ---- Enquiries ----

export const createEnquiry = async (payload) => {
  const { data, error } = await supabase.from('enquiries').insert({
    ...payload,
    stone_ids: payload.stone_ids || [],
    status: 'new',
  }).select().single();
  if (error) throw error;
  return data;
};

export const fetchEnquiries = async () => {
  const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(500);
  if (error) throw error;
  return data || [];
};

export const createStoneRequest = async (payload) => {
  const { data, error } = await supabase.from('stone_requests').insert({
    ...payload,
    type: 'stone_request',
  }).select().single();
  if (error) throw error;
  return data;
};

export const subscribeNewsletter = async (email) => {
  const { data, error } = await supabase.from('newsletter').upsert(
    { email: email.toLowerCase() },
    { onConflict: 'email' }
  ).select().single();
  if (error) throw error;
  return { ok: true };
};
