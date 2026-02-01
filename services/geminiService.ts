
import { GoogleGenAI, Type } from "@google/genai";
import { Request, Specialist } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartWorkloadAnalysis = async (requests: Request[], specialists: Specialist[]) => {
  const summary = `
    Requests: ${requests.length}
    Pending: ${requests.filter(r => r.status === 'PENDING').length}
    Specialists: ${specialists.length}
    Distribution: ${specialists.map(s => `${s.name}: ${s.activeTasks}`).join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بناءً على البيانات التالية لطلبات سحب العينات، قدم نصيحة مختصرة (جملتين) باللغة العربية حول توزيع المهام أو التحسين: ${summary}`,
      config: {
        maxOutputTokens: 200,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "تعذر الحصول على تحليل ذكي حالياً.";
  }
};
