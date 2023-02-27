/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ##################
 *   alarmclock.js
 * ##################
 */

let isAlarm = false;
let setAlarmTime = [];
let setAlarm = [];
let getSetTime = [];
let isSpecAlarm = false;
let isHash = true;
const CUR_URL = window.location.pathname;
const URL_LENGTH = CUR_URL.split('/').length;

const RE = /^(set-alarm-for)[-]([0-9]|1[0-9]|2[0-3])-([0-9]|[0-5][0-9])$/g;
if (CUR_URL.length > 1 && !CUR_URL.split('/')[URL_LENGTH - 2].match(RE)) location.href = '/err404';
if (CUR_URL.length > 1 && CUR_URL.split('/')[URL_LENGTH - 2].match(RE)) {
    isHash = false;
    getSetTime = CUR_URL.split('/')[URL_LENGTH - 2].split('-');
    getSpecTimeTable(getSetTime);
    document.querySelector('#btn-add-alarm2').onclick = () => {
        isSpecAlarm = true;
        document.querySelector('#btn-test-alarm2').style.display = "none";
        document.querySelector('#btn-add-alarm2').style.display = "none";
    }
}

function getSpecTimeTable(setTime) {
    document.querySelector('#btn-test-alarm2').onclick = () => {
        const TIME = timeFormat(setTime[3], setTime[4]);
        const TITLE = `Set Alarm for ${TIME}`;
        document.querySelector('#set-alarm-title-display').textContent = TITLE;
        document.querySelector('#set-alarm-time-display').textContent = TIME;
        document.querySelector('#btn-test-alarm').click();
        setTimeout(() => {
            alarmAudios[0].loop = true;
            alarmAudios[0].play();
        }, 500);
    }
}

function timeFormat(h, m) {
    let sign = (h < 12) ? 'AM' : 'PM';
    h = (h % 12 !== 0) ? h % 12 : 12;
    return `${h}:${m.toString().padStart(2, '0')} ${sign}`;
}

const colorNames = {
    mono: [0, ''],
    blue: [1, '#1979d2'],
    green: [2, '#388e3c'],
    red: [3, '#d32f2f'],
    orange: [4, '#ff9900'],
};

if (!isSpecAlarm && location.hash) {
    deUri = decodeURI(location.hash);
    getEmbedDataList = deUri.substring(1).split('&');
    history.replaceState({}, document.title, ".");
    let hashToObject = new Object();
    getEmbedDataList.forEach(element => {
        dataSplit = element.split('=');
        hashToObject[dataSplit[0]] = dataSplit[1];
    });

    if (hashToObject.title) {
        time = hashToObject.time.split(':');
        timeQuery = [hashToObject.title, time[0], time[1], hashToObject.audioIdx, hashToObject.loop];
        localStorage.setItem('setAlarm', JSON.stringify(timeQuery));
    }
}

getTimeQuery();
function getTimeQuery() {
    if (!isHash) return;
    let query, timeQuery;
    if (localStorage.getItem('setAlarm')) {
        query = JSON.parse(localStorage.getItem('setAlarm'));
        timeQuery = `#title=${query[0]}&time=${query[1]}:${query[2]}&audioIdx=${query[3]}&loop=${query[4]}`;
        document.querySelector('#location-name').value = location.href + decodeURI(timeQuery);
    }
    showHash = (timeQuery == undefined) ? history.pushState('', '', `${location.href}`) : history.pushState('', '', `${location.href}${timeQuery}`);
    return showHash;
}

