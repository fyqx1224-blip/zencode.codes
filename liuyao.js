/**
 * ZenCode - 六爻排盘核心逻辑 (去内联样式纯净版)
 */

let currentYaos = [];
let currentDayTgIdx = 0; 
let manualYaos = [];     

// ================= 神煞计算算法 =================
const DZ_ARR = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
function getShensha(tgIdx, dzIdx) {
    let ss = [];
    if ([2,6,10].includes(dzIdx)) ss.push("驿马-" + DZ_ARR[8]);
    else if ([8,0,4].includes(dzIdx)) ss.push("驿马-" + DZ_ARR[2]);
    else if ([5,9,1].includes(dzIdx)) ss.push("驿马-" + DZ_ARR[11]);
    else if ([11,3,7].includes(dzIdx)) ss.push("驿马-" + DZ_ARR[5]);
    
    if ([2,6,10].includes(dzIdx)) ss.push("桃花-" + DZ_ARR[3]);
    else if ([8,0,4].includes(dzIdx)) ss.push("桃花-" + DZ_ARR[9]);
    else if ([5,9,1].includes(dzIdx)) ss.push("桃花-" + DZ_ARR[6]);
    else if ([11,3,7].includes(dzIdx)) ss.push("桃花-" + DZ_ARR[0]);
    
    if ([0,4,6].includes(tgIdx)) ss.push("贵人-丑,未");
    else if ([1,5].includes(tgIdx)) ss.push("贵人-子,申");
    else if ([2,3].includes(tgIdx)) ss.push("贵人-亥,酉");
    else if ([8,9].includes(tgIdx)) ss.push("贵人-卯,巳");
    else if (tgIdx === 7) ss.push("贵人-午,寅");
    
    const luMap = {0:"寅", 1:"卯", 2:"巳", 3:"午", 4:"巳", 5:"午", 6:"申", 7:"酉", 8:"亥", 9:"子"};
    ss.push("日禄-" + luMap[tgIdx]);
    return ss.join("　");
}

function initDateTime() {
    if (typeof Lunar === 'undefined') return;
    const now = new Date();
    const d = Lunar.fromDate(now);
    currentDayTgIdx = d.getDayGanIndex(); 
    
    const html = `
        <span class="info-highlight">当前推演：</span>ZenCode 命運檔案<br>
        <span class="info-highlight">公历时间：</span>${d.getSolar().toYmdHms()}<br>
        <span class="info-highlight">干支历法：</span>${d.getYearInGanZhi()}年 ${d.getMonthInGanZhi()}月 ${d.getDayInGanZhi()}日 ${d.getTimeInGanZhi()}时 <span style="color:var(--zc-text-muted)">（旬空：${d.getDayXunKong()}）</span><br>
        <div style="font-size: 0.9rem; color: var(--zc-gold-dark); margin-top: 6px; letter-spacing: 1px;">
            神煞：${getShensha(currentDayTgIdx, d.getDayZhiIndex())}
        </div>
    `;
    document.getElementById('dynamic-info').innerHTML = html;
}

function showScreen(screenId) {
    document.querySelectorAll('.flow-screen').forEach(el => el.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
}

window.resetFlow = function() {
    currentYaos = [];
    showScreen('screen-choice');
    const panel = document.getElementById('main-panel');
    const layout = document.getElementById('gua-layout');
    panel.style.maxWidth = '850px';
    layout.className = 'gua-grid'; // 清除静卦类名
    initDateTime();
}

window.startMethod = function(method) {
    currentYaos = [];
    if (method === 'time') executeTimeMethod();
    else if (method === 'shake') setupShakeMethod();
    else if (method === 'manual') setupManualMethod();
}

function executeTimeMethod() {
    for(let i=0; i<6; i++) currentYaos.push(Math.random() > 0.5 ? 7 : 8); 
    let changingIndex = Math.floor(Math.random() * 6);
    currentYaos[changingIndex] = currentYaos[changingIndex] === 7 ? 9 : 6;
    renderFinalResult();
}

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
        const sum = (Math.random()>0.5?2:3) + (Math.random()>0.5?2:3) + (Math.random()>0.5?2:3); 
        currentYaos.push(sum);
        let isYang = (sum === 7 || sum === 9);
        let yaoHtml = isYang ? `<div class="yao-symbol yao-yang"><div class="line"></div></div>` : `<div class="yao-symbol yao-yin"><div class="line"></div><div class="line"></div></div>`;
        progressDiv.insertAdjacentHTML('beforeend', `<div style="opacity: 0.8;">${yaoHtml}</div>`);
        if (currentYaos.length === 6) {
            btn.innerText = "正在排定八宫纳甲...";
            btn.disabled = true;
            setTimeout(renderFinalResult, 600);
        } else {
            btn.innerText = `掷出铜钱 (第${currentYaos.length + 1}次)`;
        }
    };
}

