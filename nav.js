// ═══════════════════════════════════════════════════════
//  ZenCode 全站导航栏 + 語言切換器 · nav.js
//  依賴：i18n.js（需在本檔之前載入）
// ═══════════════════════════════════════════════════════
(function () {
  const currentPath = location.pathname.replace(/\/$/, '') || '/';

  const links = [
    { href: '/',          key: 'nav.reading'  },
    { href: '/about',     key: 'nav.about'    },
    { href: '/feedback',  key: 'nav.feedback' },
    { href: '/privacy',   key: 'nav.privacy'  },
    { href: '/terms',     key: 'nav.terms'    },
  ];

  const langBtns = [
    { code: 'zh-TW', label: '繁' },
    { code: 'zh-CN', label: '简' },
    { code: 'en',    label: 'EN' },
    { code: 'ko',    label: '한' },
  ];

  const css = `<style id="zc-nav-style">
.zc-nav{position:fixed;top:0;left:0;right:0;z-index:999;height:56px;background:rgba(6,5,10,0.88);border-bottom:1px solid rgba(212,168,67,0.12);backdrop-filter:blur(20px);display:flex;align-items:center;justify-content:space-between;padding:0 28px;font-family:'Noto Sans TC',sans-serif;gap:12px;}
.zc-nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;font-family:'Ma Shan Zheng',cursive;font-size:1.25rem;color:#D4A843;letter-spacing:0.08em;filter:drop-shadow(0 0 12px rgba(212,168,67,0.35));transition:filter .3s;flex-shrink:0;}
.zc-nav-logo:hover{filter:drop-shadow(0 0 22px rgba(212,168,67,0.7));}
.zc-nav-logo-dot{width:6px;height:6px;background:#D4A843;transform:rotate(45deg);flex-shrink:0;box-shadow:0 0 8px rgba(212,168,67,0.6);}
.zc-nav-links{display:flex;align-items:center;gap:2px;flex:1;}
.zc-nav-link{padding:7px 13px;font-size:0.72rem;letter-spacing:0.22em;color:rgba(240,234,214,0.45);text-decoration:none;border:1px solid transparent;transition:all .25s;position:relative;white-space:nowrap;}
.zc-nav-link:hover{color:rgba(240,234,214,0.9);background:rgba(212,168,67,0.06);border-color:rgba(212,168,67,0.18);}
.zc-nav-link.active{color:#D4A843;border-color:rgba(212,168,67,0.3);background:rgba(212,168,67,0.07);}
.zc-nav-link.active::after{content:'';position:absolute;bottom:-1px;left:20%;right:20%;height:1px;background:#D4A843;box-shadow:0 0 6px rgba(212,168,67,0.6);}
.zc-lang-sw{display:flex;align-items:center;gap:1px;border:1px solid rgba(212,168,67,0.14);flex-shrink:0;}
.zc-lang-btn{padding:5px 9px;font-family:'Noto Sans TC',sans-serif;font-size:0.62rem;letter-spacing:0.05em;color:rgba(240,234,214,0.35);background:transparent;border:none;cursor:pointer;transition:all .2s;line-height:1;}
.zc-lang-btn:hover{color:rgba(240,234,214,0.8);background:rgba(212,168,67,0.07);}
.zc-lang-btn.active{color:#D4A843;background:rgba(212,168,67,0.12);}
.zc-lang-sep{width:1px;height:12px;background:rgba(212,168,67,0.15);flex-shrink:0;align-self:center;}
.zc-hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;border:none;background:transparent;flex-shrink:0;}
.zc-hamburger span{display:block;width:22px;height:1px;background:rgba(212,168,67,0.6);transition:all .3s;}
.zc-hamburger.open span:nth-child(1){transform:translateY(6px) rotate(45deg);}
.zc-hamburger.open span:nth-child(2){opacity:0;}
.zc-hamburger.open span:nth-child(3){transform:translateY(-6px) rotate(-45deg);}
.zc-mobile-menu{display:none;position:fixed;top:56px;left:0;right:0;z-index:998;background:rgba(6,5,10,0.97);border-bottom:1px solid rgba(212,168,67,0.12);backdrop-filter:blur(20px);flex-direction:column;padding:12px 0 16px;}
.zc-mobile-menu.open{display:flex;}
.zc-mobile-link{padding:13px 32px;font-family:'Noto Sans TC',sans-serif;font-size:0.8rem;letter-spacing:0.28em;color:rgba(240,234,214,0.5);text-decoration:none;border-left:2px solid transparent;transition:all .2s;}
.zc-mobile-link:hover,.zc-mobile-link.active{color:#D4A843;border-left-color:#D4A843;background:rgba(212,168,67,0.04);}
.zc-mobile-lang{display:flex;align-items:center;gap:8px;padding:14px 32px 6px;border-top:1px solid rgba(212,168,67,0.08);margin-top:8px;}
.zc-mobile-lang-label{font-size:0.6rem;letter-spacing:0.3em;color:rgba(212,168,67,0.4);font-family:'Noto Sans TC',sans-serif;margin-right:4px;}
.zc-mobile-lang-btn{padding:4px 10px;font-size:0.68rem;color:rgba(240,234,214,0.4);background:transparent;border:1px solid rgba(212,168,67,0.15);cursor:pointer;transition:all .2s;font-family:'Noto Sans TC',sans-serif;}
.zc-mobile-lang-btn.active{color:#D4A843;border-color:rgba(212,168,67,0.4);background:rgba(212,168,67,0.08);}
body{padding-top:56px !important;}
@media(max-width:680px){.zc-nav-links{display:none;}.zc-lang-sw{display:none;}.zc-hamburger{display:flex;}.zc-nav{padding:0 18px;}}
</style>`;

  function buildNav() {
    const L = typeof ZCI18n !== 'undefined' ? ZCI18n : null;
    const tl = k => L ? L.t(k) : k;
    const curLang = L ? L.lang() : 'zh-TW';

    const navLinksHTML = links.map(l =>
      `<a href="${l.href}" class="zc-nav-link${currentPath===l.href?' active':''}" data-i18n="${l.key}">${tl(l.key)}</a>`
    ).join('');

    const langSwHTML = langBtns.map((b,i) =>
      (i>0?'<div class="zc-lang-sep"></div>':'')+
      `<button class="zc-lang-btn${curLang===b.code?' active':''}" data-lang-btn="${b.code}" onclick="ZCI18n.setLang('${b.code}')">${b.label}</button>`
    ).join('');

    const mobileLinksHTML = links.map(l =>
      `<a href="${l.href}" class="zc-mobile-link${currentPath===l.href?' active':''}" data-i18n="${l.key}">${tl(l.key)}</a>`
    ).join('');

    const mobileLangHTML = langBtns.map(b =>
      `<button class="zc-mobile-lang-btn${curLang===b.code?' active':''}" data-lang-btn="${b.code}" onclick="ZCI18n.setLang('${b.code}');document.getElementById('zc-hbg').classList.remove('open');document.getElementById('zc-mm').classList.remove('open');">${b.label}</button>`
    ).join('');

    return `${css}
<nav class="zc-nav">
  <a href="/" class="zc-nav-logo"><div class="zc-nav-logo-dot"></div>ZenCode</a>
  <div class="zc-nav-links">${navLinksHTML}</div>
  <div class="zc-lang-sw">${langSwHTML}</div>
  <button class="zc-hamburger" id="zc-hbg" aria-label="menu"><span></span><span></span><span></span></button>
</nav>
<div class="zc-mobile-menu" id="zc-mm">
  ${mobileLinksHTML}
  <div class="zc-mobile-lang"><span class="zc-mobile-lang-label">LANG</span>${mobileLangHTML}</div>
</div>`;
  }

  document.body.insertAdjacentHTML('afterbegin', buildNav());

  document.getElementById('zc-hbg').addEventListener('click', function(){
    this.classList.toggle('open');
    document.getElementById('zc-mm').classList.toggle('open');
  });
  document.querySelectorAll('.zc-mobile-link').forEach(el=>{
    el.addEventListener('click',()=>{
      document.getElementById('zc-hbg').classList.remove('open');
      document.getElementById('zc-mm').classList.remove('open');
    });
  });

  // ── 時區選項多語言渲染 ──────────────────────────────
  const TZ_OPTIONS=[
    {v:'+8',  'zh-TW':'UTC+8 · 中國大陸/台灣/香港/新加坡/馬來西亞','zh-CN':'UTC+8 · 中国大陆/台湾/香港/新加坡/马来西亚','en':'UTC+8 · China/Taiwan/HK/Singapore/Malaysia','ko':'UTC+8 · 중국/대만/홍콩/싱가포르/말레이시아'},
    {v:'+9',  'zh-TW':'UTC+9 · 日本/韓國','zh-CN':'UTC+9 · 日本/韩国','en':'UTC+9 · Japan/South Korea','ko':'UTC+9 · 일본/한국'},
    {v:'+7',  'zh-TW':'UTC+7 · 泰國/越南/柬埔寨/印尼西部','zh-CN':'UTC+7 · 泰国/越南/柬埔寨/印尼西部','en':'UTC+7 · Thailand/Vietnam/Cambodia/W.Indonesia','ko':'UTC+7 · 태국/베트남/캄보디아/인도네시아 서부'},
    {v:'+6',  'zh-TW':'UTC+6 · 孟加拉/哈薩克東部','zh-CN':'UTC+6 · 孟加拉/哈萨克东部','en':'UTC+6 · Bangladesh/East Kazakhstan','ko':'UTC+6 · 방글라데시/동카자흐스탄'},
    {v:'+5.5','zh-TW':'UTC+5:30 · 印度/斯里蘭卡','zh-CN':'UTC+5:30 · 印度/斯里兰卡','en':'UTC+5:30 · India/Sri Lanka','ko':'UTC+5:30 · 인도/스리랑카'},
    {v:'+5',  'zh-TW':'UTC+5 · 巴基斯坦/烏茲別克','zh-CN':'UTC+5 · 巴基斯坦/乌兹别克','en':'UTC+5 · Pakistan/Uzbekistan','ko':'UTC+5 · 파키스탄/우즈베키스탄'},
    {v:'+4',  'zh-TW':'UTC+4 · 阿聯酋/阿曼/阿塞拜疆','zh-CN':'UTC+4 · 阿联酋/阿曼/阿塞拜疆','en':'UTC+4 · UAE/Oman/Azerbaijan','ko':'UTC+4 · 아랍에미리트/오만/아제르바이잔'},
    {v:'+3',  'zh-TW':'UTC+3 · 沙特/土耳其/莫斯科/肯尼亞','zh-CN':'UTC+3 · 沙特/土耳其/莫斯科/肯尼亚','en':'UTC+3 · Saudi/Turkey/Moscow/Kenya','ko':'UTC+3 · 사우디/터키/모스크바/케냐'},
    {v:'+2',  'zh-TW':'UTC+2 · 以色列/南非/埃及/東歐','zh-CN':'UTC+2 · 以色列/南非/埃及/东欧','en':'UTC+2 · Israel/South Africa/Egypt/E.Europe','ko':'UTC+2 · 이스라엘/남아프리카/이집트/동유럽'},
    {v:'+1',  'zh-TW':'UTC+1 · 西歐夏令時/西非','zh-CN':'UTC+1 · 西欧夏令时/西非','en':'UTC+1 · W.Europe DST/W.Africa','ko':'UTC+1 · 서유럽 서머타임/서아프리카'},
    {v:'+0',  'zh-TW':'UTC+0 · 英國冬季/愛爾蘭/葡萄牙/冰島','zh-CN':'UTC+0 · 英国冬季/爱尔兰/葡萄牙/冰岛','en':'UTC+0 · UK(winter)/Ireland/Portugal/Iceland','ko':'UTC+0 · 영국(겨울)/아일랜드/포르투갈/아이슬란드'},
    {v:'-1',  'zh-TW':'UTC-1 · 佛得角/亞速爾群島','zh-CN':'UTC-1 · 佛得角/亚速尔群岛','en':'UTC-1 · Cape Verde/Azores','ko':'UTC-1 · 카보베르데/아조레스'},
    {v:'-2',  'zh-TW':'UTC-2 · 巴西費爾南多島','zh-CN':'UTC-2 · 巴西费尔南多岛','en':'UTC-2 · Fernando de Noronha','ko':'UTC-2 · 페르난도 데 노로냐'},
    {v:'-3',  'zh-TW':'UTC-3 · 巴西東部/阿根廷/烏拉圭','zh-CN':'UTC-3 · 巴西东部/阿根廷/乌拉圭','en':'UTC-3 · E.Brazil/Argentina/Uruguay','ko':'UTC-3 · 브라질 동부/아르헨티나/우루과이'},
    {v:'-4',  'zh-TW':'UTC-4 · 加拿大大西洋/委內瑞拉/智利','zh-CN':'UTC-4 · 加拿大大西洋/委内瑞拉/智利','en':'UTC-4 · Atlantic Canada/Venezuela/Chile','ko':'UTC-4 · 캐나다 대서양/베네수엘라/칠레'},
    {v:'-5',  'zh-TW':'UTC-5 · 美國東部EST/秘魯','zh-CN':'UTC-5 · 美国东部EST/秘鲁','en':'UTC-5 · US Eastern(EST)/Peru','ko':'UTC-5 · 미국 동부(EST)/페루'},
    {v:'-6',  'zh-TW':'UTC-6 · 美國中部CST/墨西哥城','zh-CN':'UTC-6 · 美国中部CST/墨西哥城','en':'UTC-6 · US Central(CST)/Mexico City','ko':'UTC-6 · 미국 중부(CST)/멕시코시티'},
    {v:'-7',  'zh-TW':'UTC-7 · 美國山地MST/亞利桑那','zh-CN':'UTC-7 · 美国山地MST/亚利桑那','en':'UTC-7 · US Mountain(MST)/Arizona','ko':'UTC-7 · 미국 산악(MST)/애리조나'},
    {v:'-8',  'zh-TW':'UTC-8 · 美國西部PST/英屬哥倫比亞','zh-CN':'UTC-8 · 美国西部PST/不列颠哥伦比亚','en':'UTC-8 · US Pacific(PST)/British Columbia','ko':'UTC-8 · 미국 태평양(PST)/브리티시컬럼비아'},
    {v:'-9',  'zh-TW':'UTC-9 · 阿拉斯加','zh-CN':'UTC-9 · 阿拉斯加','en':'UTC-9 · Alaska','ko':'UTC-9 · 알래스카'},
    {v:'-10', 'zh-TW':'UTC-10 · 夏威夷/法屬波利尼西亞','zh-CN':'UTC-10 · 夏威夷/法属波利尼西亚','en':'UTC-10 · Hawaii/French Polynesia','ko':'UTC-10 · 하와이/프랑스령 폴리네시아'},
    {v:'-12', 'zh-TW':'UTC-12 · 貝克島/豪蘭島','zh-CN':'UTC-12 · 贝克岛/豪兰岛','en':'UTC-12 · Baker/Howland Islands','ko':'UTC-12 · 베이커 섬/하울랜드 섬'},
    {v:'+10', 'zh-TW':'UTC+10 · 澳洲東部（悉尼/墨爾本）','zh-CN':'UTC+10 · 澳洲东部（悉尼/墨尔本）','en':'UTC+10 · E.Australia(Sydney/Melbourne)','ko':'UTC+10 · 호주 동부(시드니/멜버른)'},
    {v:'+11', 'zh-TW':'UTC+11 · 所羅門群島/瓦努阿圖','zh-CN':'UTC+11 · 所罗门群岛/瓦努阿图','en':'UTC+11 · Solomon Islands/Vanuatu','ko':'UTC+11 · 솔로몬 제도/바누아투'},
    {v:'+12', 'zh-TW':'UTC+12 · 紐西蘭/斐濟/基里巴斯','zh-CN':'UTC+12 · 新西兰/斐济/基里巴斯','en':'UTC+12 · New Zealand/Fiji/Kiribati','ko':'UTC+12 · 뉴질랜드/피지/키리바시'},
  ];

  function renderTzOptions(){
    const lang=(typeof ZCI18n!=='undefined')?ZCI18n.lang():'zh-TW';
    const sel=document.getElementById('utz');
    if(!sel)return;
    const cur=sel.value||'+8';
    sel.innerHTML=TZ_OPTIONS.map(o=>`<option value="${o.v}"${o.v===cur?' selected':''}>${o[lang]||o['zh-TW']}</option>`).join('');
  }

  // 初始渲染
  renderTzOptions();
  // 語言切換時重新渲染
  document.addEventListener('zc:langchange', renderTzOptions);
})();
