// ═══════════════════════════════════════════════════
// ZenCode 八字分析 API · api/analyze.js
// · IP 限流：每個 IP 每 60 秒最多 1 次請求（Upstash Redis）
// ═══════════════════════════════════════════════════

// Upstash Redis REST 封裝（不需要安裝任何套件）
const redis = {
    async get(key) {
        const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
        if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return null;
        const r = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`, {
            headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
        });
        const d = await r.json();
        return d.result ?? null;
    },
    async set(key, value, ex) {
        const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
        if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return;
        await fetch(`${UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}/${value}?EX=${ex}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
        });
    },
    async ttl(key) {
        const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
        if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return 60;
        const r = await fetch(`${UPSTASH_REDIS_REST_URL}/ttl/${encodeURIComponent(key)}`, {
            headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
        });
        const d = await r.json();
        return d.result ?? 60;
    }
};

// ═══════════════════════════════════════════════════
// 五行主題色系（根據日主天干自動切換）
// ═══════════════════════════════════════════════════
const WUXING_THEMES = {
  木: {
    // 甲、乙 — 蒼翠森綠
    bg:         '#04080A',
    bg2:        '#060E0A',
    primary:    '#5AB86C',
    bright:     '#7AE08E',
    dim:        'rgba(90,184,108,0.16)',
    glow:       'rgba(90,184,108,0.32)',
    accent:     '#A8D890',
    bodyBefore: 'radial-gradient(ellipse at 22% 48%,rgba(90,184,108,.09) 0%,transparent 60%),radial-gradient(ellipse at 76% 22%,rgba(168,216,144,.05) 0%,transparent 55%),radial-gradient(ellipse at 52% 80%,rgba(40,120,60,.05) 0%,transparent 50%)',
    heroGrad:   'linear-gradient(160deg,#C8F0D8 0%,#5AB86C 38%,#2A7040 68%,#5AB86C 100%)',
    verdictGrad:'linear-gradient(135deg,#5AB86C 0%,#A8D890 50%,#2A9050 100%)',
    cardBefore: '#5AB86C',
    analogyBorder: '#3A8C50',
    analogyBg:  'rgba(58,140,80,.08)',
    analogyColor:'#3A8C50',
    emblemAnim: 'pulse-theme',
    scrollHint: 'linear-gradient(180deg,#aaa,transparent)',
    sectionBorder:'rgba(90,184,108,.1)',
    label:      '木',
  },
  火: {
    // 丙、丁 — 烈焰朱紅
    bg:         '#090503',
    bg2:        '#120806',
    primary:    '#D85030',
    bright:     '#F07848',
    dim:        'rgba(216,80,48,0.16)',
    glow:       'rgba(216,80,48,0.32)',
    accent:     '#F0A878',
    bodyBefore: 'radial-gradient(ellipse at 22% 48%,rgba(216,80,48,.09) 0%,transparent 60%),radial-gradient(ellipse at 76% 22%,rgba(240,120,64,.06) 0%,transparent 55%),radial-gradient(ellipse at 52% 80%,rgba(180,60,30,.05) 0%,transparent 50%)',
    heroGrad:   'linear-gradient(160deg,#F8D8C0 0%,#D85030 38%,#902010 68%,#D85030 100%)',
    verdictGrad:'linear-gradient(135deg,#D85030 0%,#F0A878 50%,#B03018 100%)',
    cardBefore: '#D85030',
    analogyBorder: '#B04020',
    analogyBg:  'rgba(176,64,32,.08)',
    analogyColor:'#D06040',
    emblemAnim: 'pulse-theme',
    scrollHint: 'linear-gradient(180deg,#aaa,transparent)',
    sectionBorder:'rgba(216,80,48,.1)',
    label:      '火',
  },
  土: {
    // 戊、己 — 沉穩黃土
    bg:         '#090807',
    bg2:        '#100E08',
    primary:    '#C8A040',
    bright:     '#E0C060',
    dim:        'rgba(200,160,64,0.16)',
    glow:       'rgba(200,160,64,0.32)',
    accent:     '#D8B870',
    bodyBefore: 'radial-gradient(ellipse at 22% 48%,rgba(200,160,64,.08) 0%,transparent 60%),radial-gradient(ellipse at 76% 22%,rgba(216,184,112,.05) 0%,transparent 55%),radial-gradient(ellipse at 52% 80%,rgba(160,120,40,.05) 0%,transparent 50%)',
    heroGrad:   'linear-gradient(160deg,#F0E0B0 0%,#C8A040 38%,#806010 68%,#C8A040 100%)',
    verdictGrad:'linear-gradient(135deg,#C8A040 0%,#E0C060 50%,#A07820 100%)',
    cardBefore: '#C8A040',
    analogyBorder: '#907020',
    analogyBg:  'rgba(144,112,32,.08)',
    analogyColor:'#B09030',
    emblemAnim: 'pulse-theme',
    scrollHint: 'linear-gradient(180deg,#aaa,transparent)',
    sectionBorder:'rgba(200,160,64,.1)',
    label:      '土',
  },
  金: {
    // 庚、辛 — 清冷白金
    bg:         '#07080A',
    bg2:        '#0A0C10',
    primary:    '#A0B0C8',
    bright:     '#C0D0E8',
    dim:        'rgba(160,176,200,0.16)',
    glow:       'rgba(160,176,200,0.30)',
    accent:     '#D8E4F4',
    bodyBefore: 'radial-gradient(ellipse at 22% 48%,rgba(160,176,200,.07) 0%,transparent 60%),radial-gradient(ellipse at 76% 22%,rgba(200,216,240,.05) 0%,transparent 55%),radial-gradient(ellipse at 52% 80%,rgba(100,120,160,.05) 0%,transparent 50%)',
    heroGrad:   'linear-gradient(160deg,#EEF2F8 0%,#A0B0C8 38%,#607090 68%,#A0B0C8 100%)',
    verdictGrad:'linear-gradient(135deg,#A0B0C8 0%,#C0D0E8 50%,#7080A0 100%)',
    cardBefore: '#A0B0C8',
    analogyBorder: '#708090',
    analogyBg:  'rgba(112,128,144,.07)',
    analogyColor:'#8090A8',
    emblemAnim: 'pulse-theme',
    scrollHint: 'linear-gradient(180deg,#aaa,transparent)',
    sectionBorder:'rgba(160,176,200,.1)',
    label:      '金',
  },
  水: {
    // 壬、癸 — 深邃玄水
    bg:         '#040609',
    bg2:        '#060A12',
    primary:    '#4080C8',
    bright:     '#60A8F0',
    dim:        'rgba(64,128,200,0.16)',
    glow:       'rgba(64,128,200,0.32)',
    accent:     '#80C0F8',
    bodyBefore: 'radial-gradient(ellipse at 22% 48%,rgba(64,128,200,.09) 0%,transparent 60%),radial-gradient(ellipse at 76% 22%,rgba(96,168,240,.05) 0%,transparent 55%),radial-gradient(ellipse at 52% 80%,rgba(30,80,160,.06) 0%,transparent 50%)',
    heroGrad:   'linear-gradient(160deg,#C0D8F8 0%,#4080C8 38%,#184878 68%,#4080C8 100%)',
    verdictGrad:'linear-gradient(135deg,#4080C8 0%,#80C0F8 50%,#1858A0 100%)',
    cardBefore: '#4080C8',
    analogyBorder: '#2858A0',
    analogyBg:  'rgba(40,88,160,.08)',
    analogyColor:'#3870B8',
    emblemAnim: 'pulse-theme',
    scrollHint: 'linear-gradient(180deg,#aaa,transparent)',
    sectionBorder:'rgba(64,128,200,.1)',
    label:      '水',
  },
};

