/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * #######################
 *   embed_alarmclock.js
 * #######################
 */
const CUR_URL = window.location.pathname;
const URL_LENGTH = CUR_URL.split('/').length;
// const CANONICAL = document.querySelector('[rel="canonical"]');
// let path = CUR_URL.slice(6,-1);
// if (path === '/alarmclock') path = '';
// CANONICAL.href = `https://worldtime247.com${path}/`;

const RE = /^(set-alarm-for-)([0-9]|1[0-9]|2[0-3])-([0-9]|[0-5][0-9])$/g;
let isHash = true;
if (CUR_URL.length > 1 && CUR_URL.split('/')[URL_LENGTH - 2].match(RE)) {
    isHash = false;
    getSetTime = CUR_URL.split('/')[URL_LENGTH - 2].split('-');
    const TIME = timeFormat(getSetTime[3], getSetTime[4])
    document.querySelector('.main-display-title').textContent = `Set Alarm for ${TIME}`;
}
function timeFormat(h, m) {
    let sign = (h < 12) ? 'AM' : 'PM';
    h = (h % 12 !== 0) ? h % 12 : 12;
    return `${h}:${m.toString().padStart(2, '0')} ${sign}`;
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

let ampm = JSON.parse(hashToObject.ap);
let colorId = parseInt(hashToObject.cId);
let darkMode = JSON.parse(hashToObject.dM);
let dateDisplay = JSON.parse(hashToObject.dD);
let digitalFont = JSON.parse(hashToObject.dF);

let titleElement = document.querySelector('#main-display-title');
let mainDisplayTitleElement = document.querySelector('.main-display-title');
let timeElement = document.querySelector('#main-time');
let dateElement = document.querySelector('#main-date');

(function () {
    if (!darkMode) document.body.classList.remove('dark-mode');
    colorCode[0] = (darkMode) ? '#dee2e6' : '#495057';
    timeFontStyle = (digitalFont) ? 'Digital Italic' : 'Open Sans';
    document.querySelector('#main-date').style.display = dateDisplay ? 'block' : 'none';
    document.querySelector('.colored').style.color = colorCode[colorId];
    document.querySelector('.embed-icon').style.color = colorCode[colorId];
    mainDisplayTitleElement.style.fontSize = `10vmin`;
    timeElement.style.fontSize = `22vmin`;
    timeElement.style.fontFamily = timeFontStyle;
    dateElement.style.fontSize = `10vmin`;
    dateElement.style.fontFamily = timeFontStyle;
    document.querySelector('#row-display-alarm').style.display = 'none';
})();

let isAlarm = false;
let setAlarmTime = [];
let setAlarm = [];
if (getEmbedDataList.length == 10) {
    setAlarm = [hashToObject.t, parseInt(hashToObject.h), parseInt(hashToObject.m), parseInt(hashToObject.aId), JSON.parse(hashToObject.l)];
    setAlarmTime = [setAlarm[1], setAlarm[2]];
    mainDisplayTitleElement.style.fontSize = `10vmin`;
    timeElement.style.fontSize = `16vmin`;
    dateElement.style.fontSize = `10vmin`;
}

document.querySelector('#btn-set-alarm').onclick = () => {
    mainDisplayTitleElement.style.fontSize = `10vmin`;
    timeElement.style.fontSize = `16vmin`;
    dateElement.style.fontSize = `9vmin`;
    if (isHash) {
        setAlarm = ['Alarm', 0, 0, 13, 1];
        setAlarmTime = [setAlarm[1], setAlarm[2]];
    } else if (CUR_URL.length > 1 && CUR_URL.split('/')[URL_LENGTH - 2].match(RE)) {
        getSetTime = CUR_URL.split('/')[URL_LENGTH - 2].split('-');
        const TIME = timeFormat(getSetTime[3], getSetTime[4])
        setAlarm = ['Alarm ' + TIME, getSetTime[3], getSetTime[4], 8, true];
        setAlarmTime = [getSetTime[3], getSetTime[4]];
    }
}

let handleId = 0;

if (handleId == 0) {
    handleId = setInterval(getTime, 100);
}

//set alarm btn click event
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

function audioPause() {
    alarmAudios.forEach((e) => {
        e.pause();
    })
}

document.querySelector('#btn-stop-alarm').onclick = () => {
    document.querySelector('#row-display-alarm').style.display = 'none';
    document.querySelector('#btn-set-alarm').style.display = 'inline-block';
    setAlarm = [];

    mainDisplayTitleElement.style.fontSize = `10vmin`;
    timeElement.style.fontSize = `16vmin`;
    dateElement.style.fontSize = `10vmin`;
}

const localLangCode = 'en'

// get current time
function getTime() {
    const NOW = new Date();
    let timeLabel = ampm ? 'h12' : 'h23';
    const OPTIONS_TIME = { hourCycle: timeLabel, hour: 'numeric', minute: '2-digit', second: '2-digit', };
    const OPTIONS_DATE = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const TIME = NOW.toLocaleTimeString(localLangCode, OPTIONS_TIME);
    const TODAY = NOW.toLocaleDateString(localLangCode, OPTIONS_DATE);

    timeElement.textContent = TIME;
    dateElement.textContent = TODAY;

    if (setAlarm.length) {
        document.querySelector('#alarm-title').textContent = setAlarm[0];
        document.querySelector('#row-display-alarm').style.display = 'block';
        document.querySelector('#btn-set-alarm').style.display = 'none';
        document.querySelector('#display-alarm').style.color = colorCode[colorId];
        document.querySelector('#display-alarm').style.fontFamily = timeFontStyle;
    }

    if (setAlarmTime.length) {
        document.querySelector('#content-alarm-time').textContent = timeFormatter(setAlarmTime);

        nowUtc = NOW.getTime();
        setUtc = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), setAlarmTime[0], setAlarmTime[1]).getTime();
        setUtc = (nowUtc < setUtc) ? setUtc : setUtc + (24 * 3600 * 1000);

        document.querySelector('#content-alarm-timer').textContent = secondsToHMS(parseInt((setUtc - nowUtc) / 1000) + 1);

        if (parseInt((setUtc - nowUtc) / 1000) + 1 == 86400 && !isAlarm) {
            isAlarm = true;
            let alarmModal = new bootstrap.Modal(document.querySelector('#alarm-modal'));
            alarmModal.show();
            const TITLE = setAlarm[0];
            const HOUR = setAlarm[1];
            const MINUTE = setAlarm[2];

            document.querySelector('#set-alarm-title-display').textContent = TITLE;
            document.querySelector('#set-alarm-time-display').textContent = timeFormatter([HOUR, MINUTE]);

            setTimeout(() => {
                alarmAudios[setAlarm[3]].loop = setAlarm[4];
                alarmAudios[setAlarm[3]].play();
            }, 500);
        }
    }

    function secondsToHMS(num) {
        const HOURS = parseInt(num / 3600).toString();
        const MINUTES = parseInt(num % 3600 / 60).toString();
        const SECONDS = parseInt(num % 3600 % 60).toString();
        const RT = `${HOURS.padStart(2, '0')}:${MINUTES.padStart(2, '0')}:${SECONDS.padStart(2, '0')}`;
        return RT;
    }
}

document.querySelector('#alarm-modal').addEventListener('hidden.bs.modal', () => {
    audioPause();
});

//time formatter
function timeFormatter(tdTime) {
    const YEAR = new Date().getFullYear();
    const MONTH = new Date().getMonth();
    const DATE = new Date().getDate();
    const TIME_LABEL = ampm ? 'h12' : 'h23';
    const FORMATTER = { hourCycle: TIME_LABEL, hour: 'numeric', minute: 'numeric' };
    return new Date(YEAR, MONTH, DATE, tdTime[0], tdTime[1]).toLocaleTimeString(localLangCode, FORMATTER);
}

