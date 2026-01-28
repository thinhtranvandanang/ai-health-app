
export interface HealthLog {
  id: string;
  timestamp: number;
  // Tim mạch
  systolic: number;
  diastolic: number;
  heartRate: number;
  // Vận động
  steps: number;
  activeMinutes: number;
  sedentaryMinutes: number;
  // Chỉ số cơ thể
  weight: number;
  height: number;
  bmi: number;
  // Giấc ngủ
  sleepDuration: number;
  sleepQuality: number; // 1-10
  wakeUps: number;
  // Chi phí (Số tiền)
  expenseAmount: number;
  expenseNote: string;
}

export interface AIInsight {
  category: 'cardio' | 'activity' | 'body' | 'sleep' | 'general';
  title: string;
  content: string;
  severity: 'low' | 'medium' | 'high';
}

export type TabType = 'dashboard' | 'input' | 'insights' | 'history';
