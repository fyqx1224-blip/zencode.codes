// ═══════════════════════════════════════════════════════
//  ZenCode 反饋收集 API · api/feedback.js
//  依賴：Supabase（環境變量 SUPABASE_URL / SUPABASE_KEY）
// ═══════════════════════════════════════════════════════
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { SUPABASE_URL, SUPABASE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Missing Supabase credentials' });
  }

  try {
    const body = req.body || {};
    const { name, ganzhi, ri_zhu, rating, wrong_fields, correction, actual_outcome, lang } = body;

    // 基本驗證
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating must be 1–5' });
    }

    const payload = {
      name:           name           || null,
      ganzhi:         ganzhi         || null,
      ri_zhu:         ri_zhu         || null,
      rating:         Number(rating),
      wrong_fields:   Array.isArray(wrong_fields) ? wrong_fields : [],
      correction:     correction     || null,
      actual_outcome: actual_outcome || null,
      lang:           lang           || 'zh-TW',
    };

    const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Supabase error:', errText);
      return res.status(500).json({ error: 'Database write failed', detail: errText });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('feedback handler error:', err);
    return res.status(500).json({ error: err.message });
  }
};
