import React from 'react';
import StockBrowser from '../components/StockBrowser';

export const CvdPage = () => (
  <StockBrowser category="cvd" accent="#E5C158" title="CVD Diamonds" subtitle="Laboratory-grown, type IIa carbon — visually and chemically identical to mined diamonds. Certified by IGI, GIA &amp; GCAL."
    headerBg="linear-gradient(135deg, #1A160E 0%, #1a1530 50%, #1A160E 100%)"
    extra={{ origin: false }} certLabs={['IGI','GIA','GCAL']} />
);

export const NaturalPage = () => (
  <StockBrowser category="natural" accent="#E5C158" title="Natural Diamonds" subtitle="Earth-mined fancy color &amp; colorless naturals — GIA, HRD &amp; IGI certified, ethically sourced."
    headerBg="linear-gradient(135deg, #1A160E 0%, #1a1a2a 50%, #1A160E 100%)"
    extra={{ origin: true, fancyColor: true }} certLabs={['GIA','GIA Fancy Color','HRD','IGI']} />
);

export const ArgylePinkPage = () => (
  <StockBrowser category="argyle_pink" accent="#C68997" title="Argyle Pink Diamonds" subtitle="The world's rarest pinks from the now-closed Argyle Mine. Each stone a piece of geological history."
    headerBg="linear-gradient(135deg, #1a0a12 0%, #2a1820 50%, #1a0a12 100%)"
    extra={{ origin: true, fancyColor: true, skipColorClarity: false }} argyleClass="argyle-glow-pink" certLabs={['GIA Fancy Color','GIA','HRD']} />
);

export const ArgyleBluePage = () => (
  <StockBrowser category="argyle_blue" accent="#6DD0F8" title="Argyle Blue Diamonds" subtitle="Whispers of violet, depths of ocean. The rarest Argyle blues — fewer than 100 carats produced in the mine's final years."
    headerBg="linear-gradient(135deg, #0a1220 0%, #122035 50%, #0a1220 100%)"
    extra={{ origin: true, fancyColor: true }} argyleClass="argyle-glow-blue" certLabs={['GIA Fancy Color','GIA','HRD']} />
);
