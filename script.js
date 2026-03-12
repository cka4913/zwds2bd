// 全局變量存儲用戶輸入
let userData = {
    yinyang: '',
    gender: '',
    year: '',
    month: '',
    day: '',
    hour: '',
    ju: '',
    mingGong: '',
    ziwei: '',
    youbi: '',
    wenchang: '',
    firstLimit: '',
    brothersLimit: '',
    santai: '',
    bazuo: ''
};

// 天干地支
const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 十二宮位（按紫微斗數正確順序：從寅開始）
const twelvePalaces = ['yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai', 'zi', 'chou'];

// 時辰對應
const hourMapping = {
    'zi': 0, 'chou': 1, 'yin': 2, 'mao': 3, 'chen': 4, 'si': 5,
    'wu': 6, 'wei': 7, 'shen': 8, 'you': 9, 'xu': 10, 'hai': 11
};

// 局數配置
const juConfig = {
    2: { name: '水二局', range: [2, 11] },
    3: { name: '木三局', range: [3, 12] },
    4: { name: '金四局', range: [4, 13] },
    5: { name: '土五局', range: [5, 14] },
    6: { name: '火六局', range: [6, 15] }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeYearDropdown();
    initializeDayDropdown();
    initializePalaceSelection();
});

// 初始化年份下拉框
function initializeYearDropdown() {
    const yearSelect = document.getElementById('year');
    const baseYear = 1900;

    for (let year = 1900; year <= 2025; year++) {
        const ganZhi = getGanZhi(year);
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `${year} - ${ganZhi}`;
        yearSelect.appendChild(option);
    }
}

// 計算干支
function getGanZhi(year) {
    // 1984年是甲子年
    const offset = year - 1984;
    const ganIndex = (offset + 10) % 10;
    const zhiIndex = (offset + 12) % 12;

    let adjustedGanIndex = ganIndex;
    let adjustedZhiIndex = zhiIndex;

    if (adjustedGanIndex < 0) adjustedGanIndex += 10;
    if (adjustedZhiIndex < 0) adjustedZhiIndex += 12;

    return tianGan[adjustedGanIndex] + diZhi[adjustedZhiIndex];
}

// 初始化日期下拉框
function initializeDayDropdown() {
    const daySelect = document.getElementById('day');
    for (let i = 1; i <= 30; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i + '日';
        daySelect.appendChild(option);
    }
}

// 初始化宮位選擇
function initializePalaceSelection() {
    // 命宮選擇
    document.querySelectorAll('.palace-cell:not(.ziwu-cell)').forEach(cell => {
        cell.addEventListener('click', function() {
            document.querySelectorAll('.palace-cell:not(.ziwu-cell)').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');

            const palace = this.getAttribute('data-palace');
            userData.mingGong = palace;
            document.getElementById('mingGongResult').textContent = getPalaceName(palace);
        });
    });

    // 紫微星選擇
    document.querySelectorAll('.ziwu-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            document.querySelectorAll('.ziwu-cell').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');

            const palace = this.getAttribute('data-palace');
            userData.ziwei = palace;
            document.getElementById('ziweiResult').textContent = getPalaceName(palace);
        });
    });
}

// 獲取宮位名稱
function getPalaceName(code) {
    const names = {
        'yin': '寅宮', 'mao': '卯宮', 'chen': '辰宮', 'si': '巳宮',
        'wu': '午宮', 'wei': '未宮', 'shen': '申宮', 'you': '酉宮',
        'xu': '戌宮', 'hai': '亥宮', 'zi': '子宮', 'chou': '丑宮'
    };
    return names[code] || code;
}

// 步驟控制
let currentStep = 1;

function nextStep() {
    if (currentStep === 1) {
        saveBasicData();
        if (validateStep1()) {
            showStep(2);
            currentStep = 2;
        }
    } else if (currentStep === 2) {
        if (validateStep2()) {
            showStep(3);
            currentStep = 3;
        }
    } else if (currentStep === 3) {
        if (validateStep3()) {
            generateMissingDataQuestions();
            showStep(4);
            currentStep = 4;
        }
    } else if (currentStep === 4) {
        if (validateStep4()) {
            showStep(5);
            currentStep = 5;
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
        currentStep--;
    }
}

function showStep(stepNum) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.add('hidden');
    });
    document.getElementById('step' + stepNum).classList.remove('hidden');
}

