/**
 * ZenCode - 六爻排盘核心逻辑 (完整神煞与衰旺推演版)
 */

let currentYaos = [];
let currentDayTgIdx = 0; 
let currentMonthZhiIdx = 0; // 新增：保存月支，用于推算五行衰旺
let manualYaos = [];     

// ================= 神煞计算算法全家桶 =================
const DZ_ARR = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
function getShensha(tgIdx, dzIdx) {
    let tg_ss = [];
    let dz_ss = [];
    
    // ---------------- 1. 日支神煞 ----------------
    // 驿马: 申子辰马在寅, 亥卯未马在巳, 寅午戌马在申, 巳酉丑马在亥
    if ([8,0,4].includes(dzIdx)) dz_ss.push("驿马-寅");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push("驿马-巳");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push("驿马-申");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push("驿马-亥");
    
    // 桃花: 申子辰见酉, 亥卯未见子, 寅午戌见卯, 巳酉丑见午
    if ([8,0,4].includes(dzIdx)) dz_ss.push("桃花-酉");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push("桃花-子");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push("桃花-卯");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push("桃花-午");

    // 将星: 申子辰见子, 亥卯未见卯, 寅午戌见午, 巳酉丑见酉
    if ([8,0,4].includes(dzIdx)) dz_ss.push("将星-子");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push("将星-卯");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push("将星-午");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push("将星-酉");

    // 华盖: 申子辰见辰, 亥卯未见未, 寅午戌见戌, 巳酉丑见丑
    if ([8,0,4].includes(dzIdx)) dz_ss.push("华盖-辰");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push("华盖-未");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push("华盖-戌");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push("华盖-丑");

    // 劫煞: 申子辰见巳, 亥卯未见申, 寅午戌见亥, 巳酉丑见寅
    if ([8,0,4].includes(dzIdx)) dz_ss.push("劫煞-巳");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push("劫煞-申");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push("劫煞-亥");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push("劫煞-寅");

    // 灾煞: 申子辰见午, 亥卯未见酉, 寅午戌见子, 巳酉丑见卯
    if ([8,0,4].includes(dzIdx)) dz_ss.push("灾煞-午");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push("灾煞-酉");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push("灾煞-子");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push("灾煞-卯");

    // ---------------- 2. 日干神煞 ----------------
    // 贵人: 甲戊庚牛羊, 乙己鼠猴乡, 丙丁猪鸡位, 壬癸兔蛇藏, 六辛逢马虎
    if ([0,4,6].includes(tgIdx)) tg_ss.push("贵人-丑,未");
    else if ([1,5].includes(tgIdx)) tg_ss.push("贵人-子,申");
    else if ([2,3].includes(tgIdx)) tg_ss.push("贵人-亥,酉");
    else if ([8,9].includes(tgIdx)) tg_ss.push("贵人-卯,巳");
    else if (tgIdx === 7) tg_ss.push("贵人-午,寅");
    
    // 日禄: 甲禄在寅, 乙禄在卯, 丙戊在巳, 丁己在午, 庚在申, 辛在酉, 壬在亥, 癸在子
    const luMap = {0:"寅", 1:"卯", 2:"巳", 3:"午", 4:"巳", 5:"午", 6:"申", 7:"酉", 8:"亥", 9:"子"};
    tg_ss.push("日禄-" + luMap[tgIdx]);

    // 羊刃: 禄前一辰
    const renMap = {0:"卯", 1:"辰", 2:"午", 3:"未", 4:"午", 5:"未", 6:"酉", 7:"戌", 8:"子", 9:"丑"};
    tg_ss.push("羊刃-" + renMap[tgIdx]);

    // 文昌: 甲巳, 乙午, 丙戊申, 丁己酉, 庚亥, 辛子, 壬寅, 癸卯
    const wenMap = {0:"巳", 1:"午", 2:"申", 3:"酉", 4:"申", 5:"酉", 6:"亥", 7:"子", 8:"寅", 9:"卯"};
    tg_ss.push("文昌-" + wenMap[tgIdx]);
    
    return `
        <div style="margin-bottom:6px;"><b>【日干神煞】</b> ${tg_ss.join(" &nbsp; ")}</div>
        <div><b>【日支神煞】</b> ${dz_ss.join(" &nbsp; ")}</div>
    `;
}

