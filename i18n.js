// ═══════════════════════════════════════════════════════
//  ZenCode i18n · 多語言翻譯庫
//  支援：zh-TW（繁體）/ zh-CN（簡體）/ en（英文）/ ko（한국어）
//
//  用法：在 HTML 元素加 data-i18n="key"
//        動態文字用 ZCI18n.t('key') 取得
//        語言切換：ZCI18n.setLang('en')
// ═══════════════════════════════════════════════════════
const ZCI18n = (function () {

  // ── 翻譯資料庫 ──────────────────────────────────────
  const DB = {

    /* ══════════════════════════════════
       繁體中文（原版，基準語言）
    ══════════════════════════════════ */
    'zh-TW': {
      // 導航
      'nav.reading':   '命盤推演',
      'nav.about':     '關於我們',
      'nav.privacy':   '隱私政策',
      'nav.terms':     '使用條款',
      // 主頁 Hero
      'hero.tag':      'ZenCode · 命理推演系統',
      'hero.title':    '開啟命運檔案',
      'hero.sub':      '深度流年 · 八字鑑定 · 大運解讀',
      // 日曆切換
      'cal.solar':     '公曆（西曆）',
      'cal.lunar':     '農曆（陰曆）',
      // 表單
      'form.name':     '命主姓名',
      'form.name.ph':  '請輸入姓名',
      'form.gender':   '命主性別',
      'form.gender.ph':'請選擇性別',
      'form.gender.f': '女命',
      'form.gender.m': '男命',
      'form.date':     '出生日期',
      'form.lunar.hint':'✦ 請輸入農曆年月日，系統自動換算公曆',
      'form.year':     '年',
      'form.month':    '月',
      'form.day':      '日',
      'form.year.l':   '年（農）',
      'form.month.l':  '月（農）',
      'form.day.l':    '日（農）',
      'form.leap':     '閏月',
      'form.hour':     '時（24小時制）',
      'form.min':      '分（可選）',
      'form.place':    '出生地點',
      'form.place.ph': '如：四川省成都市',
      // 命盤預覽
      'prev.title':    '命盤預覽（已校正真太陽時）',
      // 提交按鈕
      'btn.submit':    '觀測星象能量',
      // Loading
      'load.sub':      '觀測星象能量 · 推算命盤格局',
      'load.phases':   ['正在校對真太陽時','排布四柱八字','推演大運流年','鑑定格局強弱','觀測五行流通','解析天干地支','計算神煞吉凶'],
      // 錯誤
      'err.lunar':     '農曆換算失敗，請檢查日期',
      'err.fail':      '觀測失敗，請稍後重試',
      // Footer
      'footer.copy':   '© 2025 ZenCode · 命運檔案 · 僅供娛樂參考',
      'footer.about':  '關於我們',
      'footer.privacy':'隱私政策',
      'footer.terms':  '使用條款',
      // 關於頁
      'about.tag':     'About · ZenCode · 命理推演系統',
      'about.title':   '關於我們',
      'about.sub':     '以演算法之精，承千年命學之道',
      // 隱私頁
      'privacy.tag':   'Privacy Policy · 隱私政策',
      'privacy.title': '隱私政策',
      'privacy.sub':   '我們如何收集、使用及保護您的資料',
      // 條款頁
      'terms.tag':     'Terms of Service · 使用條款',
      'terms.title':   '使用條款',
      'terms.sub':     '使用本平台即表示您同意以下條款',
    },

    /* ══════════════════════════════════
       簡體中文
    ══════════════════════════════════ */
    'zh-CN': {
      'nav.reading':   '命盘推演',
      'nav.about':     '关于我们',
      'nav.privacy':   '隐私政策',
      'nav.terms':     '使用条款',
      'hero.tag':      'ZenCode · 命理推演系统',
      'hero.title':    '开启命运档案',
      'hero.sub':      '深度流年 · 八字鉴定 · 大运解读',
      'cal.solar':     '公历（西历）',
      'cal.lunar':     '农历（阴历）',
      'form.name':     '命主姓名',
      'form.name.ph':  '请输入姓名',
      'form.gender':   '命主性别',
      'form.gender.ph':'请选择性别',
      'form.gender.f': '女命',
      'form.gender.m': '男命',
      'form.date':     '出生日期',
      'form.lunar.hint':'✦ 请输入农历年月日，系统自动换算公历',
      'form.year':     '年',
      'form.month':    '月',
      'form.day':      '日',
      'form.year.l':   '年（农）',
      'form.month.l':  '月（农）',
      'form.day.l':    '日（农）',
      'form.leap':     '闰月',
      'form.hour':     '时（24小时制）',
      'form.min':      '分（可选）',
      'form.place':    '出生地点',
      'form.place.ph': '如：四川省成都市',
      'prev.title':    '命盘预览（已校正真太阳时）',
      'btn.submit':    '观测星象能量',
      'load.sub':      '观测星象能量 · 推算命盘格局',
      'load.phases':   ['正在校对真太阳时','排布四柱八字','推演大运流年','鉴定格局强弱','观测五行流通','解析天干地支','计算神煞吉凶'],
      'err.lunar':     '农历换算失败，请检查日期',
      'err.fail':      '观测失败，请稍后重试',
      'footer.copy':   '© 2025 ZenCode · 命运档案 · 仅供娱乐参考',
      'footer.about':  '关于我们',
      'footer.privacy':'隐私政策',
      'footer.terms':  '使用条款',
      'about.tag':     'About · ZenCode · 命理推演系统',
      'about.title':   '关于我们',
      'about.sub':     '以算法之精，承千年命学之道',
      'privacy.tag':   'Privacy Policy · 隐私政策',
      'privacy.title': '隐私政策',
      'privacy.sub':   '我们如何收集、使用及保护您的个人资料',
      'terms.tag':     'Terms of Service · 使用条款',
      'terms.title':   '使用条款',
      'terms.sub':     '使用本平台即表示您同意以下条款',
    },

    /* ══════════════════════════════════
       English
       策略：术语保留汉字 + 括号英文注释
       难以直译的命理词用 transliteration
    ══════════════════════════════════ */
    'en': {
      'nav.reading':   'Chart Reading',
      'nav.about':     'About',
      'nav.privacy':   'Privacy',
      'nav.terms':     'Terms',
      'hero.tag':      'ZenCode · Destiny Chart System',
      'hero.title':    'Open Your Destiny File',
      'hero.sub':      'Annual Cycles · BaZi Analysis · Luck Pillars',
      'cal.solar':     'Solar Calendar',
      'cal.lunar':     'Lunar Calendar',
      'form.name':     'Your Name',
      'form.name.ph':  'Enter your name',
      'form.gender':   'Gender',
      'form.gender.ph':'Select gender',
      'form.gender.f': 'Female',
      'form.gender.m': 'Male',
      'form.date':     'Date of Birth',
      'form.lunar.hint':'✦ Enter lunar date — system converts to solar automatically',
      'form.year':     'Year',
      'form.month':    'Month',
      'form.day':      'Day',
      'form.year.l':   'Year (Lunar)',
      'form.month.l':  'Month (Lunar)',
      'form.day.l':    'Day (Lunar)',
      'form.leap':     'Leap Month',
      'form.hour':     'Hour (24h)',
      'form.min':      'Minute (optional)',
      'form.place':    'Place of Birth',
      'form.place.ph': 'e.g. Chengdu, Sichuan',
      'prev.title':    'Chart Preview (True Solar Time adjusted)',
      'btn.submit':    'Read the Stars',
      'load.sub':      'Casting your destiny chart · Aligning the stars',
      'load.phases':   ['Calibrating True Solar Time','Arranging the Four Pillars 四柱','Projecting Luck Cycles 大運','Assessing Chart Strength','Reading Five Elements 五行','Decoding Stems & Branches','Calculating Divine Stars 神煞'],
      'err.lunar':     'Lunar conversion failed. Please check your date.',
      'err.fail':      'Reading failed. Please try again later.',
      'footer.copy':   '© 2025 ZenCode · Destiny Archive · For entertainment purposes',
      'footer.about':  'About',
      'footer.privacy':'Privacy',
      'footer.terms':  'Terms',
      'about.tag':     'About · ZenCode',
      'about.title':   'About Us',
      'about.sub':     'Ancient wisdom, precise algorithms',
      'privacy.tag':   'Privacy Policy · ZenCode',
      'privacy.title': 'Privacy Policy',
      'privacy.sub':   'How we collect, use and protect your data',
      'terms.tag':     'Terms of Service · ZenCode',
      'terms.title':   'Terms of Service',
      'terms.sub':     'By using this platform you agree to the following terms',
    },

    /* ══════════════════════════════════
       한국어 (Korean)
       전략：술어는 한자 유지 + 괄호 한국어 설명
    ══════════════════════════════════ */
    'ko': {
      'nav.reading':   '운명 차트',
      'nav.about':     '소개',
      'nav.privacy':   '개인정보',
      'nav.terms':     '이용약관',
      'hero.tag':      'ZenCode · 사주팔자 분석 시스템',
      'hero.title':    '운명 파일 열기',
      'hero.sub':      '유년 분석 · 사주 감정 · 대운 해석',
      'cal.solar':     '양력',
      'cal.lunar':     '음력',
      'form.name':     '이름',
      'form.name.ph':  '이름을 입력하세요',
      'form.gender':   '성별',
      'form.gender.ph':'성별 선택',
      'form.gender.f': '여성',
      'form.gender.m': '남성',
      'form.date':     '생년월일',
      'form.lunar.hint':'✦ 음력 날짜를 입력하세요 — 시스템이 자동으로 양력으로 변환합니다',
      'form.year':     '년',
      'form.month':    '월',
      'form.day':      '일',
      'form.year.l':   '년 (음)',
      'form.month.l':  '월 (음)',
      'form.day.l':    '일 (음)',
      'form.leap':     '윤달',
      'form.hour':     '시 (24시간제)',
      'form.min':      '분 (선택)',
      'form.place':    '출생지',
      'form.place.ph': '예: 서울특별시',
      'prev.title':    '차트 미리보기 (진태양시 보정)',
      'btn.submit':    '별자리 에너지 분석',
      'load.sub':      '사주팔자 계산 중 · 운명 차트 생성 중',
      'load.phases':   ['진태양시 보정 중','사주四柱 배열 중','대운大運 추산 중','격국 강약 감정 중','오행五行 흐름 분석','천간지지 해석 중','신살神煞 계산 중'],
      'err.lunar':     '음력 변환에 실패했습니다. 날짜를 확인해 주세요.',
      'err.fail':      '분석에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      'footer.copy':   '© 2025 ZenCode · 운명 아카이브 · 오락 목적으로만 사용',
      'footer.about':  '소개',
      'footer.privacy':'개인정보처리방침',
      'footer.terms':  '이용약관',
      'about.tag':     'About · ZenCode',
      'about.title':   '소개',
      'about.sub':     '전통 명리학과 현대 알고리즘의 융합',
      'privacy.tag':   'Privacy Policy · ZenCode',
      'privacy.title': '개인정보처리방침',
      'privacy.sub':   '귀하의 정보를 어떻게 수집·이용·보호하는지 안내합니다',
      'terms.tag':     'Terms of Service · ZenCode',
      'terms.title':   '이용약관',
      'terms.sub':     '본 플랫폼을 이용하면 아래 약관에 동의하는 것으로 간주합니다',
    },
  };

  // ── AI Prompt 語言指令 ──────────────────────────────
  // 告訴後端 analyze.js 用哪個語言生成報告
  const PROMPT_LANG = {
    'zh-TW': null, // 不改，原版繁體
    'zh-CN': null, // 不改，原版（AI 本身輸出簡繁不穩定，交給繁體即可；
                   // 如需強制簡體可改為 '请全程使用简体中文撰写报告。'）
    'en': `LANGUAGE INSTRUCTION: Write the entire reading in English.
For Chinese cosmological terms that have no direct English equivalent, keep the original Chinese characters and add an English explanation in parentheses.
Examples of required format:
- 日主 (Day Master) — the central pillar representing the self
- 甲木 (Jiǎ Wood) — Yang Wood, symbolising a towering tree
- 正官 (Zheng Guan · Direct Officer) — the energy of discipline and authority
- 大運 (Dà Yùn · Major Luck Cycle) — a 10-year period of dominant influence
- 納音 (Nà Yīn · Resonance Tone) — the classical sound-element classification
- 帝旺 (Dì Wàng · Emperor's Peak) — the strongest stage of the 12-phase life cycle
- 長生 (Cháng Shēng · Emerging Life) — the birth stage of elemental strength
Apply this bilingual annotation consistently throughout ALL sections of the report.
The Four Pillars (四柱) themselves — the Chinese characters 甲子, 乙丑 etc. — must always be shown as Chinese characters, never romanised.`,

    'ko': `언어 지침: 보고서 전체를 한국어로 작성하세요.
한국어로 직역하기 어려운 중국 명리학 술어는 한자를 그대로 유지하고 괄호 안에 한국어 설명을 추가하세요.
필수 형식 예시:
- 日主 (일주·자신을 나타내는 중심 기둥)
- 甲木 (갑목·양목, 큰 나무를 상징)
- 正官 (정관·규율과 권위의 에너지)
- 大運 (대운·10년 단위의 운세 흐름)
- 納音 (납음·오행의 고전적 음운 분류)
- 帝旺 (제왕·12운성 중 가장 강한 단계)
이 이중 표기 방식을 보고서의 모든 섹션에 일관되게 적용하세요.
사주四柱의 한자 자체(甲子, 乙丑 등)는 반드시 한자로 표기하고, 한글 음역으로만 대체하지 마세요.`,
  };

  // ── 狀態 ─────────────────────────────────────────────
  const STORAGE_KEY = 'zc_lang';
  const SUPPORTED   = ['zh-TW', 'zh-CN', 'en', 'ko'];

  // 偵測預設語言：localStorage → 瀏覽器語言 → zh-TW
  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const bl = (navigator.language || '').toLowerCase();
    if (bl.startsWith('zh-cn') || bl === 'zh-sg') return 'zh-CN';
    if (bl.startsWith('zh'))  return 'zh-TW';
    if (bl.startsWith('ko'))  return 'ko';
    if (bl.startsWith('en'))  return 'en';
    return 'zh-TW';
  }

  let currentLang = detectLang();

  // ── 核心方法 ─────────────────────────────────────────

  // 取翻譯字串
  function t(key) {
    return (DB[currentLang] && DB[currentLang][key]) ||
           (DB['zh-TW'][key]) ||
           key;
  }

  // 取 loading phrases（回傳陣列）
  function phases() {
    return t('load.phases');
  }

  // 取 AI prompt 語言指令（英韓才有，中文回傳 null）
  function promptLang() {
    return PROMPT_LANG[currentLang] || null;
  }

  // 取當前語言碼
  function lang() { return currentLang; }

  // ── 套用翻譯到 DOM ────────────────────────────────────
  function applyDOM() {
    // 1. data-i18n="key" → textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (val) el.textContent = val;
    });

    // 2. data-i18n-ph="key" → placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const val = t(el.dataset.i18nPh);
      if (val) el.placeholder = val;
    });

    // 3. data-i18n-html="key" → innerHTML（少數需要 HTML 的場景）
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const val = t(el.dataset.i18nHtml);
      if (val) el.innerHTML = val;
    });

    // 4. <html lang=""> 屬性
    document.documentElement.lang =
      currentLang === 'zh-CN' ? 'zh-Hans' :
      currentLang === 'zh-TW' ? 'zh-Hant' :
      currentLang;

    // 5. 英文/韓文時調整 letter-spacing，避免過寬
    const isLatinLike = currentLang === 'en';
    document.querySelectorAll('.zc-nav-link, .zc-mobile-link').forEach(el => {
      el.style.letterSpacing = isLatinLike ? '0.06em' : '';
    });

    // 6. 更新語言切換器高亮
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langBtn === currentLang);
    });
  }

  // ── 切換語言 ─────────────────────────────────────────
  function setLang(code) {
    if (!SUPPORTED.includes(code)) return;
    currentLang = code;
    localStorage.setItem(STORAGE_KEY, code);
    applyDOM();
    // 觸發自定義事件，讓頁面 JS 可以監聽並更新動態內容
    document.dispatchEvent(new CustomEvent('zc:langchange', { detail: { lang: code } }));
  }

  // ── DOMContentLoaded 後自動套用 ──────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDOM);
  } else {
    applyDOM();
  }

  // 公開 API
  return { t, phases, promptLang, lang, setLang, applyDOM };

})();
