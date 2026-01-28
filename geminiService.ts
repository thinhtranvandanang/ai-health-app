import { GoogleGenAI, Type } from "@google/genai";
import { HealthLog, AIInsight } from "./types";

/**
 * Vite chỉ đọc được biến môi trường bắt đầu bằng VITE_
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

/**
 * Khởi tạo AI client an toàn
 * Không để app crash nếu thiếu key
 */
const ai = API_KEY
  ? new GoogleGenAI({ apiKey: API_KEY })
  : null;

export const getHealthInsights = async (
  logs: HealthLog[]
): Promise<AIInsight[]> => {
  if (!ai) {
    console.error("Missing VITE_GEMINI_API_KEY");
    return [{
      category: "general",
      title: "Chưa cấu hình AI",
      content: "Hệ thống AI chưa được cấu hình API key.",
      severity: "low",
    }];
  }

  if (logs.length === 0) return [];

  const recentLogs = logs.slice(-7);

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
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: "Phân loại: cardio, activity, body, sleep, general",
              },
              title: {
                type: Type.STRING,
                description: "Tiêu đề ngắn gọn",
              },
              content: {
                type: Type.STRING,
                description: "Nội dung lời khuyên chi tiết bằng tiếng Việt",
              },
              severity: {
                type: Type.STRING,
                description: "Mức độ cảnh báo: low, medium, high",
              },
            },
            required: ["category", "title", "content", "severity"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];

    return JSON.parse(text) as AIInsight[];
  } catch (error) {
    console.error("AI Insight Error:", error);
    return [{
      category: "general",
      title: "Lỗi AI",
      content: "Không thể phân tích dữ liệu lúc này. Đây chỉ là hệ thống hỗ trợ, vui lòng thử lại sau.",
      severity: "low",
    }];
  }
};