// ================= 五行旺相休囚死算法 =================
function getWangXiang(monthZhiIdx, yaoWx) {
    let monthWx = "土"; // 辰(4),戌(10),丑(1),未(7)
    if ([0, 11].includes(monthZhiIdx)) monthWx = "水"; // 子, 亥
    if ([2, 3].includes(monthZhiIdx)) monthWx = "木";  // 寅, 卯
    if ([5, 6].includes(monthZhiIdx)) monthWx = "火";  // 巳, 午
    if ([8, 9].includes(monthZhiIdx)) monthWx = "金";  // 申, 酉

    // 五行生克流转规则
    const gen = {"木":"火", "火":"土", "土":"金", "金":"水", "水":"木"};
    const res = {"木":"土", "土":"水", "水":"火", "火":"金", "金":"木"};

    if (yaoWx === monthWx) return "旺";         // 同我者旺
    if (gen[monthWx] === yaoWx) return "相";    // 我生者相 (月建生该爻)
    if (gen[yaoWx] === monthWx) return "休";    // 生我者休 (该爻生月建)
    if (res[yaoWx] === monthWx) return "囚";    // 克我者囚 (该爻克月建)
    if (res[monthWx] === yaoWx) return "死";    // 我克者死 (月建克该爻)

    return "";
}

function initDateTime() {
    if (typeof Lunar === 'undefined') return;
    const now = new Date();
    const d = Lunar.fromDate(now);
    currentDayTgIdx = d.getDayGanIndex(); 
    currentMonthZhiIdx = d.getMonthZhiIndex(); // 保存当前月支索引
    
    const html = `
        <span class="info-highlight">当前推演：</span>ZenCode 命運檔案<br>
        <span class="info-highlight">公历时间：</span>${d.getSolar().toYmdHms()}<br>
        <span class="info-highlight">干支历法：</span>${d.getYearInGanZhi()}年 ${d.getMonthInGanZhi()}月 ${d.getDayInGanZhi()}日 ${d.getTimeInGanZhi()}时 <span style="color:var(--zc-text-muted)">（旬空：${d.getDayXunKong()}）</span><br>
        <div style="font-size: 0.9rem; color: var(--zc-gold-dark); margin-top: 10px; letter-spacing: 1px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 4px; border: 1px solid rgba(138, 115, 66, 0.2);">
            ${getShensha(currentDayTgIdx, d.getDayZhiIndex())}
        </div>
    `;
    document.getElementById('dynamic-info').innerHTML = html;
}

function showScreen(screenId) {
    const screens = document.querySelectorAll('.flow-screen');
    for(let i=0; i<screens.length; i++) {
        screens[i].style.display = 'none';
    }
    document.getElementById(screenId).style.display = 'block';
}

