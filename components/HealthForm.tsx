
import React, { useState } from 'react';
import { HealthLog } from '../types';
import { 
  Heart, 
  Activity, 
  Scale, 
  Moon, 
  Save, 
  DollarSign, 
  Info,
  ChevronRight
} from 'lucide-react';

interface Props {
  onAdd: (log: HealthLog) => void;
}

const HealthForm: React.FC<Props> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    systolic: 120,
    diastolic: 80,
    heartRate: 70,
    steps: 5000,
    activeMinutes: 30,
    sedentaryMinutes: 480,
    weight: 60,
    height: 165,
    sleepDuration: 7,
    sleepQuality: 7,
    wakeUps: 1,
    expenseAmount: 0,
    expenseNote: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bmi = formData.weight / ((formData.height / 100) * (formData.height / 100));
    const newLog: HealthLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...formData,
      bmi
    };
    onAdd(newLog);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const steps = [
    { id: 1, name: 'Tim mạch', icon: <Heart size={18} /> },
    { id: 2, name: 'Vận động', icon: <Activity size={18} /> },
    { id: 3, name: 'Cơ thể', icon: <Scale size={18} /> },
    { id: 4, name: 'Giấc ngủ', icon: <Moon size={18} /> },
    { id: 5, name: 'Chi phí', icon: <DollarSign size={18} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Nhập chỉ số hàng ngày</h2>
        <p className="text-slate-500">Ông bà hãy điền các thông tin đo được vào đây nhé.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-8 relative px-4">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -z-10"></div>
        {steps.map(s => (
          <button 
            key={s.id}
            onClick={() => setCurrentStep(s.id)}
            className={`flex flex-col items-center gap-1 z-10 ${currentStep === s.id ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              currentStep === s.id ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-lg' : 'bg-white border-slate-200'
            }`}>
              {s.icon}
            </div>
            <span className="text-[10px] font-bold uppercase">{s.name}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
              <Heart className="text-red-500" /> Chỉ số Tim mạch
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Tâm thu (mmHg)" name="systolic" value={formData.systolic} onChange={handleChange} min={50} max={250} />
              <InputField label="Tâm trương (mmHg)" name="diastolic" value={formData.diastolic} onChange={handleChange} min={30} max={150} />
            </div>
            <InputField label="Nhịp tim (bpm)" name="heartRate" value={formData.heartRate} onChange={handleChange} min={40} max={200} />
            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-700 text-sm">
              <Info className="shrink-0" size={18} />
              <p>Huyết áp bình thường thường dưới 140/90 mmHg. Nếu cao hơn ông bà hãy nghỉ ngơi và đo lại nhé.</p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
             <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
              <Activity className="text-green-500" /> Hoạt động Thể chất
            </h3>
            <InputField label="Số bước chân" name="steps" value={formData.steps} onChange={handleChange} min={0} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Vận động (Phút)" name="activeMinutes" value={formData.activeMinutes} onChange={handleChange} min={0} />
              <InputField label="Ngồi lâu (Phút)" name="sedentaryMinutes" value={formData.sedentaryMinutes} onChange={handleChange} min={0} />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
             <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
              <Scale className="text-blue-500" /> Chỉ số Cơ thể
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Cân nặng (kg)" name="weight" value={formData.weight} onChange={handleChange} min={20} />
              <InputField label="Chiều cao (cm)" name="height" value={formData.height} onChange={handleChange} min={50} />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
             <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
              <Moon className="text-purple-500" /> Giấc ngủ
            </h3>
            <InputField label="Thời gian ngủ (Giờ)" name="sleepDuration" value={formData.sleepDuration} onChange={handleChange} min={0} max={24} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Chất lượng (1-10)" name="sleepQuality" value={formData.sleepQuality} onChange={handleChange} min={1} max={10} />
              <InputField label="Số lần thức giấc" name="wakeUps" value={formData.wakeUps} onChange={handleChange} min={0} />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
             <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
              <DollarSign className="text-yellow-600" /> Chi phí Y tế (Số tiền)
            </h3>
            <InputField label="Số tiền (VNĐ)" name="expenseAmount" value={formData.expenseAmount} onChange={handleChange} min={0} type="number" />
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 block">Ghi chú chi phí</label>
              <input 
                name="expenseNote"
                value={formData.expenseNote}
                onChange={handleChange}
                placeholder="Mua thuốc, đi khám, sữa dinh dưỡng..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
          </div>
        )}

        <div className="mt-10 flex gap-4">
          {currentStep > 1 && (
            <button 
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
            >
              Quay lại
            </button>
          )}
          {currentStep < 5 ? (
            <button 
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex-1 py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              Tiếp tục <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              type="submit"
              className="flex-1 py-4 px-6 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-200"
            >
              <Save size={20} /> Lưu tất cả
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const InputField: React.FC<{ 
  label: string, 
  name: string, 
  value: any, 
  onChange: any, 
  min?: number, 
  max?: number,
  type?: string
}> = ({ label, name, value, onChange, min, max, type = "number" }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-500 block">{label}</label>
    <input 
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-bold text-slate-800"
    />
  </div>
);

export default HealthForm;
