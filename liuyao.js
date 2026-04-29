/**
 * ZenCode - 六爻排盘核心逻辑
 * 约定数值：6老阴(×变阳), 7少阳(单), 8少阴(拆), 9老阳(○变阴)
 */

// 全局状态：存放当前排出的 6 个爻 (索引 0 为初爻，5 为上爻)
let currentYaos = [];

// ================= 1. 初始化历法与时间 =================
function initDateTime() {
    if (typeof Lunar === 'undefined') {
        document.getElementById('dynamic-info').innerHTML = "<span style='color:red'>历法库加载失败，请检查网络。</span>";
        return;
    }

    const now = new Date();
    const d = Lunar.fromDate(now);
    
    const solarDate = d.getSolar().toYmdHms();
    const gzYear = d.getYearInGanZhi();
    const gzMonth = d.getMonthInGanZhi();
    const gzDay = d.getDayInGanZhi();
    const gzTime = d.getTimeZhi();
    const xunKong = d.getDayXunKong();

    const html = `
        <span class="info-highlight">当前测算：</span>ZenCode 排盘演示<br>
        <span class="info-highlight">公历时间：</span>${solarDate}<br>
        <span class="info-highlight">干支历法：</span>${gzYear}年 ${gzMonth}月 ${gzDay}日 ${gzTime}时 <span style="color:var(--zc-text-muted)">（旬空：${xunKong}）</span>
    `;
    document.getElementById('dynamic-info').innerHTML = html;
}

// ================= 2. 视图流转控制 =================
function showScreen(screenId) {
    document.querySelectorAll('.flow-screen').forEach(el => el.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
}

function resetFlow() {
    currentYaos = [];
    showScreen('screen-choice');
    // 每次重置刷新一下时间
    initDateTime();
}

function startMethod(method) {
    currentYaos = [];
    if (method === 'time') {
        executeTimeMethod();
    } else if (method === 'shake') {
        setupShakeMethod();
    } else if (method === 'manual') {
        setupManualMethod();
    }
}

// ================= 3. 具体起卦算法 =================

// A. 时间起卦 (模拟自动生成一卦)
function executeTimeMethod() {
    // 模拟时间起卦：通常只有一个动爻
    for(let i=0; i<6; i++) {
        currentYaos.push(Math.random() > 0.5 ? 7 : 8); 
    }
    // 随机指定一个动爻 (将其变为 6 或 9)
    let changingIndex = Math.floor(Math.random() * 6);
    currentYaos[changingIndex] = currentYaos[changingIndex] === 7 ? 9 : 6;
    
    renderFinalResult();
}

// B. 铜钱摇卦 (交互逻辑)
function setupShakeMethod() {
    showScreen('screen-interact');
    document.getElementById('interact-title').innerText = "心诚则灵 · 默念所测之事";
    document.getElementById('interact-manual').style.display = 'none';
    document.getElementById('interact-shake').style.display = 'block';
    
    const progressDiv = document.getElementById('shake-progress');
    progressDiv.innerHTML = ''; 
    
    const btn = document.getElementById('btn-shake');
    btn.innerText = "掷出铜钱 (第1次)";
    btn.disabled = false;
    
    btn.onclick = function() {
        if (currentYaos.length >= 6) return;
        
        // 模拟铜钱概率
        const coinRoll = () => Math.random() > 0.5 ? 2 : 3;
        const sum = coinRoll() + coinRoll() + coinRoll(); 
        currentYaos.push(sum);
        
        // 在屏幕上动态画出这一爻
        let isYang = (sum === 7 || sum === 9);
        let yaoHtml = isYang ? `<div class="yao-symbol yao-yang"><div class="line"></div></div>` 
                             : `<div class="yao-symbol yao-yin"><div class="line"></div><div class="line"></div></div>`;
        progressDiv.insertAdjacentHTML('beforeend', `<div style="opacity: 0.8;">${yaoHtml}</div>`);
        
        if (currentYaos.length === 6) {
            btn.innerText = "正在排盘...";
            btn.disabled = true;
            setTimeout(renderFinalResult, 600); // 制造推演的停顿感
        } else {
            btn.innerText = `掷出铜钱 (第${currentYaos.length + 1}次)`;
        }
    };
}

// C. 手工起卦 (表单生成)
function setupManualMethod() {
    showScreen('screen-interact');
    document.getElementById('interact-title').innerText = "手工排定阴阳";
    document.getElementById('interact-shake').style.display = 'none';
    document.getElementById('interact-manual').style.display = 'block';
    
    const container = document.getElementById('manual-rows');
    container.innerHTML = '';
    const names = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    
    for(let i=0; i<6; i++) {
        container.innerHTML += `
            <div class="manual-yao-group">
                <span>${names[i]}</span>
                <div class="yao-radio">
                    <label><input type="radio" name="yao${i}" value="6"> 老阴(×)</label>
                    <label><input type="radio" name="yao${i}" value="8" checked> 少阴(--)</label>
                    <label><input type="radio" name="yao${i}" value="7"> 少阳(—)</label>
                    <label><input type="radio" name="yao${i}" value="9"> 老阳(○)</label>
                </div>
            </div>
        `;
    }
}

function generateManualGua() {
    currentYaos = [];
    for(let i=0; i<6; i++) {
        let val = document.querySelector(`input[name="yao${i}"]:checked`).value;
        currentYaos.push(parseInt(val));
    }
    renderFinalResult();
}

// ================= 4. 核心渲染引擎 =================
function renderFinalResult() {
    showScreen('screen-result');
    
    const mainContainer = document.getElementById('dynamic-main-gua');
    const changeContainer = document.getElementById('dynamic-change-gua');
    mainContainer.innerHTML = '';
    changeContainer.innerHTML = '';
    
    // 这里暂时用硬编码的标题占位，后续你接了“八宫算法”后可动态替换
    document.getElementById('main-gua-title').innerText = "本卦展示";
    document.getElementById('change-gua-title').innerText = "变卦展示";

    // 注意：UI 渲染需要从上往下画（即从上爻 i=5 画到初爻 i=0）
    for(let i=5; i>=0; i--) {
        let val = currentYaos[i];
        
        // --- 本卦渲染 ---
        let isMainYang = (val === 7 || val === 9);
        let mark = val === 9 ? '○→' : (val === 6 ? '×→' : '');
        let mainSymbolClass = isMainYang ? 'yao-yang' : 'yao-yin';
        let mainSymbolHtml = isMainYang ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>';
        
        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="yao-row">
                <span class="yao-shishen">--</span>
                <span class="yao-text">干支占位</span>
                <div class="yao-symbol ${mainSymbolClass}">${mainSymbolHtml}</div>
                <span class="changing-mark">${mark}</span>
                <span class="yao-position"></span>
            </div>
        `);
        
        // --- 变卦渲染 ---
        // 变卦逻辑：9变阴，6变阳，7/8维持原状
        let isChangeYang = val === 9 ? false : (val === 6 ? true : isMainYang);
        let changeSymbolClass = isChangeYang ? 'yao-yang' : 'yao-yin';
        let changeSymbolHtml = isChangeYang ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>';
        
        changeContainer.insertAdjacentHTML('beforeend', `
            <div class="yao-row">
                <div class="yao-symbol ${changeSymbolClass}">${changeSymbolHtml}</div>
                <span class="yao-text" style="text-align:right">干支占位</span>
                <span class="yao-position"></span>
            </div>
        `);
    }
}

// 页面加载完毕后执行初始化
document.addEventListener('DOMContentLoaded', () => {
    initDateTime();
});