function setupManualMethod() {
    showScreen('screen-interact');
    document.getElementById('interact-title').innerText = "点按虚线排定阴阳";
    document.getElementById('interact-shake').style.display = 'none';
    document.getElementById('interact-manual').style.display = 'block';
    manualYaos = Array(6).fill(null).map(() => ({ set: false, isYang: true, isChanging: false }));
    renderManualRows();
}

window.toggleManualYao = function(idx) {
    let y = manualYaos[idx];
    if (!y.set) { y.set = true; y.isYang = true; } 
    else if (y.isYang) { y.isYang = false; } 
    else { y.isYang = true; }
    renderManualRows();
}

window.toggleManualDong = function(idx) {
    let y = manualYaos[idx];
    if (!y.set) { y.set = true; y.isYang = true; }
    y.isChanging = !y.isChanging;
    renderManualRows();
}

function renderManualRows() {
    const container = document.getElementById('manual-rows');
    container.innerHTML = '';
    const names = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    for(let i=0; i<6; i++) {
        let y = manualYaos[i];
        let yaoHtml = !y.set ? `<div class="yao-interactive yao-dashed" onclick="toggleManualYao(${i})"><div class="line"></div></div>`
                             : (y.isYang ? `<div class="yao-interactive yao-yang" onclick="toggleManualYao(${i})"><div class="line"></div></div>`
                                         : `<div class="yao-interactive yao-yin" onclick="toggleManualYao(${i})"><div class="line"></div><div class="line"></div></div>`);
        let dongClass = y.isChanging ? 'btn-dong active' : 'btn-dong';
        container.innerHTML += `
            <div class="manual-row-interactive">
                <span style="color: var(--zc-gold-light); width: 60px; font-weight: bold; letter-spacing:2px;">${names[i]}</span>
                ${yaoHtml}
                <div class="${dongClass}" onclick="toggleManualDong(${i})">动</div>
            </div>`;
    }
}

window.generateManualGua = function() {
    currentYaos = [];
    for(let i=0; i<6; i++) {
        let y = manualYaos[i];
        if (!y.set) { alert("请先点按排定所有六个爻的阴阳！"); return; }
        currentYaos.push(y.isYang ? (y.isChanging ? 9 : 7) : (y.isChanging ? 6 : 8));
    }
    renderFinalResult();
}

