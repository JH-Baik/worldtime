/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ################
 *   stopwatch.js
 * ################
 */

let isTitleFlag = false;
setTimeout(() => {
    isTitleFlag = true;
}, 5000);

const colorNames = {
    mono: [0, ''],
    blue: [1, '#1979d2'],
    green: [2, '#388e3c'],
    red: [3, '#d32f2f'],
    orange: [4, '#ff9900'],
};

WINDOW_LOCATION_HREF = 'https://worldtime247.com' + location.pathname;

if (location.hash) {
    getEmbedDataList = location.hash.substring(1).split('&');
    history.replaceState({}, document.title, ".");
    let hashToObject = new Object();
    getEmbedDataList.forEach(element => {
        dataSplit = element.split('=');
        hashToObject[dataSplit[0]] = dataSplit[1];
    });

    if (hashToObject.start) {
        localStorage.removeItem('swdT');
        localStorage.setItem('start', hashToObject.start);
    }

    if (hashToObject.swdT) {
        localStorage.removeItem('start');
        localStorage.setItem('swdT', hashToObject.swdT);
    };

    if (hashToObject.lr) {
        localStorage.setItem('lr', hashToObject.lr);
    };

    if (hashToObject.dpD) {
        localStorage.setItem('dpD', hashToObject.dpD);
    };

    getTimeQuery();
}

let decimalPointDigit = (localStorage.getItem('dpD')) ? parseInt(localStorage.getItem('dpD')) : 3; //stopwatch decimal point digit
document.querySelectorAll('#dropdown-menu-dp > input').forEach(e => {
    if (e.value == decimalPointDigit) e.checked = true;
})

let lang = navigator.language || navigator.userLanguage;

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
    isRobot = false;
    isDarkMode = document.getElementById('btnswitch-dark-mode').checked;
    colorId = colorCheckedId();
    fontScale = 1;

    function colorCheckedId() {
        var colorButtons = document.getElementsByName('btncolor');
        for (var i = 0; i < colorButtons.length; i++) {
            if (colorButtons[i].checked == true) {
                return colorButtons[i].value;
            }
        }
    }
}

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

    // saveLocalstorage();
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
    const fontSizeObj = { time: [12, 14, 16, 20], digit: [8, 9, 10, 11], date: [4, 5, 6, 7], title: [3, 3.5, 4, 4.5] };
    // document.querySelector('.main-display-title').style.fontSize = `${fontSizeObj.title[fontScale]}vmin`;
    document.querySelector('#main-time').style.fontSize = `${fontSizeObj.time[fontScale]}vmin`;
    document.querySelector('#digit-point').style.fontSize = `${fontSizeObj.digit[fontScale]}vmin`;
    document.querySelector('#main-date').style.fontSize = `${fontSizeObj.date[fontScale]}vmin`;

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
        if (e.target.id.substr(0, 8) == 'btncolor') stringColorChangeToggle(e.target.id);
        if (e.target.id.substr(0, 12) == 'decimalpoint') {
            decimalPointDigit = e.target.value;
            stopwatchDisplay();
        }

        saveLocalstorage();
        getTimeQuery();
    });
});

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
}

//nav darkmode switch
document.querySelector('#btn-darkmode-true').addEventListener('click', () => { btnDarkThemeChangeToggle() });
document.querySelector('#btn-darkmode-false').addEventListener('click', () => { btnDarkThemeChangeToggle() });

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

