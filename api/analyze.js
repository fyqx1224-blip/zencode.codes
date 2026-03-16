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

        const prompt = `你是一位精通東西方命理的命理大師，請依據《滴天髓》《淵海子平》《三命通會》《子平真詮》《神峰通考》《窮通寶鑒》為以下對象進行深度八字解讀。

【絕對禁止】不得使用任何範例數據。所有字段必須根據以下觀測對象的實際生辰八字重新計算：
姓名：${name}，性別：${gender}，生辰：${birthday}，出生地：${birthplace}

請嚴格按照以下 JSON 格式輸出，不要輸出任何其他內容，不要有任何 markdown 標記：

{
  "hero": {
    "emblem": "（日主天干，單字）",
    "subtitle": "（四柱干支全稱｜日主五行性別命深度解讀）",
    "pillars": [
      { "label": "年柱", "tg": "（年干）", "tgClass": "（wood-c/fire-c/earth-c/metal-c/water-c）", "dz": "（年支）", "dzClass": "（wood-c/fire-c/earth-c/metal-c/water-c）", "tenGod": "（相對日主的十神）" },
      { "label": "月柱", "tg": "（月干）", "tgClass": "（五行class）", "dz": "（月支）", "dzClass": "（五行class）", "tenGod": "（十神）" },
      { "label": "日柱", "tg": "（日干）", "tgClass": "（五行class）", "dz": "（日支）", "dzClass": "（五行class）", "tenGod": "日主" },
      { "label": "時柱", "tg": "（時干）", "tgClass": "（五行class）", "dz": "（時支）", "dzClass": "（五行class）", "tenGod": "（十神）" }
    ],
    "nayin": "（四柱納音）",
    "dizhi_state": "（四柱地支旺衰狀態）",
    "bone_weight": "（稱骨骨重，如：X兩X錢）",
    "qiyun": "（起運時間，如：X歲X月）"
  },
  "sections": [
    {
      "num": "壹",
      "title": "格局鑑定",
      "subtitle": "FORMAT · STRENGTH · YONGSHENG",
      "cards": [
        {
          "title": "格局判定：（格局名稱）",
          "paragraphs": ["（深度分析，200字以上，引用古籍）", "（段落2）"],
          "highlight_type": "special",
          "highlight_content": "（核心格局結論，可含<strong>標籤）",
          "analogy": "（生活化白話比喻）"
        },
        {
          "title": "身強身弱判斷：（結論）",
          "paragraphs": ["（助旺分析）", "（泄耗分析）"],
          "highlight_type": "normal",
          "highlight_content": "（綜合判斷與用神序列）",
          "analogy": "（比喻）"
        },
        {
          "title": "調候用神 vs 扶抑用神",
          "paragraphs": ["（調候分析，引用窮通寶鑒）", "（扶抑分析）"],
          "highlight_type": "gold",
          "highlight_content": "（用神序列與忌神序列）",
          "analogy": "（比喻）",
          "quote_text": "（滴天髓或相關古籍原文）",
          "quote_cite": "（書名）"
        }
      ]
    },
    {
      "num": "貳",
      "title": "十神心理原型對照",
      "subtitle": "ARCHETYPE · PSYCHOLOGY · PERSONALITY",
      "cards": [
        {
          "title": "（命盤最核心十神）——命盤主旋律：（心理特質描述）",
          "paragraphs": ["（深度心理分析）", "（在人際職場的具體表現）"],
          "analogy": "（比喻）"
        },
        {
          "title": "（第二重要十神）——（心理描述）",
          "paragraphs": ["（分析）"],
          "analogy": "（比喻）"
        },
        {
          "title": "（第三十神）——（描述）",
          "paragraphs": ["（分析）"],
          "analogy": "（比喻）"
        },
        {
          "title": "（第四十神）——（描述）",
          "paragraphs": ["（分析）"]
        }
      ]
    },
    {
      "num": "叁",
      "title": "宮位生活映射",
      "subtitle": "PILLARS · LIFE STAGES · ENVIRONMENT",
      "cards": [
        {
          "title": "年柱 （年柱干支）｜0–15歲·（人生主題）",
          "paragraphs": ["（家族業力、原生環境分析）"],
          "analogy": "（比喻）"
        },
        {
          "title": "月柱 （月柱干支）｜16–30歲·（人生主題）",
          "paragraphs": ["（社會化、職業志向分析）"],
          "analogy": "（比喻）"
        },
        {
          "title": "日柱 （日柱干支）｜31–45歲·（人生主題）",
          "paragraphs": ["（伴侶關係、私密情感需求分析）"],
          "highlight_type": "gold",
          "highlight_content": "（日柱感情格言）",
          "analogy": "（比喻）"
        },
        {
          "title": "時柱 （時柱干支）｜46歲後·（人生主題）",
          "paragraphs": ["（晚年格局、子息緣份分析）"],
          "analogy": "（比喻）"
        }
      ],
      "interaction_table": [
        { "tag": "（互動類型名稱）", "tagClass": "（fire/earth/metal/wood/water）", "position": "（涉及宮位）", "desc": "（生活具象化說明，100字以上）" },
        { "tag": "（互動類型名稱）", "tagClass": "（五行）", "position": "（宮位）", "desc": "（說明）" },
        { "tag": "（互動類型名稱）", "tagClass": "（五行）", "position": "（宮位）", "desc": "（說明）" },
        { "tag": "（互動類型名稱）", "tagClass": "（五行）", "position": "（宮位）", "desc": "（說明）" }
      ]
    },
    {
      "num": "肆",
      "title": "天干地支互動分析",
      "subtitle": "STEMS · BRANCHES · INTERACTION",
      "cards_grid": [
        {
          "title": "天干：（天干互動描述）",
          "paragraphs": ["（分析）", "（段落2）"],
          "analogy": "（比喻）"
        },
        {
          "title": "地支：（地支互動描述）",
          "paragraphs": ["（分析）", "（段落2）"],
          "analogy": "（比喻）"
        }
      ]
    },
    {
      "num": "伍",
      "title": "大運流年交叉分析",
      "subtitle": "LUCK PILLARS · ANNUAL STARS · CURRENT",
      "yunliu": [
        { "age": "（X歲起）", "stem": "（大運干支）", "stemClass": "（五行主色class）", "desc": "（大運簡析）", "active": false },
        { "age": "（X歲起）", "stem": "（大運干支）", "stemClass": "（五行class）", "desc": "（簡析）", "active": false },
        { "age": "（X歲起）", "stem": "（大運干支）", "stemClass": "（五行class）", "desc": "（簡析）", "active": false },
        { "age": "（X歲起）", "stem": "（大運干支）", "stemClass": "（五行class）", "desc": "（簡析）", "active": false },
        { "age": "（X歲起）", "stem": "（大運干支）", "stemClass": "（五行class）", "desc": "（簡析）", "active": false },
        { "age": "（X歲起）", "stem": "（大運干支）", "stemClass": "（五行class）", "desc": "（簡析）", "active": false },
        { "age": "（X歲起）", "stem": "（大運干支）", "stemClass": "（五行class）", "desc": "（簡析）", "active": false },
        { "age": "（X歲起）", "stem": "（大運干支）", "stemClass": "（五行class）", "desc": "（簡析）", "active": false }
      ],
      "yunliu_cards": [
        {
          "title": "當前大運深度解析：（當前大運干支）",
          "paragraphs": ["（詳細分析）", "（核心衝擊說明）"],
          "highlight_type": "warn",
          "highlight_content": "（當前大運核心提示）",
          "analogy": "（比喻）"
        },
        {
          "title": "2025 乙巳年｜流年解析",
          "paragraphs": ["（乙木對日主的作用分析）", "（巳火引動宮位分析）"],
          "highlight_type": "gold",
          "highlight_content": "（2025年最適合做的事）"
        },
        {
          "title": "2026 丙午年｜流年解析",
          "paragraphs": ["（丙火格局意義）", "（午火對大運與本命的影響，注意現在是2026年）"],
          "highlight_type": "warn",
          "highlight_content": "（2026年壓力與機會提示，分條列出）",
          "analogy": "（比喻）"
        }
      ]
    },
    {
      "num": "陸",
      "title": "神煞解讀",
      "subtitle": "DIVINE STARS · AUSPICIOUS · INAUSPICIOUS",
      "shensha": [
        { "name": "（神煞名稱）", "nameColor": "（顏色，如#C9A84C）", "desc": "（詳細描述，說明落在哪個宮位及其意義）" },
        { "name": "（神煞名稱）", "nameColor": "（顏色）", "desc": "（詳細描述）" },
        { "name": "（神煞名稱）", "nameColor": "（顏色）", "desc": "（詳細描述）" },
        { "name": "（神煞名稱）", "nameColor": "（顏色）", "desc": "（詳細描述）" }
      ],
      "shensha_analogy": "（所有神煞的整體白話總結）"
    },
    {
      "num": "柒",
      "title": "稱骨訣·先天能量解讀",
      "subtitle": "BONE WEIGHT · INNATE CAPACITY · SOFTWARE UPGRADE",
      "bone": {
        "value": "（X兩X錢）",
        "desc1": "（袁天罡稱骨歌原文及對應解釋）",
        "desc2": "（骨重斷語與八字結構的呼應分析）"
      },
      "bone_card": {
        "title": "骨重 （X兩X錢） × （格局名）的人生質地",
        "paragraphs": ["（此命盤的人生底色與努力方向分析）"],
        "analogy": "（比喻）"
      }
    },
    {
      "num": "🔴",
      "title": "當前最值得把握的機會＋最需警惕的地雷",
      "subtitle": "NOW · OPPORTUNITY · WARNING",
      "opportunities": [
        "（機會1標題）：（詳細說明）",
        "（機會2標題）：（詳細說明）",
        "（機會3標題）：（詳細說明）"
      ],
      "warnings": [
        "（地雷1標題）：（詳細說明）",
        "（地雷2標題）：（詳細說明）",
        "（地雷3標題）：（詳細說明）"
      ]
    }
  ],
  "verdict": {
    "main": "（四字結語，概括此人命盤精髓）",
    "text": "（詩意總結，用\\n換行，8-12行）",
    "footer": "（尾注金句，關於命運與自由意志）"
  }
}

【重要規則】
1. 所有括號內容必須替換為根據 ${name}（生辰：${birthday}，出生地：${birthplace}）實際計算的真實數據
2. active=true 只能有一個，標記當前所處大運（現在是2026年，請根據生辰推算）
3. 五行class只能用：wood-c、fire-c、earth-c、metal-c、water-c
4. tagClass只能用：fire、earth、metal、wood、water
5. highlight_type只能用：normal、gold、warn、special
6. 輸出純JSON，無任何markdown、無任何前後說明文字`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
                })
            }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(`Google API 錯誤 ${response.status}: ${JSON.stringify(data)}`);

        let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();

        let d;
        try {
            d = JSON.parse(raw);
        } catch(e) {
            throw new Error('JSON解析失敗：' + e.message + ' | 原始內容前300字：' + raw.substring(0, 300));
        }

        function highlightClass(type) {
            const map = { normal: 'highlight', gold: 'highlight-gold', warn: 'highlight-warn', special: 'highlight-special' };
            return map[type] || 'highlight';
        }

        function renderCard(card) {
            let html = `<div class="card">`;
            html += `<div class="card-title">${card.title}</div>`;
            (card.paragraphs || []).forEach(p => { html += `<p>${p}</p>`; });
            if (card.highlight_content) {
                html += `<div class="${highlightClass(card.highlight_type)}">${card.highlight_content}</div>`;
            }
            if (card.analogy) {
                html += `<div class="analogy">${card.analogy}</div>`;
            }
            if (card.quote_text) {
                html += `<div class="quote">${card.quote_text}<cite>——${card.quote_cite}</cite></div>`;
            }
            html += `</div>`;
            return html;
        }

        const hero = d.hero || {};
        const pillarsHTML = (hero.pillars || []).map(p => `
            <div class="pillar">
                <div class="pillar-label">${p.label}</div>
                <div class="pillar-tg ${p.tgClass}">${p.tg}</div>
                <div class="pillar-dz ${p.dzClass}">${p.dz}</div>
                <div class="pillar-ten-god">${p.tenGod}</div>
            </div>`).join('');

        let sectionsHTML = '';
        for (const sec of (d.sections || [])) {
            sectionsHTML += `<section class="section">
                <div class="section-header">
                    <div class="section-num">${sec.num}</div>
                    <div>
                        <div class="section-title">${sec.title}</div>
                        <div class="section-subtitle">${sec.subtitle || ''}</div>
                    </div>
                </div>`;

            if (sec.cards) {
                sec.cards.forEach(card => { sectionsHTML += renderCard(card); });
            }

            if (sec.cards_grid) {
                sectionsHTML += `<div class="grid-2">`;
                sec.cards_grid.forEach(card => { sectionsHTML += renderCard(card); });
                sectionsHTML += `</div>`;
            }

            if (sec.interaction_table) {
                sectionsHTML += `<div class="divider"><span>刑沖合害</span></div>
                <div class="card"><div class="card-title">宮位間互動——刑沖合害具象化</div>
                <table class="interaction-table">
                <tr><th>互動</th><th>宮位</th><th>生活具象</th></tr>`;
                sec.interaction_table.forEach(row => {
                    sectionsHTML += `<tr>
                        <td><span class="tag tag-${row.tagClass || 'wood'}">${row.tag}</span></td>
                        <td>${row.position}</td>
                        <td>${row.desc}</td>
                    </tr>`;
                });
                sectionsHTML += `</table></div>`;
            }

            if (sec.yunliu) {
                sectionsHTML += `<div class="yunliu-grid">`;
                sec.yunliu.forEach(y => {
                    sectionsHTML += `<div class="yun-card${y.active ? ' active' : ''}">
                        <div class="yun-age">${y.age}</div>
                        <div class="yun-stem ${y.stemClass}">${y.stem}</div>
                        <div class="yun-desc">${y.desc}</div>
                    </div>`;
                });
                sectionsHTML += `</div>`;
            }
            if (sec.yunliu_cards) {
                sec.yunliu_cards.forEach(card => { sectionsHTML += renderCard(card); });
            }

            if (sec.shensha) {
                sectionsHTML += `<div class="shensha-grid">`;
                sec.shensha.forEach(s => {
                    sectionsHTML += `<div class="shensha-item">
                        <div class="shensha-name" style="color:${s.nameColor}">${s.name}</div>
                        <div class="shensha-desc">${s.desc}</div>
                    </div>`;
                });
                sectionsHTML += `</div>`;
                if (sec.shensha_analogy) {
                    sectionsHTML += `<div class="analogy" style="margin-top:24px;">${sec.shensha_analogy}</div>`;
                }
            }

            if (sec.bone) {
                const b = sec.bone;
                sectionsHTML += `<div class="bone-display">
                    <div><div class="bone-num">${b.value}</div></div>
                    <div class="bone-text">
                        <p>${b.desc1}</p>
                        <p>${b.desc2}</p>
                    </div>
                </div>`;
            }
            if (sec.bone_card) { sectionsHTML += renderCard(sec.bone_card); }

            if (sec.opportunities) {
                sectionsHTML += `<div class="oppo-box"><h3>🌱 當前最值得把握的機會（2025–2026）</h3><ul>`;
                sec.opportunities.forEach(o => { sectionsHTML += `<li>${o}</li>`; });
                sectionsHTML += `</ul></div>`;
                sectionsHTML += `<div class="warning-box"><h3>⚡ 最需警惕的地雷</h3><ul>`;
                (sec.warnings || []).forEach(w => { sectionsHTML += `<li>${w}</li>`; });
                sectionsHTML += `</ul></div>`;
            }

            sectionsHTML += `</section>`;
        }

        const verdict = d.verdict || {};
        const verdictLines = (verdict.text || '').split('\\n').join('<br>');

        const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>八字深度解讀｜${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700;900&family=Noto+Sans+TC:wght@300;400;500&family=Ma+Shan+Zheng&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
html, body {
  background:#000000 !important;
  color:#ffffff;
  font-family:'Noto Serif TC',serif;
  overflow-x:hidden;
  position:relative;
}
body::before {
  content:''; position:fixed; inset:0;
  background-image:
    radial-gradient(ellipse at 22% 48%, rgba(122,184,96,0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 76% 22%, rgba(240,120,64,0.05) 0%, transparent 55%),
    radial-gradient(ellipse at 52% 80%, rgba(200,200,216,0.05) 0%, transparent 50%);
  pointer-events:none; z-index:0;
}
body::after {
  content:''; position:fixed; inset:-200%;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity:0.35; pointer-events:none; z-index:1;
  animation:grain 0.5s steps(1) infinite;
}
@keyframes grain {
  0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}20%{transform:translate(3%,2%)}
  30%{transform:translate(-1%,4%)}40%{transform:translate(2%,-1%)}50%{transform:translate(-3%,2%)}
  60%{transform:translate(1%,-2%)}70%{transform:translate(3%,3%)}80%{transform:translate(-2%,1%)}90%{transform:translate(1%,-3%)}
}
.container { position:relative; z-index:2; max-width:900px; margin:0 auto; padding:0 24px 80px; }
.hero { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; position:relative; padding:60px 0; }
.hero-emblem { font-family:'Ma Shan Zheng',cursive; font-size:clamp(6rem,15vw,12rem); color:#7AB860; line-height:1; text-shadow:0 0 60px rgba(122,184,96,0.6),0 0 120px rgba(122,184,96,0.28); animation:pulse-wood 4s ease-in-out infinite; margin-bottom:16px; }
@keyframes pulse-wood { 0%,100%{text-shadow:0 0 60px rgba(122,184,96,0.6),0 0 120px rgba(122,184,96,0.28)} 50%{text-shadow:0 0 95px rgba(122,184,96,0.8),0 0 190px rgba(155,196,106,0.36)} }
.hero-subtitle { font-family:'Noto Sans TC',sans-serif; font-size:0.75rem; letter-spacing:0.5em; color:#7AB860; margin-bottom:32px; }
.four-pillars { display:flex; gap:2px; margin:32px 0; }
.pillar { display:flex; flex-direction:column; align-items:center; background:rgba(255,255,255,0.03); border:1px solid rgba(122,184,96,0.22); padding:20px 16px; position:relative; overflow:hidden; transition:all 0.4s ease; min-width:80px; cursor:default; }
.pillar:hover { border-color:rgba(122,184,96,0.55); transform:translateY(-4px); }
.pillar-label { font-size:0.6rem; letter-spacing:0.3em; color:#aaaaaa; margin-bottom:12px; font-family:'Noto Sans TC',sans-serif; }
.pillar-tg { font-family:'Ma Shan Zheng',cursive; font-size:2.2rem; line-height:1; margin-bottom:4px; }
.pillar-dz { font-family:'Ma Shan Zheng',cursive; font-size:2.2rem; line-height:1; }
.pillar-ten-god { font-size:0.65rem; color:#aaaaaa; margin-top:10px; font-family:'Noto Sans TC',sans-serif; }
.fire-c{color:#F07840;} .earth-c{color:#C9A84C;} .metal-c{color:#C8C8D8;} .wood-c{color:#7AB860;} .water-c{color:#63B3ED;}
.hero-desc { font-size:0.95rem; color:rgba(255,255,255,0.6); line-height:2; max-width:520px; font-weight:300; }
.scroll-hint { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; color:#aaaaaa; font-size:0.65rem; letter-spacing:0.3em; font-family:'Noto Sans TC',sans-serif; animation:bounce 2s ease-in-out infinite; }
@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }
.scroll-hint::after { content:''; width:1px; height:40px; background:linear-gradient(180deg,#aaaaaa,transparent); }
.section { padding:80px 0; border-top:1px solid rgba(122,184,96,0.1); }
.section-header { display:flex; align-items:baseline; gap:20px; margin-bottom:48px; }
.section-num { font-family:'Ma Shan Zheng',cursive; font-size:3rem; color:#7AB860; opacity:0.45; line-height:1; }
.section-title { font-size:1.5rem; font-weight:600; color:#7AB860; letter-spacing:0.1em; }
.section-subtitle { font-size:0.75rem; color:#aaaaaa; letter-spacing:0.3em; font-family:'Noto Sans TC',sans-serif; margin-top:4px; }
.card { background:rgba(255,255,255,0.02); border:1px solid rgba(122,184,96,0.15); padding:28px 32px; margin-bottom:20px; position:relative; overflow:hidden; }
.card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:#7AB860; }
.card-title { font-size:1rem; color:#7AB860; font-weight:600; margin-bottom:14px; letter-spacing:0.05em; display:flex; align-items:center; gap:10px; }
.card-title::before { content:'◆'; font-size:0.5rem; color:#F07840; }
.card p { font-size:0.9rem; line-height:2; color:#ffffff; font-weight:300; }
.card p + p { margin-top:12px; }
.highlight { background:rgba(99,179,237,0.08); border:1px solid rgba(99,179,237,0.32); padding:16px 20px; margin:16px 0; font-size:0.88rem; line-height:1.9; color:#ffffff; }
.highlight-gold { background:rgba(122,184,96,0.08); border:1px solid rgba(122,184,96,0.30); padding:16px 20px; margin:16px 0; font-size:0.88rem; line-height:1.9; color:#ffffff; }
.highlight-warn { background:rgba(212,98,42,0.09); border:1px solid rgba(212,98,42,0.35); padding:16px 20px; margin:16px 0; font-size:0.88rem; line-height:1.9; color:#ffffff; }
.highlight-special { background:rgba(80,100,200,0.09); border:1px solid rgba(120,140,240,0.35); padding:16px 20px; margin:16px 0; font-size:0.88rem; line-height:1.9; color:#ffffff; }
.analogy { background:rgba(74,140,110,0.08); border-left:3px solid #4A8C6E; padding:16px 20px; margin:16px 0; font-size:0.88rem; line-height:1.9; color:#eeeeee; font-style:italic; }
.analogy::before { content:'🌿 白話翻譯｜'; font-style:normal; color:#4A8C6E; font-size:0.8rem; letter-spacing:0.1em; }
.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.yunliu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(175px,1fr)); gap:12px; margin-top:24px; }
.yun-card { background:rgba(255,255,255,0.02); border:1px solid rgba(122,184,96,0.12); padding:18px 16px; position:relative; transition:all 0.3s; }
.yun-card:hover { border-color:rgba(122,184,96,0.38); background:rgba(255,255,255,0.05); transform:translateY(-2px); }
.yun-card.active { border-color:#7AB860; background:rgba(122,184,96,0.07); }
.yun-card.active::after { content:'▶ 當前'; position:absolute; top:8px; right:10px; font-size:0.6rem; color:#7AB860; font-family:'Noto Sans TC',sans-serif; }
.yun-age { font-size:0.65rem; color:#aaaaaa; margin-bottom:6px; font-family:'Noto Sans TC',sans-serif; letter-spacing:0.15em; }
.yun-stem { font-family:'Ma Shan Zheng',cursive; font-size:1.8rem; line-height:1; color:#ffffff; }
.yun-desc { font-size:0.72rem; color:#bbbbbb; margin-top:8px; line-height:1.6; font-family:'Noto Sans TC',sans-serif; }
.shensha-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
.shensha-item { border:1px solid rgba(122,184,96,0.15); padding:18px 20px; background:rgba(255,255,255,0.02); }
.shensha-name { font-size:1.1rem; font-weight:600; margin-bottom:8px; }
.shensha-desc { font-size:0.82rem; color:#dddddd; line-height:1.8; font-family:'Noto Sans TC',sans-serif; font-weight:300; }
.bone-display { display:flex; align-items:center; gap:40px; padding:40px; background:rgba(122,184,96,0.04); border:1px solid rgba(122,184,96,0.2); margin:24px 0; }
.bone-num { font-family:'Ma Shan Zheng',cursive; font-size:5rem; color:#7AB860; line-height:1; text-shadow:0 0 30px rgba(122,184,96,0.3); }
.bone-unit { font-size:1.2rem; color:#aaaaaa; }
.bone-text { flex:1; }
.bone-text p { font-size:0.88rem; line-height:2; color:#dddddd; font-weight:300; }
.bone-text p + p { margin-top:12px; }
.warning-box { background:rgba(212,98,42,0.07); border:1px solid rgba(212,98,42,0.38); padding:28px 32px; margin:16px 0; }
.warning-box h3 { color:#F07840; font-size:1.1rem; margin-bottom:14px; letter-spacing:0.1em; }
.warning-box ul { list-style:none; display:flex; flex-direction:column; gap:10px; }
.warning-box ul li { font-size:0.88rem; line-height:1.8; color:#ffffff; font-weight:300; padding-left:20px; position:relative; }
.warning-box ul li::before { content:'▸'; position:absolute; left:0; color:#D4622A; }
.oppo-box { background:rgba(74,140,110,0.07); border:1px solid rgba(74,140,110,0.38); padding:28px 32px; margin:16px 0; }
.oppo-box h3 { color:#6EC49A; font-size:1.1rem; margin-bottom:14px; letter-spacing:0.1em; }
.oppo-box ul { list-style:none; display:flex; flex-direction:column; gap:10px; }
.oppo-box ul li { font-size:0.88rem; line-height:1.8; color:#ffffff; font-weight:300; padding-left:20px; position:relative; }
.oppo-box ul li::before { content:'▸'; position:absolute; left:0; color:#6EC49A; }
.verdict { text-align:center; padding:80px 40px; border-top:1px solid rgba(122,184,96,0.2); }
.verdict-main { font-family:'Ma Shan Zheng',cursive; font-size:clamp(4rem,10vw,7rem); color:transparent; background:linear-gradient(135deg,#7AB860 0%,#C9A84C 50%,#F07840 100%); -webkit-background-clip:text; background-clip:text; line-height:1; margin-bottom:24px; animation:shimmer 3s ease-in-out infinite; }
@keyframes shimmer { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.2)} }
.verdict-text { font-size:1rem; line-height:2.2; color:rgba(255,255,255,0.8); max-width:640px; margin:0 auto 32px; font-weight:300; }
.verdict-seal { display:inline-block; border:2px solid #7AB860; padding:10px 28px; font-family:'Ma Shan Zheng',cursive; font-size:1.2rem; color:#7AB860; letter-spacing:0.3em; text-shadow:0 0 20px rgba(122,184,96,0.4); }
.divider { display:flex; align-items:center; gap:20px; margin:40px 0; opacity:0.3; }
.divider::before,.divider::after { content:''; flex:1; height:1px; background:#7AB860; }
.divider span { font-family:'Ma Shan Zheng',cursive; font-size:1.2rem; color:#7AB860; }
.quote { border-left:2px solid #7AB860; padding:12px 20px; margin:20px 0; font-size:0.85rem; color:#bbbbbb; font-style:italic; line-height:1.8; }
.quote cite { display:block; margin-top:8px; font-size:0.75rem; color:#aaaaaa; font-style:normal; letter-spacing:0.1em; }
.interaction-table { width:100%; border-collapse:collapse; font-size:0.82rem; font-family:'Noto Sans TC',sans-serif; }
.interaction-table th { padding:10px 16px; text-align:left; background:rgba(122,184,96,0.08); color:#7AB860; font-weight:500; letter-spacing:0.1em; border-bottom:1px solid rgba(122,184,96,0.2); }
.interaction-table td { padding:12px 16px; border-bottom:1px solid rgba(122,184,96,0.06); color:#dddddd; line-height:1.7; vertical-align:top; }
.interaction-table tr:hover td { background:rgba(255,255,255,0.02); }
.tag { display:inline-block; padding:3px 10px; font-size:0.7rem; border-radius:2px; font-family:'Noto Sans TC',sans-serif; margin:2px; }
.tag-fire  { background:rgba(212,98,42,0.2);  color:#F07840; border:1px solid rgba(212,98,42,0.4); }
.tag-earth { background:rgba(180,145,70,0.2);  color:#C9A84C; border:1px solid rgba(180,145,70,0.4); }
.tag-metal { background:rgba(180,165,130,0.2); color:#D4C5A0; border:1px solid rgba(180,165,130,0.4); }
.tag-wood  { background:rgba(92,140,62,0.2);   color:#9BC46A; border:1px solid rgba(92,140,62,0.4); }
.tag-water { background:rgba(43,95,140,0.2);   color:#7BB8E8; border:1px solid rgba(43,95,140,0.4); }
@media(max-width:640px){
  .grid-2{grid-template-columns:1fr;}
  .four-pillars{gap:1px;}
  .pillar{padding:14px 10px;min-width:60px;}
  .pillar-tg,.pillar-dz{font-size:1.8rem;}
  .shensha-grid{grid-template-columns:1fr;}
  .bone-display{flex-direction:column;gap:16px;text-align:center;}
  .section-num{font-size:2rem;}
  .section-title{font-size:1.2rem;}
}
</style>
</head>
<body>
<div class="container">

<section class="hero">
  <div class="hero-emblem">${hero.emblem || ''}</div>
  <div class="hero-subtitle">${hero.subtitle || ''}</div>
  <div class="four-pillars">${pillarsHTML}</div>
  <div class="hero-desc">
    納音：${hero.nayin || ''}<br>
    地勢：${hero.dizhi_state || ''}<br>
    骨重 <strong style="color:#7AB860">${hero.bone_weight || ''}</strong>｜起運 <strong style="color:#7AB860">${hero.qiyun || ''}</strong>
  </div>
  <div class="scroll-hint">向下探索</div>
</section>

${sectionsHTML}

<div class="verdict">
  <div class="verdict-main">${verdict.main || ''}</div>
  <div class="verdict-text">${verdictLines}<br><br><em style="color:#7AB860;font-size:0.9rem;">${verdict.footer || ''}</em></div>
  <div class="verdict-seal">命盤深度解讀</div>
</div>

</div>
<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.card, .yun-card, .shensha-item, .warning-box, .oppo-box, .bone-display').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});
<\/script>
</body>
</html>`;

        res.status(200).send(html);

    } catch (error) {
        res.status(500).send(`<div style="color:#7AB860;padding:40px;font-family:monospace;background:#000;min-height:100vh;">
            <p style="font-size:1.2rem;margin-bottom:16px;">觀測中斷</p>
            <p>${error.message}</p>
        </div>`);
    }
};
