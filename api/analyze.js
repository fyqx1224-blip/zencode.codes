module.exports = async function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if (req.method !== 'POST') {
        return res.status(405).send('<div>只接受 POST 請求</div>');
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("找不到 GEMINI_API_KEY");

        const body = req.body || {};
        const { name, gender, birthday, birthplace, pillars, ganzhiString,
                riZhu, riZhuTg, nayin, boneWeight, dayun } = body;

        if (!name || !pillars) throw new Error("缺少必要資料");

        // 組裝精確的八字資訊描述給 AI
        const pillarDesc = pillars.map(p =>
            `${p.label}【${p.tg}${p.dz}】天干${p.tg}(${p.tgWuxing})十神:${p.tenGod} 地支${p.dz}(${p.dzWuxing})旺衰:${p.wangshuan}`
        ).join('\n');

        const dayunDesc = dayun.list.map(d =>
            `${d.age} ${d.stem}`
        ).join('、');

        const prompt = `你是一位精通東西方命理的命理大師，請依據《滴天髓》《淵海子平》《三命通會》《子平真詮》《神峰通考》《窮通寶鑒》為以下對象進行深度八字解讀。

【⚠️ 以下四柱八字由精確演算法計算，請直接使用，不得自行重新推算或更改任何干支】

命主資料：
姓名：${name}
性別：${gender}
出生：${birthday}
出生地：${birthplace}

四柱八字（已精確計算）：
${pillarDesc}

八字組合：${ganzhiString}
日主：${riZhuTg}（${riZhu}）
納音：${nayin}
稱骨：${boneWeight}
大運起運：${dayun.startAge}歲
大運排列：${dayunDesc}

【解讀框架·請逐項完整分析】
壹、格局鑑定（正格vs特殊格局、身強身弱、調候用神vs扶抑用神）
貳、十神心理原型對照（每個主要十神的心理分析，每個至少200字）
叁、宮位生活映射（四柱各階段人生，含刑沖合害具象化表格）
肆、天干地支互動分析（天干合化、地支三合六合六衝三刑六害）
伍、大運流年交叉分析（列出全部8個大運、2025乙巳年、2026丙午年詳析）
陸、神煞解讀（天乙貴人、文昌、驛馬、桃花、羊刃、魁罡等）
柒、稱骨訣白話詮釋（${boneWeight}的命格解析）
捌、當前機會與地雷（最值得把握的3個機會、最需警惕的3個地雷）

請嚴格按照以下 JSON 格式輸出，不要輸出任何其他內容：

{
  "hero": {
    "emblem": "${riZhuTg}",
    "subtitle": "${ganzhiString}｜${riZhuTg}${gender === '女' ? '女' : '男'}命深度解讀",
    "pillars": [
      { "label": "${pillars[0].label}", "tg": "${pillars[0].tg}", "tgClass": "${pillars[0].tgClass}", "dz": "${pillars[0].dz}", "dzClass": "${pillars[0].dzClass}", "tenGod": "${pillars[0].tenGod}" },
      { "label": "${pillars[1].label}", "tg": "${pillars[1].tg}", "tgClass": "${pillars[1].tgClass}", "dz": "${pillars[1].dz}", "dzClass": "${pillars[1].dzClass}", "tenGod": "${pillars[1].tenGod}" },
      { "label": "${pillars[2].label}", "tg": "${pillars[2].tg}", "tgClass": "${pillars[2].tgClass}", "dz": "${pillars[2].dz}", "dzClass": "${pillars[2].dzClass}", "tenGod": "日主" },
      { "label": "${pillars[3].label}", "tg": "${pillars[3].tg}", "tgClass": "${pillars[3].tgClass}", "dz": "${pillars[3].dz}", "dzClass": "${pillars[3].dzClass}", "tenGod": "${pillars[3].tenGod}" }
    ],
    "nayin": "${nayin}",
    "dizhi_state": "${pillars.map(p => p.wangshuan).join('·')}",
    "bone_weight": "${boneWeight}",
    "qiyun": "${dayun.startAge}歲起運"
  },
  "sections": [
    {
      "num": "壹",
      "title": "格局鑑定",
      "subtitle": "FORMAT · STRENGTH · YONGSHENG",
      "cards": [
        {
          "title": "格局判定：（根據實際八字填寫格局名稱）",
          "paragraphs": ["（詳細分析，至少200字，引用古籍）", "（段落2）"],
          "highlight_type": "special",
          "highlight_content": "（格局核心特質總結）",
          "analogy": "（白話比喻）"
        },
        {
          "title": "身強身弱：（結論）",
          "paragraphs": ["（分析）"],
          "highlight_type": "normal",
          "highlight_content": "（用神忌神序列）",
          "analogy": "（比喻）"
        },
        {
          "title": "調候用神 vs 扶抑用神",
          "paragraphs": ["（分析）"],
          "highlight_type": "gold",
          "highlight_content": "（用神序列詳述）",
          "analogy": "（比喻）",
          "quote_text": "（引用《滴天髓》或相關古籍原文）",
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
          "title": "（主要十神）——命盤主旋律：（心理描述）",
          "paragraphs": ["（200字以上詳細心理分析）", "（段落2）"],
          "analogy": "（比喻）"
        },
        {
          "title": "（第二十神）——（心理描述）",
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
          "title": "年柱 ${pillars[0].tg}${pillars[0].dz}｜0–15歲·（主題）",
          "paragraphs": ["（詳細分析）"],
          "analogy": "（比喻）"
        },
        {
          "title": "月柱 ${pillars[1].tg}${pillars[1].dz}｜16–30歲·（主題）",
          "paragraphs": ["（詳細分析）"],
          "analogy": "（比喻）"
        },
        {
          "title": "日柱 ${pillars[2].tg}${pillars[2].dz}｜31–45歲·（主題）",
          "paragraphs": ["（詳細分析）"],
          "highlight_type": "gold",
          "highlight_content": "（日柱感情核心）",
          "analogy": "（比喻）"
        },
        {
          "title": "時柱 ${pillars[3].tg}${pillars[3].dz}｜46歲後·（主題）",
          "paragraphs": ["（詳細分析）"],
          "analogy": "（比喻）"
        }
      ],
      "interaction_table": [
        { "tag": "（互動名稱）", "tagClass": "（fire/wood/water/metal/earth之一）", "position": "（宮位）", "desc": "（具象化說明）" },
        { "tag": "（互動名稱）", "tagClass": "（顏色）", "position": "（宮位）", "desc": "（說明）" },
        { "tag": "（互動名稱）", "tagClass": "（顏色）", "position": "（宮位）", "desc": "（說明）" },
        { "tag": "（互動名稱）", "tagClass": "（顏色）", "position": "（宮位）", "desc": "（說明）" }
      ]
    },
    {
      "num": "肆",
      "title": "天干地支互動分析",
      "subtitle": "STEMS · BRANCHES · INTERACTION",
      "cards_grid": [
        {
          "title": "天干：（互動描述）",
          "paragraphs": ["（詳細分析）"],
          "analogy": "（比喻）"
        },
        {
          "title": "地支：（互動描述）",
          "paragraphs": ["（詳細分析）"],
          "analogy": "（比喻）"
        }
      ]
    },
    {
      "num": "伍",
      "title": "大運流年交叉分析",
      "subtitle": "LUCK PILLARS · ANNUAL STARS · CURRENT",
      "yunliu": [
        { "age": "${dayun.list[0] ? dayun.list[0].age : ''}", "stem": "${dayun.list[0] ? dayun.list[0].stem : ''}", "stemClass": "${dayun.list[0] ? dayun.list[0].tgClass : 'wood-c'}", "desc": "（大運簡析）", "active": false },
        { "age": "${dayun.list[1] ? dayun.list[1].age : ''}", "stem": "${dayun.list[1] ? dayun.list[1].stem : ''}", "stemClass": "${dayun.list[1] ? dayun.list[1].tgClass : 'wood-c'}", "desc": "（大運簡析）", "active": false },
        { "age": "${dayun.list[2] ? dayun.list[2].age : ''}", "stem": "${dayun.list[2] ? dayun.list[2].stem : ''}", "stemClass": "${dayun.list[2] ? dayun.list[2].tgClass : 'wood-c'}", "desc": "（大運簡析）", "active": false },
        { "age": "${dayun.list[3] ? dayun.list[3].age : ''}", "stem": "${dayun.list[3] ? dayun.list[3].stem : ''}", "stemClass": "${dayun.list[3] ? dayun.list[3].tgClass : 'wood-c'}", "desc": "（大運簡析）", "active": false },
        { "age": "${dayun.list[4] ? dayun.list[4].age : ''}", "stem": "${dayun.list[4] ? dayun.list[4].stem : ''}", "stemClass": "${dayun.list[4] ? dayun.list[4].tgClass : 'wood-c'}", "desc": "（大運簡析）", "active": false },
        { "age": "${dayun.list[5] ? dayun.list[5].age : ''}", "stem": "${dayun.list[5] ? dayun.list[5].stem : ''}", "stemClass": "${dayun.list[5] ? dayun.list[5].tgClass : 'wood-c'}", "desc": "（大運簡析）", "active": false },
        { "age": "${dayun.list[6] ? dayun.list[6].age : ''}", "stem": "${dayun.list[6] ? dayun.list[6].stem : ''}", "stemClass": "${dayun.list[6] ? dayun.list[6].tgClass : 'wood-c'}", "desc": "（大運簡析）", "active": false },
        { "age": "${dayun.list[7] ? dayun.list[7].age : ''}", "stem": "${dayun.list[7] ? dayun.list[7].stem : ''}", "stemClass": "${dayun.list[7] ? dayun.list[7].tgClass : 'wood-c'}", "desc": "（大運簡析）", "active": false }
      ],
      "yunliu_cards": [
        {
          "title": "當前大運深度解析",
          "paragraphs": ["（當前所處大運的詳細分析，結合本命盤）", "（段落2）"],
          "highlight_type": "warn",
          "highlight_content": "（核心提示與行動建議）",
          "analogy": "（比喻）"
        },
        {
          "title": "2025 乙巳年｜流年解析",
          "paragraphs": ["（乙木對日主的作用）", "（巳火引動宮位分析）"],
          "highlight_type": "gold",
          "highlight_content": "（2025年最適合做的事）"
        },
        {
          "title": "2026 丙午年｜流年解析（當前年份）",
          "paragraphs": ["（丙火格局意義）", "（午火對大運與本命的影響）"],
          "highlight_type": "warn",
          "highlight_content": "（2026年注意事項與策略）",
          "analogy": "（比喻）"
        }
      ]
    },
    {
      "num": "陸",
      "title": "神煞解讀",
      "subtitle": "DIVINE STARS · AUSPICIOUS · INAUSPICIOUS",
      "shensha": [
        { "name": "天乙貴人", "nameColor": "#C9A84C", "desc": "（根據日主或年干計算天乙貴人落在哪個地支，詳細解讀其在命盤的意義）" },
        { "name": "（第二神煞名稱）", "nameColor": "#9BC46A", "desc": "（詳細描述）" },
        { "name": "（第三神煞名稱）", "nameColor": "#FFB8A0", "desc": "（詳細描述）" },
        { "name": "（第四神煞名稱）", "nameColor": "#7BB8E8", "desc": "（詳細描述）" }
      ],
      "shensha_analogy": "（四個神煞的整體白話總結）"
    },
    {
      "num": "柒",
      "title": "稱骨訣·先天能量解讀",
      "subtitle": "BONE WEIGHT · INNATE CAPACITY · SOFTWARE UPGRADE",
      "bone": {
        "value": "${boneWeight}",
        "desc1": "（引用袁天罡稱骨歌原文及解釋，${boneWeight}對應的詩句）",
        "desc2": "（${boneWeight}與此命盤八字格局的呼應分析）"
      },
      "bone_card": {
        "title": "骨重 ${boneWeight} × 此命格的人生質地",
        "paragraphs": ["（詳細分析先天配備與後天可升級之處）"],
        "analogy": "（比喻）"
      }
    },
    {
      "num": "🔴",
      "title": "當前最值得把握的機會＋最需警惕的地雷",
      "subtitle": "NOW · OPPORTUNITY · WARNING",
      "opportunities": [
        "（機會1標題）：（詳細說明，結合2025-2026流年與當前大運）",
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
    "main": "（四字結語，如：甲木向陽）",
    "text": "（詩意總結，用\\n換行，8-12行，關於命主的人生底色與核心課題）",
    "footer": "（一句關於命運與自由意志的金句）"
  }
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 65536,
                        responseMimeType: "application/json"
                    }
                })
            }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(`Google API 錯誤 ${response.status}: ${JSON.stringify(data)}`);

        let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();

        let d;
        try { d = JSON.parse(raw); }
        catch(e) { throw new Error('JSON解析失敗：' + e.message + ' | 原始內容前300字：' + raw.substring(0, 300)); }

        // ══ 渲染 HTML ══
        function hClass(type) {
            return { normal:'highlight', gold:'highlight-gold', warn:'highlight-warn', special:'highlight-special' }[type] || 'highlight';
        }

        function renderCard(card) {
            let h = `<div class="card"><div class="card-title">${card.title}</div>`;
            (card.paragraphs||[]).forEach(p => { h += `<p>${p}</p>`; });
            if (card.highlight_content) h += `<div class="${hClass(card.highlight_type)}">${card.highlight_content}</div>`;
            if (card.analogy) h += `<div class="analogy">${card.analogy}</div>`;
            if (card.quote_text) h += `<div class="quote">${card.quote_text}<cite>——${card.quote_cite}</cite></div>`;
            h += `</div>`;
            return h;
        }

        const hero = d.hero || {};
        const pillarsHTML = (hero.pillars||[]).map(p => `
            <div class="pillar">
                <div class="pillar-label">${p.label}</div>
                <div class="pillar-tg ${p.tgClass}">${p.tg}</div>
                <div class="pillar-dz ${p.dzClass}">${p.dz}</div>
                <div class="pillar-ten-god">${p.tenGod}</div>
            </div>`).join('');

        let sectionsHTML = '';
        for (const sec of (d.sections||[])) {
            sectionsHTML += `<section class="section">
                <div class="section-header">
                    <div class="section-num">${sec.num}</div>
                    <div><div class="section-title">${sec.title}</div>
                    <div class="section-subtitle">${sec.subtitle||''}</div></div>
                </div>`;

            if (sec.cards) sec.cards.forEach(c => { sectionsHTML += renderCard(c); });
            if (sec.cards_grid) {
                sectionsHTML += `<div class="grid-2">`;
                sec.cards_grid.forEach(c => { sectionsHTML += renderCard(c); });
                sectionsHTML += `</div>`;
            }
            if (sec.interaction_table) {
                sectionsHTML += `<div class="divider"><span>刑沖合害</span></div>
                <div class="card"><div class="card-title">宮位間互動——刑沖合害具象化</div>
                <table class="interaction-table">
                <tr><th>互動</th><th>宮位</th><th>生活具象</th></tr>`;
                sec.interaction_table.forEach(row => {
                    sectionsHTML += `<tr>
                        <td><span class="tag tag-${row.tagClass||'wood'}">${row.tag}</span></td>
                        <td>${row.position}</td><td>${row.desc}</td></tr>`;
                });
                sectionsHTML += `</table></div>`;
            }
            if (sec.yunliu) {
                sectionsHTML += `<div class="yunliu-grid">`;
                sec.yunliu.forEach(y => {
                    sectionsHTML += `<div class="yun-card${y.active?' active':''}">
                        <div class="yun-age">${y.age}</div>
                        <div class="yun-stem ${y.stemClass}">${y.stem}</div>
                        <div class="yun-desc">${y.desc}</div></div>`;
                });
                sectionsHTML += `</div>`;
            }
            if (sec.yunliu_cards) sec.yunliu_cards.forEach(c => { sectionsHTML += renderCard(c); });
            if (sec.shensha) {
                sectionsHTML += `<div class="shensha-grid">`;
                sec.shensha.forEach(s => {
                    sectionsHTML += `<div class="shensha-item">
                        <div class="shensha-name" style="color:${s.nameColor}">${s.name}</div>
                        <div class="shensha-desc">${s.desc}</div></div>`;
                });
                sectionsHTML += `</div>`;
                if (sec.shensha_analogy) sectionsHTML += `<div class="analogy" style="margin-top:24px;">${sec.shensha_analogy}</div>`;
            }
            if (sec.bone) {
                const b = sec.bone;
                sectionsHTML += `<div class="bone-display">
                    <div><div class="bone-num">${b.value}</div></div>
                    <div class="bone-text"><p>${b.desc1}</p><p>${b.desc2}</p></div></div>`;
            }
            if (sec.bone_card) sectionsHTML += renderCard(sec.bone_card);
            if (sec.opportunities) {
                sectionsHTML += `<div class="oppo-box"><h3>🌱 當前最值得把握的機會（2025–2026）</h3><ul>`;
                sec.opportunities.forEach(o => { sectionsHTML += `<li>${o}</li>`; });
                sectionsHTML += `</ul></div><div class="warning-box"><h3>⚡ 最需警惕的地雷</h3><ul>`;
                sec.warnings.forEach(w => { sectionsHTML += `<li>${w}</li>`; });
                sectionsHTML += `</ul></div>`;
            }
            sectionsHTML += `</section>`;
        }

        const verdict = d.verdict || {};
        const verdictLines = (verdict.text||'').split('\\n').join('<br>');

        const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>八字深度解讀｜${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700;900&family=Noto+Sans+TC:wght@300;400;500&family=Ma+Shan+Zheng&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{background:#000!important;color:#fff;font-family:'Noto Serif TC',serif;overflow-x:hidden;position:relative;}
body::before{content:'';position:fixed;inset:0;background-image:radial-gradient(ellipse at 22% 48%,rgba(122,184,96,.08) 0%,transparent 60%),radial-gradient(ellipse at 76% 22%,rgba(240,120,64,.05) 0%,transparent 55%),radial-gradient(ellipse at 52% 80%,rgba(200,200,216,.05) 0%,transparent 50%);pointer-events:none;z-index:0;}
body::after{content:'';position:fixed;inset:-200%;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");opacity:.35;pointer-events:none;z-index:1;animation:grain .5s steps(1) infinite;}
@keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}20%{transform:translate(3%,2%)}30%{transform:translate(-1%,4%)}40%{transform:translate(2%,-1%)}50%{transform:translate(-3%,2%)}60%{transform:translate(1%,-2%)}70%{transform:translate(3%,3%)}80%{transform:translate(-2%,1%)}90%{transform:translate(1%,-3%)}}
.container{position:relative;z-index:2;max-width:900px;margin:0 auto;padding:0 24px 80px;}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;padding:60px 0;}
.hero-emblem{font-family:'Ma Shan Zheng',cursive;font-size:clamp(6rem,15vw,12rem);color:#7AB860;line-height:1;text-shadow:0 0 60px rgba(122,184,96,.6),0 0 120px rgba(122,184,96,.28);animation:pulse-wood 4s ease-in-out infinite;margin-bottom:16px;}
@keyframes pulse-wood{0%,100%{text-shadow:0 0 60px rgba(122,184,96,.6),0 0 120px rgba(122,184,96,.28)}50%{text-shadow:0 0 95px rgba(122,184,96,.8),0 0 190px rgba(155,196,106,.36)}}
.hero-subtitle{font-family:'Noto Sans TC',sans-serif;font-size:.75rem;letter-spacing:.5em;color:#7AB860;margin-bottom:32px;}
.four-pillars{display:flex;gap:2px;margin:32px 0;}
.pillar{display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.03);border:1px solid rgba(122,184,96,.22);padding:20px 16px;transition:all .4s ease;min-width:80px;cursor:default;}
.pillar:hover{border-color:rgba(122,184,96,.55);transform:translateY(-4px);}
.pillar-label{font-size:.6rem;letter-spacing:.3em;color:#aaa;margin-bottom:12px;font-family:'Noto Sans TC',sans-serif;}
.pillar-tg{font-family:'Ma Shan Zheng',cursive;font-size:2.2rem;line-height:1;margin-bottom:4px;}
.pillar-dz{font-family:'Ma Shan Zheng',cursive;font-size:2.2rem;line-height:1;}
.pillar-ten-god{font-size:.65rem;color:#aaa;margin-top:10px;font-family:'Noto Sans TC',sans-serif;}
.fire-c{color:#F07840;}.earth-c{color:#C9A84C;}.metal-c{color:#C8C8D8;}.wood-c{color:#7AB860;}.water-c{color:#63B3ED;}
.hero-desc{font-size:.95rem;color:rgba(255,255,255,.6);line-height:2;max-width:520px;font-weight:300;}
.scroll-hint{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;color:#aaa;font-size:.65rem;letter-spacing:.3em;font-family:'Noto Sans TC',sans-serif;animation:bounce 2s ease-in-out infinite;}
@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
.scroll-hint::after{content:'';width:1px;height:40px;background:linear-gradient(180deg,#aaa,transparent);}
.section{padding:80px 0;border-top:1px solid rgba(122,184,96,.1);}
.section-header{display:flex;align-items:baseline;gap:20px;margin-bottom:48px;}
.section-num{font-family:'Ma Shan Zheng',cursive;font-size:3rem;color:#7AB860;opacity:.45;line-height:1;}
.section-title{font-size:1.5rem;font-weight:600;color:#7AB860;letter-spacing:.1em;}
.section-subtitle{font-size:.75rem;color:#aaa;letter-spacing:.3em;font-family:'Noto Sans TC',sans-serif;margin-top:4px;}
.card{background:rgba(255,255,255,.02);border:1px solid rgba(122,184,96,.15);padding:28px 32px;margin-bottom:20px;position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#7AB860;}
.card-title{font-size:1rem;color:#7AB860;font-weight:600;margin-bottom:14px;letter-spacing:.05em;display:flex;align-items:center;gap:10px;}
.card-title::before{content:'◆';font-size:.5rem;color:#F07840;}
.card p{font-size:.9rem;line-height:2;color:#fff;font-weight:300;}
.card p+p{margin-top:12px;}
.highlight{background:rgba(99,179,237,.08);border:1px solid rgba(99,179,237,.32);padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#fff;}
.highlight-gold{background:rgba(122,184,96,.08);border:1px solid rgba(122,184,96,.3);padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#fff;}
.highlight-warn{background:rgba(212,98,42,.09);border:1px solid rgba(212,98,42,.35);padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#fff;}
.highlight-special{background:rgba(80,100,200,.09);border:1px solid rgba(120,140,240,.35);padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#fff;}
.analogy{background:rgba(74,140,110,.08);border-left:3px solid #4A8C6E;padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#eee;font-style:italic;}
.analogy::before{content:'🌿 白話翻譯｜';font-style:normal;color:#4A8C6E;font-size:.8rem;letter-spacing:.1em;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.yunliu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:12px;margin-top:24px;}
.yun-card{background:rgba(255,255,255,.02);border:1px solid rgba(122,184,96,.12);padding:18px 16px;position:relative;transition:all .3s;}
.yun-card:hover{border-color:rgba(122,184,96,.38);background:rgba(255,255,255,.05);transform:translateY(-2px);}
.yun-card.active{border-color:#7AB860;background:rgba(122,184,96,.07);}
.yun-card.active::after{content:'▶ 當前';position:absolute;top:8px;right:10px;font-size:.6rem;color:#7AB860;font-family:'Noto Sans TC',sans-serif;}
.yun-age{font-size:.65rem;color:#aaa;margin-bottom:6px;font-family:'Noto Sans TC',sans-serif;letter-spacing:.15em;}
.yun-stem{font-family:'Ma Shan Zheng',cursive;font-size:1.8rem;line-height:1;color:#fff;}
.yun-desc{font-size:.72rem;color:#bbb;margin-top:8px;line-height:1.6;font-family:'Noto Sans TC',sans-serif;}
.shensha-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
.shensha-item{border:1px solid rgba(122,184,96,.15);padding:18px 20px;background:rgba(255,255,255,.02);}
.shensha-name{font-size:1.1rem;font-weight:600;margin-bottom:8px;}
.shensha-desc{font-size:.82rem;color:#ddd;line-height:1.8;font-family:'Noto Sans TC',sans-serif;font-weight:300;}
.bone-display{display:flex;align-items:center;gap:40px;padding:40px;background:rgba(122,184,96,.04);border:1px solid rgba(122,184,96,.2);margin:24px 0;}
.bone-num{font-family:'Ma Shan Zheng',cursive;font-size:5rem;color:#7AB860;line-height:1;text-shadow:0 0 30px rgba(122,184,96,.3);}
.bone-unit{font-size:1.2rem;color:#aaa;}
.bone-text{flex:1;}
.bone-text p{font-size:.88rem;line-height:2;color:#ddd;font-weight:300;}
.bone-text p+p{margin-top:12px;}
.warning-box{background:rgba(212,98,42,.07);border:1px solid rgba(212,98,42,.38);padding:28px 32px;margin:16px 0;}
.warning-box h3{color:#F07840;font-size:1.1rem;margin-bottom:14px;letter-spacing:.1em;}
.warning-box ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
.warning-box ul li{font-size:.88rem;line-height:1.8;color:#fff;font-weight:300;padding-left:20px;position:relative;}
.warning-box ul li::before{content:'▸';position:absolute;left:0;color:#D4622A;}
.oppo-box{background:rgba(74,140,110,.07);border:1px solid rgba(74,140,110,.38);padding:28px 32px;margin:16px 0;}
.oppo-box h3{color:#6EC49A;font-size:1.1rem;margin-bottom:14px;letter-spacing:.1em;}
.oppo-box ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
.oppo-box ul li{font-size:.88rem;line-height:1.8;color:#fff;font-weight:300;padding-left:20px;position:relative;}
.oppo-box ul li::before{content:'▸';position:absolute;left:0;color:#6EC49A;}
.verdict{text-align:center;padding:80px 40px;border-top:1px solid rgba(122,184,96,.2);}
.verdict-main{font-family:'Ma Shan Zheng',cursive;font-size:clamp(4rem,10vw,7rem);color:transparent;background:linear-gradient(135deg,#7AB860 0%,#C9A84C 50%,#F07840 100%);-webkit-background-clip:text;background-clip:text;line-height:1;margin-bottom:24px;animation:shimmer 3s ease-in-out infinite;}
@keyframes shimmer{0%,100%{filter:brightness(1)}50%{filter:brightness(1.2)}}
.verdict-text{font-size:1rem;line-height:2.2;color:rgba(255,255,255,.8);max-width:640px;margin:0 auto 32px;font-weight:300;}
.verdict-seal{display:inline-block;border:2px solid #7AB860;padding:10px 28px;font-family:'Ma Shan Zheng',cursive;font-size:1.2rem;color:#7AB860;letter-spacing:.3em;text-shadow:0 0 20px rgba(122,184,96,.4);}
.divider{display:flex;align-items:center;gap:20px;margin:40px 0;opacity:.3;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:#7AB860;}
.divider span{font-family:'Ma Shan Zheng',cursive;font-size:1.2rem;color:#7AB860;}
.quote{border-left:2px solid #7AB860;padding:12px 20px;margin:20px 0;font-size:.85rem;color:#bbb;font-style:italic;line-height:1.8;}
.quote cite{display:block;margin-top:8px;font-size:.75rem;color:#aaa;font-style:normal;letter-spacing:.1em;}
.interaction-table{width:100%;border-collapse:collapse;font-size:.82rem;font-family:'Noto Sans TC',sans-serif;}
.interaction-table th{padding:10px 16px;text-align:left;background:rgba(122,184,96,.08);color:#7AB860;font-weight:500;letter-spacing:.1em;border-bottom:1px solid rgba(122,184,96,.2);}
.interaction-table td{padding:12px 16px;border-bottom:1px solid rgba(122,184,96,.06);color:#ddd;line-height:1.7;vertical-align:top;}
.interaction-table tr:hover td{background:rgba(255,255,255,.02);}
.tag{display:inline-block;padding:3px 10px;font-size:.7rem;border-radius:2px;font-family:'Noto Sans TC',sans-serif;margin:2px;}
.tag-fire{background:rgba(212,98,42,.2);color:#F07840;border:1px solid rgba(212,98,42,.4);}
.tag-earth{background:rgba(180,145,70,.2);color:#C9A84C;border:1px solid rgba(180,145,70,.4);}
.tag-metal{background:rgba(180,165,130,.2);color:#D4C5A0;border:1px solid rgba(180,165,130,.4);}
.tag-wood{background:rgba(92,140,62,.2);color:#9BC46A;border:1px solid rgba(92,140,62,.4);}
.tag-water{background:rgba(43,95,140,.2);color:#7BB8E8;border:1px solid rgba(43,95,140,.4);}
@media(max-width:640px){.grid-2{grid-template-columns:1fr;}.four-pillars{gap:1px;}.pillar{padding:14px 10px;min-width:60px;}.pillar-tg,.pillar-dz{font-size:1.8rem;}.shensha-grid{grid-template-columns:1fr;}.bone-display{flex-direction:column;gap:16px;text-align:center;}.section-num{font-size:2rem;}.section-title{font-size:1.2rem;}}
</style>
</head>
<body>
<div class="container">
<section class="hero">
  <div class="hero-emblem">${hero.emblem||''}</div>
  <div class="hero-subtitle">${hero.subtitle||''}</div>
  <div class="four-pillars">${pillarsHTML}</div>
  <div class="hero-desc">納音：${hero.nayin||''}<br>地勢：${hero.dizhi_state||''}<br>骨重 <strong style="color:#7AB860">${hero.bone_weight||''}</strong>｜起運 <strong style="color:#7AB860">${hero.qiyun||''}</strong></div>
  <div class="scroll-hint">向下探索</div>
</section>
${sectionsHTML}
<div class="verdict">
  <div class="verdict-main">${verdict.main||''}</div>
  <div class="verdict-text">${verdictLines}<br><br><em style="color:#7AB860;font-size:.9rem;">${verdict.footer||''}</em></div>
  <div class="verdict-seal">命盤深度解讀</div>
</div>
</div>
<script>
const observer=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}});},{threshold:0.08});
document.querySelectorAll('.card,.yun-card,.shensha-item,.warning-box,.oppo-box,.bone-display').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(16px)';el.style.transition='opacity .7s ease,transform .7s ease';observer.observe(el);});
<\/script>
</body></html>`;

        res.status(200).send(html);

    } catch (error) {
        res.status(500).send(`<div style="color:#7AB860;padding:40px;font-family:monospace;background:#000;min-height:100vh;"><p style="font-size:1.2rem;margin-bottom:16px;">觀測中斷</p><p>${error.message}</p></div>`);
    }
};