// 驗證步驟1
function validateStep1() {
    // 至少需要知道年份
    if (!userData.year) {
        alert('請至少選擇出生年份');
        return false;
    }
    return true;
}

// 驗證步驟2
function validateStep2() {
    if (!userData.mingGong) {
        alert('請選擇命宮位置');
        return false;
    }
    return true;
}

// 驗證步驟3
function validateStep3() {
    if (!userData.ziwei) {
        alert('請選擇紫微星位置');
        return false;
    }
    return true;
}

// 驗證步驟4
function validateStep4() {
    return true;
}

// 保存基本資料
function saveBasicData() {
    userData.yinyang = document.getElementById('yinyang').value;
    userData.gender = document.getElementById('gender').value;
    userData.year = document.getElementById('year').value;
    userData.month = document.getElementById('month').value;
    userData.day = document.getElementById('day').value;
    userData.hour = document.getElementById('hour').value;
    userData.ju = document.getElementById('ju').value;

    // 若未選陰陽但有年份，按年干自動補齊
    if (!userData.yinyang && userData.year) {
        userData.yinyang = getYearYinyang(parseInt(userData.year, 10));
    }
}

function createStep4PalaceGrid(cellClass, centerLabel) {
    return `
        <div class="palace-grid">
            <div class="palace-cell ${cellClass}" data-palace="si">巳宮</div>
            <div class="palace-cell ${cellClass}" data-palace="wu">午宮</div>
            <div class="palace-cell ${cellClass}" data-palace="wei">未宮</div>
            <div class="palace-cell ${cellClass}" data-palace="shen">申宮</div>

            <div class="palace-cell ${cellClass}" data-palace="chen">辰宮</div>
            <div class="center-text">${centerLabel}</div>
            <div class="palace-cell ${cellClass}" data-palace="you">酉宮</div>

            <div class="palace-cell ${cellClass}" data-palace="mao">卯宮</div>
            <div class="palace-cell ${cellClass}" data-palace="xu">戌宮</div>

            <div class="palace-cell ${cellClass}" data-palace="yin">寅宮</div>
            <div class="palace-cell ${cellClass}" data-palace="chou">丑宮</div>
            <div class="palace-cell ${cellClass}" data-palace="zi">子宮</div>
            <div class="palace-cell ${cellClass}" data-palace="hai">亥宮</div>
        </div>
    `;
}

function bindStep4PalaceSelection(cellSelector, userDataKey, resultId) {
    const cells = document.querySelectorAll(cellSelector);
    const resultEl = document.getElementById(resultId);

    cells.forEach(cell => {
        if (userData[userDataKey] && cell.getAttribute('data-palace') === userData[userDataKey]) {
            cell.classList.add('selected');
        }

        cell.addEventListener('click', function() {
            document.querySelectorAll(cellSelector).forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            const palace = this.getAttribute('data-palace');
            userData[userDataKey] = palace;
            if (resultEl) resultEl.textContent = getPalaceName(palace);
        });
    });
}

function initializeStep4PalaceSelection() {
    bindStep4PalaceSelection('.youbi-cell', 'youbi', 'youbiResult');
    bindStep4PalaceSelection('.wenchang-cell', 'wenchang', 'wenchangResult');
}

