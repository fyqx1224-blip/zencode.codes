/**
 * ZenCode - 六爻排盘核心逻辑 (联动导航栏切换 + 繁简转化引擎)
 */

// ================= 繁简翻译引擎 (字符级转换) =================
const s2t_map = {
    "阴":"陰","阳":"陽","动":"動","变":"變","宫":"宮","财":"財","孙":"孫","龙":"龍","陈":"陳",
    "复":"復","师":"師","临":"臨","谦":"謙","归":"歸","丰":"豐","恒":"恆","济":"濟","随":"隨",
    "兑":"兌","过":"過","剥":"剝","颐":"頤","损":"損","贲":"賁","蛊":"蠱","晋":"晉","观":"觀",
    "涣":"渙","渐":"漸","无":"無","讼":"訟","门":"門","档":"檔","历":"歷","时":"時","间":"間",
    "马":"馬","华":"華","盖":"蓋","灾":"災","贵":"貴","禄":"祿","测":"測","选":"選","择":"擇",
    "推":"推","演":"演","盘":"盤","点":"點","击":"擊","铜":"銅","钱":"錢","摇":"搖","会":"會",
    "联":"聯","系":"繫","们":"們","预":"預","约":"約","师":"師","态":"態","掷":"掷","线":"線",
    "冲":"沖","游":"遊","应":"應","当":"當","前":"前","法":"法","旬":"旬","空":"空","日":"日",
    "干":"干","支":"支","驿":"驛","花":"花","将":"將","刃":"刃","文":"文","昌":"昌","旺":"旺",
    "相":"相","休":"休","囚":"囚","死":"死","老":"老","少":"少","分":"分","出":"出","次":"次",
    "转":"轉","中":"中","生":"生","成":"成","排":"排","定":"定","初":"初","二":"二","三":"三",
    "四":"四","五":"五","上":"上","合":"合","魂":"魂","本":"本","不":"不","我":"我","方":"方",
    "式":"式","重":"重","新":"新","加":"加","载":"載","宝":"寶","互":"互","求":"求","解":"解",
    "辞":"辭","万":"萬","岁":"歲","历":"曆","创":"創","业":"業","网":"網","络":"絡","设":"設",
    // ▼ 二进制起卦专用字库补充 ▼
    "极":"極","客":"客","二":"二","进":"進","制":"制","编":"編","译":"譯","规":"規","则":"則",
    "输":"輸","入":"入","确":"確","切":"切","仅":"僅","包":"包","含":"含"
};

let isTrad = false;

// 翻译执行器
function t(str) {
    if (!str) return str;
    if (!isTrad) return str;
    return str.split('').map(c => s2t_map[c] || c).join('');
}

// ================= 全局语言嗅探器 (拦截 nav.js 的切换动作) =================
function checkLangState() {
    let lang = document.documentElement.lang || localStorage.getItem('lang') || localStorage.getItem('language') || 'zh-cn';
    lang = lang.toLowerCase();
    return lang.includes('tw') || lang.includes('hk') || lang.includes('hant') || lang === 'tc';
}

function updateLiuyaoLang() {
    let newTrad = checkLangState();
    if (isTrad !== newTrad) {
        isTrad = newTrad;
        
        document.querySelectorAll('[data-t]').forEach(el => {
            el.innerText = t(el.getAttribute('data-t'));
        });
        
        if(currentYaos.length > 0) renderFinalResult();
        initDateTime();
        if(document.getElementById('interact-manual') && document.getElementById('interact-manual').style.display === 'block') renderManualRows();
    }
}

// 启动嗅探与静默监听
document.addEventListener('DOMContentLoaded', () => {
    isTrad = checkLangState();
    document.querySelectorAll('[data-t]').forEach(el => el.innerText = t(el.getAttribute('data-t')));
    initDateTime();
    
    const observer = new MutationObserver(updateLiuyaoLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });
    
    document.addEventListener('click', () => {
        setTimeout(updateLiuyaoLang, 100);
        setTimeout(updateLiuyaoLang, 300);
    });
});

// ================= 数据初始化 =================
let currentYaos = [];
let currentDayTgIdx = 0; 
let currentMonthZhiIdx = 0; 
let manualYaos = [];     

