import React from 'react';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const SizeSelector = ({ value, onChange }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
      <div className="mb-4 text-xs uppercase tracking-[0.28em] text-slate-400">Choose size</div>
      <div className="grid grid-cols-3 gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${value === size ? 'border-blue-400 bg-blue-500/15 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-blue-300 hover:bg-white/10'}`}
            onClick={() => onChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