// ================= 4. 八宫纳甲核心算法 =================
const DZ = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const DZ_WX = ["水","土","木","木","土","火","火","土","金","金","土","水"];
const PALACE_WX = {7:"金", 6:"金", 5:"火", 4:"木", 3:"木", 2:"水", 1:"土", 0:"土"};
const PALACE_NAME = {7:"乾", 6:"兑", 5:"离", 4:"震", 3:"巽", 2:"坎", 1:"艮", 0:"坤"};
const WX_IDX = {"木":0, "火":1, "土":2, "金":3, "水":4};
const KINSHIPS = ["兄弟", "子孙", "妻财", "官鬼", "父母"];
const BEASTS = ["青龙", "朱雀", "勾陈", "滕蛇", "白虎", "玄武"];
const HEX_NAMES = [
  ["坤为地", "地雷复", "地水师", "地泽临", "地山谦", "地火明夷", "地风升", "地天泰"],
  ["雷地豫", "震为雷", "雷水解", "雷泽归妹", "雷山小过", "雷火丰", "雷风恒", "雷天大壮"],
  ["水地比", "水雷屯", "坎为水", "水泽节", "水山蹇", "水火既济", "水风井", "水天需"],
  ["泽地萃", "泽雷随", "泽水困", "兑为泽", "泽山咸", "泽火革", "泽风大过", "泽天夬"],
  ["山地剥", "山雷颐", "山水蒙", "山泽损", "艮为山", "山火贲", "山风蛊", "山天大畜"],
  ["火地晋", "火雷噬嗑", "火水未济", "火泽睽", "火山旅", "离为火", "火风鼎", "火天大有"],
  ["风地观", "风雷益", "风水涣", "风泽中孚", "风山渐", "风火家人", "巽为风", "风天小畜"],
  ["天地否", "天雷无妄", "天水讼", "天泽履", "天山遁", "天火同人", "天风姤", "乾为天"]
];
const NA_JIA_DZ = {
  0: [[7,5,3], [1,11,9]], 1: [[0,2,4], [6,8,10]], 2: [[2,4,6], [8,10,0]], 3: [[5,3,1], [11,9,7]],
  4: [[4,6,8], [10,0,2]], 5: [[3,1,11], [9,7,5]], 6: [[1,11,9], [7,5,3]], 7: [[0,2,4], [6,8,10]]
};
const NA_JIA_TG = { 0:["乙","癸"], 1:["庚","庚"], 2:["戊","戊"], 3:["丁","丁"], 4:["丙","丙"], 5:["己","己"], 6:["辛","辛"], 7:["甲","壬"] };

function getPalaceAndShi(b, t) {
    let x = b ^ t;
    if (x === 0) return { p: b, shi: 5 };
    if (x === 1) return { p: t, shi: 0 };
    if (x === 3) return { p: t, shi: 1 };
    if (x === 7) return { p: t, shi: 2 };
    if (x === 6) return { p: t ^ 1, shi: 3 };
    if (x === 4) return { p: t ^ 3, shi: 4 };
    if (x === 5) return { p: t ^ 2, shi: 3 }; 
    if (x === 2) return { p: b, shi: 2 };     
    return { p: 7, shi: 0 };
}

function getKinship(palaceWx, lineWx) { return KINSHIPS[(WX_IDX[lineWx] - WX_IDX[palaceWx] + 5) % 5]; }

function calcGua(yaos) {
    let mY = [], cY = [];
    for (let i=0; i<6; i++) {
        mY.push((yaos[i]===7||yaos[i]===9)?1:0);
        cY.push((yaos[i]===6)?1:(yaos[i]===9?0:mY[i]));
    }
    let bM = mY[0] | (mY[1]<<1) | (mY[2]<<2), tM = mY[3] | (mY[4]<<1) | (mY[5]<<2);
    let bC = cY[0] | (cY[1]<<1) | (cY[2]<<2), tC = cY[3] | (cY[4]<<1) | (cY[5]<<2);
    
    let infoM = getPalaceAndShi(bM, tM);
    let infoC = getPalaceAndShi(bC, tC); 
    let pWx = PALACE_WX[infoM.p]; 

    function buildLines(b, t) {
        let lines = [];
        for(let i=0; i<3; i++) lines.push({tg:NA_JIA_TG[b][0], dz:DZ[NA_JIA_DZ[b][0][i]], wx:DZ_WX[NA_JIA_DZ[b][0][i]], k:getKinship(pWx, DZ_WX[NA_JIA_DZ[b][0][i]])});
        for(let i=0; i<3; i++) lines.push({tg:NA_JIA_TG[t][1], dz:DZ[NA_JIA_DZ[t][1][i]], wx:DZ_WX[NA_JIA_DZ[t][1][i]], k:getKinship(pWx, DZ_WX[NA_JIA_DZ[t][1][i]])});
        return lines;
    }
    
    let bIdx = (currentDayTgIdx <= 1) ? 0 : (currentDayTgIdx <= 3) ? 1 : (currentDayTgIdx === 4) ? 2 : (currentDayTgIdx === 5) ? 3 : (currentDayTgIdx <= 7) ? 4 : 5;
    let beasts = [];
    for (let i=0; i<6; i++) beasts.push(BEASTS[(bIdx + i) % 6]);
    
    return {
        main: { name: HEX_NAMES[tM][bM], palaceName: PALACE_NAME[infoM.p], shi: infoM.shi, ying: (infoM.shi+3)%6, lines: buildLines(bM, tM) },
        change: { name: HEX_NAMES[tC][bC], palaceName: PALACE_NAME[infoC.p], shi: infoC.shi, ying: (infoC.shi+3)%6, lines: buildLines(bC, tC) },
        beasts: beasts
    };
}

