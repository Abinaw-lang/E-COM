import React from 'react';
import { Download, FileText, ImageIcon } from 'lucide-react';

const DownloadButton = ({ onDownloadPNG, onDownloadPDF }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={onDownloadPNG}
        className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-3 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/25"
      >
        <ImageIcon size={18} />
        Download PNG
      </button>
      <button
        type="button"
        onClick={onDownloadPDF}
        className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
      >
        <FileText size={18} />
        Download PDF
      </button>
    </div>
  );
};

export default DownloadButton;