// 生成缺失資料問題
function generateMissingDataQuestions() {
    const container = document.getElementById('missingDataQuestions');
    container.innerHTML = '';

    let questionsAdded = false;

    // 檢查缺失月份
    if (!userData.month) {
        questionsAdded = true;
        const section = createQuestionSection(
            '推算農曆月份',
            '請提供右弼星的位置'
        );

        section.innerHTML += `
            <div class="form-group"><label>右弼星位置：</label></div>
            ${createStep4PalaceGrid('youbi-cell', '右弼')}
            <div class="selected-palace">
                <label>已選擇：</label>
                <span id="youbiResult">${userData.youbi ? getPalaceName(userData.youbi) : '未選擇'}</span>
            </div>
            <p class="hint">根據右弼位置可以推算出農曆出生月份</p>
        `;

        container.appendChild(section);
    }

    // 檢查缺失時辰
    if (!userData.hour) {
        questionsAdded = true;
        const section = createQuestionSection(
            '推算出生時辰',
            '請提供文昌星的位置'
        );

        section.innerHTML += `
            <div class="form-group"><label>文昌星位置：</label></div>
            ${createStep4PalaceGrid('wenchang-cell', '文昌')}
            <div class="selected-palace">
                <label>已選擇：</label>
                <span id="wenchangResult">${userData.wenchang ? getPalaceName(userData.wenchang) : '未選擇'}</span>
            </div>
            <p class="hint">根據文昌位置可以推算出出生時辰</p>
        `;

        container.appendChild(section);
    }

    // 檢查缺失局數或陰陽男女
    if (!userData.ju || !userData.yinyang || !userData.gender) {
        questionsAdded = true;
        const section = createQuestionSection(
            '推算局數和陰陽男女',
            '請提供第一大限和兄弟宮的年份範圍'
        );

        section.innerHTML += `
            <div class="form-group">
                <label>命宮（第一大限）年份範圍：</label>
                <select id="firstLimit" class="dropdown" onchange="updateBrothersOptions(this.value)">
                    <option value="">--</option>
                    <option value="2">2-11歲 (水二局)</option>
                    <option value="3">3-12歲 (木三局)</option>
                    <option value="4">4-13歲 (金四局)</option>
                    <option value="5">5-14歲 (土五局)</option>
                    <option value="6">6-15歲 (火六局)</option>
                </select>
            </div>
            <div class="form-group">
                <label>兄弟宮年份範圍：</label>
                <select id="brothersLimit" class="dropdown" onchange="userData.brothersLimit = this.value">
                    <option value="">--</option>
                    <option value="positive">順行（如：112-121歲）</option>
                    <option value="negative">逆行（如：12-21歲）</option>
                </select>
            </div>
            <p class="hint">根據局數和兄弟宮範圍可以判斷陽男陰女或陰男陽女</p>
        `;

        container.appendChild(section);
    }

    if (!questionsAdded) {
        container.innerHTML = '<p class="hint">✅ 您已提供完整的基本資料，可以直接進入下一步</p>';
        return;
    }

    initializeStep4PalaceSelection();
}

// 創建問題區塊
function createQuestionSection(title, description) {
    const section = document.createElement('div');
    section.className = 'question-section';
    section.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;
    return section;
}

// 更新兄弟宮選項
function updateBrothersOptions(juNum) {
    userData.firstLimit = juNum;
    const brothersSelect = document.getElementById('brothersLimit');

    if (!juNum) {
        brothersSelect.innerHTML = '<option value="">--</option>';
        return;
    }

    const ju = parseInt(juNum, 10);
    brothersSelect.innerHTML = `
        <option value="">--</option>
        <option value="positive">順行（如：${ju + 110}-${ju + 119}歲）</option>
        <option value="negative">逆行（如：${ju + 10}-${ju + 19}歲）</option>
    `;
}

// 計算生日
function calculateBirthday() {
    // 保存三台八座資料
    userData.santai = document.getElementById('santai').value;
    userData.bazuo = document.getElementById('bazuo').value;

    const results = [];

    try {
        // 根據已有資料推算
        if (userData.month && userData.day && userData.hour && userData.year) {
            // 已有完整日期時辰
            results.push({
                title: '完整資料推算',
                description: `根據您提供的完整資料，推算結果如下：`,
                result: calculateFullDate()
            });
        } else {
            // 需要推算缺失部分
            const calculatedResults = calculateMissingData();
            results.push(...calculatedResults);
        }

        displayResults(results);
    } catch (error) {
        displayError(error.message);
    }
}

