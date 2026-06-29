import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, withCredentials: true });

export const formatApiErrorDetail = (detail) => {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map(e => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
};

export const CONTACT = {
  whatsapp: '918145644444',
  whatsappDisplay: '+91 81456 44444',
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
