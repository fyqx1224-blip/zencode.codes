module.exports = async function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if (req.method !== 'POST') {
        return res.status(405).send('<div>只接受 POST 請求</div>');
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("找不到 GEMINI_API_KEY");

        const { name, gender, birthday, birthplace } = req.body || {};
        if (!name) throw new Error("缺少觀測對象資料");
        
        const prompt = `
你是一位精通東西方命理的命理師，請依據《滴天髓》《淵海子平》《三命通會》《子平真詮》《神峰通考》《窮通寶鑒》做深度解讀且具備極高審美的前端命理大師。
【解讀框架·請逐項分析】
壹、格局鑑定
・正格（正官/正印/食神/財格）vs 特殊格局（從格/化氣格/雙清格）
・身強身弱判斷（月令是否得令、三方助扶、洩氣情況）
・調候用神 vs 扶抑用神（寒暖燥濕的生理/心理意義）

二、十神心理原型對照
・正官=自我規範與體制認同　七殺=突破本能與危機應變
・食神=享受生命出口　傷官=才華倒逼改革的內在壓力
・正財=穩定資源觀　偏財=機會財/人脈財/父緣
・正印=學習型安全感　梟神=叛逆型自我保護
・比劫=同儕競爭與自我主張

三、宮位生活映射（四柱橫向解析）
・年柱（0-15歲）：家族業力、原生環境、財務與性格模式遺傳
・月柱（16-30歲）：父母管教模式、社會化方式、職業志向形塑
・日柱（31-45歲）：伴侶關係、私密情感需求、最真實的自我
・時柱（46歲後）：晚年格局、子息緣份、潛意識深層驅動力
・宮位間刑沖合害的生活具象化

四、天干地支互動分析
・天干合化（甲己合土等）→ 何處能量被合絆？
・地支三合/三會/六合 → 哪個宮位得到強力援助？
・地支三刑（寅巳申等）→ 自我刑傷或人際衝突
・地支六衝 → 哪個宮位面臨動盪與變遷
・地支六害/六破 → 潛藏暗箭與長期磨損

五、大運流年交叉分析
・當前大運干支的五行意義與身份
・流年與本命盤的引動：伏吟（疊加）/反吟（對沖）/合化（結盟）
・2025乙巳年：乙木對日主的作用、巳火引動宮位
・2026丙午年：丙火格局意義、午火對大運與本命的影響，注意現在是2026年。

六、神煞解讀（選主要神煞）
・天乙貴人（最大外力援助）、文昌貴人（考試學習）
・驛馬（移動/變動/遷移）、桃花（人際魅力）
・羊刃（剛烈/危機/手術刀）、魁罡（孤傲/強勢/自我要求極高）

七、稱骨訣白話詮釋
・骨重值代表「先天能量濃度」
・轉譯：不是命定，是「出廠配備等級」，後天可升級軟體

【🔴 請用生活化語言翻譯（小學生能懂），結尾給出：當前最值得把握的機會＋最需警惕的地雷】

【參考書目 · 解讀時請交叉引用】
▍東方傳統命理經典
· 梁湘潤《子平基礎概要》《子平秘要》《女命總論》《實務論命》《八字講堂》
· 《滴天髓》《淵海子平》《三命通會》《子平真詮》《神峰通考》《窮通寶鑒》
▍現代心理對接
· 張盛舒造命系列｜十神對接大五人格/MBTI
· 了無居士《現代紫微》

請為 [${name}] 生成一份深度命理觀測報告。

【量產排版標準：必須嚴格遵守以下 HTML 結構】
1. **HERO 區塊**：使用 <div class="hero"> 封裝...
2. **標準章節 (壹至捌)**：每章使用 <section class="section"> 封裝...
3. **視覺細節**：術語用 <strong style="color:#7AB860"> 加亮， एनालॉजी使用 <div class="analogy">。
4. **結尾 VERDICT**：使用 <div class="verdict">。

【觀測對象資料】
姓名：${name}，性別：${gender}，生辰：${birthday}，出生地：${birthplace}。
請開始觀測，確保內容豐富、口吻專業神祕，HTML 結構完整。`;

      const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Google API 錯誤 ${response.status}: ${JSON.stringify(data)}`);
        }

        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        text = text.replace(/```html/g, '').replace(/```/g, '').trim();

        res.status(200).send(text);

    } catch (error) {
        res.status(500).send(`<div style="color:#7AB860;padding:20px">${error.message}</div>`);
    }
};