const TG_LIST   = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const TG_WUXING = ['木','木','火','火','土','土','金','金','水','水'];

module.exports = async function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if (req.method !== 'POST') {
        return res.status(405).send('<div>只接受 POST 請求</div>');
    }

    // ── IP 限流：每個 IP 每 60 秒最多 1 次 ──────────────
    const COOLDOWN = 60; // 秒
    if (redis) {
        try {
            const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
                    || req.headers['x-real-ip']
                    || req.socket?.remoteAddress
                    || 'unknown';
            const kvKey = `rl:${ip}`;
            const existing = await redis.get(kvKey);
            if (existing) {
                const ttl = await redis.ttl(kvKey);
                res.setHeader('Content-Type', 'application/json');
                return res.status(429).json({ retryAfter: Math.max(ttl, 1) });
            }
            // 請求放行，寫入冷卻 key（在報告生成後設定，避免失敗時白白鎖住）
            req._rl_ip = ip;
        } catch(e) {
            // KV 故障時降級放行，不影響主流程
            console.warn('Redis rate limit check failed:', e.message);
        }
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("找不到 GEMINI_API_KEY");

        const body = req.body || {};
        const { name, gender, birthday, birthplace, pillars, ganzhiString,
                riZhu, riZhuTg, nayin, dizhi_state, boneWeight, dayun,
                lang, langInstruction } = body;

        if (!name || !pillars) throw new Error("缺少必要資料");

        // ── 根據日主天干決定五行主題 ──
        const riTgIdx = TG_LIST.indexOf(riZhuTg || '甲');
        const riWuxing = TG_WUXING[Math.max(0, riTgIdx)] || '木';
        const T = WUXING_THEMES[riWuxing];

        // ── 把所有前端已算好的值整理成文字，直接填進 prompt ──
        const pillarDesc = pillars.map(p =>
            `${p.label}【${p.tg}${p.dz}】天干:${p.tg}(${p.tgWuxing},十神:${p.tenGod}) 地支:${p.dz}(${p.dzWuxing},地勢:${p.wangshuan})`
        ).join('\n');

        const dayunDesc = dayun.list.map(d => `${d.age} ${d.stem}`).join('、');

        // ── 把大運列表直接構建為 JSON（不讓 AI 填）──
        const yunliuJSON = dayun.list.map(d =>
            `{ "age": "${d.age}", "stem": "${d.stem}", "stemClass": "${d.tgClass}", "desc": "（此大運對${riZhuTg}日主的影響，結合本命格局分析）", "active": false }`
        ).join(',\n        ');

        // ── 把四柱 pillars 直接構建為 JSON（不讓 AI 填）──
        const pillarsJSON = pillars.map(p =>
            `{ "label": "${p.label}", "tg": "${p.tg}", "tgClass": "${p.tgClass}", "dz": "${p.dz}", "dzClass": "${p.dzClass}", "tenGod": "${p.tenGod}" }`
        ).join(',\n      ');

        // ── 語言指令：英韓版在 prompt 最前面注入，中文版不變 ──
        const langBlock = langInstruction
            ? `${langInstruction}\n\n`
            : '';

        const prompt = `${langBlock}你是一位熟悉傳統命理的分析師，依據《滴天髓》《淵海子平》《三命通會》《子平真詮》《神峰通考》《窮通寶鑒》的理論框架，對以下命盤進行客觀、深入的文字解讀。

【⚠️ 重要：以下所有八字數據由精確演算法計算完畢，請直接使用這些數值進行分析，絕對不得自行重新推算或修改任何干支、納音、地勢、骨重數字】

命主資料：
姓名：${name}
性別：${gender}
出生：${birthday}
出生地：${birthplace}

四柱八字（已精確計算）：
${pillarDesc}

八字組合：${ganzhiString}
日主：${riZhuTg}（${riZhu}）五行屬${riWuxing}
納音（已算定）：${nayin}
十二長生地勢（已算定）：${dizhi_state}
稱骨骨重（已算定）：${boneWeight}
大運起運年齡（已算定）：${dayun.startAge}歲
大運排列（已算定）：${dayunDesc}

【你的任務：只撰寫文字解讀內容，所有數字欄位已由系統填入，請勿修改】
【語氣要求：中肯、客觀、具體。避免空洞的激勵語言、誇大吉凶、過度詩化。分析應基於八字結構本身，指出優勢也需說明條件，指出風險也需給出應對方向。】
【解讀框架·請逐項完整分析】
壹、格局鑑定（正格vs特殊格局、身強身弱、調候用神vs扶抑用神）
貳、十神心理原型對照（每個主要十神的心理分析，每個至少200字）
叁、宮位生活映射（四柱各階段人生，含刑沖合害具象化表格）
肆、天干地支互動分析（天干合化、地支三合六合六衝三刑六害）
伍、大運流年交叉分析（全部8個大運的逐一簡析、2025乙巳年、2026丙午年詳析）
陸、神煞解讀（天乙貴人、文昌、驛馬、桃花、羊刃、魁罡等）
柒、稱骨訣白話詮釋（${boneWeight}的命格解析）
捌、當前機會與地雷（最值得把握的3個機會、最需警惕的3個地雷）

請嚴格按照以下 JSON 格式輸出，只填寫「文字分析內容」的部分（即帶有「請填寫」標記的欄位），帶有【已填入】標記的欄位值不得修改：

{
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
          "analogy": "（選填：若有適切比喻再填，否則留空字串）"
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
          "paragraphs": ["（充分說明此十神在日主五行格局下的具體表現，結合命盤結構，避免套語）", "（如有必要可補充段落2）"],
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
        { "age": "${dayun.list[0]?.age||''}", "stem": "${dayun.list[0]?.stem||''}", "stemClass": "${dayun.list[0]?.tgClass||''}", "desc": "（此大運簡析）", "active": false },
        { "age": "${dayun.list[1]?.age||''}", "stem": "${dayun.list[1]?.stem||''}", "stemClass": "${dayun.list[1]?.tgClass||''}", "desc": "（此大運簡析）", "active": false },
        { "age": "${dayun.list[2]?.age||''}", "stem": "${dayun.list[2]?.stem||''}", "stemClass": "${dayun.list[2]?.tgClass||''}", "desc": "（此大運簡析）", "active": false },
        { "age": "${dayun.list[3]?.age||''}", "stem": "${dayun.list[3]?.stem||''}", "stemClass": "${dayun.list[3]?.tgClass||''}", "desc": "（此大運簡析）", "active": false },
        { "age": "${dayun.list[4]?.age||''}", "stem": "${dayun.list[4]?.stem||''}", "stemClass": "${dayun.list[4]?.tgClass||''}", "desc": "（此大運簡析）", "active": false },
        { "age": "${dayun.list[5]?.age||''}", "stem": "${dayun.list[5]?.stem||''}", "stemClass": "${dayun.list[5]?.tgClass||''}", "desc": "（此大運簡析）", "active": false },
        { "age": "${dayun.list[6]?.age||''}", "stem": "${dayun.list[6]?.stem||''}", "stemClass": "${dayun.list[6]?.tgClass||''}", "desc": "（此大運簡析）", "active": false },
        { "age": "${dayun.list[7]?.age||''}", "stem": "${dayun.list[7]?.stem||''}", "stemClass": "${dayun.list[7]?.tgClass||''}", "desc": "（此大運簡析）", "active": false }
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
      "subtitle": "BONE WEIGHT · INNATE CAPACITY · POTENTIAL",
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
      "num": "捌",
      "title": "近期值得關注的方向與需留意的風險",
      "subtitle": "NOW · OPPORTUNITY · WARNING",
      "opportunities": [
        "（方向1）：（說明此時機的命理依據，及建議如何把握，具體可操作）",
        "（方向2）：（說明）",
        "（方向3）：（說明）"
      ],
      "warnings": [
        "（風險1）：（說明此風險的命理依據及建議應對方式）",
        "（風險2）：（說明）",
        "（風險3）：（說明）"
      ]
    }
  ],
  "verdict": {
    "main": "（四字結語，如：甲木向陽）",
    "text": "（總結，用\\n換行，6-8行，說明命主的核心格局特徵、優勢與主要課題，語氣平實）",
    "footer": "（一句簡短的實用提示，針對此命盤的核心建議）"
  }
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.35,
                        maxOutputTokens: 16000,
                        responseMimeType: "application/json"
                    }
                })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            // 429 單獨處理：把 retryDelay 透傳給前端
            if (response.status === 429) {
                const violations = data?.error?.details?.find(d => d['@type']?.includes('RetryInfo'));
                const retrySeconds = parseInt((violations?.retryDelay || '60s').replace('s','')) || 60;
                return res.status(429).json({ retryAfter: retrySeconds });
            }
            throw new Error(`Google API 錯誤 ${response.status}: ${JSON.stringify(data)}`);
        }

        let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();

        let d;
        try { d = JSON.parse(raw); }
        catch(e) { throw new Error('JSON解析失敗：' + e.message + ' | 原始內容前300字：' + raw.substring(0, 300)); }

        // ══════════════════════════════════════════
        // 渲染函數
        // ══════════════════════════════════════════
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
        // hero 區塊的固定數字欄位：全部用後端從前端收到的已算定值覆蓋，不用AI輸出的值
        const heroNayin      = nayin;         // 前端算好的納音字串
        const heroDizhiState = dizhi_state;   // 前端算好的地勢字串
        const heroBoneWeight = boneWeight;    // 前端算好的骨重
        const heroQiyun      = `${dayun.startAge}歲起運`;
        const heroEmblem     = riZhuTg;
        const heroSubtitle   = `${ganzhiString}｜${riZhuTg}${gender === '女' ? '女' : '男'}命深度解讀`;

        // 四柱直接用前端傳來的數據渲染，不用AI輸出的pillars
        const pillarsHTML = pillars.map(p => `
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
                sectionsHTML += `<div class="oppo-box"><h3>🌱 當前機會（2025–2026）</h3><ul>`;
                sec.opportunities.forEach(o => { sectionsHTML += `<li>${o}</li>`; });
                sectionsHTML += `</ul></div><div class="warning-box"><h3>⚡ 當前雷點</h3><ul>`;
                sec.warnings.forEach(w => { sectionsHTML += `<li>${w}</li>`; });
                sectionsHTML += `</ul></div>`;
            }
            sectionsHTML += `</section>`;
        }

        const verdict = d.verdict || {};
        const verdictLines = (verdict.text||'').split('\\n').join('<br>');

        // ══════════════════════════════════════════
        // HTML 模板 — 所有主色全部使用 CSS var(--p) 等變量
        // ══════════════════════════════════════════
        const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>八字深度解讀｜${name}｜${riZhuTg}${riWuxing}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700;900&family=Noto+Sans+TC:wght@300;400;500&family=Ma+Shan+Zheng&display=swap" rel="stylesheet">
