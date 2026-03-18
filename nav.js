// ═══════════════════════════════════════════════════════
//  ZenCode 全站导航栏 · nav.js
//  在每个页面 <body> 开头 <script src="/nav.js"></script> 后调用 injectNav()
// ═══════════════════════════════════════════════════════
(function(){
  const currentPath = location.pathname.replace(/\/$/, '') || '/';

  const links = [
    { href: '/',              label: '命盤推演' },
    { href: '/about',         label: '關於我們' },
    { href: '/privacy',       label: '隱私政策' },
    { href: '/terms',         label: '使用條款' },
  ];

  const css = `
<style id="zc-nav-style">
.zc-nav{
  position:fixed;top:0;left:0;right:0;z-index:999;
  height:56px;
  background:rgba(6,5,10,0.88);
  border-bottom:1px solid rgba(212,168,67,0.12);
  backdrop-filter:blur(20px);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 32px;
  font-family:'Noto Sans TC',sans-serif;
}
.zc-nav-logo{
  display:flex;align-items:center;gap:10px;
  text-decoration:none;
  font-family:'Ma Shan Zheng',cursive;
  font-size:1.25rem;
  color:#D4A843;
  letter-spacing:0.08em;
  filter:drop-shadow(0 0 12px rgba(212,168,67,0.35));
  transition:filter .3s;
}
.zc-nav-logo:hover{filter:drop-shadow(0 0 22px rgba(212,168,67,0.7));}
.zc-nav-logo-dot{
  width:6px;height:6px;
  background:#D4A843;
  transform:rotate(45deg);
  flex-shrink:0;
  box-shadow:0 0 8px rgba(212,168,67,0.6);
}
.zc-nav-links{
  display:flex;align-items:center;gap:2px;
}
.zc-nav-link{
  padding:7px 14px;
  font-size:0.72rem;
  letter-spacing:0.25em;
  color:rgba(240,234,214,0.45);
  text-decoration:none;
  border:1px solid transparent;
  transition:all .25s;
  position:relative;
}
.zc-nav-link:hover{
  color:rgba(240,234,214,0.9);
  background:rgba(212,168,67,0.06);
  border-color:rgba(212,168,67,0.18);
}
.zc-nav-link.active{
  color:#D4A843;
  border-color:rgba(212,168,67,0.3);
  background:rgba(212,168,67,0.07);
}
.zc-nav-link.active::after{
  content:'';
  position:absolute;bottom:-1px;left:20%;right:20%;
  height:1px;background:#D4A843;
  box-shadow:0 0 6px rgba(212,168,67,0.6);
}
/* 汉堡菜单 */
.zc-hamburger{
  display:none;flex-direction:column;gap:5px;
  cursor:pointer;padding:8px;border:none;background:transparent;
}
.zc-hamburger span{
  display:block;width:22px;height:1px;
  background:rgba(212,168,67,0.6);
  transition:all .3s;
}
.zc-hamburger.open span:nth-child(1){transform:translateY(6px) rotate(45deg);}
.zc-hamburger.open span:nth-child(2){opacity:0;}
.zc-hamburger.open span:nth-child(3){transform:translateY(-6px) rotate(-45deg);}
/* 移动端下拉 */
.zc-mobile-menu{
  display:none;
  position:fixed;top:56px;left:0;right:0;z-index:998;
  background:rgba(6,5,10,0.97);
  border-bottom:1px solid rgba(212,168,67,0.12);
  backdrop-filter:blur(20px);
  flex-direction:column;
  padding:12px 0 20px;
}
.zc-mobile-menu.open{display:flex;}
.zc-mobile-link{
  padding:14px 32px;
  font-family:'Noto Sans TC',sans-serif;
  font-size:0.8rem;letter-spacing:0.3em;
  color:rgba(240,234,214,0.5);
  text-decoration:none;
  border-left:2px solid transparent;
  transition:all .2s;
}
.zc-mobile-link:hover,.zc-mobile-link.active{
  color:#D4A843;
  border-left-color:#D4A843;
  background:rgba(212,168,67,0.04);
}
/* 给 body 留出导航栏空间 */
body{padding-top:56px !important;}
@media(max-width:600px){
  .zc-nav-links{display:none;}
  .zc-hamburger{display:flex;}
  .zc-nav{padding:0 20px;}
}
</style>`;

  const navHTML = `
${css}
<nav class="zc-nav">
  <a href="/" class="zc-nav-logo">
    <div class="zc-nav-logo-dot"></div>
    ZenCode
  </a>
  <div class="zc-nav-links">
    ${links.map(l => `<a href="${l.href}" class="zc-nav-link${currentPath===l.href?' active':''}">${l.label}</a>`).join('')}
  </div>
  <button class="zc-hamburger" id="zc-hbg" aria-label="选单">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="zc-mobile-menu" id="zc-mm">
  ${links.map(l => `<a href="${l.href}" class="zc-mobile-link${currentPath===l.href?' active':''}">${l.label}</a>`).join('')}
</div>`;

  // 注入到 body 最前面
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // 汉堡菜单交互
  document.getElementById('zc-hbg').addEventListener('click', function(){
    this.classList.toggle('open');
    document.getElementById('zc-mm').classList.toggle('open');
  });

  // 点击链接关闭菜单
  document.querySelectorAll('.zc-mobile-link').forEach(el => {
    el.addEventListener('click', () => {
      document.getElementById('zc-hbg').classList.remove('open');
      document.getElementById('zc-mm').classList.remove('open');
    });
  });
})();
