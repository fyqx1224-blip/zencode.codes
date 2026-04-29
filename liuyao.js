/**
 * ZenCode - 六爻排盘核心逻辑 (Responsive Fix)
 */

let currentYaos = [];
let currentDayTgIdx = 0; 
let manualYaos = [];     

const DZ_ARR = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
function getShensha(tgIdx, dzIdx) {
    let ss = [];
    if ([2,6,10].includes(dzIdx)) ss.push("驿马-寅");
    else if ([8,0,4].includes(dzIdx)) ss.push("驿马-申");
    else if ([5,9,1].includes(dzIdx)) ss.push("驿马-亥");
    else if ([11,3,7].includes(dzIdx)) ss.push("驿马-巳");
    
    if ([2,6,10].includes(dzIdx)) ss.push("桃花-卯");
    else if ([8,0,4].includes(dzIdx)) ss.push("桃花-酉");
    else if ([5,9,1].includes(dzIdx)) ss.push("桃花-午");
    else if ([11,3,7].includes(dzIdx)) ss.push("桃花-子");
    
    if ([0,4,6].includes(tgIdx)) ss.push("贵人-丑未");
    else if ([1,5].includes(tgIdx)) ss.push("贵人-子申");
    else if ([2,3].includes(tgIdx)) ss.push("贵人-亥酉");
    else if ([8,9].includes(tgIdx)) ss.push("贵人-卯巳");
    else if (tgIdx === 7) ss.push("贵人-午寅");
    
    const luMap = {0:"寅", 1:"卯", 2:"巳", 3:"午", 4:"巳", 5:"午", 6:"申", 7:"酉", 8:"亥", 9:"子"};
    ss.push("日禄-" + luMap[tgIdx]);
    return ss.join(" ");
}

function initDateTime() {
    if (typeof Lunar === 'undefined') return;
    const now = new Date();
    const d = Lunar.fromDate(now);
    currentDayTgIdx = d.getDayGanIndex(); 
    const shenshaStr = getShensha(currentDayTgIdx, d.getDayZhiIndex());
    const html = `
        <span class="info-highlight">当前推演：</span>ZenCode 命運檔案<br>
        <span class="info-highlight">公历：</span>${d.getSolar().toYmdHms()}<br>
        <span class="info-highlight">干支：</span>${d.getYearInGanZhi()} ${d.getMonthInGanZhi()} ${d.getDayInGanZhi()} ${d.getTimeInGanZhi()} <span style="color:var(--zc-text-muted)">(${d.getDayXunKong()}空)</span><br>
        <div style="font-size: 0.85rem; color: var(--zc-gold-dark); margin-top: 5px; opacity:0.8;">神煞：${shenshaStr}</div>
    `;
    document.getElementById('dynamic-info').innerHTML = html;
}

