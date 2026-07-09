import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const patternDefs = {
  Plain: null,
  Stripes: (id) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width="24" height="24">
      <path d="M0 0 L24 0" stroke="rgba(255,255,255,0.18)" strokeWidth="6" />
      <path d="M0 24 L24 24" stroke="rgba(255,255,255,0.18)" strokeWidth="6" />
    </pattern>
  ),
  Gradient: (id) => (
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
      <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
    </linearGradient>
  ),
  Camouflage: (id) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width="24" height="24">
      <circle cx="8" cy="8" r="5" fill="rgba(255,255,255,0.12)" />
      <circle cx="16" cy="14" r="4" fill="rgba(0,0,0,0.08)" />
      <circle cx="4" cy="18" r="3" fill="rgba(255,255,255,0.08)" />
    </pattern>
  ),
  Geometric: (id) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width="32" height="32">
      <rect x="0" y="0" width="16" height="16" fill="rgba(255,255,255,0.08)" />
      <rect x="16" y="16" width="16" height="16" fill="rgba(0,0,0,0.06)" />
    </pattern>
  ),
  Classic: (id) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width="20" height="20">
      <path d="M10 0 L10 20" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
    </pattern>
  )
};

const collarPaths = {
  'Round Neck': 'M120 100 Q180 55 240 100',
  'V Neck': 'M120 100 L180 55 L240 100',
  Polo: 'M120 100 C180 35 240 100 L240 108 C180 90 120 108 120 100 Z',
  'Crew Neck': 'M120 100 Q180 70 240 100 Q180 85 120 100 Z'
};

const sleevePaths = {
  'Half Sleeve': {
    left: 'M70 100 C50 140 50 190 80 210 L105 190 C90 180 86 160 90 150 Z',
    right: 'M290 100 C310 140 310 190 280 210 L255 190 C270 180 274 160 270 150 Z'
  },
  'Full Sleeve': {
    left: 'M70 100 C40 150 40 240 80 270 L110 250 C95 230 92 205 96 190 Z',
    right: 'M290 100 C320 150 320 240 280 270 L250 250 C265 230 268 205 264 190 Z'
  },
  Sleeveless: {
    left: 'M90 100 L110 100 L110 120 L90 120 Z',
    right: 'M250 100 L270 100 L270 120 L250 120 Z'
  }
};

const JerseyPreview = React.forwardRef(({
  view,
  size,
  colors,
  pattern,
  collarStyle,
  sleeveStyle,
  playerName,
  number,
  font,
  badge,
  patch,
  sponsor,
  zoom,
  rotation,
  logoPositions
}, ref) => {
  const fillId = `jersey-pattern-${pattern}`;
  const patternElement = useMemo(() => (patternDefs[pattern] ? patternDefs[pattern](fillId) : null), [pattern, fillId]);
  const showFront = view === 'front';

  return (
    <div className="relative mx-auto rounded-[2.5rem] bg-[#08101f]/70 p-5 shadow-[0_30px_90px_rgba(4,17,45,0.55)] overflow-hidden" ref={ref}>
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.28),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_30%)] pointer-events-none" />
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0f172a] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mx-auto w-full max-w-[360px]"
          style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 360 520" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="jerseyLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="jerseyShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
              </linearGradient>
              <pattern id="fabricTexture" patternUnits="userSpaceOnUse" width="12" height="12">
                <path d="M0 0 L12 0 M0 6 L12 6" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
              {patternElement}
            </defs>

            <g filter="url(#shadow)" />
            <path
              d="M80 100 C80 65 120 40 180 40 C240 40 280 65 280 100 L280 150 C300 190 300 250 280 290 L260 320 C260 400 230 500 180 500 C130 500 100 400 100 320 L80 290 C60 250 60 190 80 150 Z"
              fill={colors.primary}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="2"
            />
            <path
              d="M80 100 C80 65 120 40 180 40 C240 40 280 65 280 100 L280 150 C300 190 300 250 280 290 L260 320 C260 400 230 500 180 500 C130 500 100 400 100 320 L80 290 C60 250 60 190 80 150 Z"
              fill={pattern !== 'Plain' ? `url(#${fillId})` : 'none'}
              opacity={pattern === 'Plain' ? 0 : 0.35}
            />
            <path d="M80 100 C120 80 160 70 180 70 C200 70 240 80 280 100" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="6" opacity="0.5" />
            <path
              d={sleevePaths[sleeveStyle]?.left || sleevePaths['Half Sleeve'].left}
              fill={colors.sleeve}
              opacity="0.96"
            />
            <path
              d={sleevePaths[sleeveStyle]?.right || sleevePaths['Half Sleeve'].right}
              fill={colors.sleeve}
              opacity="0.96"
            />
            <path d={collarPaths[collarStyle] || collarPaths['Round Neck']} fill="none" stroke={colors.collar} strokeWidth="18" strokeLinecap="round" />
            <circle cx="180" cy="120" r="4" fill="rgba(255,255,255,0.6)" />
            <path d="M100 210 C130 195 160 195 190 210" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" strokeLinecap="round" />
            <path d="M170 210 C200 195 230 195 260 210" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" strokeLinecap="round" />

            {showFront ? (
              <>
                <circle cx="110" cy="180" r="24" fill="rgba(255,255,255,0.9)" />
                <text x="110" y="187" textAnchor="middle" fontSize="16" fill="#111" fontWeight="700">CLUB</text>
                <rect x="130" y="194" width="100" height="28" rx="10" fill="rgba(0,0,0,0.18)" />
                <text x="180" y="214" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="700">{sponsor.substring(0, 14)}</text>
                <text
                  x="180"
                  y="320"
                  textAnchor="middle"
                  fontSize="96"
                  fontWeight="900"
                  fill="rgba(255,255,255,0.94)"
                  style={{ fontFamily: font }}
                >
                  {number || '00'}
                </text>
                <text x="180" y="415" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="14">
                  {patch}
                </text>
              </>
            ) : (
              <>
                <text
                  x="180"
                  y="170"
                  textAnchor="middle"
                  fontSize="26"
                  fill="rgba(255,255,255,0.88)"
                  fontWeight="800"
                  style={{ letterSpacing: '0.18em', fontFamily: font }}
                >
                  {playerName || 'PLAYER NAME'}
                </text>
                <text
                  x="180"
                  y="300"
                  textAnchor="middle"
                  fontSize="104"
                  fill="rgba(255,255,255,0.96)"
                  fontWeight="900"
                  style={{ fontFamily: font }}
                >
                  {number || '00'}
                </text>
                <rect x="145" y="380" width="70" height="28" rx="12" fill="rgba(255,255,255,0.18)" />
                <text x="180" y="400" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="12" fontWeight="700">{patch}</text>
              </>
            )}

            <g opacity="0.18">
              <path d="M90 180 Q120 170 150 180" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
              <path d="M210 180 Q240 170 270 180" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
            </g>
          </svg>
        </motion.div>
      </div>
      <div className="mt-4 text-center text-sm text-slate-400">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-[0_10px_35px_rgba(15,23,42,0.35)]">
          <span className="text-slate-100 uppercase tracking-[0.24em] text-[11px]">Size</span>
          <span className="font-semibold text-white">{size}</span>
        </div>
      </div>
    </div>
  );
});

export default JerseyPreview;
