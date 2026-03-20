// ═══════════════════════════════════════════════════════
//  ZenCode i18n · 多語言翻譯庫
//  支援：zh-TW（繁體）/ zh-CN（簡體）/ en（英文）/ ko（한국어）
//
//  用法：在 HTML 元素加 data-i18n=“key”
//        動態文字用 ZCI18n.t(‘key’) 取得
//        語言切換：ZCI18n.setLang(‘en’)
// ═══════════════════════════════════════════════════════
const ZCI18n = (function () {

// ── 翻譯資料庫 ──────────────────────────────────────
const DB = {

```
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
  'err.ratelimit.wait':   '系統繁忙，觀星隊列等候中…',
  'err.ratelimit.retry':  '重新觀測中…',
  'err.ratelimit.title':  '星象觀測隊列已滿',
  'err.ratelimit.desc':   '目前請求較多，已自動重試但未能完成。\n請稍待片刻後再次點擊「觀測星象能量」。',
  'err.ratelimit.reload': '重新測算',
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
  // 夏令時
  'form.dst.label':       '夏令時 DST',
  'form.dst.sub':         '出生時當地是否正在實行夏令時（+1小時）',
  'form.dst.panel.title': '主要國家／地區夏令時參考',
  'form.dst.cn.name':     '中國大陸',
  'form.dst.cn.detail':   '1986 – 1991 年實行，每年 4月第二週日 02:00 撥快，9月第二週日 02:00 撥回',
  'form.dst.tw.name':     '台灣',
  'form.dst.tw.detail':   '1945 – 1979 年多次實行（1961–1974 年中斷），各年起訖日期不同',
  'form.dst.us.name':     '美國 / 加拿大',
  'form.dst.us.detail':   '現行：3月第二週日 → 11月第一週日（亞利桑那州、夏威夷等除外）',
  'form.dst.eu.name':     '歐洲',
  'form.dst.eu.detail':   '現行：3月最後一週日 → 10月最後一週日',
  'form.dst.au.name':     '澳洲（東/南部）',
  'form.dst.au.detail':   '現行：10月第一週日 → 4月第一週日（南半球，與北半球相反）',
  'form.dst.kr.name':     '韓國 / 日本',
  'form.dst.kr.detail':   '韓國 1948–1960、日本 1948–1951 曾短暫實行，現均不再實行',
  'form.dst.note':        '✦ 開啟後系統將在時辰計算前自動減去 1 小時，還原為標準時。如不確定是否在夏令時期間出生，請查閱出生地當年曆法。',
  // 反饋頁
  'fb.tag':              'ZenCode · 命盤反饋 · Feedback',
  'fb.title':            '命盤校準',
  'fb.sub':              '您的每一條反饋<br>都將幫助命理推演系統更趨精準',
  'fb.sec.chart':        '本次推演的命盤',
  'fb.chart.empty':      '未偵測到命盤資料，請手動填寫四柱干支',
  'fb.chart.ph':         '如：甲子 丙寅 庚午 壬申',
  'fb.meta.name':        '命主：',
  'fb.meta.rizhu':       '日主：',
  'fb.sec.rating':       '整體準確度評分',
  'fb.rating.ph':        '請評分',
  'fb.rating.1':         '感覺不太準',
  'fb.rating.2':         '有些出入',
  'fb.rating.3':         '基本吻合',
  'fb.rating.4':         '相當準確',
  'fb.rating.5':         '非常精準',
  'fb.sec.fields':       '哪些部分與您的實際情況不符（可多選）',
  'fb.field.pattern':    '格局定性',
  'fb.field.wuxing':     '五行分析',
  'fb.field.dayun':      '大運判斷',
  'fb.field.liuyear':    '流年預測',
  'fb.field.love':       '婚姻感情',
  'fb.field.career':     '事業財運',
  'fb.field.health':     '健康宮位',
  'fb.field.shensha':    '神煞吉凶',
  'fb.field.overall':    '整體偏差',
  'fb.field.other':      '其他',
  'fb.fields.hint':      '若整體都準確可不選',
  'fb.sec.correction':   '您的補充與糾正（選填）',
  'fb.correction.ph':    '請描述哪裡不準確，或您認為正確的判斷應該是什麼。例如：「系統說大運走偏財，但實際我的事業運很強…」',
  'fb.sec.outcome':      '您的實際人生經歷（最有參考價值）',
  'fb.outcome.ph':       '完全匿名。例如：「2019年壬子大運確實是事業轉折，但方向是創業而非升職…」',
  'fb.outcome.hint':     '✦ 此欄資料匿名儲存，僅用於改善推演模型，不會對外公開',
  'fb.sec.contact':      '留下聯絡方式（選填）',
  'fb.contact.ph':       'Email 或微信號，方便我們回覆您的反饋',
  'fb.contact.hint':     '✦ 僅用於回覆此次反饋，不會用於任何推廣',
  'fb.err.rating':       '請至少完成評分後再提交',
  'fb.err.fail':         '提交失敗，請稍後重試',
  'fb.btn.submit':       '提交反饋',
  'fb.btn.submitting':   '提交中…',
  'fb.success.title':    '反饋已記錄',
  'fb.success.sub':      '感謝您的校準貢獻<br>每一條記錄都讓命盤推演更趨精準',
  'fb.success.back':     '返回命盤推演',
  // 導航（反饋入口）
  'nav.feedback':        '命盤校準',
  'form.lang.hint':      '報告語言由右上角語言切換器決定，請在測算前確認語言設定，生成後無法切換',
  'form.tz':             '出生時當地時區',
  'form.tz.hint':        '✦ 請選擇出生當時當地使用的標準時間（夏令時期間請選夏令時對應的時區）',
  'form.jq.hint':        '✦ 節氣換月精確至分鐘（資料來源：天文年曆）· 採早子時流派（23:00 起為當天子時）',
  // VIP 私人定制彈窗
  'vip.eyebrow':         '命盤已生成 · 深度服務開放中',
  'vip.title':           '一對一私人命理定制',
  'vip.sub':             '您的命盤揭示了獨特的命運密碼，算法之外，還有更深的解讀等待開啟',
  'vip.item1.title':     '深度流年私定',
  'vip.item1.desc':      '逐年逐月拆解大運流年交叉，鎖定您專屬的機遇窗口與風險節點，而非泛化套語',
  'vip.item2.title':     '格局精準鑑定',
  'vip.item2.desc':      '結合出生地、家族背景、當前處境，對格局作二次校準，給出可執行的人生決策建議',
  'vip.item3.title':     '重大抉擇諮詢',
  'vip.item3.desc':      '婚姻、事業轉折、移居、投資——在命理時機與現實條件之間找到最優解',
  'vip.item4.title':     '私密存檔交付',
  'vip.item4.desc':      '完整 PDF 報告私密存檔，包含您的完整八字體系與未來十年大運逐年詳解',
  'vip.cta.label':       '預約私人命理師',
  'vip.cta.email':       'vip@zencode.codes',
  'vip.note':            '回覆通常在 24 小時內 · 全程保密 · 僅接受少量預約',
  'vip.close':           '暫不需要，繼續瀏覽',
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
  'err.ratelimit.wait':   '系统繁忙，观星队列等候中…',
  'err.ratelimit.retry':  '重新观测中…',
  'err.ratelimit.title':  '星象观测队列已满',
  'err.ratelimit.desc':   '目前请求较多，已自动重试但未能完成。\n请稍待片刻后再次点击「观测星象能量」。',
  'err.ratelimit.reload': '重新测算',
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
  // 夏令时
  'form.dst.label':       '夏令时 DST',
  'form.dst.sub':         '出生时当地是否正在实行夏令时（+1小时）',
  'form.dst.panel.title': '主要国家／地区夏令时参考',
  'form.dst.cn.name':     '中国大陆',
  'form.dst.cn.detail':   '1986 – 1991 年实行，每年 4月第二周日 02:00 拨快，9月第二周日 02:00 拨回',
  'form.dst.tw.name':     '台湾',
  'form.dst.tw.detail':   '1945 – 1979 年多次实行（1961–1974 年中断），各年起讫日期不同',
  'form.dst.us.name':     '美国 / 加拿大',
  'form.dst.us.detail':   '现行：3月第二周日 → 11月第一周日（亚利桑那州、夏威夷等除外）',
  'form.dst.eu.name':     '欧洲',
  'form.dst.eu.detail':   '现行：3月最后一周日 → 10月最后一周日',
  'form.dst.au.name':     '澳洲（东/南部）',
  'form.dst.au.detail':   '现行：10月第一周日 → 4月第一周日（南半球，与北半球相反）',
  'form.dst.kr.name':     '韩国 / 日本',
  'form.dst.kr.detail':   '韩国 1948–1960、日本 1948–1951 曾短暂实行，现均不再实行',
  'form.dst.note':        '✦ 开启后系统将在时辰计算前自动减去 1 小时，还原为标准时。如不确定是否在夏令时期间出生，请查阅出生地当年历法。',
  // 反馈页
  'fb.tag':              'ZenCode · 命盘反馈 · Feedback',
  'fb.title':            '命盘校准',
  'fb.sub':              '您的每一条反馈<br>都将帮助命理推演系统更趋精准',
  'fb.sec.chart':        '本次推演的命盘',
  'fb.chart.empty':      '未检测到命盘资料，请手动填写四柱干支',
  'fb.chart.ph':         '如：甲子 丙寅 庚午 壬申',
  'fb.meta.name':        '命主：',
  'fb.meta.rizhu':       '日主：',
  'fb.sec.rating':       '整体准确度评分',
  'fb.rating.ph':        '请评分',
  'fb.rating.1':         '感觉不太准',
  'fb.rating.2':         '有些出入',
  'fb.rating.3':         '基本吻合',
  'fb.rating.4':         '相当准确',
  'fb.rating.5':         '非常精准',
  'fb.sec.fields':       '哪些部分与您的实际情况不符（可多选）',
  'fb.field.pattern':    '格局定性',
  'fb.field.wuxing':     '五行分析',
  'fb.field.dayun':      '大运判断',
  'fb.field.liuyear':    '流年预测',
  'fb.field.love':       '婚姻感情',
  'fb.field.career':     '事业财运',
  'fb.field.health':     '健康宫位',
  'fb.field.shensha':    '神煞吉凶',
  'fb.field.overall':    '整体偏差',
  'fb.field.other':      '其他',
  'fb.fields.hint':      '若整体都准确可不选',
  'fb.sec.correction':   '您的补充与纠正（选填）',
  'fb.correction.ph':    '请描述哪里不准确，或您认为正确的判断应该是什么。例如：「系统说大运走偏财，但实际我的事业运很强…」',
  'fb.sec.outcome':      '您的实际人生经历（最有参考价值）',
  'fb.outcome.ph':       '完全匿名。例如：「2019年壬子大运确实是事业转折，但方向是创业而非升职…」',
  'fb.outcome.hint':     '✦ 此栏资料匿名储存，仅用于改善推演模型，不会对外公开',
  'fb.sec.contact':      '留下联系方式（选填）',
  'fb.contact.ph':       'Email 或微信号，方便我们回复您的反馈',
  'fb.contact.hint':     '✦ 仅用于回复此次反馈，不会用于任何推广',
  'fb.err.rating':       '请至少完成评分后再提交',
  'fb.err.fail':         '提交失败，请稍后重试',
  'fb.btn.submit':       '提交反馈',
  'fb.btn.submitting':   '提交中…',
  'fb.success.title':    '反馈已记录',
  'fb.success.sub':      '感谢您的校准贡献<br>每一条记录都让命盘推演更趋精准',
  'fb.success.back':     '返回命盘推演',
  'nav.feedback':        '命盘校准',
  'form.lang.hint':      '报告语言由右上角语言切换器决定，请在测算前确认语言设置，生成后无法切换',
  'form.tz':             '出生时当地时区',
  'form.tz.hint':        '✦ 请选择出生当时当地使用的标准时间（夏令时期间请选夏令时对应的时区）',
  'form.jq.hint':        '✦ 节气换月精确至分钟（数据来源：天文年历）· 采早子时流派（23:00 起为当天子时）',
  // VIP 私人定制弹窗
  'vip.eyebrow':         '命盘已生成 · 深度服务开放中',
  'vip.title':           '一对一私人命理定制',
  'vip.sub':             '您的命盘揭示了独特的命运密码，算法之外，还有更深的解读等待开启',
  'vip.item1.title':     '深度流年私定',
  'vip.item1.desc':      '逐年逐月拆解大运流年交叉，锁定您专属的机遇窗口与风险节点，而非泛化套语',
  'vip.item2.title':     '格局精准鉴定',
  'vip.item2.desc':      '结合出生地、家族背景、当前处境，对格局作二次校准，给出可执行的人生决策建议',
  'vip.item3.title':     '重大抉择咨询',
  'vip.item3.desc':      '婚姻、事业转折、移居、投资——在命理时机与现实条件之间找到最优解',
  'vip.item4.title':     '私密存档交付',
  'vip.item4.desc':      '完整 PDF 报告私密存档，包含您的完整八字体系与未来十年大运逐年详解',
  'vip.cta.label':       '预约私人命理师',
  'vip.cta.email':       'vip@zencode.codes',
  'vip.note':            '回复通常在 24 小时内 · 全程保密 · 仅接受少量预约',
  'vip.close':           '暂不需要，继续浏览',
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
  'err.ratelimit.wait':   'High demand — queued, please wait…',
  'err.ratelimit.retry':  'Retrying your reading…',
  'err.ratelimit.title':  'Reading Queue Full',
  'err.ratelimit.desc':   'Too many requests right now. Auto-retry did not succeed.\nPlease wait a moment and tap the button again.',
  'err.ratelimit.reload': 'Try Again',
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
  // DST
  'form.dst.label':       'Daylight Saving Time',
  'form.dst.sub':         'Was DST in effect at your place of birth? (+1 hour)',
  'form.dst.panel.title': 'DST Reference by Country / Region',
  'form.dst.cn.name':     'Mainland China',
  'form.dst.cn.detail':   'Observed 1986–1991: clocks advanced on the 2nd Sunday of April, reverted on the 2nd Sunday of September',
  'form.dst.tw.name':     'Taiwan',
  'form.dst.tw.detail':   'Observed 1945–1979 with interruptions (1961–1974); exact dates varied by year',
  'form.dst.us.name':     'USA / Canada',
  'form.dst.us.detail':   'Current: 2nd Sunday of March → 1st Sunday of November (excl. Arizona, Hawaii, etc.)',
  'form.dst.eu.name':     'Europe',
  'form.dst.eu.detail':   'Current: last Sunday of March → last Sunday of October',
  'form.dst.au.name':     'Australia (East / South)',
  'form.dst.au.detail':   'Current: 1st Sunday of October → 1st Sunday of April (Southern Hemisphere — opposite to North)',
  'form.dst.kr.name':     'South Korea / Japan',
  'form.dst.kr.detail':   'Korea observed DST 1948–1960; Japan 1948–1951. Neither observes DST today.',
  'form.dst.note':        '✦ When enabled, the system subtracts 1 hour from the clock time before calculating the BaZi chart, restoring it to standard time. If unsure, consult a historical DST calendar for the birth location.',
  // Feedback page
  'fb.tag':              'ZenCode · Chart Feedback',
  'fb.title':            'Calibrate',
  'fb.sub':              'Every piece of feedback<br>helps the chart system grow more accurate',
  'fb.sec.chart':        'Chart from your reading',
  'fb.chart.empty':      'No chart data detected — please enter the Four Pillars manually',
  'fb.chart.ph':         'e.g. 甲子 丙寅 庚午 壬申',
  'fb.meta.name':        'Name: ',
  'fb.meta.rizhu':       'Day Master: ',
  'fb.sec.rating':       'Overall accuracy rating',
  'fb.rating.ph':        'Rate this reading',
  'fb.rating.1':         'Felt quite off',
  'fb.rating.2':         'Some inaccuracies',
  'fb.rating.3':         'Mostly on point',
  'fb.rating.4':         'Quite accurate',
  'fb.rating.5':         'Remarkably precise',
  'fb.sec.fields':       'Which sections felt inaccurate? (select all that apply)',
  'fb.field.pattern':    'Chart Pattern',
  'fb.field.wuxing':     'Five Elements',
  'fb.field.dayun':      'Luck Cycles',
  'fb.field.liuyear':    'Annual Cycles',
  'fb.field.love':       'Relationships',
  'fb.field.career':     'Career & Wealth',
  'fb.field.health':     'Health',
  'fb.field.shensha':    'Divine Stars',
  'fb.field.overall':    'Overall Accuracy',
  'fb.field.other':      'Other',
  'fb.fields.hint':      'Leave blank if everything felt accurate',
  'fb.sec.correction':   'Your corrections (optional)',
  'fb.correction.ph':    'Describe what felt off, or what you believe the correct interpretation should be.',
  'fb.sec.outcome':      'What actually happened in your life (most valuable)',
  'fb.outcome.ph':       'Fully anonymous. e.g. "The 壬子 Luck Cycle was indeed a career turning point, but I started a business rather than getting promoted…"',
  'fb.outcome.hint':     '✦ This field is stored anonymously and used only to improve the chart model — never shared publicly',
  'fb.sec.contact':      'Leave your contact (optional)',
  'fb.contact.ph':       'Email or WeChat ID — so we can follow up on your feedback',
  'fb.contact.hint':     '✦ Used only to reply to this feedback, never for marketing',
  'fb.err.rating':       'Please give a star rating before submitting',
  'fb.err.fail':         'Submission failed, please try again',
  'fb.btn.submit':       'Submit Feedback',
  'fb.btn.submitting':   'Submitting…',
  'fb.success.title':    'Feedback Recorded',
  'fb.success.sub':      'Thank you for your contribution<br>Every entry makes the chart engine more precise',
  'fb.success.back':     'Back to Chart Reading',
  'nav.feedback':        'Calibrate',
  'form.lang.hint':      'Report language is set by the language switcher (top right). Please select your language before generating — it cannot be changed afterwards.',
  'form.tz':             'Local Timezone at Birth',
  'form.tz.hint':        '✦ Select the standard time in use at your birthplace. If born during Daylight Saving Time, pick the DST offset.',
  'form.jq.hint':        '✦ Solar term transitions accurate to the minute (source: astronomical almanac) · Early-zi convention: 23:00–00:59 belongs to the current day',
  // VIP modal
  'vip.eyebrow':         'Your Chart is Ready · Exclusive Service Now Open',
  'vip.title':           'One-on-One Personal Destiny Consultation',
  'vip.sub':             'Your chart reveals a unique cosmic blueprint. Beyond the algorithm, a deeper reading awaits.',
  'vip.item1.title':     'Personalised Annual Forecast',
  'vip.item1.desc':      'Month-by-month breakdown of Luck Cycle and Annual Cycle intersections — pinpointing your exact windows of opportunity and risk, not generic templates.',
  'vip.item2.title':     'Chart Pattern Deep Calibration',
  'vip.item2.desc':      'A second-layer reading that factors in birthplace, family lineage, and current circumstances — delivering actionable life decisions, not vague predictions.',
  'vip.item3.title':     'Major Life Decision Guidance',
  'vip.item3.desc':      'Marriage, career pivots, relocation, investment — finding the optimal move where cosmic timing meets real-world conditions.',
  'vip.item4.title':     'Private Archive Delivered',
  'vip.item4.desc':      'A confidential full PDF report — your complete BaZi system plus a year-by-year breakdown of all ten years ahead.',
  'vip.cta.label':       'Reserve a Private Reading',
  'vip.cta.email':       'vip@zencode.codes',
  'vip.note':            'Reply within 24 hours · Strictly confidential · Limited appointments only',
  'vip.close':           'Not now, continue reading',
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
  'err.ratelimit.wait':   '요청이 많아 대기 중입니다…',
  'err.ratelimit.retry':  '다시 분석 중…',
  'err.ratelimit.title':  '분석 대기열이 가득 찼습니다',
  'err.ratelimit.desc':   '현재 요청이 많아 자동 재시도가 완료되지 않았습니다.\n잠시 후 다시 버튼을 눌러주세요.',
  'err.ratelimit.reload': '다시 시도',
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
  // 일광절약시간
  'form.dst.label':       '일광절약시간 DST',
  'form.dst.sub':         '출생 당시 해당 지역에서 서머타임이 시행 중이었나요? (+1시간)',
  'form.dst.panel.title': '국가별 서머타임 시행 참고',
  'form.dst.cn.name':     '중국 본토',
  'form.dst.cn.detail':   '1986–1991년 시행: 매년 4월 둘째 일요일 시계를 1시간 앞당기고, 9월 둘째 일요일에 원복',
  'form.dst.tw.name':     '대만',
  'form.dst.tw.detail':   '1945–1979년 여러 차례 시행 (1961–1974년 중단), 연도별 시작·종료일 상이',
  'form.dst.us.name':     '미국 / 캐나다',
  'form.dst.us.detail':   '현행: 3월 둘째 일요일 → 11월 첫째 일요일 (애리조나주·하와이 등 제외)',
  'form.dst.eu.name':     '유럽',
  'form.dst.eu.detail':   '현행: 3월 마지막 일요일 → 10월 마지막 일요일',
  'form.dst.au.name':     '호주 (동부/남부)',
  'form.dst.au.detail':   '현행: 10월 첫째 일요일 → 4월 첫째 일요일 (남반구 기준, 북반구와 반대)',
  'form.dst.kr.name':     '한국 / 일본',
  'form.dst.kr.detail':   '한국 1948–1960년, 일본 1948–1951년 시행. 현재 두 나라 모두 미시행.',
  'form.dst.note':        '✦ 활성화하면 시스템이 입력된 시각에서 1시간을 빼 표준시로 복원한 후 사주를 계산합니다. 확실하지 않은 경우 출생지의 해당 연도 서머타임 기록을 확인하거나 이 옵션을 끄세요.',
  // 피드백 페이지
  'fb.tag':              'ZenCode · 차트 피드백',
  'fb.title':            '차트 교정',
  'fb.sub':              '보내주신 모든 피드백이<br>명리 추연 시스템의 정확도를 높여줍니다',
  'fb.sec.chart':        '이번 추연의 사주 차트',
  'fb.chart.empty':      '차트 데이터가 감지되지 않았습니다. 사주四柱 간지를 직접 입력해 주세요',
  'fb.chart.ph':         '예: 甲子 丙寅 庚午 壬申',
  'fb.meta.name':        '이름: ',
  'fb.meta.rizhu':       '일주: ',
  'fb.sec.rating':       '전반적인 정확도 평가',
  'fb.rating.ph':        '별점을 선택해 주세요',
  'fb.rating.1':         '많이 빗나간 것 같아요',
  'fb.rating.2':         '일부 오차가 있어요',
  'fb.rating.3':         '대체로 맞는 편이에요',
  'fb.rating.4':         '꽤 정확해요',
  'fb.rating.5':         '매우 정확해요',
  'fb.sec.fields':       '어느 부분이 실제와 달랐나요? (복수 선택 가능)',
  'fb.field.pattern':    '격국 정의',
  'fb.field.wuxing':     '오행 분석',
  'fb.field.dayun':      '대운 판단',
  'fb.field.liuyear':    '유년 예측',
  'fb.field.love':       '결혼·연애',
  'fb.field.career':     '직업·재운',
  'fb.field.health':     '건강궁위',
  'fb.field.shensha':    '신살 길흉',
  'fb.field.overall':    '전반적 오차',
  'fb.field.other':      '기타',
  'fb.fields.hint':      '모두 정확하다면 선택하지 않아도 됩니다',
  'fb.sec.correction':   '보완 및 수정 의견 (선택)',
  'fb.correction.ph':    '어디가 틀렸는지, 또는 올바른 해석이 무엇인지 알려주세요.',
  'fb.sec.outcome':      '실제 삶에서 일어난 일 (가장 유용한 정보)',
  'fb.outcome.ph':       '완전 익명. 예: "壬子 대운이 실제로 직업적 전환점이었는데, 승진이 아니라 창업을 했어요…"',
  'fb.outcome.hint':     '✦ 이 항목은 익명으로 저장되며 추연 모델 개선에만 사용됩니다. 외부에 공개되지 않습니다.',
  'fb.sec.contact':      '연락처 남기기 (선택)',
  'fb.contact.ph':       '이메일 또는 WeChat ID — 피드백에 답변드릴 수 있습니다',
  'fb.contact.hint':     '✦ 이 피드백 답변 목적으로만 사용되며 마케팅에 활용되지 않습니다',
  'fb.err.rating':       '제출 전에 별점을 선택해 주세요',
  'fb.err.fail':         '제출에 실패했습니다. 잠시 후 다시 시도해 주세요',
  'fb.btn.submit':       '피드백 제출',
  'fb.btn.submitting':   '제출 중…',
  'fb.success.title':    '피드백이 기록되었습니다',
  'fb.success.sub':      '교정에 참여해 주셔서 감사합니다<br>모든 기록이 추연 엔진을 더욱 정확하게 만듭니다',
  'fb.success.back':     '사주 추연으로 돌아가기',
  'nav.feedback':        '차트 교정',
  'form.lang.hint':      '보고서 언어는 오른쪽 상단의 언어 선택기로 결정됩니다. 생성 전에 언어를 먼저 설정해 주세요 — 생성 후에는 변경할 수 없습니다.',
  'form.tz':             '출생 당시 현지 시간대',
  'form.tz.hint':        '✦ 출생 당시 현지에서 사용하던 표준시를 선택하세요. 서머타임 중에 태어났다면 서머타임 오프셋을 선택하세요.',
  'form.jq.hint':        '✦ 절기 교체 시각은 분 단위로 정확합니다（출처: 천문 연감）· 조자시 기준: 23:00부터 당일 자시로 계산',
  // VIP 모달
  'vip.eyebrow':         '사주 차트 완성 · 프리미엄 서비스 오픈',
  'vip.title':           '1:1 맞춤형 명리 컨설팅',
  'vip.sub':             '당신의 사주는 고유한 운명의 코드를 담고 있습니다. 알고리즘 너머, 더 깊은 해석이 기다립니다.',
  'vip.item1.title':     '맞춤형 유년 분석',
  'vip.item1.desc':      '대운과 유년의 교차점을 월별로 세밀하게 분석하여 당신만의 기회와 위험 구간을 정확히 짚어드립니다.',
  'vip.item2.title':     '격국 정밀 감정',
  'vip.item2.desc':      '출생지, 가족 배경, 현재 상황을 반영한 2차 교정으로 실질적인 인생 결정 조언을 제공합니다.',
  'vip.item3.title':     '중요 결정 상담',
  'vip.item3.desc':      '결혼, 이직, 이민, 투자 — 명리학적 타이밍과 현실 조건 사이에서 최적의 선택을 찾아드립니다.',
  'vip.item4.title':     '비공개 리포트 제공',
  'vip.item4.desc':      '완전한 사주 체계와 향후 10년 대운 연도별 상세 해설이 담긴 기밀 PDF 보고서를 제공합니다.',
  'vip.cta.label':       '프라이빗 리딩 예약',
  'vip.cta.email':       'vip@zencode.codes',
  'vip.note':            '24시간 이내 답변 · 엄격한 비밀 보장 · 소수 예약만 수락',
  'vip.close':           '괜찮습니다, 계속 볼게요',
},
```

};

// ── AI Prompt 語言指令 ──────────────────────────────
// 告訴後端 analyze.js 用哪個語言生成報告
const PROMPT_LANG = {
‘zh-TW’: null, // 不改，原版繁體
‘zh-CN’: null, // 不改，原版（AI 本身輸出簡繁不穩定，交給繁體即可；
// 如需強制簡體可改為 ‘请全程使用简体中文撰写报告。’）
‘en’: `LANGUAGE INSTRUCTION: Write the entire reading in English.
For Chinese cosmological terms that have no direct English equivalent, keep the original Chinese characters and add an English explanation in parentheses.
Examples of required format:

- 日主 (Day Master) — the central pillar representing the self
- 甲木 (Jiǎ Wood) — Yang Wood, symbolising a towering tree
- 正官 (Zheng Guan · Direct Officer) — the energy of discipline and authority
- 大運 (Dà Yùn · Major Luck Cycle) — a 10-year period of dominant influence
- 納音 (Nà Yīn · Resonance Tone) — the classical sound-element classification
- 帝旺 (Dì Wàng · Emperor’s Peak) — the strongest stage of the 12-phase life cycle
- 長生 (Cháng Shēng · Emerging Life) — the birth stage of elemental strength
  Apply this bilingual annotation consistently throughout ALL sections of the report.
  The Four Pillars (四柱) themselves — the Chinese characters 甲子, 乙丑 etc. — must always be shown as Chinese characters, never romanised.`,
  
  ‘ko’: `언어 지침: 보고서 전체를 한국어로 작성하세요.
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
  const STORAGE_KEY = ‘zc_lang’;
  const SUPPORTED   = [‘zh-TW’, ‘zh-CN’, ‘en’, ‘ko’];
  
  // 偵測預設語言：localStorage → 瀏覽器語言 → zh-TW
  function detectLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const bl = (navigator.language || ‘’).toLowerCase();
  if (bl.startsWith(‘zh-cn’) || bl === ‘zh-sg’) return ‘zh-CN’;
  if (bl.startsWith(‘zh’))  return ‘zh-TW’;
  if (bl.startsWith(‘ko’))  return ‘ko’;
  if (bl.startsWith(‘en’))  return ‘en’;
  return ‘zh-TW’;
  }
  
  let currentLang = detectLang();
  
  // ── 核心方法 ─────────────────────────────────────────
  
  // 取翻譯字串
  function t(key) {
  return (DB[currentLang] && DB[currentLang][key]) ||
  (DB[‘zh-TW’][key]) ||
  key;
  }
  
  // 取 loading phrases（回傳陣列）
  function phases() {
  return t(‘load.phases’);
  }
  
  // 取 AI prompt 語言指令（英韓才有，中文回傳 null）
  function promptLang() {
  return PROMPT_LANG[currentLang] || null;
  }
  
  // 取當前語言碼
  function lang() { return currentLang; }
  
  // ── 套用翻譯到 DOM ────────────────────────────────────
  function applyDOM() {
  // 1. data-i18n=“key” → textContent
  document.querySelectorAll(’[data-i18n]’).forEach(el => {
  const key = el.dataset.i18n;
  const val = t(key);
  if (val) el.textContent = val;
  });
  
  // 2. data-i18n-ph=“key” → placeholder
  document.querySelectorAll(’[data-i18n-ph]’).forEach(el => {
  const val = t(el.dataset.i18nPh);
  if (val) el.placeholder = val;
  });
  
  // 3. data-i18n-html=“key” → innerHTML（少數需要 HTML 的場景）
  document.querySelectorAll(’[data-i18n-html]’).forEach(el => {
  const val = t(el.dataset.i18nHtml);
  if (val) el.innerHTML = val;
  });
  
  // 4. <html lang=""> 屬性
  document.documentElement.lang =
  currentLang === ‘zh-CN’ ? ‘zh-Hans’ :
  currentLang === ‘zh-TW’ ? ‘zh-Hant’ :
  currentLang;
  
  // 5. 英文/韓文時調整 letter-spacing，避免過寬
  const isLatinLike = currentLang === ‘en’;
  document.querySelectorAll(’.zc-nav-link, .zc-mobile-link’).forEach(el => {
  el.style.letterSpacing = isLatinLike ? ‘0.06em’ : ‘’;
  });
  
  // 6. 更新語言切換器高亮
  document.querySelectorAll(’[data-lang-btn]’).forEach(btn => {
  btn.classList.toggle(‘active’, btn.dataset.langBtn === currentLang);
  });
  }
  
  // ── 切換語言 ─────────────────────────────────────────
  function setLang(code) {
  if (!SUPPORTED.includes(code)) return;
  currentLang = code;
  localStorage.setItem(STORAGE_KEY, code);
  applyDOM();
  // 觸發自定義事件，讓頁面 JS 可以監聽並更新動態內容
  document.dispatchEvent(new CustomEvent(‘zc:langchange’, { detail: { lang: code } }));
  }
  
  // ── DOMContentLoaded 後自動套用 ──────────────────────
  if (document.readyState === ‘loading’) {
  document.addEventListener(‘DOMContentLoaded’, applyDOM);
  } else {
  applyDOM();
  }
  
  // 公開 API
  return { t, phases, promptLang, lang, setLang, applyDOM };

})();