// ================= 神煞计算算法 =================
const DZ_ARR = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
function getShensha(tgIdx, dzIdx) {
    let tg_ss = [];
    let dz_ss = [];
    
    if ([8,0,4].includes(dzIdx)) dz_ss.push(t("驿马")+"-寅");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push(t("驿马")+"-巳");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push(t("驿马")+"-申");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push(t("驿马")+"-亥");
    
    if ([8,0,4].includes(dzIdx)) dz_ss.push(t("桃花")+"-酉");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push(t("桃花")+"-子");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push(t("桃花")+"-卯");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push(t("桃花")+"-午");

    if ([8,0,4].includes(dzIdx)) dz_ss.push(t("将星")+"-子");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push(t("将星")+"-卯");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push(t("将星")+"-午");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push(t("将星")+"-酉");

    if ([8,0,4].includes(dzIdx)) dz_ss.push(t("华盖")+"-辰");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push(t("华盖")+"-未");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push(t("华盖")+"-戌");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push(t("华盖")+"-丑");

    if ([8,0,4].includes(dzIdx)) dz_ss.push(t("劫煞")+"-巳");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push(t("劫煞")+"-申");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push(t("劫煞")+"-亥");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push(t("劫煞")+"-寅");

    if ([8,0,4].includes(dzIdx)) dz_ss.push(t("灾煞")+"-午");
    else if ([11,3,7].includes(dzIdx)) dz_ss.push(t("灾煞")+"-酉");
    else if ([2,6,10].includes(dzIdx)) dz_ss.push(t("灾煞")+"-子");
    else if ([5,9,1].includes(dzIdx)) dz_ss.push(t("灾煞")+"-卯");

    if ([0,4,6].includes(tgIdx)) tg_ss.push(t("贵人")+"-丑,未");
    else if ([1,5].includes(tgIdx)) tg_ss.push(t("贵人")+"-子,申");
    else if ([2,3].includes(tgIdx)) tg_ss.push(t("贵人")+"-亥,酉");
    else if ([8,9].includes(tgIdx)) tg_ss.push(t("贵人")+"-卯,巳");
    else if (tgIdx === 7) tg_ss.push(t("贵人")+"-午,寅");
    
    const luMap = {0:"寅", 1:"卯", 2:"巳", 3:"午", 4:"巳", 5:"午", 6:"申", 7:"酉", 8:"亥", 9:"子"};
    tg_ss.push(t("日禄")+"-" + luMap[tgIdx]);

    const renMap = {0:"卯", 1:"辰", 2:"午", 3:"未", 4:"午", 5:"未", 6:"酉", 7:"戌", 8:"子", 9:"丑"};
    tg_ss.push(t("羊刃")+"-" + renMap[tgIdx]);

    const wenMap = {0:"巳", 1:"午", 2:"申", 3:"酉", 4:"申", 5:"酉", 6:"亥", 7:"子", 8:"寅", 9:"卯"};
    tg_ss.push(t("文昌")+"-" + wenMap[tgIdx]);
    
    return `
        <div class="shensha-row"><span class="shensha-label">【${t("日干神煞")}】</span> <span style="word-break: break-word;">${tg_ss.join(" &nbsp; ")}</span></div>
        <div class="shensha-row" style="margin-bottom:0;"><span class="shensha-label">【${t("日支神煞")}】</span> <span style="word-break: break-word;">${dz_ss.join(" &nbsp; ")}</span></div>
    `;
}

// ================= 五行旺相休囚死算法 =================
function getWangXiang(monthZhiIdx, yaoWx) {
    let monthWx = "土";
    if ([0, 11].includes(monthZhiIdx)) monthWx = "水"; 
    if ([2, 3].includes(monthZhiIdx)) monthWx = "木";  
    if ([5, 6].includes(monthZhiIdx)) monthWx = "火";  
    if ([8, 9].includes(monthZhiIdx)) monthWx = "金";  

    const gen = {"木":"火", "火":"土", "土":"金", "金":"水", "水":"木"};
    const res = {"木":"土", "土":"水", "水":"火", "火":"金", "金":"木"};

    if (yaoWx === monthWx) return t("旺");         
    if (gen[monthWx] === yaoWx) return t("相");    
    if (gen[yaoWx] === monthWx) return t("休");    
    if (res[yaoWx] === monthWx) return t("囚");    
    if (res[monthWx] === yaoWx) return t("死");    
    return "";
}

