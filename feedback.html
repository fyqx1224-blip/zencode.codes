<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>命盤反饋 · ZenCode</title>
<meta name="description" content="幫助我們改善命盤推演的準確性，提交您的使用反饋。">
<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Serif+TC:wght@300;400;500;700&family=Noto+Sans+TC:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root{--gold:#D4A843;--gold-b:#F0C96A;--gold-dim:rgba(212,168,67,0.18);--bg:#06050A;--text:#F0EAD6;--text-d:rgba(240,234,214,0.55);--text-f:rgba(240,234,214,0.22);}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html,body{background:var(--bg);color:var(--text);font-family:'Noto Serif TC',serif;overflow-x:hidden;min-height:100vh;}
#bg-canvas{position:fixed;inset:0;z-index:0;pointer-events:none;}
.grid-ov{position:fixed;inset:0;z-index:1;pointer-events:none;background-image:linear-gradient(rgba(212,168,67,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,0.022) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%);}
.scan{position:fixed;top:0;left:0;right:0;height:2px;z-index:2;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(212,168,67,0.1),rgba(212,168,67,0.32),rgba(212,168,67,0.1),transparent);animation:scan 12s linear infinite;}
@keyframes scan{0%{top:-2px}100%{top:100vh}}
.wrap{position:relative;z-index:10;max-width:680px;margin:0 auto;padding:80px 24px 100px;}

