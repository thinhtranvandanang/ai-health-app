
import { GoogleGenAI, Type } from "@google/genai";
import { HealthLog, AIInsight } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getHealthInsights = async (logs: HealthLog[]): Promise<AIInsight[]> => {
  if (logs.length === 0) return [];

  const recentLogs = logs.slice(-7); // Lấy 7 bản ghi gần nhất
  const prompt = `Dựa trên dữ liệu sức khỏe của một người cao tuổi dưới đây (7 ngày gần nhất), hãy phân tích xu hướng và đưa ra các lời khuyên y tế sớm. 
  Dữ liệu: ${JSON.stringify(recentLogs)}
  
  Hãy tập trung vào:
  1. Huyết áp & Tim mạch: Có cao liên tục không?
  2. Vận động: Có đủ bước chân không?
  3. Cân nặng: Thay đổi quá nhanh không?
  4. Giấc ngủ: Chất lượng thế nào?
  
  Lưu ý quan trọng: Phải luôn đi kèm lời nhắc đây chỉ là tham khảo từ AI và nên đi khám bác sĩ nếu có triệu chứng lạ.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, description: "Phân loại: cardio, activity, body, sleep, general" },
              title: { type: Type.STRING, description: "Tiêu đề ngắn gọn" },
              content: { type: Type.STRING, description: "Nội dung lời khuyên chi tiết bằng tiếng Việt" },
              severity: { type: Type.STRING, description: "Mức độ cảnh báo: low, medium, high" }
            },
            required: ["category", "title", "content", "severity"]
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("AI Insight Error:", error);
    return [{
      category: 'general',
      title: 'Lỗi kết nối AI',
      content: 'Không thể phân tích dữ liệu ngay lúc này. Vui lòng kiểm tra lại sau.',
      severity: 'low'
    }];
  }
};
