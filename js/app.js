/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ##########
 *   app.js
 * ##########
 */

let isTitleFlag = false;
setTimeout(() => {
    isTitleFlag = true;
}, 5000);

let handleId = 0;
let titleElement = document.querySelector('#main-title');
let timeElement = document.querySelector('#main-time');
let dateElement = document.querySelector('#main-date');
let isFirstTable = true;

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
    let index = 0;
    const NOW = new Date();
    let timeLabel = isAmpm ? 'h12' : 'h23';
    const OPTIONS_TIME = { hourCycle: timeLabel, hour: 'numeric', minute: '2-digit', second: '2-digit', };
    const OPTIONS_DATE = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const TIME = NOW.toLocaleTimeString(localLangCode, OPTIONS_TIME);
    const TODAY = NOW.toLocaleDateString(localLangCode, OPTIONS_DATE);

    timeElement.textContent = TIME;
    dateElement.textContent = TODAY;
    if(isTitleFlag) titleElement.textContent = `${TIME}\u00a0Online Clock - Animation Clock`;

    miniCards = document.querySelectorAll('.minicard');
    for (let i = 0; i < miniCardList.length; i++) {
        let countryCodeName = miniCardList[i].split('_');

        for (let j = 0; j < tzDatum.length; j++) {
            if (countryCodeName[0] == tzDatum[j].cc && countryCodeName[1] == tzDatum[j].city) {
                index = j;
            }
        }
        const MINICARD_LOCAL_TIME = new Date(NOW.getTime() + tzDatum[index].diffOffset * 60 * 1000).toLocaleTimeString(localLangCode, OPTIONS_TIME);
        const MINICARD_LOCAL_DATE = new Date(NOW.getTime() + tzDatum[index].diffOffset * 60 * 1000);
        let cardTitle = (countryCodeName[2] !== undefined) ? countryCodeName[2] : `${tzDatum[index].city},\u00a0${tzDatum[index].ctr}`;
        miniCards[i].querySelector('.minicard-name').textContent = cardTitle;
        miniCards[i].querySelector('.minicard-local-time').textContent = MINICARD_LOCAL_TIME;
        miniCards[i].querySelector('.minicard-local-diff-time').textContent = getLocalDayCalc(MINICARD_LOCAL_DATE, tzDatum[index].diffOffset);
        const CITY = tzDatum[index].city.replace(/\s/gi, '-').toLowerCase();
        const HREF = `${tzDatum[index].cc.toLowerCase()}-${CITY}/`;
        miniCards[i].querySelectorAll('.new-page')[0].href = (countryCodeName[2] !== undefined) ? HREF + `${countryCodeName[2]}/` : HREF;
        miniCards[i].querySelectorAll('.new-page')[1].href = (countryCodeName[2] !== undefined) ? HREF + `${countryCodeName[2]}/` : HREF;

        // miniCards[i].querySelector('#minicardIndex>i').value = i;
        let miniCardIndex = miniCards[i].querySelectorAll('.minicard ul > .dropdown-item, .minicard a');
        miniCardIndex.forEach(element => {
            element.dataset.index = i;
        });

        index = 0;
    }

    function getLocalDayCalc(date, localOffset) {
        const LOCAL_DAY = Math.floor(date.getTime() / 1000);
        const USER_DAY = Math.floor(new Date() / 1000);
        let dayNames = ['Yesterday', 'Today', 'Tomorrow'];
        let dayName = dayNames[1];
        if (date.getDate() !== new Date().getDate()) dayName = LOCAL_DAY > USER_DAY ? dayNames[2] : dayNames[0];

        return localOffset % 60 ? `${dayName},\u00a0${numToTime(localOffset)}` : `${dayName},\u00a0${localOffset / 60}\u00a0hour`
    }
}

function numToTime(num) {
    let sign = '';
    if (num > 0) {
        sign = '+';
    } else if (num < 0) {
        sign = '-';
    }
    absNum = Math.abs(num);
    return `${sign}${(parseInt(absNum / 60)).toString().padStart(2, '0')}:${(absNum % 60).toString().padStart(2, '0')}`;
}

//copy & paste templates table record (test code)
async function getTzItems(tzData, tzIndex) {
    const EVENT_DATE = new Date();
    const FORMATTER_LOCAL_TIME_NAME = Intl.DateTimeFormat('en-US', { // en-US important!
        timeZone: tzData.tzName,
        timeZoneName: 'long',
    });
    const FORMATTER_TABLE = Intl.DateTimeFormat(localLangCode, {
        timeZone: tzData.tzName,
        hourCycle: 'h23',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        weekday: 'short',
    });
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
    currentOffset = new Date().getTimezoneOffset();
    diffOffset = localOffset + currentOffset;
    tzDatum[tzIndex].diffOffset = diffOffset; // for minicard (local time, diff time display)

    if (document.querySelector('#world-time-table button').getAttribute('aria-expanded') == 'true') {
        let template = document.querySelector('#table-item-template');
        let tbodyNode = document.querySelector('#tbody-target-tabledata');
        let cloneNode = document.importNode(template.content, true);
        let tds = cloneNode.querySelectorAll('td');

        localTimeName = FORMATTER_LOCAL_TIME_NAME.format(EVENT_DATE).split(' ');
        localTimeName.shift();
        localTimeNameString = localTimeName.join(' ');

        tds[0].querySelector('#tdimg-1').src = `/assets/icons/country-icon/${tzData.cc}.svg`;
        tds[0].querySelector('#tdspan-3').textContent = '\u00a0\u00a0' + tzData.ctr;
        tds[0].querySelector('#tdspan-4').textContent = tzData.cc;
        tds[1].textContent = `${tzData.city},\u00a0${tzData.ctr}`;
        tds[2].textContent = localTimeNameString;
        tds[3].textContent = numToTime(localOffset.toFixed(0));
        tds[4].textContent = numToTime(diffOffset.toFixed(0));
        tds[5].textContent = FORMATTER_TABLE.format(EVENT_DATE);

        tbodyNode.appendChild(cloneNode);
    }
}

document.querySelector('#world-time-table button').onclick = (e) => {
    if (e.target.getAttribute('aria-expanded') == 'true' && isFirstTable) {
        isFirstTable = false;
        for (i = 0; i < tzDatum.length; i++) {
            getTzItems(tzDatum[i], i);
        }
        const datatables = document.getElementById('datatables');
        if (datatables) {
            new simpleDatatables.DataTable(datatables);
        };
    }
}

let addClockModal = document.getElementById('clock-modal')
let modalFocus = document.getElementById('modal-select-country')

addClockModal.addEventListener('shown.bs.modal', function () {
    modalFocus.focus()
})

for (i = 0; i < tzDatum.length; i++) {
    getTzItems(tzDatum[i], i)
}