if (localStorage.getItem('displayConfig')) {
    getLocalData = JSON.parse(localStorage.getItem('displayConfig'));
    isDigitalFont = Boolean(getLocalData.displayConfig.dF);
    isAmpm = Boolean(getLocalData.displayConfig.ap);
    isDateDisplay = Boolean(getLocalData.displayConfig.dD);
    isDarkMode = Boolean(getLocalData.displayConfig.dM);
    isRobot = Boolean(getLocalData.displayConfig.rb);
    colorId = getLocalData.displayConfig.cId;
    fontScale = getLocalData.displayConfig.fS;
    document.getElementById('btnswitch-am-pm').checked = isAmpm;
    document.getElementById('btnswitch-digital-font').checked = isDigitalFont;
    document.getElementById('btnswitch-dark-mode').checked = isDarkMode;
    document.getElementsByName('btncolor')[colorId].checked = true;
} else {
    isDigitalFont = document.getElementById('btnswitch-digital-font').checked;
    isAmpm = document.getElementById('btnswitch-am-pm').checked;
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

let historyAlarmList = localStorage.getItem('historyAlarm') ? JSON.parse(localStorage.getItem('historyAlarm')) : [
    ['Set Alarm 5:30 AM', 5, 30, 13, false],  //title, hour, minute, audio index, audio loop
    ['Set Alarm 6:00 AM', 6, 0, 13, false],
    ['Set Alarm 6:30 AM', 6, 30, 12, false],
    ['Set Alarm 7:00 AM', 7, 0, 12, false],
    ['Set Alarm 8:00 AM', 8, 0, 4, false],
    ['Set Alarm 9:00 AM', 9, 0, 5, false],
    ['Set Alarm 10:00 AM', 10, 0, 6, false],
    ['Set Alarm 12:00 AM', 12, 0, 7, false],
    ['Set Alarm 1:00 PM', 13, 0, 8, false],
    ['Set Alarm 6:00 PM', 18, 0, 10, false],
];

let handleId = 0;
if (handleId == 0) {
    handleId = setInterval(getTime, 100);
}

(function () {
    let colorMono = document.querySelector('#color-mono');
    if (isDarkMode == false) {
        document.body.classList.remove('dark-mode');
        document.querySelector('#btn-darkmode-true').style.display = 'block';
        document.querySelector('#btn-darkmode-false').style.display = 'none';
        colorMono.textContent = 'Lamp Black';
        colorMono.classList.replace('btn-outline-light', 'btn-outline-primary');
        colorNames.mono[1] = '#495057';
        document.getElementsByName('theme-color')[0].content = '#E9ECEF';
    } else {
        document.querySelector('#btn-darkmode-true').style.display = 'none';
        document.querySelector('#btn-darkmode-false').style.display = 'block';
        colorMono.textContent = 'Snow White';
        colorMono.classList.replace('btn-outline-primary', 'btn-outline-light');
        colorNames.mono[1] = '#dee2e6';
        document.getElementsByName('theme-color')[0].content = '#000000';
    }

    resizeFont();
    stringColorChangeToggle('btncolor-' + Object.keys(colorNames)[colorId]);
    digitalFontChangeToggle();
})();

// When the user scrolls down 200px from the top of the document, show the button
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

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

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
    document.querySelector('#main-date').style.fontSize = `${fontSizeObj.date[fontScale]}vmin`;

    saveLocalstorage();
}

// fullscreen processing
let btnFullscreen = document.querySelector("#btn-fullscreen");
btnFullscreen.addEventListener("click", openFullscreenMode);
// exit fullscreen
let btnExitFullscreen = document.querySelector("#btn-exit-fullscreen");
btnExitFullscreen.addEventListener("click", exitFullscreenMode);

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

function audioPause() {
    alarmAudios.forEach((e) => {
        e.pause();
        e.currentTime = 0;
    })
    document.querySelector('#icon-audio-pause').style.display = 'none';
    document.querySelector('#icon-audio-play').style.display = 'block';;
}

document.querySelector('#test-alarm-modal').addEventListener('hidden.bs.modal', () => {
    audioPause();
    // alarmAudios[audioIndex].currentTime = 0;
    if (!isAlarm && isHash) {
        document.querySelector('#btn-set-alarm').click();
    } else {
        isAlarm = false;
    }
});

let titleElement = document.querySelector('#main-title');
let timeElement = document.querySelector('#main-time');
let dateElement = document.querySelector('#main-date');

const localLangCode = 'en';

if (localStorage.getItem('displayConfig')) {
    getLocalData = JSON.parse(localStorage.getItem('displayConfig'));
}

