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

// T-shirt body silhouettes — sleeves are part of the single outline (boxier, not fitted like a jersey)
const bodyPaths = {
  'Half Sleeve':
    'M150,42 C165,55 195,55 210,42 L255,55 L310,75 C315,95 300,120 285,135 L262,120 L262,470 L98,470 L98,120 L75,135 C60,120 45,95 50,75 L105,55 Z',
  'Full Sleeve':
    'M150,42 C165,55 195,55 210,42 L255,55 L300,90 L300,215 L262,205 L262,470 L98,470 L98,205 L60,215 L60,90 L105,55 Z',
  Sleeveless:
    'M150,42 C165,55 195,55 210,42 L230,55 L262,110 L262,470 L98,470 L98,110 L130,55 Z'
};

// Small color-blocked cuffs at the sleeve ends (tank has none)
const cuffPaths = {
  'Half Sleeve': {
    left: 'M98,120 L75,135 L63,145 L90,133 Z',
    right: 'M262,120 L285,135 L297,145 L270,133 Z'
  },
  'Full Sleeve': {
    left: 'M60,190 L98,190 L98,215 L60,215 Z',
    right: 'M262,190 L300,190 L300,215 L262,215 Z'
  },
  Sleeveless: null
};

// Neckline treatments
const collarPaths = {
  'Round Neck': { d: 'M150,42 Q180,64 210,42', width: 10 },
  'Crew Neck': { d: 'M150,42 Q180,58 210,42', width: 14 },
  'V Neck': { d: 'M150,42 L180,90 L210,42', width: 9 },
  Polo: { d: 'M150,42 Q180,60 210,42', width: 9, placket: true }
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
  rotation
}, ref) => {
  const fillId = `tshirt-pattern-${pattern}`;
  const patternElement = useMemo(() => (patternDefs[pattern] ? patternDefs[pattern](fillId) : null), [pattern, fillId]);
  const showFront = view === 'front';

  const body = bodyPaths[sleeveStyle] || bodyPaths['Half Sleeve'];
  const cuffs = cuffPaths[sleeveStyle];
  const collar = collarPaths[collarStyle] || collarPaths['Round Neck'];

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
              <linearGradient id="teeLight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <pattern id="fabricTexture" patternUnits="userSpaceOnUse" width="12" height="12">
                <path d="M0 0 L12 0 M0 6 L12 6" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
              {patternElement}
            </defs>

            {/* Body + integrated sleeves */}
            <path d={body} fill={colors.primary} stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
            <path d={body} fill={pattern !== 'Plain' ? `url(#${fillId})` : 'none'} opacity={pattern === 'Plain' ? 0 : 0.35} />
            <path d={body} fill="url(#teeLight)" opacity="0.5" />

            {/* Sleeve cuffs, color-blocked with the sleeve color */}
            {cuffs && (
              <>
                <path d={cuffs.left} fill={colors.sleeve} opacity="0.95" />
                <path d={cuffs.right} fill={colors.sleeve} opacity="0.95" />
              </>
            )}

            {/* Collar ribbing */}
            <path d={collar.d} fill="none" stroke={colors.collar} strokeWidth={collar.width} strokeLinecap="round" />
            {collar.placket && (
              <>
                <rect x="172" y="50" width="16" height="46" rx="4" fill={colors.collar} opacity="0.85" />
                <circle cx="180" cy="64" r="2.2" fill="#1f2937" />
                <circle cx="180" cy="80" r="2.2" fill="#1f2937" />
              </>
            )}

            {/* Center seam + hem shading */}
            <path d="M180,96 L180,468" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d="M98,462 L262,462" stroke="rgba(0,0,0,0.15)" strokeWidth="6" strokeLinecap="round" />

            {showFront ? (
              <>
                <circle cx="130" cy="150" r="20" fill="rgba(255,255,255,0.9)" />
                <text x="130" y="156" textAnchor="middle" fontSize="13" fill="#111" fontWeight="700">CLUB</text>
                <rect x="150" y="160" width="90" height="24" rx="9" fill="rgba(0,0,0,0.18)" />
                <text x="195" y="177" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">{sponsor.substring(0, 14)}</text>
                <text
                  x="180"
                  y="300"
                  textAnchor="middle"
                  fontSize="88"
                  fontWeight="900"
                  fill="rgba(255,255,255,0.94)"
                  style={{ fontFamily: font }}
                >
                  {number || '00'}
                </text>
                <text x="180" y="400" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="13">
                  {patch}
                </text>
              </>
            ) : (
              <>
                <text
                  x="180"
                  y="140"
                  textAnchor="middle"
                  fontSize="24"
                  fill="rgba(255,255,255,0.88)"
                  fontWeight="800"
                  style={{ letterSpacing: '0.16em', fontFamily: font }}
                >
                  {playerName || 'PLAYER NAME'}
                </text>
                <text
                  x="180"
                  y="290"
                  textAnchor="middle"
                  fontSize="96"
                  fill="rgba(255,255,255,0.96)"
                  fontWeight="900"
                  style={{ fontFamily: font }}
                >
                  {number || '00'}
                </text>
                <rect x="150" y="365" width="60" height="24" rx="10" fill="rgba(255,255,255,0.18)" />
                <text x="180" y="382" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="700">{patch}</text>
              </>
            )}
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