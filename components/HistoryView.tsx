
import React from 'react';
import { HealthLog } from '../types';
import { Trash2, Heart, Activity, Scale, Moon, Wallet } from 'lucide-react';

interface Props {
  logs: HealthLog[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<Props> = ({ logs, onDelete }) => {
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  if (logs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Chưa có lịch sử đo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Lịch sử đo lường</h2>
      
      <div className="space-y-4">
        {sortedLogs.map(log => (
          <div key={log.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-sm font-bold text-blue-600 block mb-1">
                  {new Date(log.timestamp).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="text-xs text-slate-400">
                  Thời gian ghi nhận: {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                </span>
              </div>
              <button 
                onClick={() => onDelete(log.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <HistoryItem icon={<Heart className="text-red-500" />} label="Huyết áp" value={`${log.systolic}/${log.diastolic}`} unit="mmHg" />
              <HistoryItem icon={<Activity className="text-green-500" />} label="Vận động" value={log.steps} unit="bước" />
              <HistoryItem icon={<Scale className="text-blue-500" />} label="Cân nặng" value={log.weight} unit="kg" />
              <HistoryItem icon={<Moon className="text-purple-500" />} label="Giấc ngủ" value={log.sleepDuration} unit="giờ" />
              <HistoryItem 
                icon={<Wallet className="text-yellow-600" />} 
                label="Chi phí" 
                value={new Intl.NumberFormat('vi-VN').format(log.expenseAmount)} 
                unit="đ" 
              />
            </div>

            {log.expenseNote && (
              <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-500 italic">
                Ghi chú: {log.expenseNote}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const HistoryItem: React.FC<{ icon: React.ReactNode, label: string, value: string | number, unit: string }> = ({ icon, label, value, unit }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-slate-50 rounded-xl shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value} <span className="text-[10px] font-normal">{unit}</span></p>
    </div>
  </div>
);

export default HistoryView;
