import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("缺少 API KEY");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 改用最通用的 gemini-pro，避免 1.5 系列可能引起的 SDK 版本衝突
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { name, gender, birthday, birthplace } = req.body;
    const prompt = `你是一位命理大師。請為姓名：${name}，性別：${gender}，生日：${birthday} 的用戶提供一份深度的 2026 年運勢簡評。使用 HTML 片段，文字金色(#C9A84C)。`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).send(text);
  } catch (error) {
    res.status(500).send(`<div style="color:#C9A84C; padding:20px; border:1px solid #C9A84C;">
      觀測能量場異常：${error.message} <br>
      <small>請檢查 Vercel 設置或更換 API Key 嘗試。</small>
    </div>`);
  }
}
