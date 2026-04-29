// liuyao.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化顶部时间与干支信息 (依赖 lunar-javascript)
    function initDateTime() {
        // 如果页面没有引入 Lunar，这里需要加个保护
        if (typeof Lunar === 'undefined') {
            console.error('lunar-javascript 未加载');
            return;
        }

        const now = new Date();
        const d = Lunar.fromDate(now);
        
        const yearGanZhi = `${d.getYearInGanZhi()}年`;
        const monthGanZhi = `${d.getMonthInGanZhi()}月`;
        const dayGanZhi = `${d.getDayInGanZhi()}日`;
        const timeZhi = `${d.getTimeZhi()}时`;
        const xunKong = d.getDayXunKong(); // 自动计算旬空

        const infoHtml = `
            测卦时间：<br>
            公历：${d.getSolar().toYmdHms()}<br>
            干支：${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${timeZhi} （旬空：${xunKong}）
        `;
        
        const infoDiv = document.querySelector('.divination-info');
        if (infoDiv) {
            infoDiv.innerHTML = infoHtml;
        }
    }

    // 2. 核心状态：存放六个爻的数据 (从初爻到上爻)
    // 约定: 6为老阴(交), 7为少阳(单), 8为少阴(拆), 9为老阳(重)
    let yaoData = []; 

    // 3. 模拟传统摇卦逻辑
    function castSingleYao() {
        if (yaoData.length >= 6) {
            console.log("六爻已满，请重新起卦");
            return;
        }
        
        // 模拟三枚铜钱：每枚硬币字(2)或背(3)
        const getCoin = () => Math.random() > 0.5 ? 2 : 3;
        const sum = getCoin() + getCoin() + getCoin(); // 结果必为 6, 7, 8, 9
        
        yaoData.push(sum);
        
        // 渲染当前进度
        renderGuaGrid();
    }

    // 4. 视图渲染引擎
    function renderGuaGrid() {
        // 这里是你刚写的 .gua-grid 容器
        const mainGuaContainer = document.querySelector('.gua-grid > div:nth-child(2)');
        
        if (!mainGuaContainer) return;

        // 每次摇卦更新视图 (简易示例，实际你需要用 JS 动态生成你写的 .yao-row 结构)
        console.log("当前爻象:", yaoData);
        
        // 当收集齐6个爻时，执行核心排盘算法
        if (yaoData.length === 6) {
            const hexagramInfo = calculateHexagram(yaoData);
            console.log("卦象计算完毕，准备深度渲染:", hexagramInfo);
            // 触发更复杂的 DOM 替换，填入六亲、世应等
        }
    }

    // 5. 核心排盘算法 (这里是真正的技术难点所在)
    function calculateHexagram(yaos) {
        // TODO:
        // 1. 将 6,7,8,9 转化为本卦和变卦的二进制/八卦符号
        // 2. 八宫寻址（定世应、定卦宫五行）
        // 3. 浑天甲子定六亲（根据当前日干支和卦宫计算）
        // 4. 排六兽
        return {
            status: "success",
            data: yaos
        };
    }

    // 初始化运行
    initDateTime();
    
    // 你可以在 HTML 里加个按钮触发 castSingleYao()
    // document.getElementById('cast-btn').addEventListener('click', castSingleYao);
});