function initDateTime() {
    if (typeof Lunar === 'undefined') return;
    const now = new Date();
    const d = Lunar.fromDate(now);
    currentDayTgIdx = d.getDayGanIndex(); 
    currentMonthZhiIdx = d.getMonthZhiIndex(); 
    
    const html = `
        <span class="info-highlight">${t("当前推演")}：</span>ZenCode ${t("命运档案")}<br>
        <span class="info-highlight">${t("公历时间")}：</span>${d.getSolar().toYmdHms()}<br>
        <span class="info-highlight">${t("干支历法")}：</span>${d.getYearInGanZhi()}${t("年")} ${d.getMonthInGanZhi()}${t("月")} ${d.getDayInGanZhi()}${t("日")} ${d.getTimeInGanZhi()}${t("时")} <span style="color:var(--zc-text-muted)">（${t("旬空")}：${d.getDayXunKong()}）</span><br>
        <div style="font-size: 0.85rem; color: var(--zc-gold-dark); margin-top: 10px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 4px; border: 1px solid rgba(138, 115, 66, 0.2);">
            ${getShensha(currentDayTgIdx, d.getDayZhiIndex())}
        </div>
    `;
    const infoDiv = document.getElementById('dynamic-info');
    if (infoDiv) {
        infoDiv.innerHTML = html;
    }
}

function showScreen(screenId) {
    const screens = document.querySelectorAll('.flow-screen');
    for(let i=0; i<screens.length; i++) screens[i].style.display = 'none';
    const target = document.getElementById(screenId);
    if(target) target.style.display = 'block';
}

window.resetFlow = function() {
    currentYaos = [];
    showScreen('screen-choice');
    const layout = document.getElementById('gua-layout');
    if(layout) layout.className = 'gua-grid';
    initDateTime();

    const questionInputNode = document.getElementById('divination-question');
    if(questionInputNode) questionInputNode.value = '';
    
    const questionBoxNode = document.getElementById('result-question-box');
    if(questionBoxNode) questionBoxNode.style.display = 'none';
}

window.startMethod = function(method) {
    currentYaos = [];
    if (method === 'time') executeTimeMethod();
    else if (method === 'shake') setupShakeMethod();
    else if (method === 'manual') setupManualMethod();
    // ▼ 引入二进制起卦入口 ▼
    else if (method === 'binary') setupBinaryMethod();
}

function executeTimeMethod() {
    for(let i=0; i<6; i++) currentYaos.push(Math.random() > 0.5 ? 7 : 8); 
    let changingIndex = Math.floor(Math.random() * 6);
    currentYaos[changingIndex] = currentYaos[changingIndex] === 7 ? 9 : 6;
    renderFinalResult();
}

