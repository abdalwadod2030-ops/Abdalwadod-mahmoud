
export enum RequestStatus {
  PENDING = 'PENDING',        // طلب جديد غير معين
  ASSIGNED = 'ASSIGNED',      // تم التعيين - بانتظار قبول الأخصائي
  ACCEPTED = 'ACCEPTED',      // تم القبول - جاري التنفيذ
  REJECTED = 'REJECTED',      // مرفوض - يحتاج إعادة تعيين
  CONTACTED = 'CONTACTED',    // تم التواصل مع العميل
  SCHEDULED = 'SCHEDULED',    // تم تحديد الموعد
  COLLECTED = 'COLLECTED',    // تم السحب بنجاح
}

export interface Specialist {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  activeTasks: number;
}

export interface Request {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  sampleType: string;
  priority: 'low' | 'medium' | 'high';
  status: RequestStatus;
  specialistId?: string;
  createdAt: number;
  appointmentTime?: string;
  notes?: string;
  rejectionReason?: string;
}

export const STATUS_LABELS: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  [RequestStatus.PENDING]: { label: 'طلب جديد', color: 'text-gray-600', bg: 'bg-gray-100' },
  [RequestStatus.ASSIGNED]: { label: 'بانتظar القبول', color: 'text-blue-600', bg: 'bg-blue-50' },
  [RequestStatus.ACCEPTED]: { label: 'تم القبول', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  [RequestStatus.REJECTED]: { label: 'مرفوض', color: 'text-red-600', bg: 'bg-red-50' },
  [RequestStatus.CONTACTED]: { label: 'تم التواصل', color: 'text-amber-600', bg: 'bg-amber-50' },
  [RequestStatus.SCHEDULED]: { label: 'تم الموعد', color: 'text-teal-600', bg: 'bg-teal-50' },
  [RequestStatus.COLLECTED]: { label: 'تم السحب', color: 'text-emerald-600', bg: 'bg-emerald-50' },
};
