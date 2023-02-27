const express = require('express');
const fs = require('fs');
const router = express.Router();
const lunar2solar = require('../route-data/lunardate.js');
const { DAY_DATA } = require('../route-data/daydata.js');
const { registerFont, createCanvas, Image } = require('canvas');
registerFont('./assets/fonts/OpenSans.ttf', { family: 'myFont' });
const canvas = createCanvas(484, 252);
const canvasLocal = createCanvas(968, 504);
const imgName = 'timer';
const YEAR = parseInt(new Date().getFullYear());

const isDEPLOY = (fs.readFileSync('./isdeploy.txt', { encoding: 'utf8', flag: 'r' }) != 'true') ? false : true;
let googleTagAds = ['', '',];
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
const soundSelect = fs.readFileSync('./routes/htmlParts/sound-select.html', { encoding: 'utf8', flag: 'r' });
const colorMenu = fs.readFileSync('./routes/htmlParts/color-menu.html', { encoding: 'utf8', flag: 'r' });
const scrMenu = fs.readFileSync('./routes/htmlParts/scr-menu.html', { encoding: 'utf8', flag: 'r' });
const shareSns = fs.readFileSync('./routes/htmlParts/share-sns.html', { encoding: 'utf8', flag: 'r' });

const LANG = 'en';
let GLOBAL_DAYS = [
    ['New Year', '1-1'],
    ['Chinese New Year', getSpecialDay(YEAR, 'Chinese New Year')],
    ['Korean New Year', getSpecialDay(YEAR, 'Korean New Year')],
    ['World Wetlands Day', '2-2'],
    ["Valentine's Day", '2-14'],
    ['World Cancer Day', '2-4'],
    ["Intl Women's Day", '3-8'],
    ['World Day for Water', '3-22'],
    ['World Health Day', '4-7'],
    ['Labor Day', '5-1'],
    ["Buddha's Birthday", getSpecialDay(YEAR, "Buddha's Birthday")],
    ['World Environment Day', '6-5'],
    ['World Blood Donor Day', '6-14'],
    ['Intl Youth Day', '8-12'],
    ['Intl Day of Peace', '9-21'],
    ['Korean Thanksgiving', getSpecialDay(YEAR, 'Korean Thanksgiving')],
    ['United Nations Day', '10-24'],
    ['Halloween', '10-31'],
    ["Children's Day", '11-20'],
    ['Thanksgiving', getSpecialDay(YEAR, 'Thanksgiving')],
    ['Black Friday', getSpecialDay(YEAR, 'Black Friday')],
    ['Christmas', '12-25'],
];
const SP_DAY = ['Thanksgiving', 'Black Friday', 'Korean New Year', 'Korean Thanksgiving', "Buddha's Birthday", 'Chinese New Year'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getSpecialDay(yy, day) {
    switch (day) {
        case 'Thanksgiving':
            first = new Date(yy, 10, 1);
            day_of_week = first.getDay();
            return `11-${22 + (11 - day_of_week) % 7}`;
        case 'Black Friday':
            first = new Date(yy, 10, 1);
            day_of_week = first.getDay();
            return `11-${23 + (11 - day_of_week) % 7}`;
        case 'Korean New Year':
            return lunar2solar(yy + '0101');
        case 'Korean Thanksgiving':
            return lunar2solar(yy + '0815');
        case "Buddha's Birthday":
            return lunar2solar(yy + '0408');
        case 'Chinese New Year':
            return lunar2solar(yy + '0101');
        default:
            return;
    }
}

router.get('/', (req, res) => {
    const URL_PATH = req._parsedOriginalUrl.pathname
    const pathName = URL_PATH.split('/');
    let year = (pathName[3]) ? parseInt(pathName[3]) : YEAR;

    const DAY_NAME = pathName[2].replace(/[-]/gi, ' ');
    for (const spDay of GLOBAL_DAYS) {
        const spday = spDay[0]
        if (spday.replace(/[']/gi, '') == DAY_NAME) {
            var monthDay = spDay[1].split('-');
            var monthDayList = monthDay;
            var day_name = spDay[0];
            if (SP_DAY.includes(day_name)) monthDay = getSpecialDay(year, day_name).split('-');
            const targetDay = new Date((`${year}-${monthDay[0]}-${monthDay[1]}`)).getTime() / 86400000;
            const today = new Date(new Date().toDateString()).getTime() / 86400000;
            if (targetDay - today < -29) {
                year++;
                if (SP_DAY.includes(day_name)) monthDay = getSpecialDay(year, day_name).split('-');
            };
            break;
        }
    }
    let dayData = '';
    for (dData of DAY_DATA) {
        if (dData[0] == day_name) {
            for (let i = 1; i < dData.length - 1; i++) {
                dayData += `<p>${dData[i]}</p>`;
                if (i == 1) getImage();
            }
            var cite = dData[dData.length - 1];
            dayData += `<p><a href="${cite}" target="blank" id="outsite-link" aria-label="wikipedia">From Wikipedia</a><p>`;
        }
    }

    function getImage() {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 484, 252, 0, 0, 484, 252);
            ctx.font = '32px "myFont"';
            ctx.fillStyle = "white";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 15;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.fillText(`${day_name} ${year}`, 30, 110);
            ctx.font = '26px "myFont"';
            const IMG_DATE = new Date(`${year}-${monthDay[0]}-${monthDay[1]}`).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' });
            ctx.fillText(`${IMG_DATE}`, 30, 150);
            ctx.font = '22px "myFont"';
            ctx.fillText("Countdown Online Timer ", 30, 220);
            const buffer = canvas.toBuffer("image/jpeg", 0.9);
            fs.writeFileSync(`./images/${pathName[2]}.png`, buffer);
            dayData += `<p class="text-center"><img class="card-img img-spec-day" src="${URL_PATH}${pathName[2]}-${year}.png" alt="think of ${day_name} ${year}." width="482px" height="252px"></img><p>`;
        }
        img.onerror = err => { throw err }
        img.src = `assets/imgs/${pathName[2]}.jpg`;
    }

    let trs = '';
    let listYear = year;
    for (i = 0; i < 10; i++) {
        if (SP_DAY.includes(day_name)) monthDayList = getSpecialDay(listYear + 1, day_name).split('-');
        [listYear, M, D, GAP_DAY, SHOW_GAP] = getGlobalDay(listYear + 1, monthDayList);
        if (listYear > 2099) break;
        addSpecDayForYearly(day_name, listYear, M, D, SHOW_GAP);
    }

    function addSpecDayForYearly(day, Y, M, D, gap) {
        const DAY = day.replace(/\s/gi, '-').replace(/[']/gi, '');
        const DATE = new Date(`${D}-${M}-${Y}`).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
        const targetDay = new Date((`${D}-${M}-${Y}`)).getTime() / 86400000;
        const today = new Date(new Date().toDateString()).getTime() / 86400000;
        const classDanger = (targetDay < today) ? 'text-danger' : '';
        let tr = `<tr><td class="text-center ${classDanger}"><a href="/timer/${DAY}/${Y}/" aria-label="${day} ${Y}">${day} ${Y}</a></td><td class="text-end" id="remain-days">${DATE}</td></tr>`;
        trs += tr;
    }

    function getGlobalDay(yy, monthDay) {
        const DAYNAME = ['Yesterday', 'Today', 'Tomrrow'];
        let gMonthDay = monthDay;
        let M = MONTHS[parseInt(gMonthDay[0]) - 1];
        let D = parseInt(gMonthDay[1]);

        let targetDay = new Date((`${D}-${M}-${yy}`)).getTime() / 86400000;
        let today = new Date(new Date().toDateString()).getTime() / 86400000;
        if ((targetDay - today) < -29) {
            yy = yy + 1;
            if (SP_DAY.includes(day_name)) {
                monthDay = getSpecialDay(yy, day_name);
                gMonthDay = monthDay.split('-');
                M = MONTHS[parseInt(gMonthDay[0]) - 1];
                D = gMonthDay[1];
            };
            targetDay = new Date((`${D}-${M}-${yy}`)).getTime() / 86400000;
        }

        const GAP_DAY = targetDay - today;
        const SHOW_GAP = (Math.abs(GAP_DAY) < 2) ? DAYNAME[GAP_DAY + 1] : `${GAP_DAY} Days`;
        return [yy, M, D, GAP_DAY, SHOW_GAP];
    }
    

    const head =
        `<meta name="description" content="How many days until ${day_name}? When is ${day_name} in ${year}? Countdown showing days, hours, minutes and seconds till ${MONTHS[monthDay[0] - 1]} ${monthDay[1]}, ${year}">
            <meta name="keywords" content="${day_name}, Countdown, day counter, date duration calculator, Popular Day, holiday, International Observances Day, from now on, time left until ${day_name}">
            <meta property="og:title" content="${day_name} ${year}">
            <meta property="og:url" content="https://worldtime247.com${URL_PATH}">
            <meta property="og:type" content="website">
            <meta property="og:site_name" content="WorldTime247.com">
            <meta property="og:image" content="https://worldtime247.com${URL_PATH}image.png">
            <meta property="og:image:width" content="968">
            <meta property="og:image:height" content="504">
            <meta property="og:description" content="How many days until ${day_name}? When is ${day_name} in ${year}? Countdown showing days, hours, minutes and seconds till ${MONTHS[monthDay[0] - 1]} ${monthDay[1]}, ${year}">
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
        <meta name="theme-color" content="#000">
        <title id="main-title">When is ${day_name} ${year} - Countdown Timer - WorldTime247</title>
        ${headLink}
        <link rel="stylesheet" href="/css/styles.css">
        <link rel="stylesheet" href="/css/icons.css">
        ${googleTagAds[0]}
    </head>
    <body class="dark-mode">
        <!-- set timer modal -->
        <div class="modal fade" id="set-timer-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-timer-title1" aria-hidden="true" aria-describedby="set timer modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h4 class="modal-timer-title" id="modal-timer-title1">Set Timer</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form class="row g-3"></form>
                            <form class="row">
                                <div class="col-md-12 mb-1 mt-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="countdownOptions" id="inlineRadio1" value="countdown" checked>
                                        <label class="form-check-label" for="inlineRadio1">Countdown</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="countdownOptions" id="inlineRadio2" value="date-time">
                                        <label class="form-check-label" for="inlineRadio2">Count till (from) date and time</label>
                                    </div>
                                </div>
                            </form>
                            <form class="row" id="countdown-menu">
                                <div class="col-md-4 mb-3 mt-3">
                                    <label for="modal-select-hour" class="form-label">Hour</label>
                                    <div class="input-group">
                                        <button class="btn btn-sm btn-outline-secondary" type="button" id="btn-minus-h">
                                            <i class="bi bi-chevron-left" role="img" aria-label="minus hour"></i>
                                        </button>
                                        <select class="form-select" id="modal-select-hour" aria-label="modal select hour"></select>
                                        <button class="btn btn-sm btn-outline-secondary" type="button" id="btn-plus-h">
                                            <i class="bi bi-chevron-right" role="img" aria-label="plus hour"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3 mt-3">
                                    <label for="modal-select-minute" class="form-label">Minute</label>
                                    <div class="input-group">
                                        <button class="btn btn-sm btn-outline-secondary" type="button" id="btn-minus-m">
                                            <i class="bi bi-chevron-left" role="img" aria-label="minus minute"></i>
                                        </button>
                                        <select class="form-select" id="modal-select-minute" aria-label="modal select minute">
                                        </select>
                                        <button class="btn btn-sm btn-outline-secondary" type="button" id="btn-plus-m">
                                            <i class="bi bi-chevron-right" role="img" aria-label="plus minute"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3 mt-3">
                                    <label for="modal-select-second" class="form-label">Second</label>
                                    <div class="input-group">
                                        <button class="btn btn-sm btn-outline-secondary" type="button" id="btn-minus-s">
                                            <i class="bi bi-chevron-left" role="img" aria-label="minus second"></i>
                                        </button>
                                        <select class="form-select" id="modal-select-second" aria-label="modal select second">
                                        </select>
                                        <button class="btn btn-sm btn-outline-secondary" type="button" id="btn-plus-s">
                                            <i class="bi bi-chevron-right" role="img" aria-label="plus second"></i>
                                        </button>
                                    </div>
                                </div>
                                <form class="row">
                                    <label for="onzero" class="form-label mb-1 mt-3">On Zero</label>
                                    <div class="col-md-12" id="onzero">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="restartOptions" id="radio-stop" value="stop-timer" checked>
                                            <label class="form-check-label" for="radio-stop">Show Past Time</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="restartOptions" id="radio-restart" value="restart-timer">
                                            <label class="form-check-label" for="radio-restart">Restart Timer</label>
                                        </div>
                                    </div>
                                </form>
                            </form>
                            <form class="row" id="date-time-menu">
                                <div class="col-md-6 mb-3 mt-3">
                                    <label for="modal-select-hour" class="form-label" for="datepicker">Date</label>
                                    <div class="input-group date" id="datepicker">
                                        <input class="form-control" placeholder="MM/DD/YYYY">
                                        <span class="input-group-append input-group-addon">
                                            <button class="btn btn-outline-secondary" type="button" id="btn-plus-h">
                                                <i class="bi bi-calendar3" role="img" aria-label="plus hour"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3 mt-3">
                                    <label for="modal-select-hour" class="form-label" for="timepicker">Time</label>
                                    <div class="input-group time" id="timepicker">
                                        <input class="form-control" placeholder="HH:MM AM/PM">
                                        <span class="input-group-append input-group-addon">
                                            <button class="btn btn-outline-secondary" type="button" id="btn-plus-h">
                                                <i class="bi bi-clock" role="img" aria-label="plus hour"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </form>
                            <form class="row">
                                ${soundSelect}
                                <div class="mb-3 mt-3">
                                    <label for="modal-input-title" class="form-label">Title</label>
                                    <input class="form-control" id="modal-input-title" type="text" placeholder="Untitled" maxlength="30" aria-label="timer title">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer timer-modal-footer">
                            <button type="button" id="btn-test-timer" class="btn btn-success btn-custom" data-bs-toggle="modal" data-bs-target="#test-timer-modal" aria-label="test">Test</button>
                            <button type="button" id="btn-close-modal" class="btn btn-secondary btn-custom" data-bs-dismiss="modal" aria-label="Close">Close</button>
                            <button type="button" id="btn-add-timer" class="btn btn-primary btn-custom" data-bs-dismiss="modal" aria-label="Start">Start</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- timer modal -->
        <div class="modal fade" id="test-timer-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-timer-title2" aria-hidden="true" aria-describedby="test timer modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h4 class="modal-timer-title" id="modal-timer-title2">Timer</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center">
                                <div class="icon-alarm text-danger vibration m-3">
                                    <i class="bi bi-alarm-fill" role="img" aria-label="display timer message"></i>
                                </div>
                                <h3 id="set-timer-title-display"></h3>
                                <h3 id="set-timer-time-display"></h3>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-custom" data-bs-dismiss="modal" aria-label="Close">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- timer modal end -->
        <!-- iframe link code modal -->
        <div class="modal fade" id="embed-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-embed-title" aria-hidden="true" aria-describedby="iframe embed code modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h4 class="modal-embed-title">Embed Code</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3 mt-2">
                                <label for="modal-select-size" class="form-label">Size</label>
                                <select class="form-select form-select-md mb-4" id="modal-select-clocksize" aria-label="select-clock-size" required>
                                    <option value="1" disabled>200 x 120</option>
                                    <option value="2" disabled>240 x 130</option>
                                    <option value="3">280 x 150</option>
                                    <option value="4">340 x 200</option>
                                    <option value="5">360 x 240</option>
                                    <option value="6" selected>360 x 270</option>
                                    <option value="7">510 x 310</option>
                                    <option value="8">640 x 360</option>
                                    <option value="9">1280 x 720</option>
                                    <option value="0">Custom</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between" id="embed-html-textarea">
                                    <div for="modal-text-input" class="mb-2">HTML</div>
                                    <a id="clipboard-copy" role="button" aria-label="clipboard copy">
                                        <i id="icon-clipboard" class="bi bi-clipboard" data-bs-toggle="tooltip" role="img" aria-label="clipboard copy icon" data-bs-placement="top"
                                            data-bs-trigger="hover" title="Copy"></i>
                                        <i id="icon-copied" class="bi bi-check2 " data-bs-toggle="tooltip" role="img" aria-label="copied icon" data-bs-placement="top" data-bs-trigger="hover"
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
                    <img src="/assets/imgs/logo.png" width="120px" height="60px" alt="worldtime247 Homepage">
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
                                    <input class="form-check-input" type="checkbox" role="switch" id="btnswitch-dark-mode" checked>
                                    <label class="form-check-label" for="btnswitch-dark-mode">Dark Mode</label>
                                </div>
                            </li>
                            <li class="dropdown-item">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="btnswitch-moving-stars" checked>
                                    <label class="form-check-label" for="btnswitch-moving-stars">Moving Stars</label>
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
                                    <div class="row ">
                                        <div class="col-md-12 mt-4 mb-3">
                                            <div class="card text-center mb-3" id="main-card">
                                                <!-- canvas animation -->
                                                <canvas class="card-img-overlay" aria-label="animation"></canvas>
                                                <script type="module" src="/js/bg-animation-star.js" defer></script>
                                                ${scrMenu}
                                                <div class="card-body colored d-flex flex-column align-items-center justify-content-center">
                                                    <!-- main display -->
                                                    <h1 class="main-display-title">${day_name} ${year}</h1>
                                                    <div class="days-display digital-font text-center " id="main-display-time">
                                                        <span class="bi bi-arrow-up" role="img" aria-label="alarm past time" id="icon-past-time"></span>
                                                        <span id="main-days"></span>
                                                        <span id="sub-days"></span>
                                                        <span id="main-hours"></span>
                                                        <span class="main-display-time" id="main-time"></span>
                                                    </div>
                                                    <div class="main-display-date text-nowrap digital-font" id="dateTime-set-display">${MONTHS[monthDay[1] - 1]} ${monthDay[1]}, ${year}</div>
                                                    <div class="main-display-date text-nowrap digital-font" id="past-alarm-display"></div>
                                                    <div class="text-justify m-4" style="display:none;">
                                                        <span id="btn-set-timer"></span>
                                                        <span id="btn-group">
                                                            <span id="btn-edit-timer"></span>
                                                            <span id="btn-reset-timer"></span>
                                                            <span id="btn-stop-timer"></span>
                                                            <span id="btn-start-timer"></span>
                                                        </span>
                                                    </div>
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
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="card mb-4" id="spec-day">
                                            <h2 class="card-header time-table title">How many days until ${day_name} ${year}</h2>
                                            <div class="card-body"><blockquote cite="${cite}">${dayData}</blockquote></div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 over-widt361">
                                        <div class="card mb-4" id="spec-remain-day">
                                            <h2 class="card-header time-table title">${day_name} by year</h2>
                                            <div class="card-body" id="global-days-list">
                                                <table class="table-history align-items-center" style="font-family:Open Sans" id="tables-global-days-spec">
                                                    <caption class="hidden-caption">Number of days remaining for ${day_name} by year</caption>
                                                    <tbody>${trs}</tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" style="display:none">
                                    <div class="col-lg-12">
                                        <div class="card mb-4 colored ">
                                            <div class="card-header time-table"><span></span></div>
                                            <div class="card-body digital-font" style="display:none">
                                                <div class="row">
                                                    <div class="col-sm-6"><table class="text-end" id="table-spec-time1"><tbody></tbody></table></div>
                                                    <div class="col-sm-6"><table class="text-end" id="table-spec-time2"><tbody></tbody></table></div>
                                                </div>
                                            </div>
                                            <div class="card-body digital-font">
                                                <div class="row">
                                                    <div class="col-sm-3"><table class="text-end" id="table-spec-time-v"><tbody></tbody></table></div>
                                                    <div class="col-sm-3"><table class="text-end" id="table-spec-time-s"><tbody></tbody></table></div>
                                                    <div class="col-sm-3"><table class="text-end" id="table-spec-time-m"><tbody></tbody></table></div>
                                                    <div class="col-sm-3"><table class="text-end" id="table-spec-time-h"><tbody></tbody></table></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6" style="display:none">
                                        <div class="card mb-4 colored ">
                                            <div class="card-header time-table"><span></span>
                                                <div class="tools text-right">
                                                    <a role="button" id="btn-recently-used" aria-label="Recently used times edit">
                                                        <i class="icon bi bi-dash-circle infinite-rotate" id="btn-edit" role="img" aria-label="Recently used times edit"></i>
                                                        <i class="bi bi-check-circle" id="btn-confirm" role="img" aria-label="confirm" style="display:none"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <div class="card-body digital-font" id="recently-used-list"><table class="table-history align-items-center" id="tables-history"><tbody></tbody></table></div>
                                        </div>
                                    </div>
                                </div>
                                <!-- description -->
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="card mb-4" style="display:none">
                                            <div class="card-body">
                                                <ul>
                                                    <li><p id="spec-timer-text-1"></p></li>
                                                    <li><p id="spec-timer-text-2"></p></li>
                                                    <li><p id="spec-timer-text-3"></p></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6" style="display:none">
                                        <div class="card mb-4 colored">
                                            <div class="card-header time-table"><span></span></div>
                                            <div class="card-body digital-font" id="global-days-list"><table class="table-history align-items-center" id="tables-global-days"><tbody></tbody></table></div>
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
        <script src="/lib/lunardate.js"></script>
        <script src="/lib/bootstrap.bundle.min.js"></script>
        <script src="/js/main.js"></script>
        <script src="/js/timer.js"></script>
    </body>
</html>`;
    res.send(html);
    getImageLocal();
    function getImageLocal() {
        const ctx = canvasLocal.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 968, 504, 0, 0, 968, 504);
            ctx.font = '45px "myFont"';
            ctx.fillStyle = "black";
            ctx.textAlign = "center"
            ctx.shadowColor = "Gold";
            ctx.shadowBlur = 15;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            ctx.fillText(`Countdown - ${day_name} ${year}`, 968/2, 504*0.8);
            ctx.font = '30px "myFont"';
            const IMG_DATE = new Date(`${year}-${monthDay[0]}-${monthDay[1]}`).toLocaleDateString(LANG, { weekday: 'long', month: 'long', day: 'numeric' });
            ctx.fillText(`${IMG_DATE}`,968/2, 504*0.9);
            const buffer = canvasLocal.toBuffer("image/jpeg", 0.85);
            fs.writeFileSync(`./images/${imgName}.png`, buffer);
        }
        img.onerror = err => { throw err }
        img.src = `assets/imgs/${imgName}.png`;
    }
})

module.exports = router;