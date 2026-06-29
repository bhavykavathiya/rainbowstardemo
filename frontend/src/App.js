import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { BasketProvider } from './context/BasketContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EnquiryBasket from './components/EnquiryBasket';
import Home from './pages/Home';
import { CvdPage, NaturalPage, ArgylePinkPage, ArgyleBluePage } from './pages/StockPages';
import { Login, Register } from './pages/Auth';
import AdminPanel from './pages/Admin';
import { About, RequestStone, Contact, BasketPage } from './pages/StaticPages';
import { About as AboutNew } from './pages/AboutPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BasketProvider>
          <div className="App min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cvd" element={<CvdPage />} />
                <Route path="/natural" element={<NaturalPage />} />
                <Route path="/argyle-pink" element={<ArgylePinkPage />} />
                <Route path="/argyle-blue" element={<ArgyleBluePage />} />
                <Route path="/about" element={<AboutNew />} />
                <Route path="/request" element={<RequestStone />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/basket" element={<BasketPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
            <Footer />
            <EnquiryBasket />
            <Toaster position="bottom-left" theme="dark" toastOptions={{ style: { background: '#1F1B12', color: '#fff', border: '1px solid #27272A' } }} />
          </div>
        </BasketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
