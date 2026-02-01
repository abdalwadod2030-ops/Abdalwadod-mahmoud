
import React from 'react';
import { Specialist } from '../types';

interface SpecialistAssignModalProps {
  specialists: Specialist[];
  onSelect: (specialistId: string) => void;
  onClose: () => void;
}

const SpecialistAssignModal: React.FC<SpecialistAssignModalProps> = ({ specialists, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">اختر أخصائي</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-3 custom-scrollbar">
          {specialists.map(s => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-right group"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-500">{s.specialty}</p>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">المهام الحالية</span>
                <span className={`text-sm font-bold ${s.activeTasks > 3 ? 'text-red-500' : 'text-emerald-500'}`}>{s.activeTasks}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialistAssignModal;
