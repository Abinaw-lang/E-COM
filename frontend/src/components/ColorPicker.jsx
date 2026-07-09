import React from 'react';

const ColorPicker = ({ label, color, onChange }) => {
  return (
    <label className="block text-sm text-slate-200">
      <span className="mb-2 inline-block text-xs uppercase tracking-[0.24em] text-slate-400">{label}</span>
      <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-3 py-3">
        <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="h-12 w-12 cursor-pointer rounded-full border border-white/10 p-0" />
        <span className="text-sm text-white/80">{color.toUpperCase()}</span>
      </div>
    </label>
  );
};

export default ColorPicker;