// 計算完整日期
function calculateFullDate() {
    const lunarMonth = userData.month;
    const lunarDay = userData.day;
    const hour = userData.hour;

    // 時辰名稱映射
    const hourName = {
        'zi': '子', 'chou': '丑', 'yin': '寅', 'mao': '卯',
        'chen': '辰', 'si': '巳', 'wu': '午', 'wei': '未',
        'shen': '申', 'you': '酉', 'xu': '戌', 'hai': '亥'
    };

    // 陰陽名稱
    const yinyangName = userData.yinyang === 'yang' ? '陽' : '陰';

    // 性別名稱
    const genderName = userData.gender === 'male' ? '男' : '女';

    // 局數名稱
    const juName = userData.ju ? juConfig[userData.ju].name : '未知';

    // 構建結果字符串
    let result = `${yinyangName}${genderName}${userData.year}年 農曆${lunarMonth}月${lunarDay}日`;

    // 添加時辰（如果有）
    if (hour && hourName[hour]) {
        result += `${hourName[hour]}時`;
    }

    // 添加局數
    result += ` ${juName}`;

    return result;
}

// 計算缺失資料
function calculateMissingData() {
    const results = [];

    // 推算月份（只用右弼）
    if (!userData.month && userData.youbi) {
        const calculatedMonth = calculateMonthFromYoubi(userData.youbi);
        if (calculatedMonth) {
            userData.month = calculatedMonth;
            results.push({
                title: '推算農曆月份',
                description: `根據右弼星位置，推算出農曆月份為：${calculatedMonth}月`,
                result: `右弼星：${getPalaceName(userData.youbi)}<br>推算月份：${calculatedMonth}月`
            });
        }
    }

    // 推算時辰（只用文昌）
    if (!userData.hour && userData.wenchang) {
        const calculatedHour = calculateHourFromWenchang(userData.wenchang);
        if (calculatedHour) {
            userData.hour = calculatedHour;
            results.push({
                title: '推算出生時辰',
                description: `根據文昌星位置，推算出出生時辰為：${getHourName(calculatedHour)}`,
                result: `文昌星：${getPalaceName(userData.wenchang)}<br>推算時辰：${getHourName(calculatedHour)}`
            });
        }
    }

    // 推算局數和陰陽
    if (userData.firstLimit && userData.brothersLimit) {
        const calculated = calculateJuAndYinYang(userData.firstLimit, userData.brothersLimit);
        if (calculated) {
            userData.ju = calculated.ju;
            if (calculated.yinyang) userData.yinyang = calculated.yinyang;
            if (calculated.gender) userData.gender = calculated.gender;

            const yinyangText = userData.yinyang ? (userData.yinyang === 'yang' ? '陽' : '陰') : '未能判定';
            const genderText = userData.gender ? (userData.gender === 'male' ? '男' : '女') : '未能判定';
            const directionText = userData.brothersLimit === 'positive' ? '順行' : '逆行';
            const consistencyText = calculated.isConsistent ? '' : '<br>⚠️ 兄弟宮順逆與目前陰陽/性別資料不一致，請再核對。';

            results.push({
                title: '推算局數和陰陽',
                description: `根據第一大限和兄弟宮範圍，推算結果如下：`,
                result: `局數：${juConfig[calculated.ju].name}<br>順逆：${directionText}<br>陰陽：${yinyangText}<br>性別：${genderText}${consistencyText}`
            });
        }
    }

    // 如果已有月份但缺少日期，根據紫微星位置推算可能日期
    if (userData.month && !userData.day && userData.ziwei && userData.mingGong) {
        if (!userData.ju) {
            results.push({
                title: '可能農曆日期',
                description: '目前資料不足以反推日期',
                result: '請先提供局數（例如：第一大限與兄弟宮順逆），再計算農曆日期。'
            });
        } else {
            const possibleDays = calculatePossibleDaysInMonth();
            const extraFilters = [];
            if (userData.santai) extraFilters.push(`三台（${getPalaceName(userData.santai)}）`);
            if (userData.bazuo) extraFilters.push(`八座（${getPalaceName(userData.bazuo)}）`);
            const filterText = extraFilters.length > 0 ? `、${extraFilters.join('、')}` : '';
            if (possibleDays.length > 0) {
                results.push({
                    title: '可能農曆日期',
                    description: `根據紫微星位置、命宮位置、已知月份（${userData.month}月）、局數（${juConfig[userData.ju].name}）${filterText}，以下為可能的農曆日期：`,
                    result: possibleDays.join('<br>')
                });
            } else {
                results.push({
                    title: '可能農曆日期',
                    description: '未找到符合條件的日期',
                    result: '目前輸入條件互相衝突，請檢查命宮、紫微星、月份、時辰、三台八座是否正確。'
                });
            }
        }
    }

    // 如果完全缺少月份和日期，給出可能的完整日期
    if (!userData.month && !userData.day && userData.ziwei && userData.mingGong) {
        results.push({
            title: '可能農曆生日',
            description: '目前資料不足以反推完整日期',
            result: '請先補充右弼位置推算月份，再根據局數與紫微星位置反推日期。'
        });
    }

    if (results.length === 0) {
        results.push({
            title: '資料不足',
            description: '抱歉，根據現有資料無法推算出準確的生日日期。',
            result: '請提供更多資料（如月份、時辰、或星曜位置）以獲得準確的推算結果。'
        });
    }

    return results;
}

