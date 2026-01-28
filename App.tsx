
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Heart, 
  User, 
  Moon, 
  PlusCircle, 
  LayoutDashboard, 
  Lightbulb, 
  History,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { HealthLog, TabType, AIInsight } from './types';
import Dashboard from './components/Dashboard';
import HealthForm from './components/HealthForm';
import AIInsightsList from './components/AIInsightsList';
import HistoryView from './components/HistoryView';

const App: React.FC = () => {
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('health_logs_v1');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Save data to localStorage when logs change
  useEffect(() => {
    localStorage.setItem('health_logs_v1', JSON.stringify(logs));
  }, [logs]);

  const handleAddLog = (newLog: HealthLog) => {
    setLogs(prev => [...prev, newLog]);
    setActiveTab('dashboard');
  };

  const handleDeleteLog = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const handleClearData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu?')) {
      setLogs([]);
      setInsights([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pl-64">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Heart className="fill-current" />
            Sống Khỏe
          </h1>
          <p className="text-xs text-slate-500 font-medium">TRỢ LÝ SỨC KHỎE CAO NIÊN</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Tổng quan" />
          <NavItem active={activeTab === 'input'} onClick={() => setActiveTab('input')} icon={<PlusCircle size={20} />} label="Nhập chỉ số" />
          <NavItem active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<Lightbulb size={20} />} label="AI Tư vấn" />
          <NavItem active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={20} />} label="Lịch sử" />
        </nav>
        <div className="p-4 border-t border-slate-100">
           <button 
            onClick={handleClearData}
            className="w-full py-2 px-4 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            Xóa toàn bộ dữ liệu
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {activeTab === 'dashboard' && <Dashboard logs={logs} />}
        {activeTab === 'input' && <HealthForm onAdd={handleAddLog} />}
        {activeTab === 'insights' && <AIInsightsList logs={logs} />}
        {activeTab === 'history' && <HistoryView logs={logs} onDelete={handleDeleteLog} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 shadow-lg">
        <MobileNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={24} />} />
        <MobileNavItem active={activeTab === 'input'} onClick={() => setActiveTab('input')} icon={<PlusCircle size={24} />} />
        <MobileNavItem active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} icon={<Lightbulb size={24} />} />
        <MobileNavItem active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<History size={24} />} />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
      active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex justify-center py-2 transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}
  >
    {icon}
  </button>
);

export default App;
