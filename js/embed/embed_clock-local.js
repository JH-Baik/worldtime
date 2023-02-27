/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ########################
 *   embed_clock-local.js
 * ########################
 */

let colorCode = ['', '#1979d2', '#388e3c', '#d32f2f', '#ff9900'];

getEmbedDataList = location.hash.substring(1).split('&');
history.replaceState({}, document.title, ".");
let hashToObject = new Object();
getEmbedDataList.forEach(element => {
    dataSplit = element.split('=');
    hashToObject[dataSplit[0]] = dataSplit[1];
});

const CUR_URL = decodeURI(window.location.pathname);
const URL_LENGTH = CUR_URL.split('/').length;
// const CANONICAL = document.querySelector('[rel="canonical"]');
let path = location.pathname.slice(6, -1);
// CANONICAL.href = `https://worldtime247.com${path}/`;

let cityCountry, title;
if (CUR_URL.split('/')[URL_LENGTH - 3] === 'clock') {
    cityCountry = CUR_URL.split('/')[URL_LENGTH - 2].split('-');
} else if (CUR_URL.split('/')[URL_LENGTH - 4] === 'clock') {
    cityCountry = CUR_URL.split('/')[URL_LENGTH - 3].split('-');
    title = CUR_URL.split('/')[URL_LENGTH - 2];
} else location.href = '/err404';
const COUNTRY = cityCountry[0];
cityCountry.shift();
const CITY = cityCountry.join(' ');

let tzData;
let handleId = 0;
let mainDpTitleNameEle = document.querySelector('.main-display-title > #main-display-title-name');
let mainDpTitleFlagEle = document.querySelector('.main-display-title > #main-display-title-flag');
if (title) mainDpTitleFlagEle.style.display = 'none';

try {
    Intl.DateTimeFormat('en-US', { // en-US important!
        timeZone: 'Europe/Kyiv',
    })
} catch (err) {
    if (tzDatum[374].tzName == 'Europe/Kyiv') {
        tzDatum[374].tzName = 'Europe/Kiev';
        // tzDatum[374].city = 'Kiev';
    }
}

let ampm = JSON.parse(hashToObject.ap);
let colorId = parseInt(hashToObject.cId);
let darkMode = JSON.parse(hashToObject.dM);
let dateDisplay = JSON.parse(hashToObject.dD);
let digitalFont = JSON.parse(hashToObject.dF);

let titleElement = document.querySelector('#main-title');
let mainDisplayTitleElement = document.querySelector('.main-display-title');
let timeElement = document.querySelector('#main-time');
let dateElement = document.querySelector('#main-date');

//initial running function
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
    dateElement.style.fontSize = `13vmin`;
    dateElement.style.fontFamily = timeFontStyle;
})();

setInterval(getTime, 200);

const localLangCode = 'en'

async function getTime() {
    const NOW = new Date();
    let timeLabel = ampm ? 'h12' : 'h23';
    const OPTIONS_TIME = { hourCycle: timeLabel, hour: 'numeric', minute: '2-digit', second: '2-digit', };
    const TIME = new Date(NOW.getTime() + tzData.diffOffset * 60 * 1000).toLocaleTimeString(localLangCode, OPTIONS_TIME);
    const FORMATTER_TABLE = Intl.DateTimeFormat(localLangCode, {
        timeZone: tzData.tzName,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    });

    mainDpTitleFlagEle.src = `/assets/icons/country-icon/${COUNTRY.toUpperCase()}.svg`;
    const MAIN_TITLE = (title) ? `${TIME}\u00a0-\u00a0${title}\u00a0-\u00a0${tzData.city},\u00a0${tzData.ctr}` :
        `${TIME}\u00a0-\u00a0${tzData.city},\u00a0${tzData.ctr}`;
    titleElement.textContent = MAIN_TITLE;
    mainDpTitleNameEle.textContent = (title) ? title : `${tzData.city}, ${tzData.ctr}`;
    timeElement.textContent = TIME;
    dateElement.textContent = FORMATTER_TABLE.format(new Date());
}

// change number 1 digit to 2 digit
function withZero(num) {
    num = num > 9 ? num : `0${num}`;
    return num;
}

function numberToTime(num) {
    let signPlusMinus = '';

    if (num > 0) {
        signPlusMinus = '+';
    } else if (num < 0) {
        signPlusMinus = '-';
    }
    num = Math.abs(num);
    var hours = parseInt(num / 60);
    var minutes = num % 60;

    return `${signPlusMinus}${withZero(hours)}:${withZero(minutes)}`;
}

//copy & paste templates table record (test code)
async function getTzItems(tzData) {
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
}

function numToTime(num) {
    if (num > 0) {
        sign = '+';
    } else if (num < 0) {
        sign = '-';
    } else sign = '';
    absNum = Math.abs(num);

    return `${sign}${withZero(parseInt(absNum / 60))}:${withZero(absNum % 60)}`;
}

for (i = 0; i < tzDatum.length; i++) {
    if (COUNTRY == tzDatum[i].cc.toLowerCase() && CITY == tzDatum[i].city.toLowerCase()) {
        tzData = tzDatum[i];
        getTzItems(tzData);
        break;
    }
}