// 根據右弼推算月份
function calculateMonthFromYoubi(youbi) {
    // 右弼星從戌宮逆數農曆月份（iztro 同規則）
    const earthlyBranches = ['yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai', 'zi', 'chou'];
    const youbiIndex = earthlyBranches.indexOf(youbi);
    const xuIndex = earthlyBranches.indexOf('xu');
    if (youbiIndex === -1) return null;
    return (xuIndex - youbiIndex + 12) % 12 + 1;
}

// 根據文昌推算時辰
function calculateHourFromWenchang(wenchang) {
    // 文昌星從戌宮逆數到時辰地支（iztro 同規則）
    const earthlyBranches = ['yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai', 'zi', 'chou'];
    const wenchangIndex = earthlyBranches.indexOf(wenchang);
    const xuIndex = earthlyBranches.indexOf('xu');
    if (wenchangIndex === -1) return null;
    const timeIndex = (xuIndex - wenchangIndex + 12) % 12;
    return getHourCodeFromTimeIndex(timeIndex);
}

// 推算局數和陰陽
function calculateJuAndYinYang(firstLimit, brothersLimit) {
    const ju = parseInt(firstLimit);
    const isPositive = brothersLimit === 'positive';

    let calculatedYinyang = userData.yinyang || '';
    let calculatedGender = userData.gender || '';

    // 年干可直接決定陰陽（甲丙戊庚壬為陽；乙丁己辛癸為陰）
    if (!calculatedYinyang && userData.year) {
        calculatedYinyang = getYearYinyang(parseInt(userData.year, 10));
    }

    // 陽男陰女順行；陰男陽女逆行
    if (!calculatedGender && calculatedYinyang) {
        if (isPositive) {
            calculatedGender = calculatedYinyang === 'yang' ? 'male' : 'female';
        } else {
            calculatedGender = calculatedYinyang === 'yang' ? 'female' : 'male';
        }
    }

    if (!calculatedYinyang && calculatedGender) {
        if (isPositive) {
            calculatedYinyang = calculatedGender === 'male' ? 'yang' : 'yin';
        } else {
            calculatedYinyang = calculatedGender === 'male' ? 'yin' : 'yang';
        }
    }

    let isConsistent = true;
    if (calculatedYinyang && calculatedGender) {
        const shouldPositive =
            (calculatedYinyang === 'yang' && calculatedGender === 'male') ||
            (calculatedYinyang === 'yin' && calculatedGender === 'female');
        isConsistent = shouldPositive === isPositive;
    }

    return { ju, yinyang: calculatedYinyang, gender: calculatedGender, isConsistent };
}

// 根據年份判斷陰陽
function getYearYinyang(year) {
    // 年干陰陽：甲丙戊庚壬為陽；乙丁己辛癸為陰
    const offset = year - 1984; // 1984 = 甲子
    let ganIndex = offset % 10;
    if (ganIndex < 0) ganIndex += 10;
    return ganIndex % 2 === 0 ? 'yang' : 'yin';
}

