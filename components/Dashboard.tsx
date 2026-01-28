
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { HealthLog } from '../types';
import { 
  Heart, 
  Activity, 
  Scale, 
  Moon, 
  AlertCircle,
  TrendingUp,
  Wallet
} from 'lucide-react';

interface Props {
  logs: HealthLog[];
}

const Dashboard: React.FC<Props> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-blue-50 p-6 rounded-full mb-4">
          <Heart className="text-blue-500 w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Chào mừng ông/bà đến với Sống Khỏe</h2>
        <p className="text-slate-500 max-w-md">Hãy bắt đầu bằng việc nhập các chỉ số sức khỏe của ngày hôm nay để AI có thể phân tích và theo dõi giúp ông/bà.</p>
      </div>
    );
  }

  const latestLog = logs[logs.length - 1];
  const chartData = logs.slice(-10).map(log => ({
    time: new Date(log.timestamp).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    systolic: log.systolic,
    diastolic: log.diastolic,
    heartRate: log.heartRate,
    steps: log.steps,
    weight: log.weight,
    expense: log.expenseAmount
  }));

  // Data for Pie Chart (Activity ratio)
  const pieData = [
    { name: 'Vận động (Phút)', value: latestLog.activeMinutes, color: '#10b981' },
    { name: 'Ngồi/Nằm (Phút)', value: latestLog.sedentaryMinutes, color: '#94a3b8' }
  ];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bảng tin Sức khỏe</h2>
          <p className="text-slate-500 italic">Cập nhật lúc: {new Date(latestLog.timestamp).toLocaleString('vi-VN')}</p>
        </div>
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <TrendingUp size={16} />
          Ổn định
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Huyết áp" 
          value={`${latestLog.systolic}/${latestLog.diastolic}`} 
          unit="mmHg" 
          icon={<Heart className="text-red-500" />} 
          status={latestLog.systolic > 140 ? 'Cảnh báo' : 'Bình thường'}
          color={latestLog.systolic > 140 ? 'red' : 'blue'}
        />
        <StatCard 
          title="Nhịp tim" 
          value={latestLog.heartRate} 
          unit="bpm" 
          icon={<Activity className="text-orange-500" />} 
          status="Nhịp nghỉ"
          color="orange"
        />
        <StatCard 
          title="Cân nặng & BMI" 
          value={latestLog.weight} 
          unit={`kg (BMI: ${latestLog.bmi.toFixed(1)})`} 
          icon={<Scale className="text-blue-500" />} 
          status={latestLog.bmi > 25 ? 'Thừa cân' : 'Cân đối'}
          color="indigo"
        />
        <StatCard 
          title="Giấc ngủ" 
          value={latestLog.sleepDuration} 
          unit="giờ" 
          icon={<Moon className="text-purple-500" />} 
          status={`Chất lượng: ${latestLog.sleepQuality}/10`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Cardio Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <TrendingUp className="text-blue-500" /> Xu hướng Huyết áp & Nhịp tim
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Tâm thu" />
                <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Tâm trương" />
                <Line type="monotone" dataKey="heartRate" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" name="Nhịp tim" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Activity Ratio */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="text-green-500" /> Tỷ lệ Hoạt động
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">Mục tiêu: 30 phút vận động nhẹ mỗi ngày</p>
          </div>
        </div>

        {/* Bar Chart: Expenses */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Wallet className="text-yellow-600" /> Thống kê Chi phí Y tế (Số tiền)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  formatter={(value: any) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="expense" fill="#eab308" radius={[6, 6, 0, 0]} name="Chi phí" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  status: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon, status, color }) => {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-xl bg-slate-50`}>
          {icon}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorMap[color] || colorMap.blue}`}>
          {status}
        </span>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          <span className="text-sm text-slate-400">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
