import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    // 接收新增的 birthplace 參數
    const { name, gender, birthday, birthplace } = req.body;
    
    // 升級版 SOP 提示詞（強制要求換算真太陽時）
    const prompt = `你是一位精通《子平真詮》與《窮通寶鑒》的頂級命理大師。
    現在有一位客戶資料如下：
    姓名：${name}，性別：${gender}
    出生時間（鐘錶時間）：${birthday}
    出生地點：${birthplace}
    
    【核心排盤要求 - 必須執行】：
    請首先根據客戶的「出生地點」查詢當地的經度，並結合平太陽時差，將上述鐘錶時間精準換算為當地的【真太陽時】。
    
    然後，請根據換算後的【真太陽時】進行八字排盤，並嚴格按照以下 SOP 進行深度解讀：
    1. 真太陽時校準說明（簡短說明換算結果與時辰定盤）
    2. 格局鑑定（身強弱、用神）
    3. 十神心理原型
    4. 2026 丙午流年專項解析
    5. 稱骨訣與結語
    
    輸出格式：請直接輸出 HTML 片段（不要包含 <html> 或 <body> 標籤，直接從 <div> 或 <section> 開始），背景保持透明，文字顏色符合高級玄學設定（金色、白色、紅色）。`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).send(response.text());
  } catch (error) {
    res.status(500).send("<p style='color:red;'>星象觀測中斷，請稍後再試。</p>");
  }
}