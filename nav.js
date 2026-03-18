// ═══════════════════════════════════════════════════════
//  ZenCode 全站导航栏 + 語言切換器 · nav.js
//  依賴：i18n.js（需在本檔之前載入）
// ═══════════════════════════════════════════════════════
(function () {
  const currentPath = location.pathname.replace(/\/$/, '') || '/';

  const links = [
    { href: '/',        key: 'nav.reading' },
    { href: '/about',   key: 'nav.about'   },
    { href: '/privacy', key: 'nav.privacy' },
    { href: '/terms',   key: 'nav.terms'   },
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
})();