// get current time
function getTime() {
    const NOW = new Date();
    let timeLabel = isAmpm ? 'h12' : 'h23';
    const OPTIONS_TIME = { hourCycle: timeLabel, hour: 'numeric', minute: '2-digit', second: '2-digit', };
    const OPTIONS_DATE = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const TIME = NOW.toLocaleTimeString(localLangCode, OPTIONS_TIME);
    const TODAY = NOW.toLocaleDateString(localLangCode, OPTIONS_DATE);

    timeElement.textContent = TIME;
    dateElement.textContent = TODAY;
    // titleElement.textContent = `${TIME}\u00a0Online Alarm Clock | worldtime247.com`;

    displayHistoryAlarm();

    if (localStorage.getItem('setAlarm') || isSpecAlarm) {
        // [TITLE, HOUR, MINUTE, AUDIO_IDX, isLoop]
        if (isSpecAlarm) {
            setAlarm = ['Alarm', getSetTime[3], getSetTime[4], 0, false];
            setAlarmTime = [getSetTime[3], getSetTime[4]];
            document.querySelector('#alarm-title').textContent = setAlarm[0];
            document.querySelector('#row-display-alarm').style.display = 'block';
            document.querySelector('#btn-set-alarm').style.display = 'none';
        } else if (isHash) {
            setAlarm = JSON.parse(localStorage.getItem('setAlarm'));
            setAlarmTime = [setAlarm[1], setAlarm[2]];
            document.querySelector('#alarm-title').textContent = setAlarm[0];
            document.querySelector('#row-display-alarm').style.display = 'block';
            document.querySelector('#btn-set-alarm').style.display = 'none';
            alarmQuery = `#t=${setAlarm[0]}&h=${setAlarm[1]}&m=${setAlarm[2]}&aId=${setAlarm[3]}&l=${setAlarm[4]}`;
        }
    }

    if (setAlarmTime.length) {
        document.querySelector('#content-alarm-time').textContent = timeFormatter(setAlarmTime);

        nowUtc = NOW.getTime();
        setUtc = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), setAlarmTime[0], setAlarmTime[1]).getTime();
        setUtc = (nowUtc < setUtc) ? setUtc : setUtc + (24 * 3600 * 1000);

        document.querySelector('#content-alarm-timer').textContent = secondsToHMS(parseInt((setUtc - nowUtc) / 1000) + 1);

        if (parseInt((setUtc - nowUtc) / 1000) + 1 == 86400 && !isAlarm) {
            isAlarm = true;
            let alarmModal = new bootstrap.Modal(document.querySelector('#test-alarm-modal'));
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

function displayHistoryAlarm() {
    let trElement = document.querySelectorAll('#tables-history > tbody > tr');
    for (let i = 0; i < trElement.length; i++) {
        let tr = trElement[i];
        const HA = historyAlarmList[i]
        const TITLE = HA[0];
        const HREF = `/#title=${TITLE}&time=${HA[1]}:${HA[2]}&audioIdx=${HA[3]}&loop=${HA[4]}`
        const TIME = timeFormatter([HA[1], HA[2]]);

        tr.querySelector('td:first-child > a').setAttribute('href', HREF);
        tr.querySelector('td:first-child > a').setAttribute('aria-label', `Set an alarm at ${TIME}`);
        tr.querySelector('td:first-child > a').textContent = TITLE;
        tr.querySelector('td:nth-child(2)').textContent = TIME;

        let lastTd = tr.querySelector('td:last-child');
        let tra = tr.querySelector('td>a')
        lastTd.index = i;
        tra.index = i;
    }
}

//time formatter
function timeFormatter(tdTime) {
    const YEAR = new Date().getFullYear();
    const MONTH = new Date().getMonth();
    const DATE = new Date().getDate();
    const TIME_LABEL = isAmpm ? 'h12' : 'h23';
    const FORMATTER = { hourCycle: TIME_LABEL, hour: 'numeric', minute: 'numeric' };
    return new Date(YEAR, MONTH, DATE, tdTime[0], tdTime[1]).toLocaleTimeString(localLangCode, FORMATTER);
}

//remove history alarm
function removeHistoryAlarm(index) {
    if (index !== undefined) {
        let historyAlarmNodes = document.querySelectorAll('#tables-history > tbody > tr');
        historyAlarmList.splice(index, 1);
        removeElement = historyAlarmNodes[index];
        removeElement.parentNode.removeChild(removeElement);

        saveLocalstorage();
    }
}

function initTableAlarmHistory() {
    let tbElement = document.querySelector('#tables-history > tbody');
    tbElement.style.fontFamily = 'Open Sans';
    for (let i = 0; i < historyAlarmList.length; i++) {
        tbElement.appendChild(createHistoryAlarm(historyAlarmList[i], i));
    }
    saveLocalstorage();
}

function createHistoryAlarm(itemH, index) {
    let customAudioCheck = (localStorage.getItem('customAudio') && localStorage.getItem('customAudioName')) ? true : false;
    let tr = document.createElement('tr');
    tr.setAttribute('class', 'history-record');
    if (customAudioCheck == false && itemH[3] > alarmAudios.length - 1) itemH[3] = alarmAudios.length - 1;
    const TD_ELEMENTS = `<td class="text-start" ><a href="" onclick="window.scrollTo({left:0,top:0});" aria-label="Set an alarm"></a></td>
                        <td class="text-end"></td>
                        <td><a class="bi bi-x-circle" role="img" aria-label="remove history alarm"></a></td>`;
    tr.innerHTML = TD_ELEMENTS;
    let lastTd = tr.querySelector('td:last-child');
    let td = tr.querySelector('td:first-child');
    lastTd.index = index;
    td.index = index;
    lastTd.addEventListener('click', (target) => {
        removeHistoryAlarm(target.composedPath()[2].lastChild.index);
    });
    td.addEventListener('click', (target) => {
        const ITEM = historyAlarmList.splice(target.composedPath()[1].index, 1);
        historyAlarmList.splice(0, 0, ITEM[0]);
        localStorage.setItem('setAlarm', JSON.stringify(ITEM[0]));
    });
    return tr;
}

window.addEventListener('hashchange', () => {
    document.querySelector('#location-name').value = location.href;
});

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

//Get the button
let btnBackToTop = document.getElementById('btn-back-to-top');

// When the user scrolls down 150px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

// dropdown menu event processing
let checkBoxAll = document.querySelectorAll('li input');

checkBoxAll.forEach((checkBox) => {
    checkBox.addEventListener('change', (e) => {
        if (e.target.id == 'btnswitch-dark-mode') btnDarkThemeChangeToggle();
        if (e.target.id == 'btnswitch-digital-font') {
            isDigitalFont = !isDigitalFont;
            digitalFontChangeToggle();
        }
        if (e.target.id == 'btnswitch-date-display') {
            isDateDisplay = !isDateDisplay;
            dateDisplayChangeToggle();
        }
        if (e.target.id == 'btnswitch-am-pm') isAmpm = !isAmpm; //handled in app.js
        if (e.target.id.substr(0, 8) == 'btncolor') stringColorChangeToggle(e.target.id);
        saveLocalstorage();
    });
});

document.querySelector('#btn-set-alarm').addEventListener('click', (e) => {
    let hoursSelectElement = document.querySelector('#modal-select-hour');
    let minutesSelectElement = document.querySelector('#modal-select-minute');
    let audiosSelectElement = document.querySelector('#modal-select-audio');
    let playIcon = document.querySelector('#icon-audio-play');
    let pauseIcon = document.querySelector('#icon-audio-pause');
    let audioProgressBar = document.querySelector('#audio-progress');
    let getHour = new Date().getHours();
    let getMin = new Date().getMinutes();
    let audioIndex = 0;
    let isLoop = true;
    if (!isHash && getSetTime.length) {
        getHour = parseInt(getSetTime[3]);
        getMin = parseInt(getSetTime[4]);
    }
    if (document.querySelector('#btn-confirm').style.display == 'block') document.querySelector('#btn-recently-used').click();
    changeLoopIcon();

    for (let i = 0; i < 24; i++) {
        OptionElement = document.createElement('option');

        if (isAmpm) {
            ampm = (i < 12) ? ' AM' : ' PM';
            num = (i % 12) ? i % 12 : 12;
            OptionElement.textContent = num.toString().padStart(2, '0') + ampm;
        } else if (!isAmpm) {
            OptionElement.textContent = i.toString().padStart(2, '0');
        }
        hoursSelectElement.appendChild(OptionElement);
    }

    for (let i = 0; i < 60; i++) {
        OptionElement = document.createElement('option');
        OptionElement.textContent = i.toString().padStart(2, '0');
        minutesSelectElement.appendChild(OptionElement);
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
    audiosSelectElement.onchange = (e) => {
        alarmAudios[audioIndex].pause();
        alarmAudios[audioIndex].currentTime = 0;

        audioIndex = e.target.selectedIndex;
        audioPlay();;
    }

    //change by button
    document.querySelector('#btn-minus-h').onclick = () => {
        getHour = (getHour > 0) ? getHour - 1 : 23;
        changeTimeSelect();
    }
    document.querySelector('#btn-plus-h').onclick = () => {
        getHour = (getHour < 23) ? getHour + 1 : 0;
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

    //change select
    function changeTimeSelect() {
        hoursSelectElement.options[getHour].selected = true;
        minutesSelectElement.options[getMin].selected = true;
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
        if (alarmAudios.length >= 15) return;
        customAudioOptionElement = document.createElement('option');
        customAudioOptionElement.textContent = fileName;
        audiosSelectElement.appendChild(customAudioOptionElement);
        alarmAudios.push(customAudio);
    }

    document.querySelector('#set-alarm-modal').addEventListener('hidden.bs.modal', () => {
        hoursSelectElement.textContent = '';
        minutesSelectElement.textContent = '';
        audioPause();
        alarmAudios[audioIndex].currentTime = 0;
        document.querySelector('#modal-input-title').value = '';
    });

    document.querySelector('#btn-test-alarm').onclick = () => {
        isAlarm = false;
        const HOUR = document.querySelector('#modal-select-hour').selectedIndex;
        const MINUTE = document.querySelector('#modal-select-minute').selectedIndex;
        const TITLE = document.querySelector('#modal-input-title').value;
        document.querySelector('#set-alarm-title-display').textContent = (TITLE !== '') ? TITLE : 'Untitled';
        document.querySelector('#set-alarm-time-display').textContent = timeFormatter([HOUR, MINUTE]);
        setTimeout(() => {
            alarmAudios[audioIndex].loop = isLoop;
            alarmAudios[audioIndex].play();
        }, 500);
    }

    document.querySelector('#btn-add-alarm').onclick = () => {
        addHistoryAlarm();
        if (!isSpecAlarm) localStorage.setItem('setAlarm', JSON.stringify(setAlarm));
        getTimeQuery();
        if (!isHash) location.href = '/';
    }

    //text input event(enter key)
    let keydown = false;
    document.querySelector('#modal-input-title').addEventListener('keydown', (e) => {
        if (keydown) return;
        else if (e.keyCode == 13) {
            keydown = true;
            document.querySelector('#btn-add-alarm').click();
        }
    })

    function addHistoryAlarm() {
        const TITLE = (document.querySelector('#modal-input-title').value !== '') ? document.querySelector('#modal-input-title').value : 'Untitled';
        const HOUR = document.querySelector('#modal-select-hour').selectedIndex;
        const MINUTE = document.querySelector('#modal-select-minute').selectedIndex;
        const AUDIO_IDX = document.querySelector('#modal-select-audio').selectedIndex;
        setAlarm = [TITLE, HOUR, MINUTE, AUDIO_IDX, isLoop];

        document.querySelector('#alarm-title').textContent = TITLE;
        document.querySelector('#content-alarm-time').textContent = timeFormatter([HOUR, MINUTE]);
        titleElement.textContent = `${timeFormatter([HOUR, MINUTE])} - Online Alarm Clock`;
        document.querySelector('#row-display-alarm').style.display = 'block';
        document.querySelector('#btn-set-alarm').style.display = 'none';
        setAlarmTime = [HOUR, MINUTE];

        historyAlarmList.unshift(setAlarm);
        if (historyAlarmList.length > 10) {
            historyAlarmList.pop();
        } else {
            let tbElement = document.querySelector('#tables-history > tbody');
            tbElement.style.fontFamily = (isDigitalFont) ? 'Digital Italic' : 'Open Sans';
            tbElement.insertBefore(createHistoryAlarm(historyAlarmList[0], 0), tbElement.firstChild);
        }
        saveLocalstorage();
    }
})

document.querySelector('#btn-stop-alarm').onclick = () => {
    document.querySelector('#row-display-alarm').style.display = 'none';
    document.querySelector('#btn-set-alarm').style.display = 'inline-block';
    if (!isSpecAlarm) titleElement.textContent = 'Online Alarm Clock - Digital Alram Clock - Wake up';
    setAlarmTime = [];
    if (isSpecAlarm) {
        isSpecAlarm = false;
        document.querySelector('#btn-test-alarm2').style.display = 'inline-block';
        document.querySelector('#btn-add-alarm2').style.display = 'inline-block';
    } else {
        localStorage.removeItem('setAlarm');
        history.pushState('', '', '/');
        document.querySelector('#location-name').value = location.href;
    }
}

// embed code btn click event
document.querySelector('#embed-code').addEventListener('click', (e) => {
    //modal preview - show iframe
    let defaultFrameSize = 5;

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

        let alarmQuery = [];
        if (localStorage.getItem('setAlarm')) {
            setAlarm = JSON.parse(localStorage.getItem('setAlarm'));
            alarmQuery = (isHash) ? `&t=${setAlarm[0]}&h=${setAlarm[1]}&m=${setAlarm[2]}&aId=${setAlarm[3]}&l=${setAlarm[4]}` : `&aId=${setAlarm[3]}&l=${setAlarm[4]}`;
        }
        const IFRAME_URL = (isHash) ? `/embed/alarmclock/#` : `/embed/${CUR_URL.split('/')[URL_LENGTH - 2]}/#`;
        previewIframe = document.querySelector('#modal-preview')
        previewIframe.width = FRAME_SIZES[size][0];
        previewIframe.height = FRAME_SIZES[size][1];
        previewIframe.src = encodeURI(`${IFRAME_URL}dF=${isDigitalFont ? 1 : 0}&ap=${isAmpm ? 1 : 0}&dD=${isDateDisplay ? 1 : 0}&dM=${isDarkMode ? 1 : 0}&cId=${colorId}${alarmQuery}`);
        embedUrlElement = document.querySelector('#embedURL');
        const TEXTAREA_URL = `<iframe width="${FRAME_SIZES[size][0]}"height="${FRAME_SIZES[size][1]}" src=${previewIframe.src}"allowfullscreen="true"></iframe>`
        embedUrlElement.textContent = TEXTAREA_URL;

        //modal dispose action
        document.querySelector('#embed-modal').addEventListener('hidden.bs.modal', () => {
            embedElement.value = 5; //embed size - default
            previewIframe.src = '';
        });
    }
});

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
    CHILDHOOD, CHRISTMAS, CHURCH_BELL, CRICKET, HAPPY_BIRTHDAY, ORGAN, PHONE_BELL_1,
    PHONE_BELL_2, PIANO, PIZZICATO, POLICE_SIREN, SCHOOL_BELL, XYLOPHONE_1, XYLOPHONE_2,
];

//recently used alarm time
initTableAlarmHistory();

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

document.querySelector('#location-name').value = location.href;
//scroll to the top of the document
btnBackToTop.addEventListener('click', backToTop);

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

    localStorage.setItem('historyAlarm', JSON.stringify(historyAlarmList));
    localStorage.setItem('displayConfig', JSON.stringify(localStorageConfig));
}


// create a list of 100 numbers