// 計算可能日期
function calculatePossibleDates() {
    const possibleDates = [];

    if (!userData.year || !userData.ziwei || !userData.mingGong) {
        return possibleDates;
    }

    // 根據紫微斗數排盤算法計算可能日期
    // 使用紫微星位置和命宮位置來推算

    // 獲取已知的月份限制
    const startMonth = userData.month ? parseInt(userData.month) : 1;
    const endMonth = userData.month ? parseInt(userData.month) : 12;

    // 根據紫微星和命宮位置計算可能日期
    const calculatedDates = calculateDatesFromZiweiAndMingGong(
        parseInt(userData.year),
        userData.ziwei,
        userData.mingGong,
        startMonth,
        endMonth
    );

    return calculatedDates;
}

// 根據紫微星和命宮位置計算可能的日期
function calculateDatesFromZiweiAndMingGong(year, ziwei, mingGong, startMonth, endMonth) {
    const possibleDates = [];

    // 紫微斗數排盤算法
    // 根據紫微星位置和命宮位置來推算可能的生日

    // 1. 計算紫微星的基准位置
    // 紫微星的位置取決於出生日的五行局數和月份
    // 這裡我們需要反推：知道紫微星位置，反推可能的日子

    // 2. 根據命宮位置計算出生月份的關係
    // 命宮位置 = (月份 + 時辰索引) % 12

    // 3. 紫微星位置的計算公式
    // 紫微星位置取決於：出生日、局數、月份

    // 只使用已知局數，避免候選結果爆量
    const possibleJu = getJuCandidates();
    if (possibleJu.length === 0) return possibleDates;

    possibleJu.forEach(ju => {
        // 根據局數和紫微星位置，計算可能的日子
        const datesForJu = calculateDatesForJu(year, ziwei, mingGong, ju, startMonth, endMonth);
        possibleDates.push(...datesForJu);
    });

    // 去重並排序
    const uniqueDates = [...new Set(possibleDates)];
    return uniqueDates.sort(compareLunarDateText);
}

// 根據特定局數計算可能日期
function calculateDatesForJu(year, ziwei, mingGong, ju, startMonth, endMonth) {
    const dates = [];

    // 紫微斗數中，紫微星的位置計算：
    // 根據局數、出生日來決定紫微星在哪個宮位

    // 簡化的算法：根據紫微星位置和局數，推算可能的日子
    const ziweiIndex = twelvePalaces.indexOf(ziwei);
    const mingGongIndex = twelvePalaces.indexOf(mingGong);

    if (ziweiIndex === -1 || mingGongIndex === -1) {
        return dates;
    }

    // 根據紫微斗數書籍，紫微星的定位有特定規律
    // 這裡使用一個簡化但更準確的算法

    // 對於每個月份，計算符合條件的日子
    for (let month = startMonth; month <= endMonth; month++) {
        const daysForMonth = calculateDaysInMonth(year, month, ziwei, mingGong, ju);
        dates.push(...daysForMonth);
    }

    // 去重並排序
    const uniqueDates = [...new Set(dates)];
    return uniqueDates.sort(compareLunarDateText);
}

// 計算特定月份中符合條件的日子
function calculateDaysInMonth(year, month, ziwei, mingGong, ju) {
    const validDays = [];

    // 使用 iztro 的正確紫微星定位算法反推日期
    // 紫微星定位口訣：
    // - 六五四三二，酉午亥辰丑，
    // - 局數除日數，商數宫前走；
    // - 若见数无余，便要起虎口，
    // - 日数小於局，还直宫中守。

    const ziweiTargetIndex = twelvePalaces.indexOf(ziwei);
    if (ziweiTargetIndex === -1) return validDays;

    const fiveElementsValue = ju;

    // 遍歷該月所有可能的日期（1-30日）
    for (let day = 1; day <= 30; day++) {
        // 按 iztro：每一日只取「第一個可整除 offset」來計算紫微索引
        const ziweiIndex = calculateZiweiIndexByDayAndJu(day, fiveElementsValue);
        if (ziweiIndex === null) continue;

        if (ziweiIndex === ziweiTargetIndex) {
            // 若月份、時辰已知，需符合命宮公式
            if (userData.hour && !isMingGongMatch(month, userData.hour, mingGong)) {
                continue;
            }

            // 若提供三台/八座位置，需同時符合日系星定位
            if (!matchSantaiBazuoByDay(month, day)) {
                continue;
            }

            const yinyangName =
                userData.yinyang === 'yang' ? '陽' : (userData.yinyang === 'yin' ? '陰' : '?');
            const genderName =
                userData.gender === 'male' ? '男' : (userData.gender === 'female' ? '女' : '?');
            const juName = juConfig[ju].name;
            const hourName = userData.hour ? getHourNameSimple(userData.hour) : '';

            let result = `${yinyangName}${genderName}${year}年 農曆${month}月${day}日`;
            if (hourName) {
                result += `${hourName}時`;
            }
            result += ` ${juName}`;

            validDays.push(result);
        }
    }

    return validDays;
}

