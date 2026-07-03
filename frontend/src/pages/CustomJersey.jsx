import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';

const fonts = ['Impact', 'Rajdhani', 'Arial Black'];
const badges = ['Champions', 'Captain', 'Golden Boot'];
const patches = ['League Patch', 'Cup Patch', 'No Patch'];

const CustomJersey = () => {
  const [name, setName] = useState('RONALDO');
  const [number, setNumber] = useState('7');
  const [font, setFont] = useState(fonts[0]);
  const [badge, setBadge] = useState(badges[0]);
  const [patch, setPatch] = useState(patches[0]);
  const [sponsor, setSponsor] = useState('JERSEY HUB');

  const badgeClass = useMemo(() => {
    if (badge === 'Captain') return 'bg-red-500';
    if (badge === 'Golden Boot') return 'bg-amber-400 text-black';
    return 'bg-blue-500';
  }, [badge]);

  return (
    <MainLayout>
      <section className="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-6">
          <h1 className="font-display text-4xl mb-2">Custom Jersey Studio</h1>
          <p className="text-slate-300 mb-6">Personalize your jersey with instant live preview.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm">
              Player Name
              <input className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />
            </label>
            <label className="text-sm">
              Number
              <input className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2" value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 2))} />
            </label>
            <label className="text-sm">
              Font
              <select className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2" value={font} onChange={(e) => setFont(e.target.value)}>
                {fonts.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-sm">
              Badge
              <select className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2" value={badge} onChange={(e) => setBadge(e.target.value)}>
                {badges.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-sm">
              Sleeve Patch
              <select className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2" value={patch} onChange={(e) => setPatch(e.target.value)}>
                {patches.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="text-sm">
              Sponsor Logo Text
              <input className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2" value={sponsor} onChange={(e) => setSponsor(e.target.value.toUpperCase())} />
            </label>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-2xl mb-6">Live Preview</h2>
          <div className="mx-auto w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0e1e4f] to-[#121212] border border-white/20 p-8 shadow-premium">
            <div className="h-6 w-20 rounded-full bg-white/80 mx-auto mb-4" />
            <div className="text-center mb-6 text-xs text-white/85">{patch}</div>
            <div className={`inline-block rounded-full px-3 py-1 text-xs ${badgeClass}`}>{badge}</div>
            <div className="mt-8 text-center" style={{ fontFamily: font }}>
              <p className="text-3xl tracking-wider">{name || 'PLAYER'}</p>
              <p className="text-7xl font-bold leading-none">{number || '00'}</p>
            </div>
            <div className="mt-8 text-center text-sm text-white/75">{sponsor || 'SPONSOR'}</div>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default CustomJersey;
