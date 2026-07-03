import React from 'react';
import MainLayout from '../layouts/MainLayout';

const About = () => {
  return (
    <MainLayout>
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="font-display text-5xl mb-4">About Jersey Hub</h1>
        <p className="text-slate-300 leading-relaxed">
          Jersey Hub is a premium sports commerce experience focused on football culture, elite craftsmanship, and next-gen digital shopping.
          We blend performance textile technology with immersive design to help every fan wear the game with confidence.
        </p>
      </section>
    </MainLayout>
  );
};

export default About;
