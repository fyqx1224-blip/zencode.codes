// ═══════════════════════════════════════════════════════
//  ZenCode 反饋洞察 API · api/insight.js
//  · 從 Supabase 讀取所有反饋，聚合後交給 Gemini 分析
//  · 密碼保護：請求 Header 帶 x-admin-key，值需匹配 ADMIN_KEY 環境變量
//  · 依賴環境變量：SUPABASE_URL / SUPABASE_KEY / GEMINI_API_KEY / ADMIN_KEY
// ═══════════════════════════════════════════════════════

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── 密碼驗證 ────────────────────────────────────────
  const { SUPABASE_URL, SUPABASE_KEY, GEMINI_API_KEY, ADMIN_KEY } = process.env;
  const reqKey = req.headers['x-admin-key'] || (req.body || {}).adminKey;
  if (!ADMIN_KEY || reqKey !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Missing env variables' });
  }

  try {
    const { days = 90, minCount = 1 } = req.body || {};

    // ── 1. 從 Supabase 拉取反饋數據 ─────────────────────
    const since = new Date(Date.now() - days * 86400_000).toISOString();
    const sbRes = await fetch(
      `${SUPABASE_URL}/rest/v1/feedback?created_at=gte.${since}&order=created_at.desc&limit=500`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!sbRes.ok) throw new Error(`Supabase fetch failed: ${sbRes.status}`);
    const rows = await sbRes.json();

    if (!rows.length) {
      return res.status(200).json({ ok: true, report: null, summary: { total: 0 }, rawCount: 0 });
    }

    // ── 2. 本地聚合統計 ──────────────────────────────────
    const total        = rows.length;
    const avgRating    = (rows.reduce((s, r) => s + (r.rating || 0), 0) / total).toFixed(2);
    const byLang       = {};
    const fieldCount   = {};
    const lowRating    = rows.filter(r => r.rating <= 2);
    const highRating   = rows.filter(r => r.rating >= 4);

    rows.forEach(r => {
      // 語言分佈
      byLang[r.lang || 'zh-TW'] = (byLang[r.lang || 'zh-TW'] || 0) + 1;
      // 欄位統計（用歸一化欄位，跨語言一致）
      const fields = r.wrong_fields_normalized || r.wrong_fields || [];
      fields.forEach(f => { fieldCount[f] = (fieldCount[f] || 0) + 1; });
    });

    // 欄位排序
    const fieldRanking = Object.entries(fieldCount)
      .sort((a, b) => b[1] - a[1])
      .map(([field, count]) => ({ field, count, pct: ((count / total) * 100).toFixed(1) }));

    // 抽樣低分反饋的文字（最多 20 條，優先有 correction 的）
    const lowSamples = lowRating
      .filter(r => r.correction_normalized || r.correction || r.actual_outcome)
      .slice(0, 20)
      .map(r => ({
        ganzhi:     r.ganzhi,
        ri_zhu:     r.ri_zhu,
        rating:     r.rating,
        fields:     (r.wrong_fields_normalized || r.wrong_fields || []).join('、'),
        correction: r.correction_normalized || r.correction || '',
        outcome:    r.actual_outcome || '',
      }));

    // 高分反饋樣本（最多 10 條）
    const highSamples = highRating
      .filter(r => r.actual_outcome)
      .slice(0, 10)
      .map(r => ({
        ganzhi: r.ganzhi,
        ri_zhu: r.ri_zhu,
        rating: r.rating,
        outcome: r.actual_outcome,
      }));

    const summary = { total, avgRating, byLang, fieldRanking, lowCount: lowRating.length, highCount: highRating.length };

    // ── 3. 組裝 Gemini Prompt ─────────────────────────────
    const prompt = `你是一位命理系統的數據分析師，同時精通八字命理。
以下是命理推演平台在過去 ${days} 天內收到的 ${total} 條用戶反饋數據，請深度分析並給出具體的系統改進建議。

═══════════════════════════
一、整體統計摘要
═══════════════════════════
總反饋數：${total} 條
平均評分：${avgRating} / 5.0
低分（1-2星）：${lowRating.length} 條（${((lowRating.length/total)*100).toFixed(1)}%）
高分（4-5星）：${highRating.length} 條（${((highRating.length/total)*100).toFixed(1)}%）

語言分佈：
${Object.entries(byLang).map(([l,c]) => `  ${l}：${c} 條`).join('\n')}

最常被反映不準確的欄位（按頻次排序）：
${fieldRanking.length ? fieldRanking.map(f => `  ${f.field}：${f.count} 次（${f.pct}%）`).join('\n') : '  無欄位反饋'}

═══════════════════════════
二、低分反饋詳細樣本（評分 1-2 星）
═══════════════════════════
${lowSamples.length ? lowSamples.map((s, i) => `
【樣本 ${i+1}】
四柱：${s.ganzhi || '未填'}　日主：${s.ri_zhu || '未知'}　評分：${s.rating}星
反映問題：${s.fields || '無'}
用戶糾正：${s.correction || '（未填）'}
實際經歷：${s.outcome || '（未填）'}
`).join('') : '（暫無低分文字反饋）'}

═══════════════════════════
三、高分反饋用戶實際經歷（評分 4-5 星）
═══════════════════════════
${highSamples.length ? highSamples.map((s, i) => `
【樣本 ${i+1}】四柱：${s.ganzhi || '未填'}　評分：${s.rating}星
${s.outcome}
`).join('') : '（暫無高分文字反饋）'}

═══════════════════════════
請依據以上數據，輸出嚴格的 JSON 格式分析報告，結構如下：
═══════════════════════════

{
  "overview": "整體數據解讀（2-3句，指出最顯著的信號）",
  "top_issues": [
    {
      "field": "問題欄位名稱",
      "frequency": "出現頻次",
      "diagnosis": "這個欄位為什麼用戶反映不準？從命理角度分析根本原因（100-150字）",
      "fix_direction": "具體建議如何調整 AI Prompt 或算法邏輯（50-100字）"
    }
  ],
  "pattern_analysis": "從低分樣本中發現的命盤規律性偏差（例如：某類格局、某類日主、某類大運組合特別容易出錯）（150-200字）",
  "prompt_suggestions": [
    "具體的 Prompt 改進建議1（可直接貼入 analyze.js 的 prompt）",
    "具體的 Prompt 改進建議2",
    "具體的 Prompt 改進建議3"
  ],
  "positive_signals": "高分反饋中哪些判斷最受認可，說明系統在哪些方面做得好（100字）",
  "priority_action": "本周最值得優先處理的一個改進點（50字以內，具體可執行）"
}

只輸出 JSON，不加任何說明或 markdown 符號。`;

    // ── 4. 調用 Gemini ───────────────────────────────────
    const gemRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 3000, temperature: 0.3 },
        }),
      }
    );
    if (!gemRes.ok) throw new Error(`Gemini API failed: ${gemRes.status}`);
    const gemData = await gemRes.json();
    const rawText = gemData?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // 清洗可能的 markdown 包裹
    const cleanText = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    let report;
    try {
      report = JSON.parse(cleanText);
    } catch {
      report = { parse_error: true, raw: rawText };
    }

    // ── 5. 把本次分析結果存回 Supabase（可選，作為歷史記錄）──
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/insight_reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          days_range:  days,
          total_count: total,
          avg_rating:  parseFloat(avgRating),
          report_json: report,
        }),
      });
    } catch (e) {
      // 存歷史失敗不影響返回結果
      console.warn('insight_reports insert failed:', e.message);
    }

    return res.status(200).json({ ok: true, summary, report, rawCount: total });

  } catch (err) {
    console.error('insight handler error:', err);
    return res.status(500).json({ error: err.message });
  }
};