// ================= 5. 最终渲染 (纯CSS类控制) =================
window.renderFinalResult = function() {
    showScreen('screen-result');
    const mainContainer = document.getElementById('dynamic-main-gua');
    const changeContainer = document.getElementById('dynamic-change-gua');
    const beastContainer = document.getElementById('dynamic-beasts');
    const guaLayout = document.getElementById('gua-layout');
    const panel = document.getElementById('main-panel');
    const changeCol = document.getElementById('change-gua-col');

    mainContainer.innerHTML = ''; changeContainer.innerHTML = ''; beastContainer.innerHTML = '';

    const gua = calcGua(currentYaos);
    const hasChange = currentYaos.some(v => v === 6 || v === 9);

    if (!hasChange) {
        changeCol.style.display = 'none';
        guaLayout.classList.add('is-jing-gua');
        panel.style.maxWidth = '520px'; 
    } else {
        changeCol.style.display = 'block';
        guaLayout.classList.remove('is-jing-gua');
        panel.style.maxWidth = '850px';
    }

    document.getElementById('main-gua-title').innerText = `${gua.main.palaceName}宫：${gua.main.name}`;
    if (hasChange) document.getElementById('change-gua-title').innerText = `${gua.change.palaceName}宫：${gua.change.name}`;
    
    for(let i=5; i>=0; i--) beastContainer.insertAdjacentHTML('beforeend', `<span>${gua.beasts[i]}</span>`);

    for(let i=5; i>=0; i--) {
        let val = currentYaos[i];
        let isMainYang = (val === 7 || val === 9);
        let mark = val === 9 ? '○→' : (val === 6 ? '×→' : '');
        let mLine = gua.main.lines[i];
        let mPos = (i === gua.main.shi) ? '世' : (i === gua.main.ying) ? '应' : '';

        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="yao-row">
                <span class="yao-shishen">${mLine.k}</span>
                <span class="yao-text">${mLine.tg}${mLine.dz}${mLine.wx}</span>
                <div class="yao-symbol ${isMainYang ? 'yao-yang' : 'yao-yin'}">${isMainYang ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>'}</div>
                <span class="changing-mark">${mark}</span>
                <span class="yao-position">${mPos}</span>
            </div>`);
        
        if (hasChange) {
            let isChangeYang = val === 9 ? false : (val === 6 ? true : isMainYang);
            let isChangingLine = (val === 6 || val === 9);
            let cLine = gua.change.lines[i];
            let cPos = (i === gua.change.shi) ? '世' : (i === gua.change.ying) ? '应' : '';
            
            // 使用 CSS 类来控制颜色和透明度，绝对杜绝内联 style 宽度
            let stateClass = isChangingLine ? 'is-active-line' : 'is-static-line';

            changeContainer.insertAdjacentHTML('beforeend', `
                <div class="yao-row change-row ${stateClass}">
                    <div class="yao-symbol ${isChangeYang ? 'yao-yang' : 'yao-yin'}">${isChangeYang ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>'}</div>
                    <div class="change-info">
                        <span class="yao-shishen">${cLine.k}</span>
                        <span class="yao-text">${cLine.tg}${cLine.dz}${cLine.wx}</span>
                        <span class="yao-position">${cPos}</span>
                    </div>
                </div>`);
        }
    }
}

document.addEventListener('DOMContentLoaded', initDateTime);
