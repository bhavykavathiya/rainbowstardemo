import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import { CONTACT, buildWhatsappLink } from '../lib/api';

const Footer = () => (
  <footer className="border-t border-[#E8DFC2] bg-white mt-24" data-testid="footer">
    <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">
      <div className="md:col-span-2">
        <div className="font-serif text-3xl mb-3 refraction">Rainbow Star</div>
        <p className="text-[#1A1505] text-sm leading-relaxed max-w-md">
          A premier B2B house for loose diamonds — CVD, Natural Fancy Colors, and the world's rarest Argyle Pink &amp; Argyle Blue stones. Trusted by dealers, jewelers, and collectors worldwide.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={buildWhatsappLink('Hello Rainbow Star, I would like to enquire about your inventory.')} target="_blank" rel="noreferrer" className="btn-whatsapp" data-testid="footer-whatsapp"><MessageCircle size={14}/> WhatsApp Us</a>
          <a href={`mailto:${CONTACT.email}`} className="btn-outline-gold !text-xs" data-testid="footer-email"><Mail size={14}/> {CONTACT.email}</a>
        </div>
      </div>
      <div>
        <div className="overline mb-4">Explore</div>
        <div className="space-y-2 text-sm">
          {[['/cvd','CVD Diamonds'],['/natural','Natural Diamonds'],['/argyle-pink','Argyle Pink'],['/argyle-blue','Argyle Blue'],['/request','Request a Stone']].map(([to,l]) => (
            <Link key={to} to={to} className="block text-[#1A1505] hover:text-[#C9A227] transition">{l}</Link>
          ))}
        </div>
      </div>
      <div>
        <div className="overline mb-4">Contact</div>
        <div className="space-y-2 text-sm text-[#1A1505]">
          <div className="flex items-start gap-2"><MapPin size={14} className="mt-1 text-[#C9A227]"/> Surat, Gujarat<br/>India</div>
          <div>{CONTACT.whatsappDisplay}</div>
          <div>{CONTACT.email}</div>
        </div>
      </div>
    </div>
    <div className="border-t border-[#E8DFC2] py-6 text-center text-xs text-[#1A1505] tracking-wider">
      © {new Date().getFullYear()} Rainbow Star — All rights reserved. Trade enquiries only.
    </div>
  </footer>
);
export default Footer;
