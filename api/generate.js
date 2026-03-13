import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    // 1. 檢查是否漏填了 API Key
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Vercel 保險箱裡找不到 GEMINI_API_KEY！請檢查環境變量設置。");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. 接收前端傳來的資料
    const { name, gender, birthday, birthplace } = req.body;

    // 3. AI 提示詞
    const prompt = `你是一位精通《子平真詮》與《窮通寶鑒》的頂級命理大師。
    客戶資料：
    姓名：${name}，性別：${gender}
    出生時間：${birthday}
    出生地點：${birthplace}
    
    【核心要求】：
    1. 根據出生地點與平太陽時差，校準真太陽時。
    2. 根據真太陽時排盤，分析格局用神與 2026 丙午流年運勢。
    3. 輸出純 HTML 片段（不要 html 或 body 標籤），背景透明，文字使用金色(#C9A84C)、白色和紅色。`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    // 4. 成功回傳結果
    res.status(200).send(text);
    
  } catch (error) {
    // 🚨 終極排錯機制：把真正的死因直接印在你的黑金網頁上！
    console.error("後台嚴重錯誤:", error);
    res.status(500).send(`
      <div style="color: #ff573d; border: 1px solid #ff573d; padding: 20px; background: rgba(50,0,0,0.8); border-radius: 8px; margin-top: 20px; text-align: left;">
        <h3 style="margin-bottom: 10px; font-family: 'Noto Serif TC', serif;">⚠️ 星象觀測中斷 (系統日誌)</h3>
        <p style="font-family: monospace; font-size: 1rem; line-height: 1.5;">錯誤詳情：${error.message}</p>
        <p style="font-size: 0.8rem; margin-top: 15px; opacity: 0.7;">👉 請將這個紅色框框截圖發給你的 AI 助手</p>
      </div>
    `);
  }
}
