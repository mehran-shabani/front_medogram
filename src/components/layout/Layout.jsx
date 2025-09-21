import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * Main Layout component that wraps all pages
 */
export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};