window.resetFlow = function() {
    currentYaos = [];
    showScreen('screen-choice');
    const layout = document.getElementById('gua-layout');
    layout.className = 'gua-grid';
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
    document.getElementById('interact-title').innerText = "心诚则灵 · 掷铜钱排盘";
    document.getElementById('interact-manual').style.display = 'none';
    document.getElementById('interact-shake').style.display = 'block';
    
    const progressDiv = document.getElementById('shake-progress');
    progressDiv.innerHTML = ''; 
    const btn = document.getElementById('btn-shake');
    btn.innerText = "掷出铜钱 (第1次)";
    btn.disabled = false;
    
    const coins = document.querySelectorAll('.coin');
    for (let i = 0; i < coins.length; i++) {
        coins[i].style.animation = 'none';
        coins[i].style.transform = 'rotateY(0deg)';
        coins[i].style.webkitTransform = 'rotateY(0deg)';
    }
    
    btn.onclick = function() {
        if (currentYaos.length >= 6) return;
        btn.disabled = true;
        btn.innerText = "铜钱翻转中...";

        let sum = 0;
        let results = [];
        for(let i = 0; i < 3; i++) {
            let isFront = Math.random() > 0.5;
            results.push(isFront);
            sum += isFront ? 3 : 2;
        }

        for (let i = 0; i < coins.length; i++) {
            coins[i].style.animation = 'none';
        }

        setTimeout(() => {
            for (let i = 0; i < coins.length; i++) {
                let animName = results[i] ? 'flip-heads' : 'flip-tails';
                coins[i].style.animation = animName + ' 1s ease-out forwards';
            }
        }, 20);

        setTimeout(() => {
            currentYaos.push(sum);
            let isYang = (sum === 7 || sum === 9);
            let mark = sum === 9 ? '○ (动)' : (sum === 6 ? '× (动)' : '');
            let yaoName = sum === 9 ? '老阳' : (sum === 8 ? '少阴' : (sum === 7 ? '少阳' : '老阴'));
            
            let yaoHtml = isYang ? `<div class="yao-symbol yao-yang"><div class="line"></div></div>` : `<div class="yao-symbol yao-yin"><div class="line"></div><div class="line"></div></div>`;
            
            progressDiv.insertAdjacentHTML('beforeend', `
                <div style="display:flex; align-items:center; gap: 15px; opacity: 0; animation: fadeInYao 0.5s forwards; -webkit-animation: fadeInYao 0.5s forwards;">
                    <span style="color:var(--zc-gold-dark); width: 100px; text-align:right; font-size:0.85rem; letter-spacing: 1px;">
                        ${sum}分 ${yaoName} <span style="color:var(--zc-gold-light)">${mark}</span>
                    </span>
                    ${yaoHtml}
                </div>
            `);

            if (currentYaos.length === 6) {
                btn.innerText = "排定八宫纳甲...";
                setTimeout(renderFinalResult, 800);
            } else {
                btn.innerText = `掷出铜钱 (第${currentYaos.length + 1}次)`;
                btn.disabled = false;
            }
        }, 1100);
    };
}

function setupManualMethod() {
    showScreen('screen-interact');
    document.getElementById('interact-title').innerText = "点按虚线排定阴阳";
    document.getElementById('interact-shake').style.display = 'none';
    document.getElementById('interact-manual').style.display = 'block';
    
    manualYaos = [];
    for(let i=0; i<6; i++) {
        manualYaos.push({ set: false, isYang: true, isChanging: false });
    }
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
    
    for(let i=5; i>=0; i--) {
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
const WX_IDX = {"木":0, "火":1, "土":2, "金":3, "水":4};
const KINSHIPS = ["兄弟", "子孙", "妻财", "官鬼", "父母"];
const BEASTS = ["青龙", "朱雀", "勾陈", "滕蛇", "白虎", "玄武"];

const PALACE_NAME = {0:"坤", 1:"震", 2:"坎", 3:"兑", 4:"艮", 5:"离", 6:"巽", 7:"乾"};
const PALACE_WX = {0:"土", 1:"木", 2:"水", 3:"金", 4:"土", 5:"火", 6:"木", 7:"金"};

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

function getGuaTags(b, t, name) {
    let tags = [];
    let x = b ^ t;
    if (x === 5) tags.push("游魂");
    if (x === 2) tags.push("归魂");
    if (x === 0 || name === "天雷无妄" || name === "雷天大壮") tags.push("六冲");
    const liuHe = ["天地否", "地天泰", "水泽节", "泽水困", "火山旅", "山火贲", "雷地豫", "地雷复"];
    if (liuHe.includes(name)) tags.push("六合");
    
    return tags.length > 0 ? `<span style="font-size:0.75rem; color:var(--zc-gold-dark); font-weight:normal; margin-left:8px; opacity:0.8;">[${tags.join("·")}]</span>` : "";
}

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

function getKinship(palaceWx, lineWx) {
    return KINSHIPS[(WX_IDX[lineWx] - WX_IDX[palaceWx] + 5) % 5];
}

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
        for(let i=0; i<3; i++) {
            let dzIdx = NA_JIA_DZ[b][0][i];
            let wxStr = DZ_WX[dzIdx];
            lines.push({tg:NA_JIA_TG[b][0], dz:DZ[dzIdx], wx:wxStr, k:getKinship(pWx, wxStr), state: getWangXiang(currentMonthZhiIdx, wxStr)});
        }
        for(let i=0; i<3; i++) {
            let dzIdx = NA_JIA_DZ[t][1][i];
            let wxStr = DZ_WX[dzIdx];
            lines.push({tg:NA_JIA_TG[t][1], dz:DZ[dzIdx], wx:wxStr, k:getKinship(pWx, wxStr), state: getWangXiang(currentMonthZhiIdx, wxStr)});
        }
        return lines;
    }
    
    let bIdx = (currentDayTgIdx <= 1) ? 0 : (currentDayTgIdx <= 3) ? 1 : (currentDayTgIdx === 4) ? 2 : (currentDayTgIdx === 5) ? 3 : (currentDayTgIdx <= 7) ? 4 : 5;
    let beasts = [];
    for (let i=0; i<6; i++) beasts.push(BEASTS[(bIdx + i) % 6]);
    
    return {
        main: { name: HEX_NAMES[tM][bM], tag: getGuaTags(bM, tM, HEX_NAMES[tM][bM]), palaceName: PALACE_NAME[infoM.p], shi: infoM.shi, ying: (infoM.shi+3)%6, lines: buildLines(bM, tM) },
        change: { name: HEX_NAMES[tC][bC], tag: getGuaTags(bC, tC, HEX_NAMES[tC][bC]), palaceName: PALACE_NAME[infoC.p], shi: infoC.shi, ying: (infoC.shi+3)%6, lines: buildLines(bC, tC) },
        beasts: beasts
    };
}