function setupShakeMethod() {
    showScreen('screen-interact');
    document.getElementById('interact-title').innerText = t("心诚则灵 · 掷铜钱排盘");
    document.getElementById('interact-manual').style.display = 'none';
    document.getElementById('interact-binary').style.display = 'none';
    document.getElementById('interact-shake').style.display = 'block';
    
    const progressDiv = document.getElementById('shake-progress');
    progressDiv.innerHTML = ''; 
    const btn = document.getElementById('btn-shake');
    btn.innerText = t("掷出铜钱 (第1次)");
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
        btn.innerText = t("铜钱翻转中...");

        let sum = 0; let results = [];
        for(let i = 0; i < 3; i++) { let isFront = Math.random() > 0.5; results.push(isFront); sum += isFront ? 3 : 2; }
        for (let i = 0; i < coins.length; i++) coins[i].style.animation = 'none';

        setTimeout(() => {
            for (let i = 0; i < coins.length; i++) {
                let animName = results[i] ? 'flip-heads' : 'flip-tails';
                coins[i].style.animation = animName + ' 1s ease-out forwards';
            }
        }, 20);

        setTimeout(() => {
            currentYaos.push(sum);
            let isYang = (sum === 7 || sum === 9);
            let mark = sum === 9 ? t('○ (动)') : (sum === 6 ? t('× (动)') : '');
            let yaoName = sum === 9 ? t('老阳') : (sum === 8 ? t('少阴') : (sum === 7 ? t('少阳') : t('老阴')));
            
            let yaoHtml = isYang ? `<div class="yao-symbol yao-yang"><div class="line"></div></div>` : `<div class="yao-symbol yao-yin"><div class="line"></div><div class="line"></div></div>`;
            
            progressDiv.insertAdjacentHTML('beforeend', `
                <div style="display:flex; align-items:center; gap: 15px; opacity: 0; animation: fadeInYao 0.5s forwards; -webkit-animation: fadeInYao 0.5s forwards;">
                    <span style="color:var(--zc-gold-dark); width: 100px; text-align:right; font-size:0.85rem; letter-spacing: 1px;">
                        ${sum}${t('分')} ${yaoName} <span style="color:var(--zc-gold-light)">${mark}</span>
                    </span>
                    ${yaoHtml}
                </div>
            `);

            if (currentYaos.length === 6) {
                btn.innerText = t("排定八宫纳甲...");
                setTimeout(renderFinalResult, 800);
            } else {
                btn.innerText = t(`掷出铜钱 (第${currentYaos.length + 1}次)`);
                btn.disabled = false;
            }
        }, 1100);
    };
}

function setupManualMethod() {
    showScreen('screen-interact');
    document.getElementById('interact-title').innerText = t("点按虚线排定阴阳");
    document.getElementById('interact-shake').style.display = 'none';
    document.getElementById('interact-binary').style.display = 'none';
    document.getElementById('interact-manual').style.display = 'block';
    
    manualYaos = [];
    for(let i=0; i<6; i++) manualYaos.push({ set: false, isYang: true, isChanging: false });
    renderManualRows();
}

// ▼ 新增：二进制起卦初始化方法 ▼
function setupBinaryMethod() {
    showScreen('screen-interact');
    document.getElementById('interact-title').innerText = t("极客起卦 (二进制)");
    document.getElementById('interact-shake').style.display = 'none';
    document.getElementById('interact-manual').style.display = 'none';
    document.getElementById('interact-binary').style.display = 'block';
    
    document.getElementById('input-binary').value = '';
    document.getElementById('binary-error').innerText = '';
}

