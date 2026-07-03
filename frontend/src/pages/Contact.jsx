import React from 'react';
import MainLayout from '../layouts/MainLayout';

const Contact = () => {
  return (
    <MainLayout>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="font-display text-5xl mb-4">Contact</h1>
        <p className="text-slate-300 mb-8">Need help with sizing, delivery, tracking, or custom kits? Reach us below.</p>
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <p>Email: support@jerseyhub.store</p>
          <p>Phone: +91 90000 00000</p>
          <p>Live Chat: 10:00 AM - 10:00 PM IST</p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