// 修復紫微星索引範圍
function fixZiweiIndex(index) {
    // 確保索引在0-11範圍內
    while (index < 0) {
        index += 12;
    }
    while (index >= 12) {
        index -= 12;
    }
    return index;
}

// 獲取簡化的時辰名稱
function getHourNameSimple(hourCode) {
    const names = {
        'zi': '子', 'chou': '丑', 'yin': '寅', 'mao': '卯',
        'chen': '辰', 'si': '巳', 'wu': '午', 'wei': '未',
        'shen': '申', 'you': '酉', 'xu': '戌', 'hai': '亥'
    };
    return names[hourCode] || '';
}

// 計算特定月份中可能的日期
function calculatePossibleDaysInMonth() {
    const possibleDays = [];

    if (!userData.month || !userData.year || !userData.ziwei || !userData.mingGong) {
        return possibleDays;
    }

    const month = parseInt(userData.month);
    const year = parseInt(userData.year);

    // 局數未知時不做日期反推
    const possibleJu = getJuCandidates();
    if (possibleJu.length === 0) return possibleDays;

    possibleJu.forEach(ju => {
        const daysForJu = calculateDaysInMonth(year, month, userData.ziwei, userData.mingGong, ju);
        possibleDays.push(...daysForJu);
    });

    // 去重並排序
    const uniqueDays = [...new Set(possibleDays)];
    return uniqueDays.sort(compareLunarDateText);
}

function getJuCandidates() {
    if (!userData.ju) return [];
    const ju = parseInt(userData.ju, 10);
    return juConfig[ju] ? [ju] : [];
}

function calculateZiweiIndexByDayAndJu(day, ju) {
    let remainder = -1;
    let quotient = 0;
    let offset = -1;

    do {
        offset++;
        const divisor = day + offset;
        quotient = Math.floor(divisor / ju);
        remainder = divisor % ju;
    } while (remainder !== 0 && offset <= 12);

    if (remainder !== 0) return null;

    quotient %= 12;
    let ziweiIndex = quotient - 1;

    if (offset % 2 === 0) {
        ziweiIndex += offset;
    } else {
        ziweiIndex -= offset;
    }

    return fixZiweiIndex(ziweiIndex);
}

function getHourCodeFromTimeIndex(timeIndex) {
    const hourCodes = ['zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai'];
    return hourCodes[timeIndex] || null;
}

function getHourIndexByZiOrder(hourCode) {
    const hourCodes = ['zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai'];
    return hourCodes.indexOf(hourCode);
}

function isMingGongMatch(month, hourCode, mingGongCode) {
    const mingIndex = twelvePalaces.indexOf(mingGongCode);
    const hourIndex = getHourIndexByZiOrder(hourCode);
    if (mingIndex < 0 || hourIndex < 0) return true;

    // 寅起正月；命宮索引 = (月索引 - 時支索引) mod 12
    const monthIndex = month - 1;
    const calculatedMingIndex = ((monthIndex - hourIndex) % 12 + 12) % 12;
    return calculatedMingIndex === mingIndex;
}