// ▼ 新增：二进制编译执行方法 ▼
window.generateBinaryGua = function() {
    const binInput = document.getElementById('input-binary').value.trim();
    const errorDiv = document.getElementById('binary-error');

    // 正则校验：必须是刚好 6 位的 0 或 1
    if (!/^[01]{6}$/.test(binInput)) {
        errorDiv.innerText = t("Error: 请输入确切的6位二进制字符 (仅包含0和1)");
        return;
    }
    
    errorDiv.innerText = "";
    currentYaos = [];
    
    // 解析：左到右分别对应初爻到上爻
    for (let i = 0; i < 6; i++) {
        const bit = binInput.charAt(i);
        currentYaos.push(bit === '1' ? 7 : 8); 
    }

    renderFinalResult();
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
    const names = [t('初爻'), t('二爻'), t('三爻'), t('四爻'), t('五爻'), t('上爻')];
    
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
                <div class="${dongClass}" onclick="toggleManualDong(${i})">${t("动")}</div>
            </div>`;
    }
}

window.generateManualGua = function() {
    currentYaos = [];
    for(let i=0; i<6; i++) {
        let y = manualYaos[i];
        if (!y.set) { alert(t("请先点按排定所有六个爻的阴阳！")); return; }
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

function getGuaTags(b, t_val, name) {
    let tags = [];
    let x = b ^ t_val;
    if (x === 5) tags.push(t("游魂"));
    if (x === 2) tags.push(t("归魂"));
    if (x === 0 || name === "天雷无妄" || name === "雷天大壮") tags.push(t("六冲"));
    const liuHe = ["天地否", "地天泰", "水泽节", "泽水困", "火山旅", "山火贲", "雷地豫", "地雷复"];
    if (liuHe.includes(name)) tags.push(t("六合"));
    
    return tags.length > 0 ? `<span style="font-size:0.75rem; color:var(--zc-gold-dark); font-weight:normal; margin-left:8px; opacity:0.8;">[${tags.join("·")}]</span>` : "";
}

function getPalaceAndShi(b, t_val) {
    let x = b ^ t_val;
    if (x === 0) return { p: b, shi: 5 };
    if (x === 1) return { p: t_val, shi: 0 };
    if (x === 3) return { p: t_val, shi: 1 };
    if (x === 7) return { p: t_val, shi: 2 };
    if (x === 6) return { p: t_val ^ 1, shi: 3 };
    if (x === 4) return { p: t_val ^ 3, shi: 4 };
    if (x === 5) return { p: t_val ^ 2, shi: 3 }; 
    if (x === 2) return { p: b, shi: 2 };     
    return { p: 7, shi: 0 };
}

function getKinship(palaceWx, lineWx) { return t(KINSHIPS[(WX_IDX[lineWx] - WX_IDX[palaceWx] + 5) % 5]); }

window.calcGua = function(yaos) {
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

    function buildLines(b, t_val) {
        let lines = [];
        for(let i=0; i<3; i++) {
            let dzIdx = NA_JIA_DZ[b][0][i]; let wxStr = DZ_WX[dzIdx];
            lines.push({tg:t(NA_JIA_TG[b][0]), dz:t(DZ[dzIdx]), wx:t(wxStr), k:getKinship(pWx, wxStr), state: getWangXiang(currentMonthZhiIdx, wxStr)});
        }
        for(let i=0; i<3; i++) {
            let dzIdx = NA_JIA_DZ[t_val][1][i]; let wxStr = DZ_WX[dzIdx];
            lines.push({tg:t(NA_JIA_TG[t_val][1]), dz:t(DZ[dzIdx]), wx:t(wxStr), k:getKinship(pWx, wxStr), state: getWangXiang(currentMonthZhiIdx, wxStr)});
        }
        return lines;
    }
    
    let bIdx = (currentDayTgIdx <= 1) ? 0 : (currentDayTgIdx <= 3) ? 1 : (currentDayTgIdx === 4) ? 2 : (currentDayTgIdx === 5) ? 3 : (currentDayTgIdx <= 7) ? 4 : 5;
    let beasts = [];
    for (let i=0; i<6; i++) beasts.push(t(BEASTS[(bIdx + i) % 6]));
    
    return {
        main: { name: t(HEX_NAMES[tM][bM]), tag: getGuaTags(bM, tM, HEX_NAMES[tM][bM]), palaceName: t(PALACE_NAME[infoM.p]), shi: infoM.shi, ying: (infoM.shi+3)%6, lines: buildLines(bM, tM) },
        change: { name: t(HEX_NAMES[tC][bC]), tag: getGuaTags(bC, tC, HEX_NAMES[tC][bC]), palaceName: t(PALACE_NAME[infoC.p]), shi: infoC.shi, ying: (infoC.shi+3)%6, lines: buildLines(bC, tC) },
        beasts: beasts
    };
}

// ================= 5. 最终渲染 =================
window.renderFinalResult = function() {
    showScreen('screen-result');
    
    const questionInput = document.getElementById('divination-question');
    const questionBox = document.getElementById('result-question-box');
    const questionText = document.getElementById('result-question-text');

    if (questionInput && questionBox && questionText) {
        const qVal = questionInput.value.trim();
        if (qVal) {
            questionText.innerText = qVal;
            questionBox.style.display = 'block'; 
        } else {
            questionText.innerText = '';
            questionBox.style.display = 'none';  
        }
    }

    const mainContainer = document.getElementById('dynamic-main-gua');
    const changeContainer = document.getElementById('dynamic-change-gua');
    const beastContainer = document.getElementById('dynamic-beasts');
    const guaLayout = document.getElementById('gua-layout');
    const changeCol = document.getElementById('change-gua-col');

    if (!mainContainer || !changeContainer || !beastContainer) return;

    mainContainer.innerHTML = ''; changeContainer.innerHTML = ''; beastContainer.innerHTML = '';

    const gua = window.calcGua(currentYaos);
    const hasChange = currentYaos.some(v => v === 6 || v === 9);

    if (!hasChange) {
        changeCol.style.display = 'none';
        guaLayout.classList.add('is-jing-gua');
    } else {
        changeCol.style.display = 'block';
        guaLayout.classList.remove('is-jing-gua');
    }

    document.getElementById('main-gua-title').innerHTML = `${gua.main.palaceName}${t("宫")}：${gua.main.name}${gua.main.tag}`;
    if (hasChange) document.getElementById('change-gua-title').innerHTML = `${gua.change.palaceName}${t("宫")}：${gua.change.name}${gua.change.tag}`;
    
    for(let i=5; i>=0; i--) beastContainer.insertAdjacentHTML('beforeend', `<span>${gua.beasts[i]}</span>`);

    for(let i=5; i>=0; i--) {
        let val = currentYaos[i];
        let isMainYang = (val === 7 || val === 9);
        let mark = val === 9 ? '○→' : (val === 6 ? '×→' : '');
        let mLine = gua.main.lines[i];
        let mPos = (i === gua.main.shi) ? t('世') : (i === gua.main.ying) ? t('应') : '';

        let stateHtml = `<span style="font-size:0.6rem; opacity:0.7; margin-left:2px; vertical-align: super;">(${mLine.state})</span>`;

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
            let cPos = (i === gua.change.shi) ? t('世') : (i === gua.change.ying) ? t('应') : '';
            
            let stateClass = isChangingLine ? 'is-active-line' : 'is-static-line';
            let cStateHtml = `<span style="font-size:0.6rem; opacity:0.7; margin-left:2px; vertical-align: super;">(${cLine.state})</span>`;

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

// ================= 6. 导出图片功能 =================
window.exportGuaImage = function() {
    if (typeof html2canvas === 'undefined') {
        alert(t("截图引擎未加载完成，请稍后重试或检查网络。"));
        return;
    }

    const btn = document.getElementById('btn-export-img');
    const originalText = btn.innerText;
    btn.innerText = t("正在生成高清图...");
    btn.disabled = true;

    const panel = document.getElementById('main-panel');
    const actionArea = document.getElementById('result-action-area');
    
    // 缓存原始样式
    const originalBg = panel.style.background || '';
    const originalFilter = panel.style.backdropFilter || '';
    const originalShadow = panel.style.boxShadow || '';

    // 截图前预处理：隐藏交互按钮，取消玻璃态模糊，替换为深邃实色背景
    if (actionArea) actionArea.style.display = 'none';
    panel.style.background = '#0d0c11'; 
    panel.style.backdropFilter = 'none';
    panel.style.boxShadow = 'none'; // 去掉外阴影防止截图边缘发黑

    // 延迟 100ms 确保 DOM 样式重绘完成
    setTimeout(() => {
        html2canvas(panel, {
            scale: 2, // 开启 2 倍抗锯齿，确保字体和线条锐利
            backgroundColor: '#050505', // 画布底层颜色
            useCORS: true,
            logging: false
        }).then(canvas => {
            // 恢复原有的玻璃态和交互按钮
            if (actionArea) actionArea.style.display = 'flex';
            panel.style.background = originalBg;
            panel.style.backdropFilter = originalFilter;
            panel.style.boxShadow = originalShadow;
            btn.innerText = originalText;
            btn.disabled = false;

            // 触发下载
            const link = document.createElement('a');
            const timestamp = new Date().getTime();
            link.download = `ZenCode_命运档案_${timestamp}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error("图片生成失败:", err);
            // 发生异常也要恢复现场
            if (actionArea) actionArea.style.display = 'flex';
            panel.style.background = originalBg;
            panel.style.backdropFilter = originalFilter;
            panel.style.boxShadow = originalShadow;
            btn.innerText = originalText;
            btn.disabled = false;
            alert(t("图片生成失败，请稍后重试。"));
        });
    }, 100);
}
