/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ##################
 *   embed_timer.js
 * ##################
 */

let handleId = 0;
if (handleId == 0) {
    handleId = setInterval(getTime, 100);
}
const CUR_URL = window.location.pathname;
const URL_LENGTH = CUR_URL.split('/').length;
const YR = parseInt(new Date().getFullYear());
const OPTIONS_DATE = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
let isSpecTimer = false;
let isHash = true;
let setTimerTime = [];
let setTimer = [];
const CANONICAL = document.querySelector('[rel="canonical"]');
let path = location.pathname.slice(6, -1);
CANONICAL.href = `https://${location.host + path}/`;
let gl = [
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

if (CUR_URL.split('/').at(1) == 'embed') {
    if (CUR_URL.match(/\b(set-timer-for-)[0-9]{1,5}[\-](Hour|Minute|Second)\b/g)) {
        let h = 0; let m = 0; let s = 0;
        let getSetTime = CUR_URL.split('/')[URL_LENGTH - 2].split('-');
        let title = `${getSetTime[3]} ${getSetTime[4]} Timer`;
        if (getSetTime[4] == 'Hour') {
            h = getSetTime[3];
        } else if (getSetTime[4] == 'Minute') {
            m = getSetTime[3];
        } else if (getSetTime[4] == 'Second') {
            s = getSetTime[3];
        } else location.href = '/err404';

        setTimer = ['countdown', title, h, m, s, 8, true];
        setTimeout(function () { document.querySelector('#btn-reset-timer').click(); }, 200);
    }

    let spDay = CUR_URL.split('/')[URL_LENGTH - 2];
    let year = YR;
    if (spDay.match(/\b(20)[0-9]{2}\b/g)) {
        year = parseInt(spDay);
        spDay = checkQuery(CUR_URL.split('/')[URL_LENGTH - 3], year);
        date = getDate(spDay, year);
        setTimer = ['dateTime', `${spDay[0]} ${date[0]}`, `${date[2]}-${date[1]}-${date[0]}`, '12:00 AM', 8, true];
    } else if (checkQuery(spDay)) {
        spDay = checkQuery(CUR_URL.split('/')[URL_LENGTH - 2]);
        date = getDate(spDay, year);
        setTimer = ['dateTime', `${spDay[0]} ${date[0]}`, `${date[2]}-${date[1]}-${date[0]}`, '12:00 AM', 8, true];
    } else spDay = false;
}

function getDate(globalDay, year) {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const SP_DAY = ['Thanksgiving', 'Black Friday', 'Korean New Year', 'Korean Thanksgiving', "Buddha's Birthday", 'Chinese New Year'];
    if (SP_DAY.includes(globalDay[0])) globalDay[1] = getSpecialDay(year, globalDay[0]);
    let gMonthDay = globalDay[1].split('-');
    let M = MONTHS[parseInt(gMonthDay[0]) - 1];
    let D = gMonthDay[1];
    let targetDay = new Date((`${D}-${M}-${year}`)).getTime() / 86400000;
    let today = new Date(new Date().toDateString()).getTime() / 86400000;
    if ((targetDay - today) < -29) {
        year = year + 1;
        if (SP_DAY.includes(globalDay[0])) {
            globalDay[1] = getSpecialDay(year, globalDay[0]);
            gMonthDay = globalDay[1].split('-');
            M = MONTHS[parseInt(gMonthDay[0]) - 1];
            D = gMonthDay[1];
        };
        targetDay = new Date((`${D}-${M}-${year}`)).getTime() / 86400000;
    }
    const GAP_DAY = targetDay - today;
    const SHOW_GAP = (Math.abs(GAP_DAY) < 2) ? DAY_NAME[GAP_DAY + 1] : `${GAP_DAY} Days`;
    return [year, M, D, GAP_DAY, SHOW_GAP];
}

function checkQuery(getSetDay) {
    for (someDay of gl) {
        const DAY = someDay[0].replace(/\s/gi, '-').replace(/[']/gi, '');
        if (DAY == getSetDay) {
            isHash = false;
            return someDay;
        }
    } return false;
}

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
            return lunar2solar(year + '0101');
        case 'Korean Thanksgiving':
            return lunar2solar(year + '0815');
        case "Buddha's Birthday":
            return lunar2solar(year + '0408');
        case 'Chinese New Year':
            return lunar2solar(year + '0101');
        default:
            return;
    }
}

let colorCode = ['', '#1979d2', '#388e3c', '#d32f2f', '#ff9900'];
let deUri = decodeURI(location.hash);
let getEmbedDataList = deUri.substring(1).split('&');
history.replaceState({}, document.title, ".");
let hashToObject = new Object();
getEmbedDataList.forEach(element => {
    dataSplit = element.split('=');
    hashToObject[dataSplit[0]] = dataSplit[1];
});

let isCountdown = 1;
let isRestart = 0;
let isAlarm = false;

localStorage.removeItem('isT');
localStorage.removeItem('idT');

if (isHash) {
    if (hashToObject.cd) setTimer = ['countdown', hashToObject.T, parseInt(hashToObject.h), parseInt(hashToObject.m), parseInt(hashToObject.s), parseInt(hashToObject.aId), hashToObject.l];
    if (hashToObject.dt) setTimer = ['dateTime', hashToObject.T, hashToObject.d, hashToObject.t, parseInt(hashToObject.aId), hashToObject.l];
    if (hashToObject.sTimer) localStorage.setItem('isT', hashToObject.sTimer);
    if (hashToObject.dTime) localStorage.setItem('idT', hashToObject.dTime);
    if (!hashToObject.sTimer && !hashToObject.dTime && setTimer.lengthn) setTimeout(function () { document.querySelector('#btn-reset-timer').click(); }, 200);

} else localStorage.setItem('isT', window.btoa(new Date().getTime()));

let ampm = JSON.parse(hashToObject.ap);
let colorId = parseInt(hashToObject.cId);
let darkMode = JSON.parse(hashToObject.dM);
let dateDisplay = JSON.parse(hashToObject.dD);
let digitalFont = JSON.parse(hashToObject.dF);

let btnStart = document.querySelector('#btn-start-timer');
let btnStop = document.querySelector('#btn-stop-timer');
let btnReset = document.querySelector('#btn-reset-timer');
let btnGroup = document.querySelector('#btn-group');

let titleElement = document.querySelector('#main-title');
let timeElement = document.querySelector('#main-time');
let mainTitleEle = document.querySelector('.main-display-title');
let mainDaysEle = document.querySelector('#main-days');
let daysEle = document.querySelector('#sub-days');
let pastTimeDisplayEle = document.querySelector('#past-alarm-display');
let dateTimeSetDisplayEle = document.querySelector('#dateTime-set-display');
let iconPastTime = document.querySelector('#icon-past-time');

(function () {
    if (!darkMode) document.body.classList.remove('dark-mode');
    colorCode[0] = (darkMode) ? '#dee2e6' : '#495057';
    timeFontStyle = (digitalFont) ? 'Digital Italic' : 'Open Sans';
    document.querySelector('.colored').style.color = colorCode[colorId];
    document.querySelector('.embed-icon').style.color = colorCode[colorId];
    timeElement.style.fontSize = `18vmin`;
    timeElement.style.fontFamily = timeFontStyle;
    mainTitleEle.style.fontSize = '12vmin';
    // mainTitleEle.style.fontFamily = timeFontStyle;
    mainDaysEle.style.fontSize = '18vmin';
    mainDaysEle.style.fontFamily = timeFontStyle;
    iconPastTime.style.fontSize = '12vmin';
    daysEle.style.fontSize = '12vmin';
    daysEle.style.fontFamily = timeFontStyle;
    dateTimeSetDisplayEle.style.fontSize = '10vmin';
    dateTimeSetDisplayEle.style.fontFamily = timeFontStyle;
})();

//set timer btn click event
const CHILDHOOD = new Audio('/assets/audios/Childhood.mp3');
const CHRISTMAS = new Audio('/assets/audios/Christmas.mp3');
const CHURCH_BELL = new Audio('/assets/audios/Church_bell.mp3');
const CRICKET = new Audio('/assets/audios/Cricket.mp3');
const HAPPY_BIRTHDAY = new Audio('/assets/audios/Happy_birthday.mp3');
const ORGAN = new Audio('/assets/audios/Organ.mp3');
const PHONE_BELL_1 = new Audio('/assets/audios/Phone_bell.mp3');
const PHONE_BELL_2 = new Audio('/assets/audios/Phone_bell2.mp3')
const PIANO = new Audio('/assets/audios/Piano.mp3')
const PIZZICATO = new Audio('/assets/audios/Pizzicato.mp3');
const POLICE_SIREN = new Audio('/assets/audios/Police_siren.mp3');
const SCHOOL_BELL = new Audio('/assets/audios/School_bell.mp3');
const XYLOPHONE_1 = new Audio('/assets/audios/Xylophone.mp3');
const XYLOPHONE_2 = new Audio('/assets/audios/Xylophone2.mp3');

let alarmAudios = [ // length = 14
    CHILDHOOD,
    CHRISTMAS,
    CHURCH_BELL,
    CRICKET,
    HAPPY_BIRTHDAY,
    ORGAN,
    PHONE_BELL_1,
    PHONE_BELL_2,
    PIANO,
    PIZZICATO,
    POLICE_SIREN,
    SCHOOL_BELL,
    XYLOPHONE_1,
    XYLOPHONE_2,
];

// stop audioplayer
function audioPause() {
    alarmAudios.forEach((e) => {
        e.pause();
        e.currentTime = 0;
    })
}

document.querySelector('#test-timer-modal').addEventListener('hidden.bs.modal', () => {
    audioPause();
    if (!isAlarm) {
        document.querySelector('#btn-set-timer').click();
    } else {
        isAlarm = false;
    }
});

const localLangCode = 'en'

let diff, stdT = new Date().getTime();

const FORMATTER = { hourCycle: 'h12', year: 'numeric', month: 'short', date: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };


function getTime() {
    const NOW = new Date();
    if (setTimer) {
        setTimerTime = timeFormatter(setTimer)[2];
    }
    nowUtc = NOW.getTime();
    if (localStorage.getItem('isT')) {
        setUtc = parseInt(window.atob(localStorage.getItem('isT'))) + setTimerTime;
        btnGroup.style.display = 'inline-block';
    } else if (localStorage.getItem('idT')) {
        setUtc = nowUtc + setTimerTime - JSON.parse(window.atob(localStorage.getItem('idT')));
    } else setUtc = stdT

    if (setUtc >= nowUtc) {
        if (localStorage.getItem('idT')) {
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
        pastTimeDisplayEle.textContent = (localStorage.getItem('isT')) ? 'Alarm Past Time' : '';
        iconPastTime.style.display = 'inline-block';
    }
    diff = Math.abs(setUtc - nowUtc);
    mainDisplay(diff);

    if (parseInt(setUtc / 1000) == parseInt(nowUtc / 1000) && !isAlarm && localStorage.getItem('isT')) {
        isAlarm = true;
        let timerModal = new bootstrap.Modal(document.querySelector('#test-timer-modal'));
        timerModal.show();
        const TITLE = setTimer[1];
        document.querySelector('#set-timer-title-display').textContent = TITLE;
        let showTimer = (setTimer[0] == 'countdown') ?
            `${setTimer[2].toString().padStart(2, '0')}:${setTimer[3].toString().padStart(2, '0')}:${setTimer[4].toString().padStart(2, '0')}` :
            `${setTimer[3]}, ${setTimer[2]}`;
        document.querySelector('#set-timer-time-display').textContent = showTimer;

        setTimeout(() => {
            let idx = (setTimer[0] == 'countdown') ? 5 : 4;
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
        if (secondsToHMS(dt)[0]) {
            const T = secondsToHMS(dt);
            isDays = T[0] > 1 ? 'Days ' : 'Day ';
        } else isDays = '';

        mainTitleEle.textContent = (setTimer[1]) ? setTimer[1] : 'Set Timer';
        mainDaysEle.textContent = secondsToHMS(dt)[0] ? secondsToHMS(dt)[0] : '';
        timeElement.textContent = secondsToHMS(dt)[1];
        daysEle.textContent = isDays;
        titleElement.textContent = `${mainDaysEle.textContent} ${isDays} ${timeElement.textContent} Online Timer - Digital Timer - WorldTime247.com`;
        mainDisplayBtn();
    }

    function mainDisplayBtn() {
        if (setTimer[0] == 'dateTime') {
            const DATE = new Date(setTimer[2]).toLocaleDateString(localLangCode, OPTIONS_DATE);
            dateTimeSetDisplayEle.textContent = DATE //: `${setTimer[3]}, ${DATE}`;;
            document.querySelector('#btn-group').style.display = 'none';
        } else {
            dateTimeSetDisplayEle.textContent = '';
            btnReset.style.display = 'inline-block';
        }
        if (setTimer == false) {
            document.querySelector('#btn-group').style.display = 'none';
        }
    }

    btnReset.onclick = () => {
        clearInterval(handleId);
        handleId = 0;
        localStorage.removeItem('isT');
        localStorage.removeItem('idT');
        mainDisplay(setTimerTime);
        btnStop.style.display = 'none';
        btnStart.style.display = 'inline-block';
        btnStart.disabled = false;
        iconPastTime.style.display = 'none';
        pastTimeDisplayEle.textContent = '';
    }

    btnStop.onclick = () => {
        localStorage.removeItem('isT');
        localStorage.setItem('idT', window.btoa(setTimerTime - diff));
        btnStart.disabled = false;
    }
    btnStart.onclick = () => {
        if (handleId == 0) {
            handleId = setInterval(getTime, 200);
            localStorage.setItem('isT', window.btoa(new Date().getTime()));
        } else {
            let diff = parseInt(window.atob(localStorage.getItem('idT')));
            (diff) ? localStorage.setItem('isT', window.btoa(new Date().getTime() - diff)) : localStorage.setItem('isT', window.btoa(new Date().getTime()));
            localStorage.removeItem('idT');
            btnStop.style.display = 'inline-block';
            btnStart.style.display = 'none';
        }
    }
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
    if (st[0] == 'countdown') { // st : [countdown, title, hour, min, sec, audioIdx, isloop]
        [h, m, s] = [st[2], st[3], st[4]];
        offsetT = (h * 3600 + m * 60 + s) * 1000;
    } else if (st[0] == 'dateTime') { //st : [dateTime, title, date, time, audioIdx, isloop]
        offsetT = new Date(`${st[2]} ${st[3]}`).getTime() - parseInt(window.atob(localStorage.getItem('isT')));
    };

    return secondsToHMS(offsetT);
}
