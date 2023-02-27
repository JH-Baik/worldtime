/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ##################
 *   embed_clock.js
 * ##################
 */

const CANONICAL = document.querySelector('[rel="canonical"]');
let path = location.pathname.slice(6,-1);
CANONICAL.href = `https://${location.host+path}/`;

let colorCode = ['', '#1979d2', '#388e3c', '#d32f2f', '#ff9900'];
getEmbedDataList = location.hash.substring(1).split('&');
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

const localLangCode = 'en';

function getTime() {
    const now = new Date();
    let timeLabel = ampm ? 'h12' : 'h23';
    const optionsTime = { hourCycle: timeLabel, hour: 'numeric', minute: '2-digit', second: '2-digit', };
    const optionsDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const time = now.toLocaleTimeString(localLangCode, optionsTime);
    const today = now.toLocaleDateString(localLangCode, optionsDate);

    timeElement.textContent = time;
    titleElement.textContent = `${time}\u00a0Online Clock`;
    dateElement.textContent = today;
}

// change number 1 digit to 2 digit
function withZero(num) {
    num = num > 9 ? num : `0${num}`;
    return num;
}