// embed code btn click event
document.querySelector('#embed-code').addEventListener('click', (e) => {
    //modal preview - show iframe
    const IFRAME_URL = `/embed${location.pathname}#`;
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

        previewIframe = document.querySelector('#modal-preview')
        previewIframe.width = FRAME_SIZES[size][0];
        previewIframe.height = FRAME_SIZES[size][1];
        let addInfo = ''
        if (localStorage.getItem('swdT')) {
            addInfo = `&swdT=${localStorage.getItem('swdT')}`;
        } else if (localStorage.getItem('start')) {
            addInfo = `&start=${localStorage.getItem('start')}`;
        }
        if (localStorage.getItem('lr')) {
            addInfo += `&lr=${localStorage.getItem('lr')}`;
        }
        previewIframe.src = `${IFRAME_URL}dF=${isDigitalFont ? 1 : 0}&dpD=${decimalPointDigit}&dM=${isDarkMode ? 1 : 0}&cId=${colorId}${addInfo}`;
        embedUrlElement = document.querySelector('#embedURL');
        const TEXTAREA_URL = `<iframe width="${FRAME_SIZES[size][0]}"height="${FRAME_SIZES[size][1]}" src="${previewIframe.src}dF=${isDigitalFont ? 1 : 0}&dM=${isDarkMode ? 1 : 0}&cId=${colorId}${addInfo}"allowfullscreen="true"></iframe>`
        embedUrlElement.textContent = TEXTAREA_URL;

        //modal dispose action
        document.querySelector('#embed-modal').addEventListener('hidden.bs.modal', () => {
            embedElement.value = 4; //embed size - default
            localStorage.removeItem('istart');
            localStorage.removeItem('ilr');
            localStorage.removeItem('iswdT');
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

let titleElement = document.querySelector('#main-title');
let timeElement = document.querySelector('#main-time');
let dateElement = document.querySelector('#main-date');

if (localStorage.getItem('displayConfig')) {
    getLocalData = JSON.parse(localStorage.getItem('displayConfig'));
}

//get stopwatch
let days = hours = minutes = seconds = milliSeconds = dT = lapT = start = '0';
let tT = (localStorage.getItem('lr')) ? JSON.parse(window.atob(localStorage.getItem('lr')))[0][1] : 0;
let mainDisplayElement = document.querySelector('#main-time');
let dpDisplayElement = document.querySelector('#digit-point');

let btnStart = document.getElementById("btn-start");
let btnStop = document.getElementById("btn-stop");
let btnReset = document.getElementById("btn-reset");
let btnLap = document.getElementById("btn-lap");
let Interval;
let laps = [];

if (localStorage.getItem('lr')) {
    laps = JSON.parse(window.atob(localStorage.getItem('lr')));
    for (i = 0; i < laps.length + 1; i++) {
        createTableRecord();
        // laps.push(HISTORY_RECORDS[i]);
    }
}

stopwatchDisplay();
function getTimeQuery() {
    let timeQuery;
    if (localStorage.getItem('swdT')) {
        timeQuery = `&swdT=${localStorage.getItem('swdT')}`;
    } else if (localStorage.getItem('start')) {
        timeQuery = `&start=${localStorage.getItem('start')}`;
    }
    if (localStorage.getItem('lr')) {
        timeQuery += `&lr=${localStorage.getItem('lr')}`;
    }
    document.querySelector('#location-name').value = (timeQuery) ? `${WINDOW_LOCATION_HREF}/#${timeQuery}&dpD=${localStorage.getItem('dpD')}` : `${WINDOW_LOCATION_HREF}`;
    return location.href = `/stopwatch/#${timeQuery}&dpD=${localStorage.getItem('dpD')}`;
}
btnStart.onclick = function () {
    clearInterval(Interval);

    start = (parseInt(window.atob(localStorage.getItem('swdT')))) ? Date.now() - parseInt(window.atob(localStorage.getItem('swdT'))) : Date.now();
    localStorage.setItem('start', window.btoa(start));
    localStorage.removeItem('swdT');
    Interval = setInterval(startTimer, 1);
    getTimeQuery();
};

btnStop.onclick = function () {
    clearInterval(Interval);
    btnStart.style.display = 'inline-block';
    btnReset.style.display = 'inline-block';
    btnLap.style.display = 'none';
    btnStop.style.display = 'none';

    localStorage.setItem('swdT', window.btoa(dT));
    localStorage.removeItem('start');
    getTimeQuery();
};

btnLap.onclick = function () {
    tT = dT;
    laps.unshift([lapT, dT]);
    localStorage.setItem('lr', window.btoa(JSON.stringify(laps)));
    createTableRecord();
    getTimeQuery();
}

btnReset.onclick = function () {
    clearInterval(Interval);
    localStorage.removeItem('swdT');
    localStorage.removeItem('start');
    days = hours = minutes = seconds = milliSeconds = dT = lapT = tT = start = '0';
    localStorage.removeItem('lr');
    laps = [];
    removeElements = document.querySelectorAll('#tables-laps > tbody > tr');
    for (i = 0; i < removeElements.length; i++) {
        removeElements[i].remove();
    }

    //create table record
    createTableRecord();
    stopwatchDisplay();
    document.querySelector('#btn-reset').disabled = true;
    location.href = '/stopwatch/#';
    document.querySelector('#location-name').value = `${WINDOW_LOCATION_HREF}`;
};

function createTableRecord() {
    tbElement = document.querySelector('#tables-laps > tbody');
    tbElement.style.fontFamily = (isDigitalFont) ? 'Digital Italic' : 'Open Sans';
    newLapRecord = document.createElement('tr');
    newLapRecord.setAttribute('class', 'laps-record digital-font');
    newLapRecord.innerHTML = `<td class='text-center'id="lapNo"></td><td id="lapTime"></td><td id="lapAcc"></td>`;
    tbElement.appendChild(newLapRecord);
}

if (parseInt(window.atob(localStorage.getItem('start')))) {
    start = parseInt(window.atob(localStorage.getItem('start')));
    Interval = setInterval(startTimer, 1);
    getTimeQuery();
} else if (parseInt(window.atob(localStorage.getItem('swdT')))) {
    start = Date.now() - parseInt(window.atob(localStorage.getItem('swdT')));
    startTimer();
    btnStart.style.display = 'inline-block';
    btnReset.style.display = 'inline-block';
    btnLap.style.display = 'none';
    btnStop.style.display = 'none';
    getTimeQuery();
}

function startTimer() {
    btnStart.style.display = 'none';
    btnReset.style.display = 'none';
    document.querySelector('#btn-reset').disabled = false;
    btnLap.style.display = 'inline-block';
    btnStop.style.display = 'inline-block';
    dT = Date.now() - start;
    lapT = dT - tT;

    [milliSeconds, seconds, minutes, hours, days] = millisecondsToTimeUnit(dT);
    stopwatchDisplay();
}

function millisecondsToTimeUnit(t) {
    ms = t % 1000;
    s = (parseInt(t / 1000) % 60).toString();
    m = (parseInt(t / 1000 / 60) % 60).toString();
    h = ((t / 1000) > 3500) ? parseInt(t / 1000 / 60 / 60) % 24 : 0;
    d = ((t / 1000) > 3500 * 24) ? parseInt(t / 1000 / 60 / 60 / 24) : 0;
    return [ms, s, m, h, d];
}


function stopwatchDisplay() {
    if (localStorage.getItem('lr')) {
        document.querySelector('#card-laps').style.display = 'block';
        lapsRecords = JSON.parse(window.atob(localStorage.getItem('lr')));
        trs = document.querySelectorAll('#tables-laps > tbody > tr');
        let count = 0;
        for (let i = lapsRecords.length; i > 0; i--) {

            tdHead = trs[0].querySelectorAll('td');
            tdHead[0].textContent = count + 2;
            [ms, s, m, h, d] = millisecondsToTimeUnit(lapT);
            tdHead[1].textContent = displayFractionsType(m, s, ms, decimalPointDigit, d, h);
            tdHead[2].textContent = displayFractionsType(minutes, seconds, milliSeconds, decimalPointDigit, days, hours);

            tds = trs[count + 1].querySelectorAll('td');
            tds[0].textContent = i;
            [ms, s, m, h, d] = millisecondsToTimeUnit(lapsRecords[count][0]);
            tds[1].textContent = displayFractionsType(m, s, ms, decimalPointDigit, d, h);
            [ms, s, m, h, d] = millisecondsToTimeUnit(lapsRecords[count][1]);
            tds[2].textContent = displayFractionsType(m, s, ms, decimalPointDigit, d, h);
            count++;
        }
    } else {
        document.querySelector('#card-laps').style.display = 'none';
    }
    decimalPointDigit = parseInt(decimalPointDigit);
    mainDisplayElement.textContent = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    let digitPoint = milliSeconds.toString().padStart(3, '0');
    dateElement.textContent = (hours !== 0 || days !== 0) ? hourDayFormatter(hours, days, 'Passed') : '';
    dpDisplayElement.textContent = (decimalPointDigit !== 0) ? '.' + digitPoint.slice(0, decimalPointDigit) : '';

    if (isTitleFlag) titleElement.textContent = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}\u00a0Online Stopwatch - Accurate Stopwatch`;
}

function hourDayFormatter(h, d, ago) {
    if (h == 0 && d == 0) return;
    let dh = '';
    if (d) {
        dh = (d < 2) ? `${d} day ` : `${d} days `
    }
    if (h) {
        dh = (h < 2) ? dh + `${h} Hr ` : dh + `${h} Hrs `
    }

    return (dh) ? dh + ago : '';
}

function displayFractionsType(m, s, ms, dpd, d, h) {
    if (dpd == 0) {
        return hourDayFormatter(h, d, '') == undefined ? `${m.padStart(2, '0')}:${s.padStart(2, '0')}` :
            hourDayFormatter(h, d, '') + `${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
    } else {
        const digitPoint = ms.toString().padStart(3, '0');
        return hourDayFormatter(h, d, '') == undefined ? `${m.padStart(2, '0')}:${s.padStart(2, '0')}.${digitPoint.slice(0, dpd)}` :
            hourDayFormatter(h, d, '') + `${m.padStart(2, '0')}:${s.padStart(2, '0')}.${digitPoint.slice(0, dpd)}`;
    }
}

//current location(http address)
document.querySelector('#location-name').value = 'https://worldtime247.com/' + location.pathname;

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

    localStorage.setItem('displayConfig', JSON.stringify(localStorageConfig));
    localStorage.setItem('dpD', decimalPointDigit);
}
