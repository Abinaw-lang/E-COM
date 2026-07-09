import React from 'react';

const QuantitySelector = ({ quantity, onChange }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
      <div className="mb-4 text-xs uppercase tracking-[0.28em] text-slate-400">Quantity</div>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, quantity - 1))}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl font-bold text-white transition hover:bg-white/10"
        >
          -
        </button>
        <div className="min-w-[3rem] text-center text-xl font-semibold text-white">{quantity}</div>
        <button
          type="button"
          onClick={() => onChange(quantity + 1)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl font-bold text-white transition hover:bg-white/10"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