<style>
/* ── 五行主題變量（${riWuxing}命：${riZhuTg}） ── */
:root {
  --p:   ${T.primary};
  --pb:  ${T.bright};
  --pd:  ${T.dim};
  --pg:  ${T.glow};
  --ac:  ${T.accent};
  --bg:  ${T.bg};
  --bg2: ${T.bg2};
  --cb:  ${T.cardBefore};
  --ab:  ${T.analogyBorder};
  --abg: ${T.analogyBg};
  --ac2: ${T.analogyColor};
}

*{margin:0;padding:0;box-sizing:border-box;}
html,body{background:var(--bg)!important;color:#F0EAD6;font-family:'Noto Serif TC',serif;overflow-x:hidden;position:relative;}

/* 五行氛圍背景光暈 */
body::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:${T.bodyBefore};
}
/* 膠片噪點 */
body::after{
  content:'';position:fixed;inset:-200%;pointer-events:none;z-index:1;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  opacity:.3;animation:grain .5s steps(1) infinite;
}
@keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}20%{transform:translate(3%,2%)}30%{transform:translate(-1%,4%)}40%{transform:translate(2%,-1%)}50%{transform:translate(-3%,2%)}60%{transform:translate(1%,-2%)}70%{transform:translate(3%,3%)}80%{transform:translate(-2%,1%)}90%{transform:translate(1%,-3%)}}

