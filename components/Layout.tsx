
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'board' | 'specialists' | 'reports';
  setActiveTab: (tab: 'board' | 'specialists' | 'reports') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden h-screen">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-l border-slate-200 shadow-sm flex flex-col z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
            <span className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-sm">V</span>
            Vampires
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">إدارة سحب العينات</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('board')}
            className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'board' ? 'bg-red-50 text-red-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'board' ? 'bg-red-600' : 'bg-slate-300'}`}></div>
            لوحة التتبع (Kanban)
          </button>
          <button 
            onClick={() => setActiveTab('specialists')}
            className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'specialists' ? 'bg-red-50 text-red-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'specialists' ? 'bg-red-600' : 'bg-slate-300'}`}></div>
            الأخصائيين
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'reports' ? 'bg-red-50 text-red-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'reports' ? 'bg-red-600' : 'bg-slate-300'}`}></div>
            التقارير والإحصائيات
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 mb-1">المسؤول الحالي</p>
            <p className="text-sm font-semibold text-slate-800">أحمد المدير</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
