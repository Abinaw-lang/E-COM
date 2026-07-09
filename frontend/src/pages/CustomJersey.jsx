import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import JerseyPreview from '../components/JerseyPreview';
import ColorPicker from '../components/ColorPicker';
import SizeSelector from '../components/SizeSelector';
import PatternSelector from '../components/PatternSelector';
import DownloadButton from '../components/DownloadButton';
import ToggleView from '../components/ToggleView';
import QuantitySelector from '../components/QuantitySelector';

const fonts = ['Impact', 'Rajdhani', 'Arial Black'];
const badges = ['Champions', 'Captain', 'Golden Boot'];
const patches = ['League Patch', 'Cup Patch', 'No Patch'];
const collarStyles = ['Round Neck', 'V Neck', 'Polo', 'Crew Neck'];
const sleeveStyles = ['Half Sleeve', 'Full Sleeve', 'Sleeveless'];

const CustomJersey = () => {
  const [playerName, setPlayerName] = useState('RONALDO');
  const [number, setNumber] = useState('7');
  const [font, setFont] = useState(fonts[0]);
  const [badge, setBadge] = useState(badges[0]);
  const [patch, setPatch] = useState(patches[0]);
  const [sponsor, setSponsor] = useState('JERSEY HUB');
  const [view, setView] = useState('front');
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [pattern, setPattern] = useState('Plain');
  const [collarStyle, setCollarStyle] = useState('Round Neck');
  const [sleeveStyle, setSleeveStyle] = useState('Half Sleeve');
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [colors, setColors] = useState({
    primary: '#1f2937',
    secondary: '#2563eb',
    sleeve: '#111827',
    collar: '#f8fafc'
  });

  const previewRef = useRef(null);

  const handleColorChange = (key, value) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownloadPNG = () => {
    const svg = previewRef.current?.querySelector('svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#08101f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${playerName || 'custom'}-${view}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleDownloadPDF = () => {
    const svg = previewRef.current?.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${playerName || 'custom'}-${view}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  const logoPositions = [
    { label: 'Club Logo', active: true },
    { label: 'League Badge', active: true },
    { label: 'Sleeve Badge', active: true },
    { label: 'Sponsor Logo', active: true }
  ];

  return (
    <MainLayout>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="glass-card rounded-[2rem] border border-white/10 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight text-white">Custom Jersey Studio</h1>
                <p className="mt-2 max-w-2xl text-slate-300">Design your jersey with a premium live preview, size options, and professional styling details.</p>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Selected Size</p>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                  {size}
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-5">
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.16)]">
                  <h2 className="mb-5 text-sm uppercase tracking-[0.28em] text-slate-400">Player Customization</h2>
                  <div className="grid gap-4">
                    <label className="block text-sm text-slate-200">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Player Name</span>
                      <input
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                        className="mt-3 w-full rounded-3xl border border-white/10 bg-[#020617]/90 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                        placeholder="RONALDO"
                      />
                    </label>
                    <label className="block text-sm text-slate-200">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Number</span>
                      <input
                        value={number}
                        onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        className="mt-3 w-full rounded-3xl border border-white/10 bg-[#020617]/90 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                        placeholder="07"
                      />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm text-slate-200">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Font</span>
                        <select
                          value={font}
                          onChange={(e) => setFont(e.target.value)}
                          className="mt-3 w-full rounded-3xl border border-white/10 bg-[#020617]/90 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                        >
                          {fonts.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm text-slate-200">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Badge</span>
                        <select
                          value={badge}
                          onChange={(e) => setBadge(e.target.value)}
                          className="mt-3 w-full rounded-3xl border border-white/10 bg-[#020617]/90 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                        >
                          {badges.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="block text-sm text-slate-200">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-500">League Patch</span>
                      <select
                        value={patch}
                        onChange={(e) => setPatch(e.target.value)}
                        className="mt-3 w-full rounded-3xl border border-white/10 bg-[#020617]/90 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                      >
                        {patches.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-sm text-slate-200">
                      <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Sponsor Logo</span>
                      <input
                        value={sponsor}
                        onChange={(e) => setSponsor(e.target.value.toUpperCase())}
                        className="mt-3 w-full rounded-3xl border border-white/10 bg-[#020617]/90 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                        placeholder="JERSEY HUB"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.16)]">
                  <h2 className="mb-5 text-sm uppercase tracking-[0.28em] text-slate-400">Design Controls</h2>
                  <div className="grid gap-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <SizeSelector value={size} onChange={setSize} />
                      <QuantitySelector quantity={quantity} onChange={setQuantity} />
                    </div>
                    <PatternSelector value={pattern} onChange={setPattern} />
                    <div className="grid gap-4 lg:grid-cols-2">
                      <label className="block text-sm text-slate-200">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Collar Style</span>
                        <select
                          value={collarStyle}
                          onChange={(e) => setCollarStyle(e.target.value)}
                          className="mt-3 w-full rounded-3xl border border-white/10 bg-[#020617]/90 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                        >
                          {collarStyles.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm text-slate-200">
                        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Sleeve Style</span>
                        <select
                          value={sleeveStyle}
                          onChange={(e) => setSleeveStyle(e.target.value)}
                          className="mt-3 w-full rounded-3xl border border-white/10 bg-[#020617]/90 px-4 py-3 text-white outline-none transition focus:border-blue-400"
                        >
                          {sleeveStyles.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ColorPicker label="Primary Color" color={colors.primary} onChange={(value) => handleColorChange('primary', value)} />
                      <ColorPicker label="Secondary Color" color={colors.secondary} onChange={(value) => handleColorChange('secondary', value)} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ColorPicker label="Sleeve Color" color={colors.sleeve} onChange={(value) => handleColorChange('sleeve', value)} />
                      <ColorPicker label="Collar Color" color={colors.collar} onChange={(value) => handleColorChange('collar', value)} />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/50 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.16)]">
                  <h2 className="mb-5 text-sm uppercase tracking-[0.28em] text-slate-400">Logo Positions</h2>
                  <div className="grid gap-3">
                    {logoPositions.map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#020617]/80 px-4 py-3">
                        <span className="text-sm text-slate-200">{item.label}</span>
                        <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs uppercase tracking-[0.24em] text-blue-100">Visible</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_40px_100px_rgba(15,23,42,0.4)]">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Preview</p>
                      <h2 className="text-2xl font-semibold text-white">Jersey Studio</h2>
                    </div>
                    <ToggleView view={view} onChange={setView} />
                  </div>
                  <div ref={previewRef} className="rounded-[2rem] border border-white/10 bg-[#08101f]/70 p-5">
                    <JerseyPreview
                      view={view}
                      size={size}
                      colors={colors}
                      pattern={pattern}
                      collarStyle={collarStyle}
                      sleeveStyle={sleeveStyle}
                      playerName={playerName}
                      number={number}
                      font={font}
                      badge={badge}
                      patch={patch}
                      sponsor={sponsor}
                      zoom={zoom}
                      rotation={rotation}
                    />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setZoom((current) => Math.min(1.4, current + 0.1))}
                      className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Zoom In
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom((current) => Math.max(0.8, current - 0.1))}
                      className="rounded-2xl bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      Zoom Out
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setZoom(1);
                        setRotation(0);
                      }}
                      className="rounded-2xl bg-blue-500/15 px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/25"
                    >
                      Reset View
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRotation((current) => current + 15)}
                    className="mt-4 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/15 transition hover:scale-[1.01]"
                  >
                    Rotate Jersey
                  </button>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_40px_100px_rgba(15,23,42,0.4)]">
                  <div className="grid gap-3">
                    <DownloadButton onDownloadPNG={handleDownloadPNG} onDownloadPDF={handleDownloadPDF} />
                    <button
                      type="button"
                      className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default CustomJersey;