function getZuoYouIndexByMonth(month) {
    const earthlyBranches = ['yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai', 'zi', 'chou'];
    const chenIndex = earthlyBranches.indexOf('chen');
    const xuIndex = earthlyBranches.indexOf('xu');
    const monthOffset = month - 1;

    return {
        zuoIndex: fixZiweiIndex(chenIndex + monthOffset),
        youIndex: fixZiweiIndex(xuIndex - monthOffset)
    };
}

function matchSantaiBazuoByDay(month, day) {
    // 未提供三台/八座時，不作為限制條件
    if (!userData.santai && !userData.bazuo) return true;

    const { zuoIndex, youIndex } = getZuoYouIndexByMonth(month);
    const dayIndex = day - 1; // 初一 = 0
    const santaiIndex = fixZiweiIndex(zuoIndex + dayIndex);
    const bazuoIndex = fixZiweiIndex(youIndex - dayIndex);

    const santaiCode = twelvePalaces[santaiIndex];
    const bazuoCode = twelvePalaces[bazuoIndex];

    if (userData.santai && userData.santai !== santaiCode) return false;
    if (userData.bazuo && userData.bazuo !== bazuoCode) return false;

    return true;
}

function compareLunarDateText(a, b) {
    const ak = extractLunarDateKey(a);
    const bk = extractLunarDateKey(b);
    return ak - bk;
}

function extractLunarDateKey(text) {
    const m = text.match(/農曆(\d+)月(\d+)日/);
    if (!m) return Number.MAX_SAFE_INTEGER;
    const month = parseInt(m[1], 10);
    const day = parseInt(m[2], 10);
    return month * 100 + day;
}

// 獲取時辰名稱（簡單版本，不包含時間段）
function getHourName(hourCode) {
    const names = {
        'zi': '子時', 'chou': '丑時', 'yin': '寅時', 'mao': '卯時',
        'chen': '辰時', 'si': '巳時', 'wu': '午時', 'wei': '未時',
        'shen': '申時', 'you': '酉時', 'xu': '戌時', 'hai': '亥時'
    };
    return names[hourCode] || hourCode;
}

// 顯示結果
function displayResults(results) {
    const container = document.getElementById('results');
    container.innerHTML = '';

    results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'result-item';

        // 對於完整資料推算，使用特殊的顯示格式
        if (result.title === '完整資料推算') {
            div.innerHTML = `
                <h3>🎯 推算結果</h3>
                <p class="main-result">${result.result}</p>
            `;
        } else {
            div.innerHTML = `
                <h3>${result.title}</h3>
                <p>${result.description}</p>
                <p class="result-content">${result.result}</p>
            `;
        }

        container.appendChild(div);
    });

    // 添加警告
    const warning = document.createElement('div');
    warning.className = 'warning';
    warning.innerHTML = '<p>⚠️ 注意：此推算結果基於有限資料，僅供參考。如需準確的生日時辰，建議諮詢專業紫微斗數師。</p>';
    container.appendChild(warning);

    showStep(6);
}

// 顯示錯誤
function displayError(message) {
    const container = document.getElementById('results');
    container.innerHTML = `
        <div class="warning">
            <p>❌ 計算錯誤：${message}</p>
            <p>請檢查您的輸入資料是否正確。</p>
        </div>
    `;
    showStep(6);
}

// 重新開始
function restart() {
    // 重置所有數據
    userData = {
        yinyang: '',
        gender: '',
        year: '',
        month: '',
        day: '',
        hour: '',
        ju: '',
        mingGong: '',
        ziwei: '',
        youbi: '',
        wenchang: '',
        firstLimit: '',
        brothersLimit: '',
        santai: '',
        bazuo: ''
    };

    // 重置表單
    document.getElementById('yinyang').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('year').value = '';
    document.getElementById('month').value = '';
    document.getElementById('day').value = '';
    document.getElementById('hour').value = '';
    document.getElementById('ju').value = '';

    // 重置宮位選擇
    document.querySelectorAll('.palace-cell').forEach(cell => {
        cell.classList.remove('selected');
    });
    document.getElementById('mingGongResult').textContent = '未選擇';
    document.getElementById('ziweiResult').textContent = '未選擇';

    // 重置到第一步
    currentStep = 1;
    showStep(1);
}
