/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ##################
 *   clock-local.js
 * ##################
 */

const CUR_URL = decodeURI(window.location.pathname);
const URL_LENGTH = CUR_URL.split('/').length;
const CITES_QTY = 40;
let cityCountry, title;
let isTitleFlag = false;
setTimeout(() => {
    isTitleFlag = true;
}, 5000);

if (CUR_URL.split('/')[URL_LENGTH - 3] === 'clock') {
    cityCountry = CUR_URL.split('/')[URL_LENGTH - 2].split('-');
} else if (CUR_URL.split('/')[URL_LENGTH - 4] === 'clock') {
    cityCountry = CUR_URL.split('/')[URL_LENGTH - 3].split('-');
    title = CUR_URL.split('/')[URL_LENGTH - 2];
} else location.href = '/err404';

const COUNTRY = cityCountry[0];
cityCountry.shift();
let CITY = cityCountry.join(' ');
let tzData;
let handleId = 0;
let titleElement = document.querySelector('#main-title');
let mainDpTitleNameEle = document.querySelector('.main-display-title > #main-display-title-name');
let mainDpTitleFlagEle = document.querySelector('#main-display-title-flag');
let timeElement = document.querySelector('#main-time');
let dateElement = document.querySelector('#main-date');
let localTzOffsetEle = document.querySelector('#localTzOffset');

try {
    Intl.DateTimeFormat('en-US', { // en-US important!
        timeZone: 'Europe/Kyiv',
    })
} catch (err) {
    if (tzDatum[374].tzName == 'Europe/Kyiv') {
        tzDatum[374].tzName = 'Europe/Kiev';
    }
}

if (handleId == 0) {
    handleId = setInterval(getTime, 100);
}

const localLangCode = 'en';

// get time for 12hours cycle
let isAmpm;
if (localStorage.getItem('displayConfig')) {
    getLocalData = JSON.parse(localStorage.getItem('displayConfig'));
    isAmpm = getLocalData.displayConfig.ap;
    miniCardList = JSON.parse(window.atob(localStorage.getItem('miniCards')));
}

async function getTime() {
    const NOW = new Date();
    let timeLabel = isAmpm ? 'h12' : 'h23';
    const OPTIONS_TIME = { hourCycle: timeLabel, hour: 'numeric', minute: '2-digit', second: '2-digit', };
    const TIME = new Date(NOW.getTime() + tzData.diffOffset * 60 * 1000).toLocaleTimeString(localLangCode, OPTIONS_TIME);
    const FORMATTER_TABLE = Intl.DateTimeFormat(localLangCode, {
        timeZone: tzData.tzName,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
    });

    if (isTitleFlag) {
        var mainTitle = (title) ? `${TIME}\u00a0-\u00a0${title}\u00a0-\u00a0${tzData.city},\u00a0${tzData.ctr}` :
            `${TIME}\u00a0- Current Time in ${tzData.city},\u00a0${tzData.ctr}`;
        titleElement.textContent = mainTitle;
    }

    mainDpTitleNameEle.textContent = (title) ? (title) : `${tzData.city}, ${tzData.ctr}`;
    timeElement.textContent = TIME;
    const LOCAL_DATE = new Date(NOW.getTime() + tzData.diffOffset * 60 * 1000);

    localTzOffsetEle.textContent = getLocalDayCalc(LOCAL_DATE, tzData.diffOffset);
    dateElement.textContent = FORMATTER_TABLE.format(new Date());

    function getLocalDayCalc(date, localOffset) {
        const LOCAL_DAY = Math.floor(date.getTime() / 1000);
        const USER_DAY = Math.floor(new Date() / 1000);
        let dayNames = ['Yesterday', 'Today', 'Tomorrow'];
        let dayName = dayNames[1];
        if (date.getDate() !== new Date().getDate()) dayName = LOCAL_DAY > USER_DAY ? dayNames[2] : dayNames[0];

        return localOffset % 60 ? `${dayName},\u00a0${numToTime(localOffset)}` : `${dayName},\u00a0${localOffset / 60}\u00a0hour`;
    }
}

function numToTime(num) {
    let signPlusMinus = '';

    if (num > 0) {
        signPlusMinus = '+';
    } else if (num < 0) {
        signPlusMinus = '-';
    }
    num = Math.abs(num);
    var hours = parseInt(num / 60);
    var minutes = num % 60;

    return `${signPlusMinus}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

//copy & paste templates table record (test code)
async function getTzItems(tzData, i) {
    const EVENT_DATE = new Date();
    const FORMATTER = Intl.DateTimeFormat(localLangCode, {
        timeZone: tzData.tzName,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'short',
        // timeZoneName: 'short',
    });

    dtf = FORMATTER.formatToParts(EVENT_DATE);
    function partsOffset(dtf, date) {
        const TYPE_TO_POS = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 };
        const FORMATTED = dtf.formatToParts(date),
            filled = [];
        for (let i = 0; i < FORMATTED.length; i++) {
            const { type, value } = FORMATTED[i],
                pos = TYPE_TO_POS[type];
            if (pos !== undefined) {
                filled[pos] = parseInt(value, 10);
            }
        }
        return filled;
    }

    function getOffset(parts, date) {
        const [y, M, d, h, m, s] = parts;
        const UTC = new Date(Date.UTC(y, M - 1, d, h, m, s));
        const OFFSET = (UTC - date) / 60 / 1000;

        return OFFSET;
    }

    localOffset = Math.round(getOffset(partsOffset(FORMATTER, EVENT_DATE), EVENT_DATE));
    currentOffset = new Date().getTimezoneOffset() * -1;
    diffOffset = localOffset - currentOffset;
    tzData.diffOffset = diffOffset;
    tzData.localOffset = localOffset;
    tzDatum[i].diffOffset = diffOffset;
}

for (i = 0; i < tzDatum.length; i++) {
    getTzItems(tzDatum[i], i);
    if (COUNTRY == tzDatum[i].cc.toLowerCase() && CITY == tzDatum[i].city.toLowerCase()) {
        tzData = tzDatum[i];
        break;
    }
}

if (tzData == undefined) location.href = '/err404';

