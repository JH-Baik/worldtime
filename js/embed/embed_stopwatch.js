/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ######################
 *   embed_stopwatch.js
 * ######################
 */

let colorCode = ['', '#1979d2', '#388e3c', '#d32f2f', '#ff9900'];

const CANONICAL = document.querySelector('[rel="canonical"]');
let path = location.pathname.slice(6, -1);
CANONICAL.href = `https://${location.host + path}/`;

getEmbedDataList = location.hash.substring(1).split('&');
history.replaceState({}, document.title, ".");
let hashToObject = new Object();
getEmbedDataList.forEach(element => {
    dataSplit = element.split('=');
    hashToObject[dataSplit[0]] = dataSplit[1];
});

let decimalPointDigit = parseInt(hashToObject.dpD);
let colorId = parseInt(hashToObject.cId);
let start = 0;

if (hashToObject.start) {
    localStorage.removeItem('iswdT');
    localStorage.setItem('istart', hashToObject.start);
}
let swdT = 0;
if (hashToObject.swdT) {
    localStorage.removeItem('istart');
    localStorage.setItem('iswdT', hashToObject.swdT);
};

if (hashToObject.lr) {
    localStorage.setItem('ilr', hashToObject.lr)
};

let darkMode = JSON.parse(hashToObject.dM);
let digitalFont = JSON.parse(hashToObject.dF);
let titleElement = document.querySelector('#main-title');
let mainDisplayTitleElement = document.querySelector('.main-display-title');
let timeElement = document.querySelector('#main-time');
let digitElemnt = document.querySelector('#digit-point');
let dateElement = document.querySelector('#main-date');

//initial running function
(function () {
    if (!darkMode) document.body.classList.remove('dark-mode');
    colorCode[0] = (darkMode) ? '#dee2e6' : '#495057';
    timeFontStyle = (digitalFont) ? 'Digital Italic' : 'Open Sans';
    document.querySelector('.colored').style.color = colorCode[colorId];
    document.querySelector('.embed-icon').style.color = colorCode[colorId];
    mainDisplayTitleElement.style.fontSize = `10vmin`;
    timeElement.style.fontSize = `18vmin`;
    timeElement.style.fontFamily = timeFontStyle;
    digitElemnt.style.fontSize = `13vmin`;
    digitElemnt.style.fontFamily = timeFontStyle;
    dateElement.style.fontSize = `13vmin`;
    dateElement.style.fontFamily = timeFontStyle;
})();

//get stopwatch
let days = hours = minutes = seconds = milliSeconds = lapT = '0';
let tT = (localStorage.getItem('ilr')) ? JSON.parse(atob(localStorage.getItem('ilr')))[0][1] : 0;
let mainDisplayElement = document.querySelector('#main-time');
let dpDisplayElement = document.querySelector('#digit-point');

let btnStart = document.getElementById("btn-start");
let btnStop = document.getElementById("btn-stop");
let btnReset = document.getElementById("btn-reset");
let btnLap = document.getElementById("btn-lap");
let Interval;
let laps = [];

if (localStorage.getItem('ilr')) {
    laps = JSON.parse(atob(localStorage.getItem('ilr')));
    for (i = 0; i < laps.length + 1; i++) {
        createTableRecord();
        // laps.push(HISTORY_RECORDS[i]);
    }
}

stopwatchDisplay()
btnStart.onclick = function () {
    clearInterval(Interval);

    start = (localStorage.getItem('iswdT')) ? Date.now() - parseInt(atob(localStorage.getItem('iswdT'))) : Date.now();

    localStorage.setItem('istart', btoa(start));
    localStorage.removeItem('iswdT');
    Interval = setInterval(startTimer, 9);
};

btnStop.onclick = function () {
    clearInterval(Interval);
    btnStart.style.display = 'inline-block';
    btnReset.style.display = 'inline-block';
    btnLap.style.display = 'none';
    btnStop.style.display = 'none';

    localStorage.setItem('iswdT', btoa(dT));
    localStorage.removeItem('istart');
};

btnLap.onclick = function () {
    tT = dT;
    laps.unshift([lapT, dT]);
    localStorage.setItem('ilr', btoa(JSON.stringify(laps)));
    createTableRecord();
}

btnReset.onclick = function () {
    clearInterval(Interval);
    localStorage.removeItem('iswdT');
    localStorage.removeItem('istart');
    days = hours = minutes = seconds = milliSeconds = dT = lapT = tT = start = '0';
    localStorage.removeItem('ilr');
    laps = [];
    // document.querySelector('#tables-laps > tbody').textContent = '';
    removeElements = document.querySelectorAll('#tables-laps > tbody > tr');
    for (i = 0; i < removeElements.length; i++) {
        removeElements[i].remove();
    }

    //create table record
    createTableRecord();
    stopwatchDisplay();
    document.querySelector('#btn-reset').disabled = true;
};

function createTableRecord() {
    tbElement = document.querySelector('#tables-laps > tbody');
    tbElement.style.fontFamily = (digitalFont) ? 'Digital Italic' : 'Open Sans';
    tbElement.style.color = colorCode[colorId];
    newLapRecord = document.createElement('tr');
    newLapRecord.setAttribute('class', 'laps-record digital-font colored');
    newLapRecord.innerHTML = `<td class='text-center'id="lapNo"></td><td id="lapTime"></td><td id="lapAcc"></td>`;
    tbElement.appendChild(newLapRecord);
}

if (localStorage.getItem('istart')) {
    start = parseInt(atob(localStorage.getItem('istart')));
    Interval = setInterval(startTimer, 9);
} else if (localStorage.getItem('iswdT')) {
    start = Date.now() - parseInt(atob(localStorage.getItem('iswdT')));
    startTimer();
    btnStart.style.display = 'inline-block';
    btnReset.style.display = 'inline-block';
    btnLap.style.display = 'none';
    btnStop.style.display = 'none';
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
    document.querySelector('#card-laps').style.display = (!localStorage.getItem('ilr')) ? 'none' : 'block';
    if (localStorage.getItem('ilr')) {
        document.querySelector('#card-laps').style.display = 'block';
        document.querySelector('#tables-laps tr').style.color = colorCode[colorId];
        lapsRecords = JSON.parse(atob(localStorage.getItem('ilr')));
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