.container{position:relative;z-index:2;max-width:900px;margin:0 auto;padding:0 24px 80px;}

/* ── HERO ── */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;padding:60px 0;}
.hero-emblem{
  font-family:'Ma Shan Zheng',cursive;
  font-size:clamp(6rem,15vw,12rem);
  color:var(--p);line-height:1;margin-bottom:16px;
  text-shadow:0 0 60px var(--pg),0 0 120px var(--pd);
  animation:pulse-theme 4s ease-in-out infinite;
}
@keyframes pulse-theme{
  0%,100%{text-shadow:0 0 60px var(--pg),0 0 120px var(--pd)}
  50%{text-shadow:0 0 100px var(--pb),0 0 200px var(--pg)}
}
.hero-subtitle{font-family:'Noto Sans TC',sans-serif;font-size:.75rem;letter-spacing:.5em;color:var(--p);margin-bottom:32px;}
.four-pillars{display:flex;gap:2px;margin:32px 0;}
.pillar{display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.03);border:1px solid var(--pd);padding:20px 16px;transition:all .4s ease;min-width:80px;cursor:default;}
.pillar:hover{border-color:var(--p);transform:translateY(-4px);box-shadow:0 8px 24px var(--pd);}
.pillar-label{font-size:.6rem;letter-spacing:.3em;color:rgba(240,234,214,0.5);margin-bottom:12px;font-family:'Noto Sans TC',sans-serif;}
.pillar-tg{font-family:'Ma Shan Zheng',cursive;font-size:2.2rem;line-height:1;margin-bottom:4px;}
.pillar-dz{font-family:'Ma Shan Zheng',cursive;font-size:2.2rem;line-height:1;}
.pillar-ten-god{font-size:.65rem;color:rgba(240,234,214,0.45);margin-top:10px;font-family:'Noto Sans TC',sans-serif;}