/* Hero */
.pg-hero{text-align:center;padding:60px 0 64px;border-bottom:1px solid rgba(212,168,67,0.1);}
.pg-tag{display:inline-flex;align-items:center;gap:12px;font-family:'Noto Sans TC',sans-serif;font-size:0.6rem;letter-spacing:0.55em;color:var(--gold);margin-bottom:24px;opacity:0;animation:fsd .8s ease .1s forwards;}
.pg-tag::before,.pg-tag::after{content:'';width:24px;height:1px;background:linear-gradient(90deg,transparent,var(--gold));}
.pg-tag::after{transform:scaleX(-1);}
.pg-title{font-family:'Ma Shan Zheng',cursive;font-size:clamp(2.6rem,8vw,4.4rem);line-height:1;background:linear-gradient(160deg,#F8EFC0 0%,#D4A843 40%,#A0680A 70%,#D4A843 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 40px rgba(212,168,67,0.3));opacity:0;animation:fsd .9s ease .25s forwards;}
.pg-sub{font-family:'Noto Sans TC',sans-serif;font-size:0.78rem;letter-spacing:0.3em;color:var(--text-d);margin-top:16px;line-height:1.9;opacity:0;animation:fsd 1s ease .4s forwards;}

/* 表單整體 */
.fb-form{margin-top:52px;display:flex;flex-direction:column;gap:36px;}

/* 區塊標題 */
.fb-section{display:flex;flex-direction:column;gap:14px;}
.fb-label{font-family:'Noto Sans TC',sans-serif;font-size:0.62rem;letter-spacing:0.42em;color:var(--gold);text-transform:uppercase;display:flex;align-items:center;gap:8px;}
.fb-label::before{content:'';width:3px;height:3px;background:var(--gold);transform:rotate(45deg);flex-shrink:0;}

/* 命盤顯示區（只讀） */
.ganzhi-display{background:rgba(212,168,67,0.03);border:1px solid rgba(212,168,67,0.14);padding:20px 24px;display:flex;align-items:center;gap:16px;}
.ganzhi-chars{font-family:'Ma Shan Zheng',cursive;font-size:1.6rem;color:var(--gold);letter-spacing:0.18em;line-height:1;}
.ganzhi-meta{font-family:'Noto Sans TC',sans-serif;font-size:0.68rem;color:var(--text-d);line-height:1.9;}
.ganzhi-empty{font-family:'Noto Sans TC',sans-serif;font-size:0.75rem;color:var(--text-f);letter-spacing:0.15em;}

/* 星級評分 */
.stars{display:flex;gap:6px;align-items:center;}
.star-btn{background:none;border:none;cursor:pointer;font-size:1.5rem;color:rgba(212,168,67,0.2);transition:all .2s;padding:4px;line-height:1;position:relative;}
.star-btn:hover,.star-btn.lit{color:var(--gold);filter:drop-shadow(0 0 8px rgba(212,168,67,0.5));}
.star-label{font-family:'Noto Sans TC',sans-serif;font-size:0.68rem;color:var(--text-f);letter-spacing:0.1em;margin-left:8px;transition:color .2s;}
.star-label.show{color:rgba(212,168,67,0.6);}

/* 多選標籤 */
.chips{display:flex;flex-wrap:wrap;gap:8px;}
.chip{padding:7px 14px;font-family:'Noto Sans TC',sans-serif;font-size:0.68rem;letter-spacing:0.15em;color:var(--text-d);border:1px solid rgba(212,168,67,0.18);background:transparent;cursor:pointer;transition:all .22s;-webkit-appearance:none;}
.chip:hover{border-color:rgba(212,168,67,0.42);color:var(--text);}
.chip.active{border-color:var(--gold);color:var(--gold-b);background:rgba(212,168,67,0.08);}

/* 文字輸入 */
.fb-input{width:100%;padding:13px 16px;background:rgba(0,0,0,0.5);border:1px solid rgba(212,168,67,0.15);color:var(--text);font-family:'Noto Serif TC',serif;font-size:0.92rem;letter-spacing:0.04em;outline:none;transition:all .3s;resize:vertical;min-height:88px;border-radius:2px;}
.fb-input::placeholder{color:var(--text-f);font-size:0.8rem;}
.fb-input:focus{background:rgba(212,168,67,0.04);border-color:rgba(212,168,67,0.42);box-shadow:0 0 24px rgba(212,168,67,0.07);}
.fb-input-line{min-height:auto;resize:none;height:48px;padding:13px 16px;}

/* 提示文字 */
.fb-hint{font-family:'Noto Sans TC',sans-serif;font-size:0.63rem;color:var(--text-f);letter-spacing:0.08em;line-height:1.7;padding-left:4px;}

/* 提交按鈕 */
.submit-row{margin-top:8px;}
.fb-btn{width:100%;padding:16px;background:linear-gradient(135deg,#1A3A1A 0%,#2E6B2E 55%,#3A8A3A 100%);color:rgba(255,255,255,0.92);border:none;border-radius:2px;font-family:'Ma Shan Zheng',cursive;font-size:1.3rem;letter-spacing:5px;cursor:pointer;position:relative;overflow:hidden;transition:transform .2s,box-shadow .3s;box-shadow:0 6px 32px rgba(40,120,40,0.25),inset 0 1px 0 rgba(255,255,255,0.07);}
.fb-btn::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);transition:left .6s ease;}
.fb-btn:hover::before{left:100%;}
.fb-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(60,160,60,0.32);}
.fb-btn:active{transform:translateY(0);}
.fb-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none;}

