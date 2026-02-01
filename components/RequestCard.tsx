
import React from 'react';
import { Request, STATUS_LABELS, Specialist, RequestStatus } from '../types';

interface RequestCardProps {
  request: Request;
  specialist?: Specialist;
  onAssign: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: RequestStatus) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, specialist, onAssign, onUpdateStatus }) => {
  const statusInfo = STATUS_LABELS[request.status];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 flex flex-col gap-3 group">
      <div className="flex justify-between items-start">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${statusInfo.bg} ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          request.priority === 'high' ? 'bg-red-100 text-red-700' : 
          request.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {request.priority === 'high' ? 'عاجل' : request.priority === 'medium' ? 'متوسط' : 'عادي'}
        </span>
      </div>

      <div>
        <h4 className="font-bold text-slate-800 text-base">{request.customerName}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{request.sampleType}</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span className="truncate">{request.address}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <span>{request.phone}</span>
        </div>
      </div>

      {request.status === RequestStatus.PENDING || request.status === RequestStatus.REJECTED ? (
        <button 
          onClick={() => onAssign(request.id)}
          className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
        >
          {request.status === RequestStatus.REJECTED ? 'إعادة تعيين أخصائي' : 'تعيين أخصائي'}
        </button>
      ) : (
        <div className="mt-2 pt-3 border-t border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600">
            {specialist?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase">الأخصائي</p>
            <p className="text-xs font-bold text-slate-700 truncate">{specialist?.name || 'غير معروف'}</p>
          </div>
          {/* Simulated Specialist Action (for demo) */}
          {request.status === RequestStatus.ASSIGNED && (
             <div className="flex gap-1">
                <button onClick={() => onUpdateStatus(request.id, RequestStatus.ACCEPTED)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="قبول"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg></button>
                <button onClick={() => onUpdateStatus(request.id, RequestStatus.REJECTED)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="رفض"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
             </div>
          )}
        </div>
      )}

      {request.status === RequestStatus.ACCEPTED && (
        <button 
          onClick={() => onUpdateStatus(request.id, RequestStatus.CONTACTED)}
          className="w-full mt-2 py-2 border border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg hover:bg-amber-100 transition-colors"
        >
          تم التواصل مع العميل؟
        </button>
      )}

      {request.status === RequestStatus.CONTACTED && (
        <button 
          onClick={() => onUpdateStatus(request.id, RequestStatus.SCHEDULED)}
          className="w-full mt-2 py-2 border border-teal-200 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-lg hover:bg-teal-100 transition-colors"
        >
          تحديد موعد السحب
        </button>
      )}

      {request.status === RequestStatus.SCHEDULED && (
        <button 
          onClick={() => onUpdateStatus(request.id, RequestStatus.COLLECTED)}
          className="w-full mt-2 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg hover:bg-emerald-100 transition-colors"
        >
          تم السحب بنجاح
        </button>
      )}
    </div>
  );
};

export default RequestCard;