function showScreen(screenId) {
    document.querySelectorAll('.flow-screen').forEach(el => el.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
}

function resetFlow() {
    currentYaos = [];
    showScreen('screen-choice');
    document.getElementById('gua-layout').className = 'gua-grid'; // 重置网格类
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
        let yaoHtml = `<div class="yao-symbol ${isYang ? 'yao-yang' : 'yao-yin'}">${isYang ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>'}</div>`;
        progressDiv.insertAdjacentHTML('beforeend', `<div style="opacity: 0.8;">${yaoHtml}</div>`);
        if (currentYaos.length === 6) {
            btn.innerText = "正在推演...";
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
        container.innerHTML += `<div class="manual-row-interactive"><span style="color: var(--zc-gold-light); font-weight: bold;">${names[i]}</span>${yaoHtml}<div class="${dongClass}" onclick="toggleManualDong(${i})">动</div></div>`;
    }
}

window.generateManualGua = function() {
    currentYaos = [];
    for(let i=0; i<6; i++) {
        let y = manualYaos[i];
        if (!y.set) { alert("请先完成所有爻位点选"); return; }
        currentYaos.push(y.isYang ? (y.isChanging ? 9 : 7) : (y.isChanging ? 6 : 8));
    }
    renderFinalResult();
}

// 核心算法部分不变 (HEX_NAMES, NA_JIA_DZ等)
const DZ = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const DZ_WX = ["水","土","木","木","土","火","火","土","金","金","土","水"];
const PALACE_WX = {7:"金", 6:"金", 5:"火", 4:"木", 3:"木", 2:"水", 1:"土", 0:"土"};
const PALACE_NAME = {7:"乾", 6:"兑", 5:"离", 4:"震", 3:"巽", 2:"坎", 1:"艮", 0:"坤"};
const KINSHIPS = ["兄弟", "子孙", "妻财", "官鬼", "父母"];
const WX_IDX = {"木":0, "火":1, "土":2, "金":3, "水":4};
const HEX_NAMES = [["坤为地","地雷复","地水师","地泽临","地山谦","地火明夷","地风升","地天泰"],["雷地豫","震为雷","雷水解","雷泽归妹","雷山小过","雷火丰","雷风恒","雷天大壮"],["水地比","水雷屯","坎为水","水泽节","水山蹇","水火既济","水风井","水天需"],["泽地萃","泽雷随","泽水困","兑为泽","泽山咸","泽火革","泽风大过","泽天夬"],["山地剥","山雷颐","山水蒙","山泽损","艮为山","山火贲","山风蛊","山天大畜"],["火地晋","火雷噬嗑","火水未济","火泽睽","火山旅","离为火","火风鼎","火天大有"],["风地观","风雷益","风水涣","风泽中孚","风山渐","风火家人","巽为风","风天小畜"],["天地否","天雷无妄","天水讼","天泽履","天山遁","天火同人","天风姤","乾为天"]];
const NA_JIA_DZ = {0:[[7,5,3],[1,11,9]],1:[[0,2,4],[6,8,10]],2:[[2,4,6],[8,10,0]],3:[[5,3,1],[11,9,7]],4:[[4,6,8],[10,0,2]],5:[[3,1,11],[9,7,5]],6:[[1,11,9],[7,5,3]],7:[[0,2,4],[6,8,10]]};
const NA_JIA_TG = {0:["乙","癸"],1:["庚","庚"],2:["戊","戊"],3:["丁","丁"],4:["丙","丙"],5:["己","己"],6:["辛","辛"],7:["甲","壬"]};

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

function calcGua(yaos) {
    let mY = [], cY = [];
    for (let i=0; i<6; i++) {
        mY.push((yaos[i]===7||yaos[i]===9)?1:0);
        cY.push((yaos[i]===6)?1:(yaos[i]===9?0:mY[i]));
    }
    let bM = mY[0]|(mY[1]<<1)|(mY[2]<<2), tM = mY[3]|(mY[4]<<1)|(mY[5]<<2);
    let bC = cY[0]|(cY[1]<<1)|(cY[2]<<2), tC = cY[3]|(cY[4]<<1)|(cY[5]<<2);
    let infoM = getPalaceAndShi(bM, tM), infoC = getPalaceAndShi(bC, tC);
    let pWx = PALACE_WX[infoM.p];
    function buildLines(b, t, pW) {
        let lines = [];
        for(let i=0; i<3; i++) { let dz=NA_JIA_DZ[b][0][i]; lines.push({tg:NA_JIA_TG[b][0], dz:DZ[dz], wx:DZ_WX[dz], k:KINSHIPS[(WX_IDX[DZ_WX[dz]] - WX_IDX[pW] + 5) % 5]}); }
        for(let i=0; i<3; i++) { let dz=NA_JIA_DZ[t][1][i]; lines.push({tg:NA_JIA_TG[t][1], dz:DZ[dz], wx:DZ_WX[dz], k:KINSHIPS[(WX_IDX[DZ_WX[dz]] - WX_IDX[pW] + 5) % 5]}); }
        return lines;
    }
    let bIdx = (currentDayTgIdx <= 1) ? 0 : (currentDayTgIdx <= 3) ? 1 : (currentDayTgIdx === 4) ? 2 : (currentDayTgIdx === 5) ? 3 : (currentDayTgIdx <= 7) ? 4 : 5;
    let beasts = []; for (let i=0; i<6; i++) beasts.push(["青龙","朱雀","勾陈","滕蛇","白虎","玄武"][(bIdx + i)%6]);
    return { main: { name: HEX_NAMES[tM][bM], palaceName: PALACE_NAME[infoM.p], shi: infoM.shi, ying: (infoM.shi+3)%6, lines: buildLines(bM, tM, pWx) }, change: { name: HEX_NAMES[tC][bC], palaceName: PALACE_NAME[infoC.p], shi: infoC.shi, ying: (infoC.shi+3)%6, lines: buildLines(bC, tC, pWx) }, beasts: beasts };
}

window.renderFinalResult = function() {
    showScreen('screen-result');
    const mainContainer = document.getElementById('dynamic-main-gua');
    const changeContainer = document.getElementById('dynamic-change-gua');
    const beastContainer = document.getElementById('dynamic-beasts');
    const guaLayout = document.getElementById('gua-layout');
    const changeCol = document.getElementById('change-gua-col');
    mainContainer.innerHTML = ''; changeContainer.innerHTML = ''; beastContainer.innerHTML = '';

    const gua = calcGua(currentYaos);
    const hasChange = currentYaos.some(v => v === 6 || v === 9);

    // 响应式布局切换逻辑 (修正：改用 class 切换)
    if (!hasChange) {
        changeCol.style.display = 'none';
        guaLayout.classList.add('is-jing-gua');
    } else {
        changeCol.style.display = 'block';
        guaLayout.classList.remove('is-jing-gua');
    }

    document.getElementById('main-gua-title').innerText = `${gua.main.palaceName}宫：${gua.main.name}`;
    if (hasChange) document.getElementById('change-gua-title').innerText = `${gua.change.palaceName}宫：${gua.change.name}`;
    
    for(let i=5; i>=0; i--) beastContainer.insertAdjacentHTML('beforeend', `<span>${gua.beasts[i]}</span>`);

    for(let i=5; i>=0; i--) {
        let val = currentYaos[i], isM = (val===7||val===9), mLine = gua.main.lines[i];
        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="yao-row">
                <span class="yao-shishen">${mLine.k}</span>
                <span class="yao-text">${mLine.tg}${mLine.dz}${mLine.wx}</span>
                <div class="yao-symbol ${isM ? 'yao-yang' : 'yao-yin'}">${isM ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>'}</div>
                <span class="changing-mark">${val===9?'○→':(val===6?'×→':'')}</span>
                <span class="yao-position">${i===gua.main.shi?'世':(i===gua.main.ying?'应':'')}</span>
            </div>`);
        
        if (hasChange) {
            let isC = val===9?false:(val===6?true:isM), cLine = gua.change.lines[i];
            let isMoving = (val===6||val===9);
            let style = isMoving ? '' : 'style="opacity:0.35"';
            changeContainer.insertAdjacentHTML('beforeend', `
                <div class="yao-row" ${style}>
                    <div class="yao-symbol ${isC ? 'yao-yang' : 'yao-yin'}">${isC ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>'}</div>
                    <span class="yao-text">${cLine.tg}${cLine.dz}${cLine.wx}</span>
                    <span class="yao-shishen">${cLine.k}</span>
                    <span class="yao-position" style="font-weight:normal; font-size:0.8rem">${i===gua.change.shi?'世':(i===gua.change.ying?'应':'')}</span>
                </div>`);
        }
    }
}

document.addEventListener('DOMContentLoaded', initDateTime);
