import React from 'react';

const patterns = ['Plain', 'Stripes', 'Gradient', 'Camouflage', 'Geometric', 'Classic'];

const PatternSelector = ({ value, onChange }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
      <div className="mb-4 text-xs uppercase tracking-[0.28em] text-slate-400">Pattern</div>
      <div className="grid grid-cols-2 gap-3">
        {patterns.map((pattern) => (
          <button
            key={pattern}
            type="button"
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${value === pattern ? 'border-blue-400 bg-blue-500/15 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-blue-300 hover:bg-white/10'}`}
            onClick={() => onChange(pattern)}
          >
            {pattern}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PatternSelector;