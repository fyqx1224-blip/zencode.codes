/**
 * ZenCode - 六爻排盘核心逻辑 (完整纳甲版)
 */

let currentYaos = [];
let currentDayTgIdx = 0; // 记录日干索引，用于推算六兽

// ================= 1. 初始化历法与时间 =================
function initDateTime() {
    if (typeof Lunar === 'undefined') {
        document.getElementById('dynamic-info').innerHTML = "<span style='color:red'>历法库加载失败，请检查网络。</span>";
        return;
    }

    const now = new Date();
    const d = Lunar.fromDate(now);
    
    currentDayTgIdx = d.getDayGanIndex(); // 获取日天干索引 (0:甲, 1:乙...)

    const solarDate = d.getSolar().toYmdHms();
    const gzYear = d.getYearInGanZhi();
    const gzMonth = d.getMonthInGanZhi();
    const gzDay = d.getDayInGanZhi();
    const gzTime = d.getTimeInGanZhi(); // 修复问题一：获取带天干的完整时柱
    const xunKong = d.getDayXunKong();

    const html = `
        <span class="info-highlight">当前推演：</span>ZenCode 命运档案<br>
        <span class="info-highlight">公历时间：</span>${solarDate}<br>
        <span class="info-highlight">干支历法：</span>${gzYear}年 ${gzMonth}月 ${gzDay}日 ${gzTime}时 <span style="color:var(--zc-text-muted)">（旬空：${xunKong}）</span>
    `;
    
    const infoDiv = document.getElementById('dynamic-info');
    if (infoDiv) infoDiv.innerHTML = html;
}

// ================= 2. 视图流转控制 =================
function showScreen(screenId) {
    document.querySelectorAll('.flow-screen').forEach(el => el.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
}

function resetFlow() {
    currentYaos = [];
    showScreen('screen-choice');
    initDateTime();
}

function startMethod(method) {
    currentYaos = [];
    if (method === 'time') executeTimeMethod();
    else if (method === 'shake') setupShakeMethod();
    else if (method === 'manual') setupManualMethod();
}

// ================= 3. 具体起卦交互 =================
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
        let yaoHtml = isYang ? `<div class="yao-symbol yao-yang"><div class="line"></div></div>` 
                             : `<div class="yao-symbol yao-yin"><div class="line"></div><div class="line"></div></div>`;
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
        currentYaos.push(parseInt(document.querySelector(`input[name="yao${i}"]:checked`).value));
    }
    renderFinalResult();
}

// ================= 4. 八宫纳甲核心算法 (修复问题二) =================
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

// 八卦纳甲地支排布 (内卦/外卦)
const NA_JIA_DZ = {
  0: [[7,5,3], [1,11,9]], 1: [[0,2,4], [6,8,10]], 2: [[2,4,6], [8,10,0]], 3: [[5,3,1], [11,9,7]],
  4: [[4,6,8], [10,0,2]], 5: [[3,1,11], [9,7,5]], 6: [[1,11,9], [7,5,3]], 7: [[0,2,4], [6,8,10]]
};
const NA_JIA_TG = { 0:["乙","癸"], 1:["庚","庚"], 2:["戊","戊"], 3:["丁","丁"], 4:["丙","丙"], 5:["己","己"], 6:["辛","辛"], 7:["甲","壬"] };

// 二进制异或寻世诀算法
function getPalaceAndShi(b, t) {
    let x = b ^ t;
    if (x === 0) return { p: b, shi: 5 };
    if (x === 1) return { p: t, shi: 0 };
    if (x === 3) return { p: t, shi: 1 };
    if (x === 7) return { p: t, shi: 2 };
    if (x === 6) return { p: t ^ 1, shi: 3 };
    if (x === 4) return { p: t ^ 3, shi: 4 };
    if (x === 5) return { p: t ^ 2, shi: 3 }; // 游魂
    if (x === 2) return { p: b, shi: 2 };     // 归魂
    return { p: 7, shi: 0 };
}

function getKinship(palaceWx, lineWx) {
    return KINSHIPS[(WX_IDX[lineWx] - WX_IDX[palaceWx] + 5) % 5];
}

