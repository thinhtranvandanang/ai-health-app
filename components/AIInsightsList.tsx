
import React, { useState, useEffect } from 'react';
import { HealthLog, AIInsight } from '../types';
import { getHealthInsights } from '../geminiService';
import { Sparkles, Brain, AlertTriangle, CheckCircle, RefreshCw, Info } from 'lucide-react';

interface Props {
  logs: HealthLog[];
}

const AIInsightsList: React.FC<Props> = ({ logs }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (logs.length === 0) return;
    setLoading(true);
    try {
      const result = await getHealthInsights(logs);
      setInsights(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (logs.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Brain className="mx-auto text-blue-200 mb-4" size={64} />
        <h3 className="text-xl font-bold text-slate-800">Chưa có dữ liệu để phân tích</h3>
        <p className="text-slate-500">Ông bà vui lòng nhập thông tin sức khỏe để AI đưa ra lời khuyên nhé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-blue-500 fill-current" /> Trí tuệ nhân tạo Tư vấn
          </h2>
          <p className="text-slate-500">Phân tích dựa trên dữ liệu cá nhân của ông/bà.</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 disabled:opacity-50 transition-all shadow-sm"
        >
          <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={20} />
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex gap-3 text-yellow-800 text-sm">
        <Info className="shrink-0 mt-0.5" size={18} />
        <p><strong>Lưu ý quan trọng:</strong> Những lời khuyên này được tạo ra bởi AI nhằm mục đích tham khảo và giúp ông bà theo dõi xu hướng. <strong>Hãy luôn tham khảo ý kiến bác sĩ chuyên khoa</strong> trước khi thay đổi chế độ dinh dưỡng hoặc tập luyện.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl h-32 animate-pulse border border-slate-100 shadow-sm"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.length > 0 ? (
            insights.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} />
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-slate-400">
              Nhấn nút làm mới để nhận tư vấn mới nhất từ Gemini.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  const severityStyles = {
    low: 'bg-green-50 border-green-100 text-green-700',
    medium: 'bg-orange-50 border-orange-100 text-orange-700',
    high: 'bg-red-50 border-red-100 text-red-700'
  };

  const icons = {
    low: <CheckCircle size={20} />,
    medium: <AlertTriangle size={20} />,
    high: <AlertTriangle className="animate-bounce" size={20} />
  };

  return (
    <div className={`p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md ${severityStyles[insight.severity]}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg leading-tight">{insight.title}</h3>
        <span className="p-2 rounded-xl bg-white/50">{icons[insight.severity]}</span>
      </div>
      <p className="text-slate-700 font-medium leading-relaxed mb-4">{insight.content}</p>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">
        Phân loại: {insight.category}
      </div>
    </div>
  );
};

export default AIInsightsList;