/* 五行顏色保持不變（用於非日主的干支顯示） */
.fire-c{color:#F07840;}.earth-c{color:#C9A84C;}.metal-c{color:#C8C8D8;}.wood-c{color:#7AB860;}.water-c{color:#63B3ED;}
/* 日主顏色使用主題色 */
.cw{color:#7DE09A;}.cf{color:#F07840;}.ce{color:#D4A843;}.cm{color:#D0D0E0;}.cwa{color:#63B3ED;}

.hero-desc{font-size:.95rem;color:rgba(240,234,214,.65);line-height:2;max-width:520px;font-weight:300;}
.scroll-hint{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(240,234,214,.4);font-size:.65rem;letter-spacing:.3em;font-family:'Noto Sans TC',sans-serif;animation:bounce 2s ease-in-out infinite;}
@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
.scroll-hint::after{content:'';width:1px;height:40px;background:${T.scrollHint};}

/* ── SECTIONS ── */
.section{padding:80px 0;border-top:1px solid ${T.sectionBorder};}
.section-header{display:flex;align-items:baseline;gap:20px;margin-bottom:48px;}
.section-num{font-family:'Ma Shan Zheng',cursive;font-size:3rem;color:var(--p);opacity:.45;line-height:1;}
.section-title{font-size:1.5rem;font-weight:600;color:var(--p);letter-spacing:.1em;}
.section-subtitle{font-size:.75rem;color:rgba(240,234,214,.4);letter-spacing:.3em;font-family:'Noto Sans TC',sans-serif;margin-top:4px;}

/* ── CARDS ── */
.card{background:rgba(255,255,255,.025);border:1px solid var(--pd);padding:28px 32px;margin-bottom:20px;position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--cb);}
.card-title{font-size:1rem;color:var(--pb);font-weight:600;margin-bottom:14px;letter-spacing:.05em;display:flex;align-items:center;gap:10px;}
.card-title::before{content:'◆';font-size:.5rem;color:#F07840;}
.card p{font-size:.9rem;line-height:2;color:#E8E0D0;font-weight:300;}
.card p+p{margin-top:12px;}

/* highlight 框 — 保持語意色，不改變 */
.highlight{background:rgba(99,179,237,.08);border:1px solid rgba(99,179,237,.32);padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#E8E0D0;}
.highlight-gold{background:var(--pd);border:1px solid var(--p);padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#E8E0D0;}
.highlight-warn{background:rgba(212,98,42,.09);border:1px solid rgba(212,98,42,.35);padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#E8E0D0;}
.highlight-special{background:rgba(80,100,200,.09);border:1px solid rgba(120,140,240,.35);padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#E8E0D0;}

/* analogy — 使用五行主題色 */
.analogy{background:var(--abg);border-left:3px solid var(--ab);padding:16px 20px;margin:16px 0;font-size:.88rem;line-height:1.9;color:#DDD8C8;font-style:italic;}
.analogy::before{content:'🌿 白話翻譯｜';font-style:normal;color:var(--ac2);font-size:.8rem;letter-spacing:.1em;}

.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

/* ── 大運 ── */
.yunliu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:12px;margin-top:24px;}
.yun-card{background:rgba(255,255,255,.02);border:1px solid var(--pd);padding:18px 16px;position:relative;transition:all .3s;}
.yun-card:hover{border-color:var(--p);background:rgba(255,255,255,.04);transform:translateY(-2px);}
.yun-card.active{border-color:var(--p);background:var(--pd);}
.yun-card.active::after{content:'▶ 當前';position:absolute;top:8px;right:10px;font-size:.6rem;color:var(--p);font-family:'Noto Sans TC',sans-serif;}
.yun-age{font-size:.65rem;color:rgba(240,234,214,.4);margin-bottom:6px;font-family:'Noto Sans TC',sans-serif;letter-spacing:.15em;}
.yun-stem{font-family:'Ma Shan Zheng',cursive;font-size:1.8rem;line-height:1;color:#F0EAD6;}
.yun-desc{font-size:.72rem;color:rgba(240,234,214,.6);margin-top:8px;line-height:1.6;font-family:'Noto Sans TC',sans-serif;}

/* ── 神煞 ── */
.shensha-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
.shensha-item{border:1px solid var(--pd);padding:18px 20px;background:rgba(255,255,255,.02);}
.shensha-name{font-size:1.1rem;font-weight:600;margin-bottom:8px;}
.shensha-desc{font-size:.82rem;color:#D0CAB8;line-height:1.8;font-family:'Noto Sans TC',sans-serif;font-weight:300;}

/* ── 稱骨 ── */
.bone-display{display:flex;align-items:center;gap:40px;padding:40px;background:var(--pd);border:1px solid var(--p);margin:24px 0;opacity:.9;}
.bone-num{font-family:'Ma Shan Zheng',cursive;font-size:5rem;color:var(--p);line-height:1;text-shadow:0 0 30px var(--pg);}
.bone-unit{font-size:1.2rem;color:rgba(240,234,214,.5);}
.bone-text{flex:1;}
.bone-text p{font-size:.88rem;line-height:2;color:#D8D0C0;font-weight:300;}
.bone-text p+p{margin-top:12px;}

/* ── 機會雷點（固定語意色）── */
.warning-box{background:rgba(212,98,42,.07);border:1px solid rgba(212,98,42,.38);padding:28px 32px;margin:16px 0;}
.warning-box h3{color:#F07840;font-size:1.1rem;margin-bottom:14px;letter-spacing:.1em;}
.warning-box ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
.warning-box ul li{font-size:.88rem;line-height:1.8;color:#E8E0D0;font-weight:300;padding-left:20px;position:relative;}
.warning-box ul li::before{content:'▸';position:absolute;left:0;color:#D4622A;}
.oppo-box{background:rgba(74,140,110,.07);border:1px solid rgba(74,140,110,.38);padding:28px 32px;margin:16px 0;}
.oppo-box h3{color:#6EC49A;font-size:1.1rem;margin-bottom:14px;letter-spacing:.1em;}
.oppo-box ul{list-style:none;display:flex;flex-direction:column;gap:10px;}
.oppo-box ul li{font-size:.88rem;line-height:1.8;color:#E8E0D0;font-weight:300;padding-left:20px;position:relative;}
.oppo-box ul li::before{content:'▸';position:absolute;left:0;color:#6EC49A;}

/* ── VERDICT ── */
.verdict{text-align:center;padding:80px 40px;border-top:1px solid var(--pd);}
.verdict-main{
  font-family:'Ma Shan Zheng',cursive;font-size:clamp(4rem,10vw,7rem);
  color:transparent;
  background:${T.verdictGrad};
  -webkit-background-clip:text;background-clip:text;
  line-height:1;margin-bottom:24px;
  animation:shimmer 3s ease-in-out infinite;
}
@keyframes shimmer{0%,100%{filter:brightness(1)}50%{filter:brightness(1.25)}}
.verdict-text{font-size:1rem;line-height:2.2;color:rgba(240,234,214,.82);max-width:640px;margin:0 auto 32px;font-weight:300;}
.verdict-seal{
  display:inline-block;border:2px solid var(--p);padding:10px 28px;
  font-family:'Ma Shan Zheng',cursive;font-size:1.2rem;color:var(--p);
  letter-spacing:.3em;text-shadow:0 0 20px var(--pg);
}

/* ── 其他通用 ── */
.divider{display:flex;align-items:center;gap:20px;margin:40px 0;opacity:.3;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--p);}
.divider span{font-family:'Ma Shan Zheng',cursive;font-size:1.2rem;color:var(--p);}
.quote{border-left:2px solid var(--p);padding:12px 20px;margin:20px 0;font-size:.85rem;color:rgba(240,234,214,.6);font-style:italic;line-height:1.8;}
.quote cite{display:block;margin-top:8px;font-size:.75rem;color:rgba(240,234,214,.4);font-style:normal;letter-spacing:.1em;}
.interaction-table{width:100%;border-collapse:collapse;font-size:.82rem;font-family:'Noto Sans TC',sans-serif;}
.interaction-table th{padding:10px 16px;text-align:left;background:var(--pd);color:var(--pb);font-weight:500;letter-spacing:.1em;border-bottom:1px solid var(--p);}
.interaction-table td{padding:12px 16px;border-bottom:1px solid var(--pd);color:#D8D0C0;line-height:1.7;vertical-align:top;}
.interaction-table tr:hover td{background:rgba(255,255,255,.02);}
.tag{display:inline-block;padding:3px 10px;font-size:.7rem;border-radius:2px;font-family:'Noto Sans TC',sans-serif;margin:2px;}
.tag-fire{background:rgba(212,98,42,.2);color:#F07840;border:1px solid rgba(212,98,42,.4);}
.tag-earth{background:rgba(180,145,70,.2);color:#C9A84C;border:1px solid rgba(180,145,70,.4);}
.tag-metal{background:rgba(180,165,130,.2);color:#D4C5A0;border:1px solid rgba(180,165,130,.4);}
.tag-wood{background:rgba(92,140,62,.2);color:#9BC46A;border:1px solid rgba(92,140,62,.4);}
.tag-water{background:rgba(43,95,140,.2);color:#7BB8E8;border:1px solid rgba(43,95,140,.4);}
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
  <div class="hero-emblem">${heroEmblem}</div>
  <div class="hero-subtitle">${heroSubtitle}</div>
  <div class="four-pillars">${pillarsHTML}</div>
  <div class="hero-desc">
    納音：${heroNayin}<br>
    地勢：${heroDizhiState}<br>
    骨重 <strong style="color:var(--pb)">${heroBoneWeight}</strong>｜起運 <strong style="color:var(--pb)">${heroQiyun}</strong>
  </div>
  <div class="scroll-hint">向下探索</div>
</section>
${sectionsHTML}
<div class="verdict">
  <div class="verdict-main">${verdict.main||''}</div>
  <div class="verdict-text">
    ${verdictLines}<br><br>
    <em style="color:var(--p);font-size:.9rem;">${verdict.footer||''}</em>
  </div>
  <div class="verdict-seal">命盤深度解讀</div>
</div>
</div>
<script>
const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}});
},{threshold:0.08});
document.querySelectorAll('.card,.yun-card,.shensha-item,.warning-box,.oppo-box,.bone-display').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(16px)';
  el.style.transition='opacity .7s ease,transform .7s ease';
  observer.observe(el);
});
<\/script>
</body></html>`;

        // ── 成功後寫入冷卻 key ──
        if (redis && req._rl_ip) {
            try { await redis.set(`rl:${req._rl_ip}`, 1, COOLDOWN); }
            catch(e) { console.warn('Redis set failed:', e.message); }
        }
        res.status(200).send(html);

    } catch (error) {
        res.status(500).send(`<div style="color:#7AB860;padding:40px;font-family:monospace;background:#000;min-height:100vh;"><p style="font-size:1.2rem;margin-bottom:16px;">觀測中斷</p><p>${error.message}</p></div>`);
    }
};