// ================= 5. 最终渲染 =================
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

    if (!hasChange) {
        changeCol.style.display = 'none';
        guaLayout.classList.add('is-jing-gua');
    } else {
        changeCol.style.display = 'block';
        guaLayout.classList.remove('is-jing-gua');
    }

    document.getElementById('main-gua-title').innerHTML = `${gua.main.palaceName}宫：${gua.main.name}${gua.main.tag}`;
    if (hasChange) document.getElementById('change-gua-title').innerHTML = `${gua.change.palaceName}宫：${gua.change.name}${gua.change.tag}`;
    
    for(let i=5; i>=0; i--) beastContainer.insertAdjacentHTML('beforeend', `<span>${gua.beasts[i]}</span>`);

    for(let i=5; i>=0; i--) {
        let val = currentYaos[i];
        let isMainYang = (val === 7 || val === 9);
        let mark = val === 9 ? '○→' : (val === 6 ? '×→' : '');
        let mLine = gua.main.lines[i];
        let mPos = (i === gua.main.shi) ? '世' : (i === gua.main.ying) ? '应' : '';

        // 新增的五行状态附着在文字后面
        let stateHtml = `<span style="font-size:0.7rem; opacity:0.6; margin-left:2px;">(${mLine.state})</span>`;

        mainContainer.insertAdjacentHTML('beforeend', `
            <div class="yao-row">
                <span class="yao-shishen">${mLine.k}</span>
                <span class="yao-text">${mLine.tg}${mLine.dz}${mLine.wx}${stateHtml}</span>
                <div class="yao-symbol ${isMainYang ? 'yao-yang' : 'yao-yin'}">${isMainYang ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>'}</div>
                <span class="changing-mark">${mark}</span>
                <span class="yao-position">${mPos}</span>
            </div>`);
        
        if (hasChange) {
            let isChangeYang = val === 9 ? false : (val === 6 ? true : isMainYang);
            let isChangingLine = (val === 6 || val === 9);
            let cLine = gua.change.lines[i];
            let cPos = (i === gua.change.shi) ? '世' : (i === gua.change.ying) ? '应' : '';
            
            let stateClass = isChangingLine ? 'is-active-line' : 'is-static-line';
            let cStateHtml = `<span style="font-size:0.7rem; opacity:0.6; margin-left:2px;">(${cLine.state})</span>`;

            changeContainer.insertAdjacentHTML('beforeend', `
                <div class="yao-row change-row ${stateClass}">
                    <div class="yao-symbol ${isChangeYang ? 'yao-yang' : 'yao-yin'}">${isChangeYang ? '<div class="line"></div>' : '<div class="line"></div><div class="line"></div>'}</div>
                    <div class="change-info">
                        <span class="yao-shishen">${cLine.k}</span>
                        <span class="yao-text">${cLine.tg}${cLine.dz}${cLine.wx}${cStateHtml}</span>
                        <span class="yao-position">${cPos}</span>
                    </div>
                </div>`);
        }
    }
}

document.addEventListener('DOMContentLoaded', initDateTime);