// 排演单卦结构
function calcGua(yaos) {
    let mY = [], cY = [];
    for (let i=0; i<6; i++) {
        mY.push((yaos[i]===7||yaos[i]===9)?1:0);
        cY.push((yaos[i]===6)?1:(yaos[i]===9?0:mY[i]));
    }
    // 转为二进制数字 (底爻为最低位)
    let bM = mY[0] | (mY[1]<<1) | (mY[2]<<2), tM = mY[3] | (mY[4]<<1) | (mY[5]<<2);
    let bC = cY[0] | (cY[1]<<1) | (cY[2]<<2), tC = cY[3] | (cY[4]<<1) | (cY[5]<<2);

    let infoM = getPalaceAndShi(bM, tM), infoC = getPalaceAndShi(bC, tC);
    let pWx = PALACE_WX[infoM.p]; // 变卦六亲也以【本卦】宫五行为准

    function buildLines(b, t) {
        let lines = [];
        for(let i=0; i<3; i++) {
            let dz = NA_JIA_DZ[b][0][i], tg = NA_JIA_TG[b][0];
            lines.push({tg:tg, dz:DZ[dz], wx:DZ_WX[dz], k:getKinship(pWx, DZ_WX[dz])});
        }
        for(let i=0; i<3; i++) {
            let dz = NA_JIA_DZ[t][1][i], tg = NA_JIA_TG[t][1];
            lines.push({tg:tg, dz:DZ[dz], wx:DZ_WX[dz], k:getKinship(pWx, DZ_WX[dz])});
        }
        return lines;
    }

    // 排六兽
    let bIdx = (currentDayTgIdx <= 1) ? 0 : (currentDayTgIdx <= 3) ? 1 : (currentDayTgIdx === 4) ? 2 : (currentDayTgIdx === 5) ? 3 : (currentDayTgIdx <= 7) ? 4 : 5;
    let beasts = [];
    for (let i=0; i<6; i++) beasts.push(BEASTS[(bIdx + i) % 6]);

    return {
        main: { name: HEX_NAMES[tM][bM], palaceName: PALACE_NAME[infoM.p], shi: infoM.shi, ying: (infoM.shi+3)%6, lines: buildLines(bM, tM) },
        change: { name: HEX_NAMES[tC][bC], lines: buildLines(bC, tC) },
        beasts: beasts
    };
}

// ================= 5. 渲染引擎 =================
function renderFinalResult() {
    showScreen('screen-result');
    const mainContainer = document.getElementById('dynamic-main-gua');
    const changeContainer = document.getElementById('dynamic-change-gua');
    const beastContainer = document.querySelector('.beast-column');
    
    mainContainer.innerHTML = ''; changeContainer.innerHTML = ''; beastContainer.innerHTML = '';

    const gua = calcGua(currentYaos);

    // 动态注入真实卦名与宫位
    document.getElementById('main-gua-title').innerText = `${gua.main.palaceName}宫：${gua.main.name}`;
    document.getElementById('change-gua-title').innerText = `变卦：${gua.change.name}`;
    
    // 渲染六兽
    for(let i=5; i>=0; i--) beastContainer.insertAdjacentHTML('beforeend', `<span>${gua.beasts[i]}</span>`);

    // 从上爻(5)往下渲染到初爻(0)
    for(let i=5; i>=0; i--) {
        let val = currentYaos[i];
        let isMainYang = (val === 7 || val === 9);
        let mark = val === 9 ? '○→' : (val === 6 ? '×→' : '');
        let mSym = isMainYang ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>';
        
        let mLine = gua.main.lines[i];
        let mText = `${mLine.tg}${mLine.dz}${mLine.wx}`;
        let mPos = (i === gua.main.shi) ? '世' : (i === gua.main.ying) ? '应' : '';

        // 主卦渲染
        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="yao-row">
                <span class="yao-shishen">${mLine.k}</span>
                <span class="yao-text">${mText}</span>
                <div class="yao-symbol ${isMainYang ? 'yao-yang' : 'yao-yin'}">${mSym}</div>
                <span class="changing-mark">${mark}</span>
                <span class="yao-position">${mPos}</span>
            </div>
        `);
        
        // 变卦渲染（只显示发动的变爻对应的干支和六亲）
        let isChangeYang = val === 9 ? false : (val === 6 ? true : isMainYang);
        let cSym = isChangeYang ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>';
        let isChangingLine = (val === 6 || val === 9);
        let cLine = gua.change.lines[i];

        changeContainer.insertAdjacentHTML('beforeend', `
            <div class="yao-row" style="justify-content: flex-start; gap: 15px;">
                <div class="yao-symbol ${isChangeYang ? 'yao-yang' : 'yao-yin'}">${cSym}</div>
                <div style="display:flex; gap:10px; width:120px; justify-content:flex-end;">
                    <span class="yao-text" style="width: auto;">${isChangingLine ? cLine.tg + cLine.dz + cLine.wx : ''}</span>
                    <span class="yao-shishen" style="width: 30px; text-align:right;">${isChangingLine ? cLine.k : ''}</span>
                </div>
            </div>
        `);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initDateTime();
});
