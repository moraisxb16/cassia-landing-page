import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './cart/CartContext';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { AboutMe } from './components/sections/AboutMe';
import { MyWork } from './components/sections/MyWork';
import { MySpecializations } from './components/sections/MySpecializations';
import { MyTools } from './components/sections/MyTools';
import { Services } from './components/sections/Services';
import { Courses } from './components/sections/Courses';
import { Products } from './components/sections/Products';
import { Testimonials } from './components/sections/Testimonials';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './cart/CartDrawer';
import { CheckoutForm } from './payment/CheckoutForm';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentCancel } from './pages/PaymentCancel';

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <AboutMe />
      <MyWork />
      <MySpecializations />
      <MyTools />
      <Courses />
      <Services />
      <Testimonials />
      <Products />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-[var(--cassia-white)] relative overflow-hidden">
                {/* Background Effects - Místico e Claro */}
                <div className="fixed inset-0 bg-gradient-to-br from-[var(--cassia-lavender)]/20 via-[var(--cassia-white)] to-[var(--cassia-gold-light)]/20 pointer-events-none" />
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[var(--cassia-purple)]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[var(--cassia-gold)]/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--cassia-lavender)]/15 rounded-full blur-[150px] pointer-events-none" />

                <HomePage />

                {/* Fluxo de Carrinho & Checkout montado globalmente */}
                <CartDrawer />
                <CheckoutForm />
              </div>
            }
          />
          <Route path="/pagamento/sucesso" element={<PaymentSuccess />} />
          <Route path="/pagamento/cancelado" element={<PaymentCancel />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
