const express = require('express');
const router = express.Router();
const fs = require('fs');
const { registerFont, createCanvas, Image } = require('canvas');
registerFont('./assets/fonts/OpenSans.ttf', { family: 'myFont' });
const canvasLocal = createCanvas(968, 504);
const imgName = 'clock';
const { CITY_DATA } = require('../route-data/citydata.js');
const { tzDatum } = require('../route-data/tzdata.js');

const isDEPLOY = (fs.readFileSync('./isdeploy.txt', { encoding: 'utf8', flag: 'r' }) != 'true') ? false : true;
let googleTagAds = ['','',];
if (isDEPLOY) {
    googleTagAds[0] = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-JBTJPVR3JD"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-JBTJPVR3JD');
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2489741092366129" crossorigin="anonymous"></script>`;
    
    googleTagAds[1] = `
    <style>
        .ad_responsive_1 { width: 336px;height: 280px; }
        @media(min-width: 500px) { .ad_responsive_1 { width: 468px;height: 60px; } }
        @media(min-width: 800px) { .ad_responsive_1 { width: 728px;height: 90px; } }
        @media(min-width: 1200px) { .ad_responsive_1 { width: 970px;height: 90px; } }
        @media(min-width: 1400px) { .ad_responsive_1 { width: 1200px;height: 90px; } }
    </style>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2489741092366129"
            crossorigin="anonymous"></script>
    <ins class="adsbygoogle ad_responsive_1"
        style="display:inline-block;"
        data-ad-client="ca-pub-2489741092366129"
        data-ad-slot="5332156109"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`
}

const headLink = fs.readFileSync('./routes/htmlParts/head-link.html', { encoding: 'utf8', flag: 'r' });
const colorMenu = fs.readFileSync('./routes/htmlParts/color-menu.html', { encoding: 'utf8', flag: 'r' });
const scrMenu = fs.readFileSync('./routes/htmlParts/scr-menu.html', { encoding: 'utf8', flag: 'r' });
const shareSns = fs.readFileSync('./routes/htmlParts/share-sns.html', { encoding: 'utf8', flag: 'r' });

const LANG = 'en';
let timeLabel = 'h12'; //'h23'
const OPTIONS_TIME = { hourCycle: timeLabel, hour: 'numeric', minute: '2-digit', second: '2-digit', };
const OPTIONS_DATE = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

const CITES_QTY = 40;
let tzSimilarEle = ['','','',''];

