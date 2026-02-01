
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import RequestCard from './components/RequestCard';
import SpecialistAssignModal from './components/SpecialistAssignModal';
import AddRequestModal from './components/AddRequestModal';
import { Request, RequestStatus, Specialist, STATUS_LABELS } from './types';
import { getSmartWorkloadAnalysis } from './services/geminiService';

const INITIAL_SPECIALISTS: Specialist[] = [
  { id: 's1', name: 'د. سارة المنصور', phone: '0501234567', specialty: 'تحاليل مخبرية', activeTasks: 1 },
  { id: 's2', name: 'أ. محمد العتيبي', phone: '0507654321', specialty: 'تمريض سحب عينات', activeTasks: 2 },
  { id: 's3', name: 'د. هند القحطاني', phone: '0559876543', specialty: 'فني مختبر', activeTasks: 0 },
];

const INITIAL_REQUESTS: Request[] = [
  {
    id: 'req1',
    customerName: 'فهد الرشيدي',
    phone: '0550001112',
    address: 'الرياض - الياسمين - شارع الياقوت',
    sampleType: 'فحص دم شامل',
    priority: 'high',
    status: RequestStatus.PENDING,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'req2',
    customerName: 'نورة السليمان',
    phone: '0559998887',
    address: 'الرياض - الملقا - برج رافال',
    sampleType: 'مسحة كورونا',
    priority: 'medium',
    status: RequestStatus.ASSIGNED,
    specialistId: 's1',
    createdAt: Date.now() - 7200000,
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'board' | 'specialists' | 'reports'>('board');
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
  const [specialists, setSpecialists] = useState<Specialist[]>(INITIAL_SPECIALISTS);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>('جاري تحليل ضغط العمل...');

  useEffect(() => {
    const fetchAnalysis = async () => {
      const advice = await getSmartWorkloadAnalysis(requests, specialists);
      setAiAdvice(advice || 'لا يوجد تحليل متاح حالياً.');
    };
    fetchAnalysis();
  }, [requests, specialists]);

  const handleAddRequest = (data: Partial<Request>) => {
    const newReq: Request = {
      id: `req-${Date.now()}`,
      customerName: data.customerName || '',
      phone: data.phone || '',
      address: data.address || '',
      sampleType: data.sampleType || '',
      priority: data.priority || 'medium',
      status: RequestStatus.PENDING,
      createdAt: Date.now(),
    };
    setRequests([...requests, newReq]);
    setIsAddModalOpen(false);
  };

  const handleAssignSpecialist = (specialistId: string) => {
    if (!assigningRequestId) return;
    
    setRequests(prev => prev.map(req => 
      req.id === assigningRequestId 
        ? { ...req, status: RequestStatus.ASSIGNED, specialistId } 
        : req
    ));

    setSpecialists(prev => prev.map(s => 
      s.id === specialistId ? { ...s, activeTasks: s.activeTasks + 1 } : s
    ));

    setAssigningRequestId(null);
  };

  const handleUpdateStatus = (id: string, newStatus: RequestStatus) => {
    setRequests(prev => prev.map(req => {
      if (req.id === id) {
        // Handle task count if rejected or collected
        if (newStatus === RequestStatus.REJECTED || newStatus === RequestStatus.COLLECTED) {
           if (req.specialistId) {
              setSpecialists(sp => sp.map(s => s.id === req.specialistId ? { ...s, activeTasks: Math.max(0, s.activeTasks - 1)} : s));
           }
        }
        return { ...req, status: newStatus };
      }
      return req;
    }));
  };

  const columns = [
    { title: 'طلب جديد', status: RequestStatus.PENDING },
    { title: 'بانتظار القبول', status: RequestStatus.ASSIGNED },
    { title: 'تم القبول / التواصل', status: [RequestStatus.ACCEPTED, RequestStatus.CONTACTED] },
    { title: 'تم التحديد / السحب', status: [RequestStatus.SCHEDULED, RequestStatus.COLLECTED] },
    { title: 'مرفوض', status: RequestStatus.REJECTED },
  ];

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Header Area */}
      <header className="bg-white border-b border-slate-100 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">لوحة المتابعة الشاملة</h2>
          <p className="text-sm text-slate-500 font-medium">نظم وراقب سير العمليات اليومية بكفاءة عالية</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 max-w-sm">
            <span className="text-lg">💡</span>
            <p className="text-xs text-indigo-700 font-medium line-clamp-2">{aiAdvice}</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            إضافة طلب جديد
          </button>
        </div>
      </header>

      {/* Board View */}
      {activeTab === 'board' && (
        <div className="flex-1 overflow-x-auto p-4 md:p-6 bg-slate-50 flex gap-6 custom-scrollbar">
          {columns.map((col, idx) => {
            const filteredRequests = requests.filter(req => 
              Array.isArray(col.status) ? col.status.includes(req.status) : req.status === col.status
            );
            return (
              <div key={idx} className="flex-shrink-0 w-72 md:w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700">{col.title}</h3>
                    <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      {filteredRequests.length}
                    </span>
                  </div>
                  <div className="w-8 h-1 bg-indigo-200 rounded-full"></div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pb-10 custom-scrollbar pr-1">
                  {filteredRequests.map(req => (
                    <RequestCard 
                      key={req.id} 
                      request={req} 
                      specialist={specialists.find(s => s.id === req.specialistId)}
                      onAssign={setAssigningRequestId}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                  {filteredRequests.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl h-32 flex items-center justify-center">
                      <p className="text-xs text-slate-400 font-bold">لا توجد طلبات</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Specialists View */}
      {activeTab === 'specialists' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map(s => (
              <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-2xl border border-indigo-100">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{s.name}</h3>
                    <p className="text-sm text-slate-500">{s.specialty}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">المهام النشطة</p>
                    <p className="text-xl font-extrabold text-indigo-600">{s.activeTasks}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">الحالة</p>
                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      متاح للعمل
                    </p>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
                  عرض السجل الكامل
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports View */}
      {activeTab === 'reports' && (
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center text-center">
          <div className="max-w-md space-y-4">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📊</div>
             <h3 className="text-2xl font-bold text-slate-800">التقارير التحليلية</h3>
             <p className="text-slate-500">سيتم تفعيل هذه الشاشة قريباً لعرض إحصائيات الأداء الأسبوعي ونسب الإنجاز لكل أخصائي.</p>
             <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-3xl font-black text-indigo-600">{requests.filter(r => r.status === RequestStatus.COLLECTED).length}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase">إجمالي المسحوبات</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-3xl font-black text-red-600">{requests.filter(r => r.status === RequestStatus.REJECTED).length}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase">إجمالي المرفوضات</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <AddRequestModal onAdd={handleAddRequest} onClose={() => setIsAddModalOpen(false)} />
      )}
      {assigningRequestId && (
        <SpecialistAssignModal 
          specialists={specialists} 
          onSelect={handleAssignSpecialist} 
          onClose={() => setAssigningRequestId(null)} 
        />
      )}
    </Layout>
  );
};

export default App;