/* 成功狀態 */
.success-box{display:none;text-align:center;padding:56px 32px;border:1px solid rgba(90,184,108,0.25);background:rgba(90,184,108,0.04);animation:fsu .5s ease both;}
.success-box.show{display:block;}
.success-icon{font-family:'Ma Shan Zheng',cursive;font-size:3.5rem;color:#5AB86C;filter:drop-shadow(0 0 20px rgba(90,184,108,0.45));margin-bottom:20px;line-height:1;}
.success-title{font-family:'Ma Shan Zheng',cursive;font-size:1.6rem;color:#5AB86C;letter-spacing:0.12em;margin-bottom:12px;}
.success-sub{font-family:'Noto Sans TC',sans-serif;font-size:0.78rem;color:var(--text-d);letter-spacing:0.15em;line-height:2;}
.success-back{display:inline-block;margin-top:28px;padding:10px 28px;border:1px solid rgba(212,168,67,0.3);color:rgba(212,168,67,0.7);font-family:'Noto Sans TC',sans-serif;font-size:0.7rem;letter-spacing:0.3em;text-decoration:none;transition:all .2s;}
.success-back:hover{border-color:var(--gold);color:var(--gold);background:rgba(212,168,67,0.05);}

/* 錯誤提示 */
.err-bar{display:none;padding:12px 16px;background:rgba(200,50,30,0.08);border:1px solid rgba(200,50,30,0.3);font-family:'Noto Sans TC',sans-serif;font-size:0.72rem;color:rgba(240,100,80,0.9);letter-spacing:0.08em;margin-top:-16px;}
.err-bar.show{display:block;}

/* 分隔 */
.divider{display:flex;align-items:center;gap:16px;opacity:0.25;margin:4px 0;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--gold);}
.divider span{font-family:'Ma Shan Zheng',cursive;font-size:1rem;color:var(--gold);}

@keyframes fsd{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}
@keyframes fsu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media(max-width:520px){.chips{gap:6px;}.chip{font-size:0.63rem;padding:6px 11px;}}
</style>
<script src="/i18n.js"></script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9117931248328967" crossorigin="anonymous"></script>
</head>
<body>
<canvas id="bg-canvas"></canvas>
<div class="grid-ov"></div>
<div class="scan"></div>
<script src="/nav.js"></script>

<div class="wrap">
  <div class="pg-hero">
    <div class="pg-tag">ZenCode · 命盤反饋 · Feedback</div>
    <div class="pg-title">命盤校準</div>
    <div class="pg-sub">您的每一條反饋<br>都將幫助命理推演系統更趨精準</div>
  </div>

  <!-- 主表單 -->
  <div class="fb-form" id="fb-form">

    <!-- 1. 命盤信息（自動帶入，可手填） -->
    <div class="fb-section">
      <div class="fb-label">本次推演的命盤</div>
      <div class="ganzhi-display" id="ganzhi-display">
        <div id="ganzhi-loaded" style="display:none;flex:1;">
          <div class="ganzhi-chars" id="ganzhi-chars">—</div>
          <div class="ganzhi-meta" id="ganzhi-meta"></div>
        </div>
        <div id="ganzhi-manual" style="flex:1;">
          <div class="ganzhi-empty">未偵測到命盤資料，請手動填寫四柱干支</div>
          <input type="text" class="fb-input fb-input-line" id="inp-ganzhi" placeholder="如：甲子 丙寅 庚午 壬申" style="margin-top:10px;height:44px;">
        </div>
      </div>
    </div>

    <div class="divider"><span>✦</span></div>

    <!-- 2. 整體評分 -->
    <div class="fb-section">
      <div class="fb-label">整體準確度評分</div>
      <div class="stars" id="stars">
        <button class="star-btn" data-v="1" onclick="setRating(1)" title="1星">★</button>
        <button class="star-btn" data-v="2" onclick="setRating(2)" title="2星">★</button>
        <button class="star-btn" data-v="3" onclick="setRating(3)" title="3星">★</button>
        <button class="star-btn" data-v="4" onclick="setRating(4)" title="4星">★</button>
        <button class="star-btn" data-v="5" onclick="setRating(5)" title="5星">★</button>
        <span class="star-label" id="star-label">請評分</span>
      </div>
    </div>

    <div class="divider"><span>✦</span></div>

    <!-- 3. 哪裡不準 -->
    <div class="fb-section">
      <div class="fb-label">哪些部分與您的實際情況不符（可多選）</div>
      <div class="chips" id="chips">
        <button class="chip" data-field="格局定性" onclick="toggleChip(this)">格局定性</button>
        <button class="chip" data-field="五行分析" onclick="toggleChip(this)">五行分析</button>
        <button class="chip" data-field="大運判斷" onclick="toggleChip(this)">大運判斷</button>
        <button class="chip" data-field="流年預測" onclick="toggleChip(this)">流年預測</button>
        <button class="chip" data-field="婚姻感情" onclick="toggleChip(this)">婚姻感情</button>
        <button class="chip" data-field="事業財運" onclick="toggleChip(this)">事業財運</button>
        <button class="chip" data-field="健康宮位" onclick="toggleChip(this)">健康宮位</button>
        <button class="chip" data-field="神煞吉凶" onclick="toggleChip(this)">神煞吉凶</button>
        <button class="chip" data-field="整體偏差" onclick="toggleChip(this)">整體偏差</button>
        <button class="chip" data-field="其他" onclick="toggleChip(this)">其他</button>
      </div>
      <div class="fb-hint">若整體都準確可不選</div>
    </div>

    <div class="divider"><span>✦</span></div>

    <!-- 4. 具體糾正 -->
    <div class="fb-section">
      <div class="fb-label">您的補充與糾正（選填）</div>
      <textarea class="fb-input" id="inp-correction" placeholder="請描述哪裡不準確，或您認為正確的判斷應該是什麼。例如：「系統說大運走偏財，但實際我的事業運很強，應為正財格…」" rows="4"></textarea>
    </div>

    <!-- 5. 實際發生的事 -->
    <div class="fb-section">
      <div class="fb-label">您的實際人生經歷（最有參考價值）</div>
      <textarea class="fb-input" id="inp-outcome" placeholder="這部分完全匿名，幫助最大。例如：「2019年壬子大運確實是事業轉折，但方向是創業而非升職…」或「感情運確實應驗，39歲遇到了…」" rows="5"></textarea>
      <div class="fb-hint">✦ 此欄資料匿名儲存，僅用於改善推演模型，不會對外公開</div>
    </div>

    <div class="err-bar" id="err-bar">請至少完成評分後再提交</div>

    <div class="submit-row">
      <button class="fb-btn" id="fb-btn" onclick="submitFeedback()">提交反饋</button>
    </div>

  </div>

  <!-- 成功頁 -->
  <div class="success-box" id="success-box">
    <div class="success-icon">易</div>
    <div class="success-title">反饋已記錄</div>
    <div class="success-sub">感謝您的校準貢獻<br>每一條記錄都讓命盤推演更趨精準</div>
    <a href="/" class="success-back">返回命盤推演</a>
  </div>

</div><!-- /wrap -->

<footer style="position:relative;z-index:10;text-align:center;padding:32px 24px;border-top:1px solid rgba(212,168,67,0.08);font-family:'Noto Sans TC',sans-serif;font-size:0.65rem;color:rgba(240,234,214,0.22);letter-spacing:0.15em;line-height:2.2;">
  <div style="margin-bottom:10px;">
    <a href="/about" style="color:rgba(212,168,67,0.4);text-decoration:none;margin:0 12px;" onmouseover="this.style.color='#D4A843'" onmouseout="this.style.color='rgba(212,168,67,0.4)'">關於我們</a>
    <span style="color:rgba(212,168,67,0.15)">·</span>
    <a href="/privacy" style="color:rgba(212,168,67,0.4);text-decoration:none;margin:0 12px;" onmouseover="this.style.color='#D4A843'" onmouseout="this.style.color='rgba(212,168,67,0.4)'">隱私政策</a>
    <span style="color:rgba(212,168,67,0.15)">·</span>
    <a href="/terms" style="color:rgba(212,168,67,0.4);text-decoration:none;margin:0 12px;" onmouseover="this.style.color='#D4A843'" onmouseout="this.style.color='rgba(212,168,67,0.4)'">使用條款</a>
  </div>
  <div>© 2025 ZenCode · 命運檔案 · 僅供娛樂參考</div>
</footer>

<script>
/* ── 背景星空（複用主頁） ── */
(function(){
  const c=document.getElementById('bg-canvas'),ctx=c.getContext('2d');
  let W,H,stars=[];
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;}
  resize();addEventListener('resize',()=>{resize();init();});
  function init(){
    stars=[];
    for(let i=0;i<120;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*0.9+0.1,a:Math.random(),da:(Math.random()-0.5)*0.004});
  }
  init();
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(6,5,10,0)';
    stars.forEach(s=>{
      s.a=Math.max(0.05,Math.min(0.7,s.a+s.da));
      if(s.a<=0.05||s.a>=0.7)s.da*=-1;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(212,168,67,${s.a})`;ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 狀態 ── */
let rating = 0;
const STAR_LABELS = ['','感覺不太準','有些出入','基本吻合','相當準確','非常精準'];

/* ── 嘗試從 sessionStorage 讀取上一次命盤資料 ── */
(function(){
  try{
    const raw = sessionStorage.getItem('zc_last_bazi');
    if(!raw) return;
    const d = JSON.parse(raw);
    if(d && d.ganzhi){
      document.getElementById('ganzhi-chars').textContent = d.ganzhi;
      const meta = [d.name ? `命主：${d.name}` : '', d.riZhu ? `日主：${d.riZhu}` : ''].filter(Boolean).join('　');
      document.getElementById('ganzhi-meta').textContent = meta;
      document.getElementById('ganzhi-loaded').style.display = 'flex';
      document.getElementById('ganzhi-manual').style.display = 'none';
    }
  }catch(e){}
})();

/* ── 星級評分 ── */
function setRating(v){
  rating = v;
  document.querySelectorAll('.star-btn').forEach(btn=>{
    btn.classList.toggle('lit', Number(btn.dataset.v) <= v);
  });
  const lbl = document.getElementById('star-label');
  lbl.textContent = STAR_LABELS[v] || '';
  lbl.classList.add('show');
  document.getElementById('err-bar').classList.remove('show');
}

/* ── 多選標籤 ── */
function toggleChip(el){
  el.classList.toggle('active');
}

/* ── 提交 ── */
async function submitFeedback(){
  if(!rating){
    document.getElementById('err-bar').classList.add('show');
    document.getElementById('stars').scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }

  const btn = document.getElementById('fb-btn');
  btn.disabled = true;
  btn.textContent = '提交中…';

  // 收集命盤資料
  let ganzhi = '', ri_zhu = '', name = '';
  try{
    const raw = sessionStorage.getItem('zc_last_bazi');
    if(raw){
      const d = JSON.parse(raw);
      ganzhi  = d.ganzhi  || '';
      ri_zhu  = d.riZhu   || '';
      name    = d.name    || '';
    }
  }catch(e){}
  // 若是手動輸入
  if(!ganzhi){
    ganzhi = document.getElementById('inp-ganzhi').value.trim();
  }

  // 收集勾選的錯誤欄位
  const wrongFields = [...document.querySelectorAll('.chip.active')].map(el=>el.dataset.field);

  const payload = {
    name,
    ganzhi,
    ri_zhu,
    rating,
    wrong_fields:   wrongFields,
    correction:     document.getElementById('inp-correction').value.trim() || null,
    actual_outcome: document.getElementById('inp-outcome').value.trim()    || null,
    lang: typeof ZCI18n !== 'undefined' ? ZCI18n.lang() : 'zh-TW',
  };

  try{
    const res = await fetch('/api/feedback', {
      method:  'POST',
      headers: {'Content-Type':'application/json'},
      body:    JSON.stringify(payload),
    });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);

    // 成功
    document.getElementById('fb-form').style.display  = 'none';
    document.getElementById('success-box').classList.add('show');
    window.scrollTo({top:0,behavior:'smooth'});

  }catch(err){
    btn.disabled = false;
    btn.textContent = '提交反饋';
    document.getElementById('err-bar').textContent = `提交失敗，請稍後重試（${err.message}）`;
    document.getElementById('err-bar').classList.add('show');
  }
}
</script>
</body>
</html>
