import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 2. 檢查 Vercel 設置裡的 API Key 是否存在
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Vercel 保險箱中找不到 GEMINI_API_KEY，請檢查 Environment Variables 設置。");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 3. 使用目前最穩定且免費的 1.5 Flash 模型
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. 接收前端傳來的用戶資料
    const { name, gender, birthday, birthplace } = req.body;

    // 5. 設定給 AI 的大師指令 (Prompt)
    const prompt = `你是一位精通東方命理與西洋占星的頂級大師。
    請為以下用戶進行 2026 丙午年運勢深度觀測：
    姓名：${name}
    性別：${gender}
    生辰：${birthday}
    出生地：${birthplace}

    要求：
    1. 輸出格式必須是純 HTML 片段（不要包含 <html> 或 <body> 標籤）。
    2. 風格：神祕、優雅、專業。
    3. 配色：文字主要使用金色 (#C9A84C) 與白色。
    4. 內容包含：五行能量解析、2026 關鍵運勢提醒、大師寄語。`;

    // 6. 執行 AI 生成
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 7. 將結果傳回給前端
    res.status(200).send(text);

  } catch (error) {
    console.error("後端報錯:", error);

    // 8. 報錯處理：如果失敗，直接把原因顯示在網頁的紅框裡
    let errorMessage = error.message;
    
    // 針對 404 錯誤的特別提醒（通常是工具包版本太舊）
    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      errorMessage = "Google 伺服器找不到模型。請確保你的 package.json 裡使用的是最新版 @google/generative-ai";
    }

    res.status(500).send(`
      <div style="color: #ff573d; border: 1px solid #ff573d; padding: 20px; background: rgba(0,0,0,0.8); border-radius: 8px; margin-top: 20px;">
        <h3 style="margin-top:0;">⚠️ 星象觀測失敗</h3>
        <p style="font-size: 0.9rem;">原因：${errorMessage}</p>
        <p style="font-size: 0.8rem; opacity: 0.7;">提示：請檢查 Vercel 裡的 API Key 設置或重新部署。</p>
      </div>
    `);
  }
}
