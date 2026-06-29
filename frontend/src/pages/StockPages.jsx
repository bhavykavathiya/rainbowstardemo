import React from 'react';
import StockBrowser from '../components/StockBrowser';
import LoginGate from '../components/LoginGate';

export const CvdPage = () => (
  <LoginGate>
    <StockBrowser category="cvd" accent="#C9A227" title="CVD Diamonds" subtitle="Laboratory-grown, type IIa carbon — visually and chemically identical to mined diamonds. Certified by IGI, GIA & GCAL."
      headerBg="linear-gradient(135deg, #FFFDF7 0%, #FFF8E1 50%, #FAF6E8 100%)"
      extra={{ origin: false }} certLabs={['IGI','GIA','GCAL']} />
  </LoginGate>
);

export const NaturalPage = () => (
  <LoginGate>
    <StockBrowser category="natural" accent="#C9A227" title="Natural Diamonds" subtitle="Earth-mined fancy color & colorless naturals — GIA, HRD & IGI certified, ethically sourced."
      headerBg="linear-gradient(135deg, #FFFDF7 0%, #FFF8E1 50%, #FAF6E8 100%)"
      extra={{ origin: true, fancyColor: true }} certLabs={['GIA','GIA Fancy Color','HRD','IGI']} />
  </LoginGate>
);

export const ArgylePinkPage = () => (
  <LoginGate>
    <StockBrowser category="argyle_pink" accent="#B7536B" title="Argyle Pink Diamonds" subtitle="Only 0.1% of all diamonds mined are pink. From the now-closed Argyle Mine in Western Australia — the source of over 90% of the world's pink diamonds — each stone is a finite piece of geological history. Rarer with every passing year."
      headerBg="linear-gradient(135deg, #FFF7F9 0%, #FFE4EB 50%, #FFF7F9 100%)"
      extra={{ origin: true, fancyColor: true }} argyleClass="argyle-glow-pink" certLabs={['GIA Fancy Color','GIA','HRD']} />
  </LoginGate>
);

export const ArgyleBluePage = () => (
  <LoginGate>
    <StockBrowser category="argyle_blue" accent="#2F8FCB" title="Argyle Blue Diamonds" subtitle="Rare are the Pinks. Legendary are the Blues. Only 1 in 50,000 to 100,000 diamonds ever mined displays a true blue hue — and Argyle's violet-blues are the rarest of all. Whispers of violet, depths of ocean, the last of a vanished mine."
      headerBg="linear-gradient(135deg, #F5FAFD 0%, #DCEEF8 50%, #F5FAFD 100%)"
      extra={{ origin: true, fancyColor: true }} argyleClass="argyle-glow-blue" certLabs={['GIA Fancy Color','GIA','HRD']} />
  </LoginGate>
);
