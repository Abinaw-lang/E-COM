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

const bodyPaths = {
  'Half Sleeve':
    'M120,70 C120,50 150,35 180,35 C210,35 240,50 240,70 L292,96 C302,112 296,142 276,158 L250,142 L250,480 C250,497 232,507 180,507 C128,507 110,497 110,480 L110,142 L84,158 C64,142 58,112 68,96 Z',
  'Full Sleeve':
    'M120,70 C120,50 150,35 180,35 C210,35 240,50 240,70 L300,110 L300,255 L250,240 L250,480 C250,497 232,507 180,507 C128,507 110,497 110,480 L110,240 L60,255 L60,110 Z',
  Sleeveless:
    'M132,70 C132,50 155,35 180,35 C205,35 228,50 228,70 L246,100 L246,480 C246,497 230,507 180,507 C130,507 114,497 114,480 L114,100 Z'
};

const cuffPaths = {
  'Half Sleeve': {
    left: 'M68,96 L84,158 L60,148 L52,110 Z',
    right: 'M292,96 L276,158 L300,148 L308,110 Z'
  },
  'Full Sleeve': {
    left: 'M60,235 L110,235 L110,255 L60,255 Z',
    right: 'M300,235 L250,235 L250,255 L300,255 Z'
  },
  Sleeveless: null
};

const sidePanel = {
  left: 'M118,110 C102,220 102,370 118,480',
  right: 'M242,110 C258,220 258,370 242,480'
};

const collarPaths = {
  'Round Neck': { d: 'M150,45 Q180,68 210,45', width: 10 },
  'Crew Neck': { d: 'M148,42 Q180,60 212,42', width: 14 },
  'V Neck': { d: 'M150,45 L180,95 L210,45', width: 9 },
  Polo: { d: 'M150,45 Q180,62 210,45', width: 9, placket: true }
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
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <radialGradient id="stageLight" cx="50%" cy="38%" r="65%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <filter id="garmentShadow" x="-30%" y="-20%" width="160%" height="150%">
                <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.5" />
              </filter>
              {patternElement}
            </defs>

            {/* Studio backdrop so any garment color reads clearly against the dark panel */}
            <ellipse cx="180" cy="260" rx="175" ry="235" fill="url(#stageLight)" />
            <ellipse cx="180" cy="500" rx="150" ry="14" fill="rgba(0,0,0,0.4)" />

            <g filter="url(#garmentShadow)">
              {/* Body + integrated sleeves, always outlined so it separates from the backdrop */}
              <path d={body} fill={colors.primary} stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" />
              <path d={body} fill={pattern !== 'Plain' ? `url(#${fillId})` : 'none'} opacity={pattern === 'Plain' ? 0 : 0.35} />
              <path d={body} fill="url(#teeLight)" opacity="0.5" />

              {/* Curved side panels, like princess seams on a real jersey */}
              <path d={sidePanel.left} fill="none" stroke={colors.secondary} strokeWidth="10" strokeLinecap="round" opacity="0.85" />
              <path d={sidePanel.right} fill="none" stroke={colors.secondary} strokeWidth="10" strokeLinecap="round" opacity="0.85" />

              {/* Sleeve cuffs, color-blocked with the sleeve color */}
              {cuffs && (
                <>
                  <path d={cuffs.left} fill={colors.sleeve} stroke="rgba(255,255,255,0.3)" strokeWidth="1" opacity="0.95" />
                  <path d={cuffs.right} fill={colors.sleeve} stroke="rgba(255,255,255,0.3)" strokeWidth="1" opacity="0.95" />
                </>
              )}

              {/* Collar ribbing */}
              <path d={collar.d} fill="none" stroke={colors.collar} strokeWidth={collar.width} strokeLinecap="round" />
              {collar.placket && (
                <>
                  <rect x="172" y="50" width="16" height="46" rx="4" fill={colors.collar} opacity="0.9" />
                  <circle cx="180" cy="64" r="2.2" fill="#1f2937" />
                  <circle cx="180" cy="80" r="2.2" fill="#1f2937" />
                </>
              )}

              <path d="M98,462 L262,462" stroke="rgba(0,0,0,0.18)" strokeWidth="6" strokeLinecap="round" />
            </g>

            {showFront ? (
              <>
                <circle cx="130" cy="150" r="20" fill="rgba(255,255,255,0.92)" />
                <text x="130" y="156" textAnchor="middle" fontSize="13" fill="#111" fontWeight="700">CLUB</text>
                <rect x="150" y="160" width="90" height="24" rx="9" fill="rgba(0,0,0,0.35)" />
                <text x="195" y="177" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">{sponsor.substring(0, 14)}</text>
                <text
                  x="180" y="300" textAnchor="middle" fontSize="88" fontWeight="900"
                  fill="rgba(255,255,255,0.96)" stroke="rgba(0,0,0,0.25)" strokeWidth="1"
                  style={{ fontFamily: font }}
                >
                  {number || '00'}
                </text>
                <text x="180" y="400" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="13">
                  {patch}
                </text>
              </>
            ) : (
              <>
                <path id="nameArc" d="M75,135 Q180,72 285,135" fill="none" />
                <text
                  fontSize="26" fontWeight="800" fill="rgba(255,255,255,0.92)"
                  stroke="rgba(0,0,0,0.25)" strokeWidth="0.5"
                  style={{ letterSpacing: '0.12em', fontFamily: font }}
                >
                  <textPath href="#nameArc" startOffset="50%" textAnchor="middle">
                    {playerName || 'PLAYER NAME'}
                  </textPath>
                </text>
                <text
                  x="180" y="290" textAnchor="middle" fontSize="96" fontWeight="900"
                  fill="rgba(255,255,255,0.97)" stroke="rgba(0,0,0,0.25)" strokeWidth="1"
                  style={{ fontFamily: font }}
                >
                  {number || '00'}
                </text>
                <rect x="150" y="365" width="60" height="24" rx="10" fill="rgba(255,255,255,0.22)" />
                <text x="180" y="382" textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize="11" fontWeight="700">{patch}</text>
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