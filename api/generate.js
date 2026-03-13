import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("API_KEY_MISSING");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { name, gender, birthday, birthplace } = req.body;

        const prompt = `
你是一位精通《子平真詮》且具備極高審美的前端命理大師。請為 [${name}] 生成一份深度命理觀測報告。

【量產排版標準：必須嚴格遵守以下 HTML 結構】

1. **HERO 區塊**：
   - 使用 <div class="hero"> 封裝。
   - 包含 <div class="hero-emblem"> (填入日主天干文字)。
   - 包含 <div class="hero-subtitle"> (顯示完整八字與解析標題)。
   - 包含 <div class="four-pillars"> 結構，內含四個 <div class="pillar"> (分別為年、月、日、時柱，標註天干、地支、十神)。
   - 包含 <div class="hero-desc"> (顯示納音、地勢、骨重、起運時間)。

2. **標準章節 (壹至捌)**：
   每一章必須嚴格使用以下格式：
   <section class="section">
     <div class="section-header">
       <div class="section-num">【繁體序號】</div>
       <div>
         <div class="section-title">【中文標題】</div>
         <div class="section-subtitle">【英文副標】</div>
       </div>
     </div>
     <div class="card">...內容...</div>
   </section>

   章節清單與英文副標：
   - 壹：格局鑑定 (FORMAT · STRENGTH · YONGSHENG)
   - 貳：十神心理原型 (ARCHETYPE · PSYCHOLOGY · PERSONALITY)
   - 叁：宮位生活映射 (PILLARS · LIFE STAGES · ENVIRONMENT)
   - 肆：天干地支互動 (STEMS · BRANCHES · INTERACTION)
   - 伍：大運流年交叉分析 (LUCK PILLARS · ANNUAL STARS · CURRENT)
   - 陸：神煞解讀 (DIVINE STARS · AUSPICIOUS · INAUSPICIOUS)
   - 柒：稱骨訣 (BONE WEIGHT · INNATE CAPACITY)
   - 捌：機會與地雷 (NOW · OPPORTUNITY · WARNING)

3. **視覺細節**：
   - 關鍵術語用 <strong style="color:#7AB860"> 加亮。
   - 每段專業分析後必須有 <div class="analogy">白話翻譯</div>。
   - 使用 <div class="highlight-gold"> 或 <div class="highlight-warn"> 標記重點。
   - 使用 <table class="interaction-table"> 展示刑沖合害。

4. **結尾 VERDICT**：
   - 必須包含 <div class="verdict"> 區塊，內含 <div class="verdict-main">、<div class="verdict-text"> 和 <div class="verdict-seal">。

【觀測對象資料】
姓名：${name}，性別：${gender}，生辰：${birthday}，出生地：${birthplace}。

請開始觀測，確保內容豐富、口吻專業神祕，字數不少於 2500 字，HTML 結構完整。`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // 移除 Markdown 代碼塊標籤
        text = text.replace(/(\` \` \`html|\` \` \`)/g, "").trim();

        res.status(200).send(text);

    } catch (error) {
        console.error("生成異常:", error);
        res.status(500).send(`<div class="card"><p style="color:#7AB860;">觀測中斷：${error.message}</p></div>`);
    }
}
