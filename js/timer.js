/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ############
 *   timer.js
 * ############
 */
let isHash = true;
let isTitleFlag = false;
setTimeout(() => {
    isTitleFlag = true;
}, 5000);

let isMovingStars;
const CUR_URL = location.pathname;
const URL_LENGTH = CUR_URL.split('/').length;

const OPTIONS_DATE = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
const YR = parseInt(new Date().getFullYear());

let GLOBAL_DAYS = [
    ['New Year', '1-1'],
    ['Chinese New Year', getSpecialDay(YR, 'Chinese New Year')],
    ['Korean New Year', getSpecialDay(YR, 'Korean New Year')],
    ['World Wetlands Day', '2-2'],
    ["Valentine's Day", '2-14'],
    ['World Cancer Day', '2-4'],
    ["Intl Women's Day", '3-8'],
    ['World Day for Water', '3-22'],
    ['World Health Day', '4-7'],
    ['Labor Day', '5-1'],
    ["Buddha's Birthday", getSpecialDay(YR, "Buddha's Birthday")],
    ['World Environment Day', '6-5'],
    ['World Blood Donor Day', '6-14'],
    ['Intl Youth Day', '8-12'],
    ['Intl Day of Peace', '9-21'],
    ['Korean Thanksgiving', getSpecialDay(YR, 'Korean Thanksgiving')],
    ['United Nations Day', '10-24'],
    ['Halloween', '10-31'],
    ["Children's Day", '11-20'],
    ['Thanksgiving', getSpecialDay(YR, 'Thanksgiving')],
    ['Black Friday', getSpecialDay(YR, 'Black Friday')],
    ['Christmas', '12-25'],
];
const SP_DAY = ['Thanksgiving', 'Black Friday', 'Korean New Year', 'Korean Thanksgiving', "Buddha's Birthday", 'Chinese New Year'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getSpecialDay(year, day) {
    switch (day) {
        case 'Thanksgiving':
            first = new Date(year, 10, 1);
            day_of_week = first.getDay();
            return `11-${22 + (11 - day_of_week) % 7}`;

        case 'Black Friday':
            first = new Date(year, 10, 1);
            day_of_week = first.getDay();
            return `11-${23 + (11 - day_of_week) % 7}`;

        case 'Korean New Year':
            return yearAdd(year, '0101');

        case 'Korean Thanksgiving':
            return yearAdd(year, '0815');

        case "Buddha's Birthday":
            return yearAdd(year, '0408');

        case 'Chinese New Year':
            return yearAdd(year, '0101');

        default:
            return;
    }

    function yearAdd(year, MD) {
        let l2s = lunar2solar(year + MD).split('-');
        const targetDay = new Date((`${l2s[1]}-${l2s[0]}-${year}`)).getTime() / 86400000;
        const today = new Date(new Date().toDateString()).getTime() / 86400000;
        return (targetDay - today < -29) ? lunar2solar((year + 1) + MD) : lunar2solar(year + MD);
    }
}

let gl = GLOBAL_DAYS;

let isSpecTimer = false;
let getSetTime = CUR_URL.split('/')[URL_LENGTH - 2].split('-');

let day = checkQuery(CUR_URL.split('/')[URL_LENGTH - 2]);

function checkQuery(getSetDay) {
    for (someDay of gl) {
        const DAY = someDay[0].replace(/\s/gi, '-').replace(/[']/gi, '');
        if (DAY == getSetDay) {
            isSpecTimer = true;
            return someDay;
        }
    } return false;
}

let queryYear = parseInt(new Date().getFullYear());
if (CUR_URL.split('/')[URL_LENGTH - 2].match(/\b(20)[0-9]{2}\b/g) && checkQuery(CUR_URL.split('/')[URL_LENGTH - 3])) {
    queryYear = parseInt(CUR_URL.split('/')[URL_LENGTH - 2]);
    day = checkQuery(CUR_URL.split('/')[URL_LENGTH - 3]);
    isSpecTimer = true;
    isHash = false;
}

if (getSetTime.length == 5 && isSpecTimer == false) {
    location.hash = '';
    localStorage.removeItem('sTimer');
    localStorage.removeItem('dTime');
    localStorage.removeItem('setTimer');

    if (getSetTime[1] == 'timer') {
        if (getSetTime[3] < 1) location.href = '/err404';
        if (!CUR_URL.match(/\b(set-timer-for-)[0-9]{1,5}[\-](Hour|Minute|Second)\b/g)) location.href = '/err404';
        let h = 0; let m = 0; let s = 0;
        title = `${getSetTime[3]} ${getSetTime[4]} Timer`;
        if (getSetTime[4] == 'Hour') {
            h = getSetTime[3];
        } else if (getSetTime[4] == 'Minute') {
            m = getSetTime[3];
        } else if (getSetTime[4] == 'Second') {
            s = getSetTime[3];
        } else location.href = '/err404';
        let st = ["cd", `${title}`, parseInt(h), parseInt(m), parseInt(s), 8, "false"];
        localStorage.setItem('setTimer', JSON.stringify(st));

        isSpecTimer = true;
    }
} else if (isSpecTimer) {
    if (SP_DAY.includes(day[0])) day[1] = getSpecialDay(queryYear, day[0]);
    let [year, M, D, GAP_DAY, SHOW_GAP] = getGlobalDay(queryYear, day);
    const ST = ['dt', `${day[0]} ${year}`, `${D}-${M}-${year}`, '12:00 AM', 8, true];

    localStorage.setItem('setTimer', JSON.stringify(ST));
    localStorage.setItem('sTimer', window.btoa(new Date().getTime()));
    localStorage.removeItem('dTime');

    for (i = 1; i < 10; i++) {
        if (SP_DAY.includes(day[0])) day[1] = getSpecialDay(year + 1, day[0]);
        [year, M, D, GAP_DAY, SHOW_GAP] = getGlobalDay(year + 1, day);
        if (year > 2099) break;
    }

    // background animation switch
    if (localStorage.getItem('movingStars')) {
        isMovingStars = JSON.parse(localStorage.getItem('movingStars'));
        document.querySelector('#btnswitch-moving-stars').checked = isMovingStars;
        document.querySelector('canvas').style.display = (isMovingStars) ? 'block' : 'none';
    } else isMovingStars = true;

} else if (getSetTime[0] !== 'timer') location.href = '/err404';

let handleId = 0;
if (handleId == 0) {
    handleId = setInterval(getTime, 100);
}

const colorNames = {
    mono: [0, ''],
    blue: [1, '#1979d2'],
    green: [2, '#388e3c'],
    red: [3, '#d32f2f'],
    orange: [4, '#ff9900'],
};

let timeQuery, st = [], cd, dt, T, d, t, aId, h, m, s, l, stdt = '';

if (location.hash) {
    deUri = decodeURI(location.hash);
    getHash = deUri.substring(1).split('&');
    hashToObject = new Object();
    getHash.forEach(element => {
        dataSplit = element.split('=');
        if (dataSplit[0] !== 'dTime' && dataSplit[0] !== 'sTimer' && dataSplit[0] !== '') hashToObject[dataSplit[0]] = dataSplit[1];
        if (dataSplit[0] == 'dTime' || dataSplit[0] == 'sTimer') localStorage.setItem(dataSplit[0], dataSplit[1]);
    });
    if (hashToObject.dt || hashToObject.cd) {
        if (hashToObject.dt !== undefined || hashToObject.cd !== undefined) {
            st = Object.values(hashToObject);
            if (st.length == 6) {
                st[0] = 'dt';
                st[4] = parseInt(st[4]);
            } else if (st.length == 7) {
                st[0] = 'cd';
                st[2] = parseInt(st[2]);
                st[3] = parseInt(st[3]);
                st[4] = parseInt(st[4]);
                st[5] = parseInt(st[5]);
            }
            if (st.length == 6 || st.length == 7) localStorage.setItem('setTimer', JSON.stringify(st));
            if (st[0] == 'cd') {
                if (localStorage.getItem('dTime')) {
                    document.querySelector('#btn-set-timer').style.display = 'none';
                    document.querySelector('#btn-group').style.display = 'inline-block';
                    document.querySelector('#btn-start-timer').disabled = false;
                };
            }
        }
    }
}

if (localStorage.getItem('setTimer')) {
    s = JSON.parse(localStorage.getItem('setTimer'));
    if (localStorage.getItem('sTimer')) stdt = '&sTimer=' + localStorage.getItem('sTimer');
    if (localStorage.getItem('dTime')) stdt = '&dTime=' + localStorage.getItem('dTime');
    if (s[0] == 'cd') {
        timeQuery = `#cd=1&T=${s[1]}&h=${s[2]}&m=${s[3]}&s=${s[4]}&aId=${s[5]}&l=${s[6]}${stdt}`;
    } else if (s[0] == 'dt') {
        timeQuery = `#dt=1&T=${s[1]}&d=${s[2]}&t=${s[3]}&aId=${s[4]}&l=${s[5]}${stdt}`;
    };
    if (!isSpecTimer) location.hash = timeQuery;
}

// const WINDOW_LOCATION_HREF = location.href;
document.querySelector('#location-name').value = location.href;

if (localStorage.getItem('displayConfig')) {
    getLocalData = JSON.parse(localStorage.getItem('displayConfig'));
    isDigitalFont = Boolean(getLocalData.displayConfig.dF);
    isAmpm = Boolean(getLocalData.displayConfig.ap);
    isDateDisplay = Boolean(getLocalData.displayConfig.dD);
    isDarkMode = Boolean(getLocalData.displayConfig.dM);
    isRobot = Boolean(getLocalData.displayConfig.rb);
    colorId = getLocalData.displayConfig.cId;
    fontScale = getLocalData.displayConfig.fS;
    document.getElementById('btnswitch-digital-font').checked = isDigitalFont;
    document.getElementById('btnswitch-dark-mode').checked = isDarkMode;
    document.getElementsByName('btncolor')[colorId].checked = true;
} else {
    isDigitalFont = document.getElementById('btnswitch-digital-font').checked;
    isAmpm = false;
    isDateDisplay = true;
    isDarkMode = document.getElementById('btnswitch-dark-mode').checked;
    colorId = colorCheckedId();
    fontScale = 1;
    isRobot = false;
    function colorCheckedId() {
        var colorButtons = document.getElementsByName('btncolor');
        for (var i = 0; i < colorButtons.length; i++) {
            if (colorButtons[i].checked == true) {
                return colorButtons[i].value;
            }
        }
    }
}

const DEFAULT = [
    ['cd', 'Timer 30 Second', 0, 0, 30, 13, false],  //countdown, title, hour, minute, audio index, audio loop
    ['cd', 'Timer 50 Second', 0, 0, 50, 13, false],
    ['cd', 'Timer 1 Minute', 0, 1, 0, 13, false],
    ['cd', 'Timer 3 Minute', 0, 3, 0, 13, false],
    ['cd', 'Timer 5 Minute', 0, 5, 0, 4, false],
    ['cd', 'Timer 10 Minute', 0, 10, 0, 5, false],
    ['cd', 'Timer 30 Minute', 0, 30, 0, 6, false],
    ['cd', 'Timer 1 Hour', 1, 0, 0, 7, false],
    ['cd', 'Timer 2 Hour', 2, 0, 0, 8, false],
    ['cd', 'Timer 3 Hour', 3, 0, 0, 10, false]
];

let historyTimerList = localStorage.getItem('historyTimer') ? JSON.parse(localStorage.getItem('historyTimer')) : DEFAULT;
let isCountdown = 1;
let isRestart = 0;
let isAlarm = false;
let setTimerTime = [];
let setTimer = [];

//initial running function
(function () {
    let colorMono = document.querySelector('#color-mono');
    if (isDarkMode == false) {
        document.body.classList.remove('dark-mode');
        document.querySelector('#btn-darkmode-true').style.display = 'block';
        document.querySelector('#btn-darkmode-false').style.display = 'none';
        colorMono.textContent = 'Lamp Black';
        colorMono.classList.replace('btn-outline-light', 'btn-outline-secondary');
        colorNames.mono[1] = '#495057';
        document.getElementsByName('theme-color')[0].content = '#E9ECEF';
    } else {
        document.querySelector('#btn-darkmode-true').style.display = 'none';
        document.querySelector('#btn-darkmode-false').style.display = 'block';
        colorMono.textContent = 'Snow White';
        colorMono.classList.replace('btn-outline-secondary', 'btn-outline-light');
        colorNames.mono[1] = '#dee2e6';
        document.getElementsByName('theme-color')[0].content = '#000000';
    }

    resizeFont();
    stringColorChangeToggle('btncolor-' + Object.keys(colorNames)[colorId]);
    digitalFontChangeToggle();
    bgTransparentChange();
})();

//Get the button
let btnBackToTop = document.getElementById('btn-back-to-top');

// When the user scrolls down 200px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        btnBackToTop.classList.remove('disappear');
        btnBackToTop.classList.add('appear');
    } else {
        if (btnBackToTop.classList.contains('appear')) {
            btnBackToTop.classList.add('disappear');
            setTimeout(function () { btnBackToTop.classList.remove('appear') }, 701);
        }
    }
}

//scroll to the top of the document
btnBackToTop.addEventListener('click', backToTop);
function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//tooltip initialize
const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')];
if (window.innerWidth > 991) {
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

const fontScaleMin = 0;
const fontScaleMax = 3;
//font scale-up button
let btnFontScaleUp = document.querySelector('#btn-fontscale-up');
btnFontScaleUp.addEventListener('click', () => {
    if (fontScale < fontScaleMax) fontScale++;
    resizeFont();
});

//font scale-down button
let btnFontScaleDown = document.querySelector('#btn-fontscale-down');
btnFontScaleDown.addEventListener('click', () => {
    if (fontScale > fontScaleMin) fontScale--;
    resizeFont();
});

//resize font
function resizeFont() {
    const fontSizeObj = { time: [12, 14, 16, 20], date: [4, 5, 6, 7], title: [3, 3.5, 4, 4.5] };
    document.querySelector('#main-time').style.fontSize = `${fontSizeObj.time[fontScale]}vmin`;
    document.querySelector('#main-days').style.fontSize = `${fontSizeObj.time[fontScale]}vmin`;
    document.querySelector('#sub-days').style.fontSize = `${fontSizeObj.date[fontScale]}vmin`;
    saveLocalstorage();
}

// fullscreen processing
let btnFullscreen = document.querySelector("#btn-fullscreen");
btnFullscreen.addEventListener("click", openFullscreenMode);
// exit fullscreen
let btnExitFullscreen = document.querySelector("#btn-exit-fullscreen");
btnExitFullscreen.addEventListener("click", exitFullscreenMode);

// dropdown menu event processing
let checkBoxAll = document.querySelectorAll('li input');

checkBoxAll.forEach((checkBox) => {
    checkBox.addEventListener('change', (e) => {
        if (e.target.id == 'btnswitch-dark-mode') btnDarkThemeChangeToggle();
        if (e.target.id == 'btnswitch-digital-font') {
            isDigitalFont = !isDigitalFont;
            digitalFontChangeToggle();
        }
        if (e.target.id == 'btnswitch-moving-stars') {
            isMovingStars = !isMovingStars;
            document.querySelector('#btnswitch-moving-stars').checked = isMovingStars;
            document.querySelector('canvas').style.display = (isMovingStars) ? 'block' : 'none';
            localStorage.setItem('movingStars', isMovingStars);
            bgTransparentChange();
        }

        if (e.target.id == 'btnswitch-am-pm') isAmpm = !isAmpm; //handled in app.js
        if (e.target.id.substr(0, 8) == 'btncolor') stringColorChangeToggle(e.target.id);
        saveLocalstorage();
    });
});

function bgTransparentChange() {
    if (isMovingStars) {
        if (isDarkMode) document.querySelector('#main-card').style.backgroundColor = 'rgba(0,0,0,0)';
        if (!isDarkMode) document.querySelector('#main-card').style.backgroundColor = 'rgba(255,255,255,0)';
    } else if (!isMovingStars) {
        if (isDarkMode) document.querySelector('#main-card').style.backgroundColor = 'rgba(0,0,0)';
        if (!isDarkMode) document.querySelector('#main-card').style.backgroundColor = 'rgba(255,255,255)';
    }
}

//date display toggle
function dateDisplayChangeToggle() {
    document.querySelector('#main-date').style.display = isDateDisplay ? 'block' : 'none';
}

// digital font toggle
function digitalFontChangeToggle() {
    timeDisplayElement = document.querySelectorAll('.digital-font');
    timeFontStyle = (isDigitalFont) ? 'Digital Italic' : 'Open Sans';
    timeDisplayElement.forEach((e) => {
        e.style.fontFamily = timeFontStyle;
    })
}

//string color change toggle (colorNames : global variable!)
function stringColorChangeToggle(e) {
    let [btn, colorName] = e.split('-');
    coloredElement = document.querySelectorAll('.colored, .dataTable-selector');
    coloredElement.forEach((e) => {
        e.style.color = colorNames[colorName][1];
    });
    colorId = colorNames[colorName][0];
    // saveLocalstorage();
}

//nav darkmode switch
document.querySelector('#btn-darkmode-true').addEventListener('click',()=>{btnDarkThemeChangeToggle()});
document.querySelector('#btn-darkmode-false').addEventListener('click',()=>{btnDarkThemeChangeToggle()});

// dark mode toggle
function btnDarkThemeChangeToggle() {
    isDarkMode = !isDarkMode;
    bgTransparentChange();
    darkThemeChangeToggle();
}

//go to the share button
let btnShare = document.querySelector("#btn-share");
btnShare.addEventListener("click", () => {
    document.querySelector('#last-card').style.backgroundColor = "#30bde7";
    setTimeout(() => {
        let lastCard = document.querySelector('#last-card');
        lastCard.style.backgroundColor = "";
        lastCard.style.transition = "all 0.7s";
        lastCard.addEventListener('transitionend', () => {
            lastCard.style.transition = "all 0s";
        }, false);
    }, 1000);
    window.scrollTo(0, document.body.scrollHeight);
});

//countdown or date mode for set timer modal
function showCountdownMenu(isCountdown) {
    if (isCountdown) {
        const AMPM = new Date().getHours() < 12 ? 'AM' : 'PM';
        const DATE = `${new Date().getDate().toString().padStart(2, '0')}-${new Date().toLocaleString(localLangCode, { month: "short" })}-${new Date().getFullYear()}`;
        const HOUR = new Date().getHours() % 12 == 0 ? 12 : new Date().getHours() % 12;
        const TIME = `${HOUR}:${new Date().getMinutes().toString().padStart(2, '0')} ${AMPM}`;

        document.querySelector('#countdown-menu').style.display = 'flex';
        document.querySelector('#datepicker > input').value = DATE;
        document.querySelector('#timepicker > input').value = TIME;
        document.querySelector('#date-time-menu').style.display = 'none';
    } else {
        document.querySelector('#date-time-menu').style.display = 'flex';
        document.querySelector('#countdown-menu').style.display = 'none';

    }
}

// stop audioplayer
function audioPause() {
    alarmAudios.forEach((e) => {
        e.pause();
        e.currentTime = 0;
    })

    document.querySelector('#icon-audio-pause').style.display = 'none';
    document.querySelector('#icon-audio-play').style.display = 'block';;
}

document.querySelector('#test-timer-modal').addEventListener('hidden.bs.modal', () => {
    audioPause();
    if (!isAlarm) {
        document.querySelector('#btn-set-timer').click();
    } else {
        isAlarm = false;
    }

});

// embed code btn click event
document.querySelector('#embed-code').addEventListener('click', (e) => {
    //modal preview - show iframe
    let url = CUR_URL.split('/');
    url.pop();
    let url_LENGTH = url.length;

    let _url = '/embed/timer/#';
    if (isSpecTimer && url[url_LENGTH - 1].match(/^(20)[0-9]{2}$/g)) {
        _url = `/embed/timer/${url[url_LENGTH - 2]}/${url[url_LENGTH - 1]}/#`;
    } else if (isSpecTimer && url[url_LENGTH - 1].slice(0, 14) == 'set-timer-for-') {
        _url = `/embed/${url[url_LENGTH - 1]}/#`;
    } else if (isSpecTimer) {
        _url = `/embed/timer/${url[url_LENGTH - 1]}/#`;
    }
    const IFRAME_URL = _url;
    let defaultFrameSize = 4;
    embedFrameChangeSize(defaultFrameSize);
    let embedElement = document.querySelector('#modal-select-clocksize');
    embedElement.addEventListener('change', (e) => {
        embedFrameChangeSize(e.target.value);
    })

    function embedFrameChangeSize(size) {
        const FRAME_SIZES = {
            1: [200, 120],
            2: [240, 130],
            3: [280, 150],
            4: [340, 200],
            5: [360, 240],
            6: [360, 270],
            7: [510, 310],
            8: [640, 360],
            9: [1280, 720],
            0: ['100%', '100%']
        }

        let timeQuery = '';
        if (localStorage.getItem('setTimer')) {
            setTimer = JSON.parse(localStorage.getItem('setTimer'));
            let stdt;
            if (localStorage.getItem('sTimer')) stdt = '&sTimer=' + localStorage.getItem('sTimer');
            if (localStorage.getItem('dTime')) stdt = '&dTime=' + localStorage.getItem('dTime');
            if (setTimer[0] == 'cd') {
                timeQuery = `&cd=1&T=${setTimer[1]}&h=${setTimer[2]}&m=${setTimer[3]}&s=${setTimer[4]}&aId=${setTimer[5]}&l=${setTimer[6]}${stdt}`;
            } else if (setTimer[0] == 'dt') {
                timeQuery = `&dt=1&T=${setTimer[1]}&d=${setTimer[2]}&t=${setTimer[3]}&aId=${setTimer[4]}&l=${setTimer[5]}${stdt}`;
            } else return;
        }

        if (isSpecTimer) timeQuery = '';
        previewIframe = document.querySelector('#modal-preview')
        previewIframe.width = FRAME_SIZES[size][0];
        previewIframe.height = FRAME_SIZES[size][1];
        previewIframe.src = encodeURI(`${IFRAME_URL}dF=${isDigitalFont ? 1 : 0}&ap=${isAmpm ? 1 : 0}&dD=${isDateDisplay ? 1 : 0}&dM=${isDarkMode ? 1 : 0}&cId=${colorId}${timeQuery}`);
        embedUrlElement = document.querySelector('#embedURL');
        const TEXTAREA_URL = `<iframe width="${FRAME_SIZES[size][0]}"height="${FRAME_SIZES[size][1]}" src="${previewIframe.src}"allowfullscreen="true"></iframe>`
        embedUrlElement.textContent = TEXTAREA_URL;

        //modal dispose action
        document.querySelector('#embed-modal').addEventListener('hidden.bs.modal', () => {
            embedElement.value = 4; //embed size - default
            previewIframe.src = '';
        });
    }
})

// copy to clipboard
document.getElementById('clipboard-copy').onclick = () => {
    var content = document.getElementById('embedURL').textContent;
    navigator.clipboard.writeText(content)
        .then(() => {
            document.querySelector('#icon-clipboard').style.display = 'none';
            document.querySelector('#icon-copied').style.display = 'inline-block';
            setTimeout(() => {
                document.querySelector('#icon-copied').style.display = 'none';
                document.querySelector('#icon-clipboard').style.display = 'inline-block';
            }, 3000);
        })
        .catch(err => {
            document.querySelector('#clipboard-copy-failed').style.display = 'block';
        })
}

const localLangCode = 'en';

// get current time
let btnStart = document.querySelector('#btn-start-timer');
let btnStop = document.querySelector('#btn-stop-timer');
let btnReset = document.querySelector('#btn-reset-timer');
let btnEdit = document.querySelector('#btn-edit-timer');
let btnGroup = document.querySelector('#btn-group');
let btnSet = document.querySelector('#btn-set-timer');

let titleElement = document.querySelector('#main-title');
let timeElement = document.querySelector('#main-time');
let mainTitleEle = document.querySelector('.main-display-title');
let mainDaysEle = document.querySelector('#main-days');
let daysEle = document.querySelector('#sub-days');
let pastTimeDisplayEle = document.querySelector('#past-alarm-display');
let dateTimeSetDisplayEle = document.querySelector('#dateTime-set-display');
let iconPastTime = document.querySelector('#icon-past-time');

let diff, stdT = new Date().getTime();

function getTime() {
    const NOW = new Date();

    displayHistoryTimer();

    if (localStorage.getItem('setTimer')) {
        setTimer = JSON.parse(localStorage.getItem('setTimer'));
        setTimerTime = timeFormatter(setTimer)[2];
    }

    nowUtc = NOW.getTime();
    if (localStorage.getItem('sTimer')) {
        setUtc = parseInt(window.atob(localStorage.getItem('sTimer'))) + setTimerTime;
        btnSet.style.display = 'none';
        btnGroup.style.display = 'inline-block';
    } else if (localStorage.getItem('dTime')) {
        setUtc = nowUtc + setTimerTime - JSON.parse(window.atob(localStorage.getItem('dTime')));
        document.querySelector('#btn-set-timer').style.display = 'none';
        document.querySelector('#btn-group').style.display = 'inline-block';
        document.querySelector('#btn-start-timer').disabled = false;

    } else setUtc = stdT

    if (setUtc >= nowUtc) {
        if (localStorage.getItem('dTime')) {
            btnStop.style.display = 'none';
            btnStart.style.display = 'inline-block';
        } else {
            btnStart.style.display = 'none';
            btnStop.style.display = 'inline-block';
        }
        pastTimeDisplayEle.textContent = '';
        iconPastTime.style.display = 'none';
    } else {
        btnStop.style.display = 'none';
        btnStart.style.display = 'inline-block';
        btnStart.disabled = true;
        pastTimeDisplayEle.textContent = (localStorage.getItem('sTimer')) ? 'Alarm Past Time' : '';
        iconPastTime.style.display = 'inline-block';
    }
    diff = Math.abs(setUtc - nowUtc);
    mainDisplay(diff);

    if (localStorage.getItem('setTimer') && localStorage.getItem('dTime') == null && localStorage.getItem('sTimer') == null) {
        btnReset.click();
        document.querySelector('#btn-set-timer').style.display = 'none';
        document.querySelector('#btn-group').style.display = 'inline-block';
    }

    if (parseInt(setUtc / 1000) == parseInt(nowUtc / 1000) && !isAlarm && localStorage.getItem('sTimer')) {
        isAlarm = true;
        let timerModal = new bootstrap.Modal(document.querySelector('#test-timer-modal'));
        timerModal.show();
        const TITLE = setTimer[1];
        document.querySelector('#set-timer-title-display').textContent = TITLE;
        let showTimer = (setTimer[0] == 'cd') ?
            `${setTimer[2].toString().padStart(2, '0')}:${setTimer[3].toString().padStart(2, '0')}:${setTimer[4].toString().padStart(2, '0')}` :
            `${setTimer[3]}, ${setTimer[2]}`;
        document.querySelector('#set-timer-time-display').textContent = showTimer;

        setTimeout(() => {
            let idx = (setTimer[0] == 'cd') ? 5 : 4;
            alarmAudios[setTimer[idx]].loop;
            alarmAudios[setTimer[idx]].play();
        }, 500);

        if (isRestart) {
            btnReset.click();
            btnStart.click();
        }
    }

    function mainDisplay(dt) {
        let isDays;
        const sToHMS = secondsToHMS(dt)
        if (sToHMS[0]) {
            // const T = secondsToHMS(dt);
            isDays = sToHMS[0] > 1 ? 'Days ' : 'Day ';
        } else isDays = '';

        mainDaysEle.textContent = sToHMS[0] ? sToHMS[0] : '';
        daysEle.textContent = isDays;
        timeElement.textContent = sToHMS[1];

        let tabTitle, mainTitle;
        if (localStorage.getItem('setTimer')) {
            mainTitle = setTimer[1];
            tabTitle = `${setTimer[1]} - Online Timer - Countdown`;
        } else tabTitle = `Online Timer - Online Digital Timer - Start The Timer`;

        if (localStorage.getItem('sTimer') || localStorage.getItem('dTime')) {
            tabTitle = `${mainDaysEle.textContent} ${isDays} ${timeElement.textContent} - ${setTimer[1]}`;
        }

        let d = null;
        if (setTimer[1] !== undefined) {
            let d = setTimer[1].split(' ');
            d.pop();
        }

        if (d !== null && GLOBAL_DAYS.findIndex(n => n[0] == d.join(' ')) > -1) {
            mainTitle = `${setTimer[1]}`;
            tabTitle = `When is ${setTimer[1]} - Countdown Online Timer`
        }

        mainTitleEle.textContent = (mainTitle) ? mainTitle : 'Set Timer';

        if (isTitleFlag) titleElement.textContent = tabTitle;
        mainDisplayBtn();
    }

    function mainDisplayBtn() {
        if (setTimer[0] == 'dt') {
            const DATE = new Date(setTimer[2]).toLocaleDateString(localLangCode, OPTIONS_DATE);
            dateTimeSetDisplayEle.textContent = (isSpecTimer) ? DATE : `${setTimer[3]}, ${DATE}`;
            btnReset.style.display = 'none';
            btnStop.style.display = 'none';
            btnStart.style.display = 'none';
        } else {
            dateTimeSetDisplayEle.textContent = '';
            btnReset.style.display = 'inline-block';
        }
    }

    btnReset.onclick = () => {
        clearInterval(handleId);
        handleId = 0;
        localStorage.removeItem('sTimer');
        localStorage.removeItem('dTime');
        mainDisplay(setTimerTime);
        btnStop.style.display = 'none';
        btnStart.style.display = 'inline-block';
        btnStart.disabled = false;
        btnReset.disabled = true;
        iconPastTime.style.display = 'none';
        pastTimeDisplayEle.textContent = '';

        location.hash = (!isSpecTimer) ? getTimeQuery() : '';
    }

    btnStop.onclick = () => {
        localStorage.removeItem('sTimer');
        localStorage.setItem('dTime', window.btoa(setTimerTime - diff));
        btnStart.disabled = false;
        location.hash = (!isSpecTimer) ? `${getTimeQuery()}&dTime=${window.btoa(setTimerTime - diff)}` : '';
    }

    btnStart.onclick = () => {
        btnReset.disabled = false;
        if (handleId == 0) {
            handleId = setInterval(getTime, 100);
            localStorage.setItem('sTimer', window.btoa(new Date().getTime()));
        } else {
            let diff = parseInt(window.atob(localStorage.getItem('dTime')));
            (diff) ? localStorage.setItem('sTimer', window.btoa(new Date().getTime() - diff)) : localStorage.setItem('sTimer', window.btoa(new Date().getTime()));
            localStorage.removeItem('dTime');
            btnStop.style.display = 'inline-block';
            btnStart.style.display = 'none';
        }

        location.hash = (!isSpecTimer) ? `${getTimeQuery()}&sTimer=${localStorage.getItem('sTimer')}` : '';
    }

    btnEdit.onclick = () => {
        btnSet.click();
    }
}

function getTimeQuery() {
    const ST = JSON.parse(localStorage.getItem('setTimer'));
    if (ST[0] == 'cd') {
        var timeQuery = `#cd=1&T=${ST[1]}&h=${ST[2]}&m=${ST[3]}&s=${ST[4]}&aId=${ST[5]}&l=${ST[6]}`;
    } else if (ST[0] == 'dt') {
        var timeQuery = `#dt=1&T=${ST[1]}&d=${ST[2]}&t=${ST[3]}&aId=${ST[4]}&l=${ST[5]}`;
    };
    return timeQuery;
}

function secondsToHMS(diffTime) {
    diffTime = parseInt(diffTime / 1000);
    const DAYS = parseInt(diffTime / (3600 * 24));
    const HOURS = parseInt(diffTime / 3600 % 24);
    const MINUTES = parseInt(diffTime % 3600 / 60).toString();
    const SECONDS = parseInt(diffTime % 3600 % 60).toString();
    const TIME_FORMAT = (HOURS || DAYS) ? `${HOURS.toString().padStart(2, '0')}:${MINUTES.padStart(2, '0')}:${SECONDS.padStart(2, '0')}` :
        `${MINUTES.padStart(2, '0')}:${SECONDS.padStart(2, '0')}`;
    return [DAYS, TIME_FORMAT, (diffTime + 0.9) * 1000];
}

//time formatter
function timeFormatter(st) {
    let h, m, s, offsetT;
    if (st[0] == 'cd') { // st : [countdown, title, hour, min, sec, audioIdx, isloop]
        [h, m, s] = [st[2], st[3], st[4]];
        offsetT = (h * 3600 + m * 60 + s) * 1000;
    } else if (st[0] == 'dt') { //st : [dateTime, title, date, time, audioIdx, isloop]
        offsetT = new Date(`${st[2]} ${st[3]}`).getTime() - parseInt(window.atob(localStorage.getItem('sTimer')));
    };

    return secondsToHMS(offsetT);
}

function displayHistoryTimer() {
    let trElements = document.querySelectorAll('#tables-history > tbody > tr');
    for (let i = 0; i < trElements.length; i++) {
        let href, time, tr = trElements[i];
        const HA = historyTimerList[i]
        let title = HA[1];
        let sT = window.btoa((new Date().getTime()).toString());
        if (HA[0] == 'cd') {
            href = `#cd=1&T=${HA[1]}&h=${HA[2]}&m=${HA[3]}&s=${HA[4]}&aId=${HA[5]}&l=${HA[6]}&sTimer=${sT}`;
            time = `${HA[2].toString().padStart(2, '0')}:${HA[3].toString().padStart(2, '0')}:${HA[4].toString().padStart(2, '0')}`;
        } else if (HA[0] == 'dt') {
            href = `#dt=1&T=${HA[1]}&d=${HA[2]}&t=${HA[3]}&aId=${HA[4]}&l=${HA[5]}&sTimer=${sT}`;
            time = `${HA[2]} ${HA[3]}`;
        } else return;

        tr.querySelector('td:first-child > a').href = href;
        tr.querySelector('td:first-child > a').setAttribute('aria-label', `Set timer for ${time}`);
        tr.querySelector('td:first-child > a').textContent = title;
        tr.querySelector('td:nth-child(2)').textContent = time;

        let lastTd = tr.querySelector('td:last-child');
        let tra = tr.querySelector('td>a')
        lastTd.index = i;
        tra.index = i;
    }

    let gdTrElements = document.querySelectorAll('#tables-global-days > tbody > tr');
    if (!isSpecTimer) for (let i = 0; i < GLOBAL_DAYS.length; i++) {
        let tr = gdTrElements[i];
        let year = parseInt(new Date().getFullYear());
        [year, M, D, GAP_DAY, SHOW_GAP] = getGlobalDay(year, GLOBAL_DAYS[i], tr)
        const DATE = new Date(`${D}-${M}-${year}`).toLocaleDateString(localLangCode, { year: 'numeric', month: 'short', day: 'numeric' });
        tr.querySelector('td:nth-child(2)').textContent = DATE;
        tr.querySelector('td:last-child').textContent = SHOW_GAP;
    }
}

function getGlobalDay(year, globalDay, tr) {
    const DAY_NAME = ['Yesterday', 'Today', 'Tomrrow'];
    let gMonthDay = globalDay[1].split('-');
    let M = MONTHS[parseInt(gMonthDay[0]) - 1];
    let D = gMonthDay[1];
    let targetDay = new Date((`${D}-${M}-${year}`)).getTime() / 86400000;
    let today = new Date(new Date().toDateString()).getTime() / 86400000;
    if ((targetDay - today) < -29) {
        year = year + 1;
        if (SP_DAY.includes(day[0])) {
            globalDay[1] = getSpecialDay(year, globalDay[0]);
            gMonthDay = globalDay[1].split('-');
            M = MONTHS[parseInt(gMonthDay[0]) - 1];
            D = gMonthDay[1];
        };
        targetDay = new Date((`${D}-${M}-${year}`)).getTime() / 86400000;
    } else if ((targetDay - today) >= -29 && (targetDay - today) < 0) {
        if (!isSpecTimer) tr.style.color = (isDarkMode) ? '#ffc107' : '#dc3545';
    }
    const GAP_DAY = targetDay - today;
    const SHOW_GAP = (Math.abs(GAP_DAY) < 2) ? DAY_NAME[GAP_DAY + 1] : `${GAP_DAY} Days`;
    return [year, M, D, GAP_DAY, SHOW_GAP];
}

document.querySelector('#btn-recently-used').onclick = () => {
    lastTDs = document.querySelectorAll('#tables-history > tbody > tr > td:last-child');
    if (document.querySelector('#btn-edit').style.display == 'none') {
        document.querySelector('#btn-confirm').style.display = 'none';
        document.querySelector('#btn-edit').style.display = 'block';
        showEditIcon = 'none';
    } else {
        document.querySelector('#btn-edit').style.display = 'none';
        document.querySelector('#btn-confirm').style.display = 'block';
        showEditIcon = 'block';
    }

    for (td of lastTDs) td.style.display = showEditIcon;
}

//remove history timer
function removeHistoryTimer(index) {
    if (index !== undefined) {
        let historyTimerNodes = document.querySelectorAll('#tables-history > tbody > tr');
        historyTimerList.splice(index, 1);
        removeElement = historyTimerNodes[index];
        removeElement.parentNode.removeChild(removeElement);

        saveLocalstorage();
    }
}

//set timer btn click event
const CHILDHOOD = new Audio('/assets/audios/Childhood.mp3');
const CHRISTMAS = new Audio('/assets/audios/Christmas.mp3');
const CHURCH_BELL = new Audio('/assets/audios/Church_bell.mp3');
const CRICKET = new Audio('/assets/audios/Cricket.mp3');
const HAPPY_BIRTHDAY = new Audio('/assets/audios/Happy_birthday.mp3');
const ORGAN = new Audio('/assets/audios/Organ.mp3');
const PHONE_BELL_1 = new Audio('/assets/audios/Phone_bell.mp3');
const PHONE_BELL_2 = new Audio('/assets/audios/Phone_bell2.mp3');
const PIANO = new Audio('/assets/audios/Piano.mp3');
const PIZZICATO = new Audio('/assets/audios/Pizzicato.mp3');
const POLICE_SIREN = new Audio('/assets/audios/Police_siren.mp3');
const SCHOOL_BELL = new Audio('/assets/audios/School_bell.mp3');
const XYLOPHONE_1 = new Audio('/assets/audios/Xylophone.mp3');
const XYLOPHONE_2 = new Audio('/assets/audios/Xylophone2.mp3');

let alarmAudios = [
    CHILDHOOD, CHRISTMAS, CHURCH_BELL, CRICKET, HAPPY_BIRTHDAY, ORGAN, PHONE_BELL_1,
    PHONE_BELL_2, PIANO, PIZZICATO, POLICE_SIREN, SCHOOL_BELL, XYLOPHONE_1, XYLOPHONE_2,
]; // length = 14

//recently used timer time
initTableTimerHistory();

function initTableTimerHistory() {
    let tbElement = document.querySelector('#tables-history > tbody');
    tbElement.style.fontFamily = 'Open Sans';
    for (let i = 0; i < historyTimerList.length; i++) {
        tbElement.appendChild(createHistoryTimer(historyTimerList[i], i));
    }

    saveLocalstorage();
}

function createHistoryTimer(HA, index) {
    let customAudioCheck = (localStorage.getItem('customAudio') && localStorage.getItem('customAudioName')) ? 1 : 0;
    let tr = document.createElement('tr');
    tr.setAttribute('class', 'history-record');
    if (customAudioCheck == false && HA[HA.length - 2] > alarmAudios.length - 1) HA[HA.length - 2] = alarmAudios.length - 1;

    const TD_ELEMENTS = `<td class="text-start"><a href="" onclick="window.scrollTo({left:0,top:0});" aria-label="Set timer for"></a>
                            </td><td class="text-start"></td><td><a class="bi bi-x-circle" role="img" aria-label="remove history timer"></a></td>`;

    tr.innerHTML = TD_ELEMENTS;
    let lastTd = tr.querySelector('td:last-child');
    let td = tr.querySelector('td:first-child')
    lastTd.index = index;
    td.index = index;
    lastTd.addEventListener('click', (e) => { removeHistoryTimer(e.composedPath()[2].lastChild.index); });
    td.addEventListener('click', (e) => {
        localStorage.setItem('sTimer', window.btoa(new Date().getTime().toString()));
        localStorage.setItem('setTimer', JSON.stringify(historyTimerList[e.target.index]))

        const ITEM = historyTimerList.splice(e.composedPath()[1].index, 1)
        historyTimerList.splice(0, 0, ITEM[0]);
        if (handleId == 0) handleId = setInterval(getTime, 100);
        btnStart.click();
        saveLocalstorage();
    })
    return tr;
}

window.addEventListener('hashchange', () => {
    document.querySelector('#location-name').value = location.href;
})

// set timer modal
document.querySelector('#btn-set-timer').addEventListener('click', (e) => {
    showCountdownMenu(isCountdown);
    let countDownRadios = document.querySelectorAll('input[name="countdownOptions"]');
    countDownRadios.forEach(radio => radio.addEventListener('change', (e) => {
        isCountdown = (e.target.value == 'countdown') ? 1 : 0;
        showCountdownMenu(isCountdown)
    }))
    let restartRadios = document.querySelectorAll('input[name="restartOptions"]');
    restartRadios.forEach(radio => radio.addEventListener('change', (e) => {
        isRestart = (e.target.value == 'restart-timer') ? 1 : 0;
    }))

    let hoursSelectElement = document.querySelector('#modal-select-hour');
    let minutesSelectElement = document.querySelector('#modal-select-minute');
    let secondsSelectElement = document.querySelector('#modal-select-second');
    let audiosSelectElement = document.querySelector('#modal-select-audio');
    let playIcon = document.querySelector('#icon-audio-play');
    let pauseIcon = document.querySelector('#icon-audio-pause');
    let audioProgressBar = document.querySelector('#audio-progress');
    let getHour = getMin = getSecond = audioIndex = 0;
    let isLoop = true;
    if (document.querySelector('#btn-confirm').style.display == 'block') document.querySelector('#btn-recently-used').click();
    changeLoopIcon();

    for (let i = 0; i < 100; i++) {
        OptionElement = document.createElement('option');
        OptionElement.textContent = i.toString().padStart(2, '0');
        hoursSelectElement.appendChild(OptionElement);
    }

    for (let i = 0; i < 60; i++) {
        OptionElement = document.createElement('option');
        OptionElement.textContent = i.toString().padStart(2, '0');
        minutesSelectElement.appendChild(OptionElement);

        OptionElement = document.createElement('option');
        OptionElement.textContent = i.toString().padStart(2, '0');
        secondsSelectElement.appendChild(OptionElement);
    }

    if (localStorage.getItem('setTimer')) {
        const SET_TIMER = JSON.parse(localStorage.getItem('setTimer'));
        if (SET_TIMER[0] == 'cd') {
            getHour = SET_TIMER[2];
            getMin = SET_TIMER[3];
            getSecond = SET_TIMER[4];
        }
    }

    changeTimeSelect();

    audiosSelectElement.options[audioIndex].selected = true;
    let customAudio = new Audio();

    if (localStorage.getItem('customAudioName') && localStorage.getItem('customAudio') && alarmAudios.length == 14) {
        fileName = localStorage.getItem('customAudioName');
        file = localStorage.getItem('customAudio');
        customAudio.src = file;
        customAudioAdd();
        audioIndex = alarmAudios.length - 1;
        audiosSelectElement.options[audioIndex].selected = true;
    }

    if (localStorage.getItem('customAudioName') && localStorage.getItem('customAudio')) {
        audioIndex = alarmAudios.length - 1;
        audiosSelectElement.options[audioIndex].selected = true;
    }

    //change by select
    hoursSelectElement.onchange = (e) => {
        getHour = e.target.selectedIndex;
    }
    minutesSelectElement.onchange = (e) => {
        getMin = e.target.selectedIndex;
    }
    secondsSelectElement.onchange = (e) => {
        getSeconds = e.target.selectedIndex;
    }

    audiosSelectElement.onchange = (e) => {
        alarmAudios[audioIndex].pause();
        alarmAudios[audioIndex].currentTime = 0;

        audioIndex = e.target.selectedIndex;
        audioPlay();;
    }

    //change by button
    document.querySelector('#btn-minus-h').onclick = () => {
        getHour = (getHour > 0) ? getHour - 1 : 99;
        changeTimeSelect();
    }
    document.querySelector('#btn-plus-h').onclick = () => {
        getHour = (getHour < 99) ? getHour + 1 : 0;
        changeTimeSelect();
    }
    document.querySelector('#btn-minus-m').onclick = () => {
        getMin = (getMin > 0) ? getMin - 1 : 59;
        changeTimeSelect();
    }
    document.querySelector('#btn-plus-m').onclick = () => {
        getMin = (getMin < 59) ? getMin + 1 : 0;
        changeTimeSelect();
    }
    document.querySelector('#btn-minus-s').onclick = () => {
        getSecond = (getSecond > 0) ? getSecond - 1 : 59;
        changeTimeSelect();
    }
    document.querySelector('#btn-plus-s').onclick = () => {
        getSecond = (getSecond < 59) ? getSecond + 1 : 0;
        changeTimeSelect();
    }

    //change select
    function changeTimeSelect() {
        hoursSelectElement.options[getHour].selected = true;
        minutesSelectElement.options[getMin].selected = true;
        secondsSelectElement.options[getSecond].selected = true;
    }

    //audio play control
    document.querySelector('#btn-audio-play-pause').onclick = () => {
        (playIcon.style.display !== 'none') ? audioPlay() : audioPause();
    }

    //play loop control
    document.querySelector('#btn-loop-true-false').onclick = () => {
        changeLoopIcon();
    }

    function changeLoopIcon() {
        iconTrue = document.querySelector('#icon-loop-true');
        iconFalse = document.querySelector('#icon-loop-false');
        if (isLoop) {
            isLoop = !isLoop;
            iconTrue.style.display = 'none';
            iconFalse.style.display = 'block';
        } else {
            isLoop = !isLoop;
            iconFalse.style.display = 'none';
            iconTrue.style.display = 'block';
        }
    }

    function audioPlay() {
        alarmAudios[audioIndex].play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        alarmAudios[audioIndex].addEventListener('timeupdate', () => {
            const PERCENT = alarmAudios[audioIndex].currentTime / alarmAudios[audioIndex].duration * 100;
            audioProgressBar.style.width = `${PERCENT}%`
            alarmAudios[audioIndex].loop = isLoop;
        })

        alarmAudios[audioIndex].addEventListener('ended', () => {
            audioPause()
            audioProgressBar.style.width = 0;
        });
    }

    document.querySelector('#btn-local-file-audio').onclick = () => {
        fileUploadElement = document.createElement('input');
        fileUploadElement.setAttribute('type', 'file');
        fileUploadElement.setAttribute('accept', 'audio/*');
        fileUploadElement.click();

        fileUploadElement.addEventListener('change', async () => {
            let FILE = await fileUploadElement.files[0];
            fileName = FILE.name.split('.')[0];
            let fileReader = new FileReader();
            fileReader.readAsDataURL(FILE);
            fileReader.onload = () => {
                customAudio.src = fileReader.result;
                if (localStorage.getItem('customAudioName') && localStorage.getItem('customAudio')) {
                    audiosSelectElement.options[audiosSelectElement.length - 1].textContent = fileName;
                    alarmAudios.splice(-1, 1, customAudio);
                } else {
                    customAudioAdd();
                }

                audioPause();
                localStorage.setItem('customAudioName', fileName);
                localStorage.setItem('customAudio', fileReader.result);
                audioIndex = alarmAudios.length - 1;
                audiosSelectElement.options[audioIndex].selected = true;
                audioPlay();
            };
        }, false)
    }

    function customAudioAdd() {
        if (alarmAudios.length >= 10) return;
        customAudioOptionElement = document.createElement('option');
        customAudioOptionElement.textContent = fileName;
        audiosSelectElement.appendChild(customAudioOptionElement);
        alarmAudios.push(customAudio);
    }
    
    document.querySelector('#set-timer-modal').addEventListener('hidden.bs.modal', () => {
        hoursSelectElement.textContent = '';
        minutesSelectElement.textContent = '';
        secondsSelectElement.textContent = '';
        audioPause();
        alarmAudios[audioIndex].currentTime = 0;
        document.querySelector('#modal-input-title').value = '';
    });

    document.querySelector('#btn-test-timer').onclick = () => {
        isAlarm = false;
        let hour, minute, second, date, time, tVal;
        const TITLE = document.querySelector('#modal-input-title').value;

        if (isCountdown) {
            hour = document.querySelector('#modal-select-hour').selectedIndex;
            minute = document.querySelector('#modal-select-minute').selectedIndex;
            second = document.querySelector('#modal-select-second').selectedIndex;
            tVal = ['cd', TITLE, hour, minute, second, 0, false]
        } else {
            date = document.querySelector('#datepicker > input').value;
            time = document.querySelector('#timepicker > input').value;
            tVal = ['dt', TITLE, date, time, 0, false]
        }

        document.querySelector('#set-timer-title-display').textContent = (TITLE !== '') ? TITLE : 'Online Timer';
        const tf = timeFormatter(tVal)
        let showTimer = tf[0] ? `${tf[0]}day(s) ${tf[1]}` : `${tf[1]}`;
        document.querySelector('#set-timer-time-display').textContent = showTimer;
        setTimeout(() => {
            alarmAudios[audioIndex].loop = isLoop;
            alarmAudios[audioIndex].play();
        }, 500);
    }

    //start timer
    document.querySelector('#btn-add-timer').onclick = () => {
        addHistoryTimer();
        if (setTimer.length) {
            localStorage.setItem('sTimer', window.btoa(new Date().getTime()));
            localStorage.setItem('setTimer', JSON.stringify(setTimer))
        }
        if (setTimer[0] == 'cd') {
            timeQuery = `#cd=1&T=${setTimer[1]}&h=${setTimer[2]}&m=${setTimer[3]}&s=${setTimer[4]}&aId=${setTimer[5]}&l=${setTimer[6]}&sTimer=${localStorage.getItem('sTimer')}`;
        } else if (setTimer[0] == 'dt') {
            timeQuery = `#dt=1&T=${setTimer[1]}&d=${setTimer[2]}&t=${setTimer[3]}&aId=${setTimer[4]}&l=${setTimer[5]}&sTimer=${localStorage.getItem('sTimer')}`;
        } else return;
        location.href = '/timer/' + timeQuery;
        btnStart.click();
    }

    //text input event(enter key)
    document.querySelector('#modal-input-title').addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            e.preventDefault();
            document.querySelector('#btn-add-timer').click();
        }
    })

    function addHistoryTimer() {
        const AUDIO_IDX = document.querySelector('#modal-select-audio').selectedIndex;
        let hours, minutes, seconds;
        const TITLE = (document.querySelector('#modal-input-title').value !== '') ? document.querySelector('#modal-input-title').value : 'Online Timer';

        if (isCountdown) {
            hours = document.querySelector('#modal-select-hour').selectedIndex;
            minutes = document.querySelector('#modal-select-minute').selectedIndex;
            seconds = document.querySelector('#modal-select-second').selectedIndex;
            if (!hours && !minutes && !seconds) return;
            setTimer = ['cd', TITLE, hours, minutes, seconds, AUDIO_IDX, isLoop];
        } else {
            const DATE = document.querySelector('#datepicker > input').value;
            const TIME = document.querySelector('#timepicker > input').value;
            setTimer = ['dt', TITLE, DATE, TIME, AUDIO_IDX, isLoop];
        }

        historyTimerList.unshift(setTimer);
        if (historyTimerList.length > 10) {
            historyTimerList.pop();
        } else {
            let tbElement = document.querySelector('#tables-history > tbody');
            tbElement.style.fontFamily = 'Open Sans';
            tbElement.insertBefore(createHistoryTimer(historyTimerList[0], 0), tbElement.firstChild);
        }
        saveLocalstorage();
    }
});

// SNS share button event handling
shareSns();

//save localdata -> localstorage
function saveLocalstorage() {
    let localStorageConfig = {
        displayConfig: {
            dF: isDigitalFont ? 1 : 0,
            ap: isAmpm ? 1 : 0,
            dD: isDateDisplay ? 1 : 0,
            dM: isDarkMode ? 1 : 0,
            cId: colorId,
            fS: fontScale,
            rb: isRobot ? 1 : 0,
        },
    };

    localStorage.setItem('historyTimer', JSON.stringify(historyTimerList));
    localStorage.setItem('displayConfig', JSON.stringify(localStorageConfig));
}