function getTzItems(tzData) {
    const EVENT_DATE = new Date();
    const FORMATTER = Intl.DateTimeFormat('en', {
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

    tzData.localOffset = Math.round(getOffset(partsOffset(FORMATTER, EVENT_DATE), EVENT_DATE));
}

function appendSimilarTimeZone(cities) {
    cities.sort(function compare(a, b) {
        if (a.cc > b.cc) return 1;
        if (a.cc < b.cc) return -1;
        return 0;
    });

    for (let i = 0; i < cities.length; i++) {
        const HREF = `/clock/${cities[i].cc}-${cities[i].city}/`.toLowerCase().replace(/\s/gi, '-');
        const aText = `${cities[i].city}, ${cities[i].ctr}`;
        tzSimilarEle[i%4] += `<tr><td><a href="${HREF}" aria-label="Current time in ${cities[i].city}">${aText}</a></td></tr>`;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.splice(40, array.length - CITES_QTY);
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
    return `${signPlusMinus}${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
}

function getLocalDayCalc(date, localOffset) {
    const LOCAL_DAY = Math.floor(date.getTime() / 1000);
    const USER_DAY = Math.floor(new Date() / 1000);
    let dayNames = ['Yesterday', 'Today', 'Tomorrow'];
    let dayName = dayNames[1];
    if (date.getDate() !== new Date().getDate()) dayName = LOCAL_DAY > USER_DAY ? dayNames[2] : dayNames[0];

    return localOffset % 60 ? `${dayName},\u00a0${numToTime(localOffset)}` : `${dayName},\u00a0${localOffset / 60}\u00a0hour`;
}

router.get('/', (req, res) => {
    const URL_PATH = req._parsedOriginalUrl.pathname
    const pathName = URL_PATH.split('/')[2].split('-');
    const CC = pathName.shift();
    const CITY = pathName.join(' ');
    const img = new Image();

    for (const data of tzDatum) {
        data.city.replace(/[_]/, ' ');
        if (data.city.toLocaleLowerCase() == CITY) {
            var tzData = data;
        }
        getTzItems(data);
    }

    const FORMATTER_LOCAL_TIME_NAME = Intl.DateTimeFormat('en-US', { // en-US important!
        timeZone: tzData.tzName,
        timeZoneName: 'long',
    });
    localTimeName = FORMATTER_LOCAL_TIME_NAME.format(new Date()).split(' ');
    localTimeName.shift();
    localTimeNameString = localTimeName.join(' ') + ` (UTC ${numToTime(tzData.localOffset.toFixed(0))})`;
    localStdTz = tzData.tzName + ` (UTC/GMT ${numToTime(tzData.localOffset.toFixed(0))})`;

    diffOffset = new Date().getTimezoneOffset()+tzData.localOffset;
    const LOCAL_DATE = new Date(new Date().getTime() + diffOffset * 60 * 1000);
    localTzOffset = getLocalDayCalc(LOCAL_DATE, diffOffset);

    const TIME = LOCAL_DATE.toLocaleTimeString(LANG, OPTIONS_TIME);
    const DATE = LOCAL_DATE.toLocaleDateString(LANG, OPTIONS_DATE);

    let similarTimeZone = [];
    for (i = 0; i < tzDatum.length; i++) {
        if (Math.abs(tzDatum[i].localOffset - tzData.localOffset) <= 60 && tzDatum[i].city !== tzData.city) similarTimeZone.push(tzDatum[i])
    }

    if (CITES_QTY < similarTimeZone.length) shuffle(similarTimeZone);
    appendSimilarTimeZone(similarTimeZone);

    img.onload = () => {
        flag = `<img class="country-flag-large" id="main-display-title-flag" src="${URL_PATH}${tzData.cc}.jpg" width="32px" height="21px" alt="flag" aria-label="${tzData.ctr} flag"></img>`
    }
    img.onerror = err => { throw err }
    img.src = `./assets/icons/country-icon/${tzData.cc}.svg`;

    let cityData = '';
    for (content of CITY_DATA) {
        if (content[0].replace(/[_]/gi, ' ').toLowerCase() === CITY) {
            for (let i = 1; i < content.length - 1; i++) cityData += `<p id = 'city-information-p${i}'>${content[i]}</p>`;

            var cite = content[content.length - 1];
            if (CITY === 'dokdo') {
                cityData += `<p><a href="${cite}" target="blank" id="outsite-link" aria-label="The Korean Government’s Basic Position on Dokdo">From The Korean Government’s Basic Position on Dokdo</a><p>`;
            } else {
                cityData += `<p><a href="${cite}" target="blank" id="outsite-link" aria-label="wikipedia">From Wikipedia</a><p>`;
            }
            break;
        }
    }

    const head =
        `<meta name="description" content="What time is it in ${tzData.city} now? Exact current time in ${tzData.city}, ${tzData.ctr} now. You can check the accurate time for all country in the world with an animated screen.">
            <meta name="keywords" content="${tzData.city} current time, ${tzData.ctr} time now, current time, time now, exact time, animation clock, online clock">
            <meta property="og:title" content="Current Time in ${tzData.city}, ${tzData.ctr} - Online Animation Clock">
            <meta property="og:url" content="https://worldtime247.com${URL_PATH}">
            <meta property="og:description" content="What time is it in ${tzData.city} now? Exact current time in ${tzData.city}, ${tzData.ctr} now. You can check the accurate time for all country in the world with an animated screen.">
            <meta property="og:type" content="website">
            <meta property="og:site_name" content="WorldTime247.com">
            <meta property="og:image" content="https://worldtime247.com${URL_PATH}image.png">
            <meta property="og:image:width" content="968">
            <meta property="og:image:height" content="504">
            <link rel="canonical" href="https://worldtime247.com${URL_PATH}">
            <link rel="alternate" type="embed" href="https://worldtime247.com/embed${URL_PATH}">`;
    

    const html = `
<!DOCTYPE html>
<html lang="${LANG}" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        ${head}
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@worldtime247">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#fff">
        <title id="main-title">Current Time in ${tzData.city}, ${tzData.ctr} - Online Animation Clock</title>
        ${headLink}
        <link rel="stylesheet" href="/css/styles.css">
        <link rel="stylesheet" href="/css/icons.css">
        ${googleTagAds[0]}
    </head>

    <body class="dark-mode">
        <!-- create-card modal -->
        <div class="modal fade" id="clock-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-title-label" aria-hidden="true" aria-describedby="clock modal" style="display:none">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h3 class="modal-title" id="modal-title-label">Add Clock</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3 mt-3">
                                <label for="modal-select-country" class="form-label">Country</label>
                                <select class="form-select form-select-md mb-5" id="modal-select-country" aria-label="select-country" required>
                                    <option selected disabled value="">Choose Country</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="modal-select-timezone" class="form-label">Standard Time Zone</label>
                                <select class="form-select form-select-md mb-5" id="modal-select-timezone" aria-label="select-timezone" required>
                                    <option selected disabled value="">Choose City - Time Zone</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="modal-input-title">Title</label>
                                <input type="text" class="form-control form-control-md" id="modal-input-title" placeholder="text" value="My mini clock">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="close-modal" class="btn btn-secondary btn-custom" data-bs-dismiss="modal">Close</button>
                            <button type="button" id="createNewCard" class="btn btn-outline-primary btn-custom" data-bs-dismiss="modal" disabled>Add
                                Clock</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- iframe link code modal -->
        <div class="modal fade" id="embed-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-embed-title-label" aria-hidden="true" aria-describedby="iframe embed code modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h3 class="modal-embed-title" id="modal-embed-title-label">Embed Code</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3 mt-2">
                                <label for="modal-select-size" class="form-label">Size</label>
                                <select class="form-select form-select-md mb-4" id="modal-select-clocksize" aria-label="select-country" required>
                                    <option value="1">200 x 120</option>
                                    <option value="2">240 x 130</option>
                                    <option value="3">280 x 150</option>
                                    <option value="4" selected>340 x 200</option>
                                    <option value="5">360 x 240</option>
                                    <option value="6">360 x 270</option>
                                    <option value="7">510 x 310</option>
                                    <option value="8">640 x 360</option>
                                    <option value="9">1280 x 720</option>
                                    <option value="0">Custom</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between" id="embed-html-textarea">
                                    <div for="modal-text-input" class="mb-2">HTML</div>
                                    <a id="clipboard-copy" role="button" role="img" aria-label="clipboard copy">
                                        <i id="icon-clipboard" class="bi bi-clipboard" data-bs-toggle="tooltip" aria-label="clipboard copy icon" data-bs-placement="top" data-bs-trigger="hover"
                                            title="Copy"></i>
                                        <i id="icon-copied" class="bi bi-check2" data-bs-toggle="tooltip" role="img" aria-label="copied icon" data-bs-placement="top" data-bs-trigger="hover"
                                            title="Copied" style="display: none;"></i>
                                    </a>
                                </div>
                                <div class="alert alert-primary alert-dismissible fade show text-center" id="clipboard-copy-failed" role="alert" style="display:none">
                                    <strong>Clipboard access denied.</strong><br>Right-click to copy the code.
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                                <textarea spellcheck="false" class="form-control" id="embedURL" rows="5"></textarea>
                            </div>
                            <div class="mb-2">
                                <label for="modal-preview" class="form-label">Preview</label>
                                <div class="iframe-stage">
                                    <iframe id="modal-preview" src="" scrolling="yes" allowfullscreen="true"></iframe>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="close-modal" class="btn btn-secondary btn-custom" data-bs-dismiss="modal">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="fullscreen-display" style="display: none;"></div>
        <div class="sb-nav-fixed" style="display: block;">
            <nav class="sb-topnav navbar navbar-expand">
                <!-- Navbar Brand-->
                <a class="navbar-brand ps-1" href="/" role="button" type="button">
                    <img src="/assets/imgs/logo.png" width="120px" height="60px" alt="Home" aria-label="home">
                </a>
                <!-- Sidebar Toggle-->
                <button class="btn btn-link btn-lg order-1 order-lg-0 me-5 me-lg-0" id="sidebarToggle" role="button" aria-label="sidebar toggle" href="#!" data-bs-toggle="tooltip"
                    data-bs-placement="right" data-bs-trigger="hover" title="Sidebar Toggle">
                    <i class="bi bi-list" role="img" aria-label="navigation menu"></i>
                </button>
                <!-- Navbar Search-->
                <form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"></form>
                <!-- Navbar-->
                <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li class="over-width-361">
                        <a class="nav-link-top rotate-l-icon" id="btn-darkmode-true" role="button" type="button" aria-label="BG black"
                            data-bs-toggle="tooltip" data-bs-placement="left" title="Dark Mode" data-bs-trigger="hover">
                            <div class="nav-link-icon">
                                <i class="bi bi-brightness-low-fill" role="img" aria-label="dark mode on"></i>
                            </div>
                        </a>
                        <a class="nav-link-top rotate-r-icon" id="btn-darkmode-false" role="button" type="button" aria-label="BG white"
                            data-bs-toggle="tooltip" data-bs-placement="left" title="Light Mode" data-bs-trigger="hover">
                            <div class="nav-link-icon">
                                <i class="bi bi-brightness-high" role="img" aria-label="dark mode off"></i>
                            </div>
                        </a>
                    </li>
                    <!-- tools menu start -->
                    <li class="nav-item dropdown">
                        <a class="nav-link-top" id="navbarDropdownTools" href="#" role="button" type="button" aria-label="tools" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                            <i class="bi bi-tools" role="img" aria-label="display tools" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-trigger='hover' title="Setting"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="navbarDropdown">
                            <li class="dropdown-item">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="btnswitch-digital-font" checked>
                                    <label class="form-check-label" for="btnswitch-digital-font">Digital</label>
                                </div>
                            </li>
                            <li class="dropdown-item">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="btnswitch-am-pm" checked>
                                    <label class="form-check-label" for="btnswitch-am-pm">12Hour(am/pm)</label>
                                </div>
                            </li>
                            <li class="dropdown-item">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="btnswitch-date-display" checked>
                                    <label class="form-check-label" for="btnswitch-date-display">Date Display</label>
                                </div>
                            </li>
                            <li class="dropdown-item">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="btnswitch-dark-mode" checked>
                                    <label class="form-check-label" for="btnswitch-dark-mode">Dark Mode</label>
                                </div>
                            </li>
                            <li class="dropdown-item">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="btnswitch-dancing-robot">
                                    <label class="form-check-label" for="btnswitch-dancing-robot">Dancing Robot</label>
                                </div>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            ${colorMenu}
                        </ul>
                    </li>
                </ul>
            </nav>
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                        <div class="sb-sidenav-menu">
                            <div class="nav">
                                <a class="nav-link" href="/"><div class="sb-nav-link-icon"><i class="bi bi-alarm" role="img" aria-label="alarm clock"></i></div>Alarm Clock</a>
                                <a class="nav-link" href="/timer/"><div class="sb-nav-link-icon"><i class="bi bi-clock-history" role="img" aria-label="timer"></i></div>Timer</a>
                                <a class="nav-link" href="/stopwatch/"><div class="sb-nav-link-icon"><i class="bi bi-stopwatch" role="img" aria-label="stopwatch"></i></div>Stopwatch</a>
                                <a class="nav-link" href="/clock/"><div class="sb-nav-link-icon"><i class="bi bi-clock" role="img" aria-label="clock"></i></div>Clock</a>
                            </div>
                        </div>
                    </nav>
                </div>
                <div id="layoutSidenav_content">
                    <main>
                        <div class="container-fluid px-4">
                            <div class="fullscreen-section-parent">
                                <div class="fullscreen-section-child">
                                    <div class="row">
                                        <div class="col-md-12 mt-4 mb-4">
                                            <div class="card text-center" id="main-card">
                                                <canvas class="card-img-overlay" aria-label="animation"></canvas>
                                                <script type="module" src="/js/bg-animation-rb.js" defer></script>
                                                ${scrMenu}
                                                <div class="card-body colored fade-in d-flex flex-column align-items-center justify-content-center">
                                                    <h1 class="main-display-title">
                                                        <p id="main-display-title-name">${tzData.city}, ${tzData.ctr}</p>
                                                    </h1>
                                                    <div class="main-display text-center" id="main-display-time">
                                                        <span class="main-display-time digital-font text-break" id="main-time">${TIME}</span>
                                                    </div>
                                                    <p class="main-display-date text-nowrap digital-font" id="main-date">${DATE}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-ml-12">
                                            <div class="card mb-4">
                                                <div class="card-body text-center ps-0 pe-0">
                                                    ${googleTagAds[1]}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- add minicard  -->
                                <div class="row" id="minicard-target" style="display:none">
                                    <div class="col-sm-4 col-md-3 add-minicard">
                                        <div class="card mb-4 colored">
                                            <div class="card-header country-city">
                                                <a href="#" class="add-minicard-head" id="text-add-minicard" onclick="custumAddMiniCardInput()" data-bs-toggle="modal" data-bs-target="#clock-modal"
                                                    aria-label="add clock modal">
                                                    <span class="add-minicard-name text-ellipsis">Add Clock</span>
                                                </a>
                                            </div>
                                            <div class="card-body country-city-content">
                                                <a class="infinite-rotate" id="btn-add-minicard" onclick="custumAddMiniCardInput()" role="button" type="button" data-bs-toggle="modal"
                                                    data-bs-target="#clock-modal" aria-label="add clock modal">
                                                    <i class="bi bi-plus-circle-dotted" role="img" aria-label="add minicard"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- add minicard end -->
                                <!-- world time tables -->
                                <div class="row">
                                    <div class="col-xl-12">
                                        <div class="card mb-4">
                                            <h2 class="card-header">Current time and time difference information in ${tzData.city}, ${tzData.ctr}</h2>
                                            <div class="card-body" id="city-information">
                                                <p>Local Time Offset (Time Difference) : <strong><span id="localTzOffset">${localTzOffset}</span></strong></p>
                                                <p>Time Zone : <strong>${tzData.city}, ${tzData.ctr} ${flag}</strong></p>
                                                <p>Standard Time Name : <strong>${localTimeNameString}</strong></p>
                                                <p>Standard Time Zone : <strong>${localStdTz}</strong></p>
                                                <blockquote cite="${cite}">${cityData}</blockquote>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12">
                                        <div class="card mb-4">
                                            <h2 class="card-header">Cities with similar time zones as ${tzData.city}, ${tzData.ctr}</h2>
                                            <div class="row p-5 pt-0 pb-0 table-responsive align-items-start" id="searched-cities">
                                                <table class="table table-borderless col-sm-6 col-md-4 col-lg-3" style="table-layout: fixed">
                                                    <caption class="hidden-caption">List of similar time zone 1~10</caption>
                                                    <thead class="colored"><tr><th width="25%"></th></tr></thead>
                                                    <tbody>${tzSimilarEle[0]}</tbody>
                                                </table>
                                                <table class="table table-borderless col-sm-6 col-md-4 col-lg-3" style="table-layout: fixed">
                                                    <caption class="hidden-caption">List of similar time zone 2~20</caption>
                                                    <thead class="colored"><tr><th width="25%"></th></tr></thead>
                                                    <tbody>${tzSimilarEle[1]}</tbody>
                                                </table>
                                                <table class="table table-borderless col-sm-6 col-md-4 col-lg-3" style="table-layout: fixed">
                                                    <caption class="hidden-caption">List of similar time zone 3~30</caption>
                                                    <thead class="colored"><tr><th width="25%"></th></tr></thead>
                                                    <tbody>${tzSimilarEle[2]}</tbody>
                                                </table>
                                                <table class="table table-borderless col-sm-6 col-md-4 col-lg-3" style="table-layout: fixed">
                                                    <caption class="hidden-caption">List of similar time zone 4~40</caption>
                                                    <thead class="colored"><tr><th width="25%"></th></tr></thead>
                                                    <tbody>${tzSimilarEle[3]}</tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12">
                                        <div class="card mb-4">
                                            <h2 class="card-header">What time is it in ${tzData.city}, ${tzData.ctr} now?</h2>
                                            <div class="card-body">
                                                <p>
                                                    On this website you can find the current time and date for all countries and cities around the
                                                    world including ${tzData.city}, ${tzData.ctr}. You can also check the time difference between your current location and another country or
                                                    city.
                                                </p>
                                                <p>
                                                    This website displays a list of pre-installed clocks for major cities, as well as watches with the correct time for your area. You can
                                                    modify this list as you like. For any city in the list, clicking on the title with the city name will open a separate page with the clock.
                                                </p>
                                                <p>If you turn on the dancing robot in the clock setting menu, you can see the dancing robot animation on the clock screen.</p>
                                                <p>Country names and codes displayed on this website are in accordance with ISO codes and time zones are in accordance with IANA Time Zone Database 2022.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ${shareSns}
                            </div>
                        </div>
                        <button type="button" class="btn btn-lg btn-secondary show-none" aria-label="back-to-top button" id="btn-back-to-top">
                            <i class="bi bi-chevron-compact-up" role="img" aria-label="back to top"></i>
                        </button>
                    </main>
                    <footer class="py-3 bg-dark mt-auto">
                        <div class="container-fluid px-4">
                            <div class="d-flex align-items-center justify-content-center small">
                                <div class="text-muted">
                                    <span><a href="/contact/">Contact Me</a> | <a href="/privacy/">Privacy Policy</a> | <a href="/terms/">Terms of Service</a> | &copy;2023 worldtime247</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
            <!-- javascrip -->
            <script src="/lib/bootstrap.bundle.min.js"></script>
            <script src="/js/main.js"></script>
            <script src="/js/scripts.js"></script>
            <script src="/lib/tzdata.js"></script>
            <script src="/js/clock-local.js"></script>
        </div>
    </body>
</html>`;
    res.send(html);
    tzSimilarEle = ['','','',''];
    
    getImageLocal();
    function getImageLocal() {
        const ctx = canvasLocal.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 968, 504, 0, 0, 968, 504);
            ctx.font = '55px "myFont"';
            ctx.fillStyle = "black";
            ctx.textAlign = "center"
            ctx.shadowColor = "Gold";
            ctx.shadowBlur = 15;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.fillText(`Current Time in ${tzData.city}`, 968/2, 504*0.8);
            const buffer = canvasLocal.toBuffer("image/jpeg", 0.85);
            fs.writeFileSync(`./images/${imgName}.png`, buffer);
        }
        img.onerror = err => { throw err }
        img.src = `assets/imgs/${imgName}.png`;
    }
})

module.exports = router;