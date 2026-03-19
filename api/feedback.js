// ═══════════════════════════════════════════════════════
//  ZenCode 反饋收集 API · api/feedback.js
//  · 將任意語言的 wrong_fields / correction 統一歸一化為標準中文後存庫
//  · 依賴：SUPABASE_URL / SUPABASE_KEY / GEMINI_API_KEY
// ═══════════════════════════════════════════════════════

// 標準欄位集（中文基準，所有語言最終映射到這裡）
const STANDARD_FIELDS = ['格局定性','五行分析','大運判斷','流年預測','婚姻感情','事業財運','健康宮位','神煞吉凶','整體偏差','其他'];

// 各語言的欄位顯示名 → 本地快速映射
const FIELD_MAP = {
  'zh-TW': { '格局定性':'格局定性','五行分析':'五行分析','大運判斷':'大運判斷','流年預測':'流年預測','婚姻感情':'婚姻感情','事業財運':'事業財運','健康宮位':'健康宮位','神煞吉凶':'神煞吉凶','整體偏差':'整體偏差','其他':'其他' },
  'zh-CN': { '格局定性':'格局定性','五行分析':'五行分析','大运判断':'大運判斷','流年预测':'流年預測','婚姻感情':'婚姻感情','事业财运':'事業財運','健康宫位':'健康宮位','神煞吉凶':'神煞吉凶','整体偏差':'整體偏差','其他':'其他' },
  'en':    { 'Chart Pattern':'格局定性','Five Elements':'五行分析','Luck Cycles':'大運判斷','Annual Cycles':'流年預測','Relationships':'婚姻感情','Career & Wealth':'事業財運','Health':'健康宮位','Divine Stars':'神煞吉凶','Overall Accuracy':'整體偏差','Other':'其他' },
  'ko':    { '격국 정의':'格局定性','오행 분석':'五行分析','대운 판단':'大運判斷','유년 예측':'流年預測','결혼·연애':'婚姻感情','직업·재운':'事業財運','건강궁위':'健康宮位','신살 길흉':'神煞吉凶','전반적 오차':'整體偏差','기타':'其他' },
};

function normalizeFieldsLocal(fields, lang) {
  const map = FIELD_MAP[lang] || FIELD_MAP['zh-TW'];
  return fields.map(f => {
    if (STANDARD_FIELDS.includes(f)) return f;
    if (map[f]) return map[f];
    for (const m of Object.values(FIELD_MAP)) { if (m[f]) return m[f]; }
    return '其他';
  });
}

async function normalizeCorrectionWithAI(correction, lang, apiKey) {
  if (!correction || correction.length < 5) return correction;
  if (lang === 'zh-TW' || lang === 'zh-CN') return correction;
  if (!apiKey) return correction;

  const langName = lang === 'en' ? '英文' : '韓文';
  const prompt = `你是命理數據標準化助手。下面是用戶用「${langName}」提交的命盤反饋糾正內容。請將其翻譯成繁體中文，保留所有命理術語的原意，僅輸出翻譯結果，不加任何說明。\n\n原文：${correction}`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:512,temperature:0.1} }) }
    );
    const data = await r.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || correction;
  } catch(e) {
    console.warn('normalization AI failed, storing original:', e.message);
    return correction;
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const { SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) return res.status(500).json({ error: 'Missing Supabase credentials' });

  try {
    const { name, ganzhi, ri_zhu, rating, wrong_fields, correction, actual_outcome, lang } = req.body || {};
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'rating must be 1–5' });

    const userLang  = lang || 'zh-TW';
    const rawFields = Array.isArray(wrong_fields) ? wrong_fields : [];

    const [normalizedFields, normalizedCorrection] = await Promise.all([
      Promise.resolve(normalizeFieldsLocal(rawFields, userLang)),
      normalizeCorrectionWithAI(correction || '', userLang, GEMINI_API_KEY || ''),
    ]);

    const payload = {
      name:                    name           || null,
      ganzhi:                  ganzhi         || null,
      ri_zhu:                  ri_zhu         || null,
      rating:                  Number(rating),
      wrong_fields:            rawFields,
      wrong_fields_normalized: normalizedFields,
      correction:              correction     || null,
      correction_normalized:   normalizedCorrection || null,
      actual_outcome:          actual_outcome || null,
      lang:                    userLang,
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'apikey':SUPABASE_KEY, 'Authorization':`Bearer ${SUPABASE_KEY}`, 'Prefer':'return=minimal' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Supabase error:', errText);
      return res.status(500).json({ error: 'Database write failed', detail: errText });
    }

    return res.status(200).json({ ok: true });
  } catch(err) {
    console.error('feedback handler error:', err);
    return res.status(500).json({ error: err.message });
  }
};
