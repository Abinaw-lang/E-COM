import React from 'react';

const ToggleView = ({ view, onChange }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-3 flex items-center justify-between gap-2">
      {['front', 'back'].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${view === item ? 'bg-blue-500/20 text-white' : 'bg-transparent text-slate-300 hover:bg-white/10'}`}
        >
          {item === 'front' ? 'Front View' : 'Back View'}
        </button>
      ))}
    </div>
  );
};

export default ToggleView;
