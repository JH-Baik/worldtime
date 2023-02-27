const express = require('express');
const router = express.Router();
const fs = require('fs');
const { registerFont, createCanvas, Image } = require('canvas');
registerFont('./assets/fonts/OpenSans.ttf', { family: 'myFont' });
const canvasLocal = createCanvas(968, 504);
const imgName = 'alarm';
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
const soundSelect = fs.readFileSync('./routes/htmlParts/sound-select.html', { encoding: 'utf8', flag: 'r' });
const colorMenu = fs.readFileSync('./routes/htmlParts/color-menu.html', { encoding: 'utf8', flag: 'r' });
const scrMenu = fs.readFileSync('./routes/htmlParts/scr-menu.html', { encoding: 'utf8', flag: 'r' });
const shareSns = fs.readFileSync('./routes/htmlParts/share-sns.html', { encoding: 'utf8', flag: 'r' });

const LANG = 'en';
function timeFormat(h, m) {
    let sign = (h < 12) ? 'AM' : 'PM';
    h = (h % 12 !== 0) ? h % 12 : 12;
    return `${h}:${m.toString().padStart(2, '0')} ${sign}`;
}

router.get('/', (req, res) => {
    const URL_PATH = req._parsedOriginalUrl.pathname
    const pathName = URL_PATH.replace(/\//gi, '').split('-');
    const time = timeFormat(pathName[3], pathName[4]);

    const head =
        `<meta name="description" content="Wake me up at ${time}. Set the alarm for ${time}. Set my alarm for ${time}. This alarm clock wakes you up at the exact time.">
        <meta name="keywords" content="set alarm for ${time}, alarm ${time}, set alarm ${time}, set alarm ${pathName[3]}:${pathName[4]}, wake me up, online alarm clock">
        <meta property="og:title" content="Set Alarm for ${time} - Online Alarm Clock - worldtime247">
        <meta property="og:url" content="https://worldtime247.com${URL_PATH}">
        <meta property="og:image" content="https://worldtime247.com${URL_PATH}image.png">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="WorldTime247.com">
        <meta property="og:image:width" content="968">
        <meta property="og:image:height" content="504">
        <meta property="og:description" content="Wake me up at ${time}. Set the alarm for ${time}. Set my alarm for ${time}. This alarm clock wakes you up at the exact time.">
        <link rel="canonical" href="https://worldtime247.com${URL_PATH}">
        <link rel="alternate" type="embed" href="https://worldtime247.com/embed${URL_PATH}">`;

    let h = parseInt(pathName[3]);
    let m = parseInt(pathName[4]) + 12 > 59 ? 48 : parseInt(pathName[4]);
    let btns = '';
    for (let i = 0; i < 12; i++) {
        getTimeButton(h, m + i)
    }
    btns=btns+'<hr>';
    for (let i = 0; i < 12; i++) {
        getTimeButton(h, i * 5)
    }
    btns=btns+'<hr>';
    for (let i = 0; i < 24; i++) {
        getTimeButton(i, 0);
        if (i == 11) btns=btns+'<br>';
    }

    function getTimeButton(hour, minute) {
        let time = timeFormat(hour,minute)
        let aTag = `<a class="btn btn-outline-primary btngroup-custom text-center" title="Set an alarm at ${time}" href="/set-alarm-for-${hour}-${minute}/">${time}</a>`;
        btns = btns + aTag;
    }
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const LOCAL_DATE = new Date().toLocaleDateString(LANG, options);
    const LOCAL_TIME = new Date().toLocaleTimeString(LANG)

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
        <title id="main-title">Set Alarm for ${time} - Online Alarm Clock</title>
        ${headLink}
        <link rel="stylesheet" href="/css/styles.css">
        <link rel="stylesheet" href="/css/icons.css">
        ${googleTagAds[0]}
    </head>

    <body class="dark-mode">
        <!-- set alarm modal -->
        <div class="modal fade" id="set-alarm-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-alarm-title1" aria-hidden="true" aria-describedby="set alarm modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h4 class="modal-alarm-title" id="modal-alarm-title1">Set Alarm Clock</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form class="row g-3"></form>
                            <form class="row">
                                <div class="col-md-6 mb-3 mt-3">
                                    <label for="modal-select-hour" class="form-label">Hour</label>
                                    <div class="input-group">
                                        <button class="btn btn-sm btn-outline-secondary" type="button" id="btn-minus-h">
                                            <i class="bi bi-chevron-left" role="img" aria-label="minus hour"></i>
                                        </button>
                                        <select class="form-select" id="modal-select-hour" aria-label="modal select hour">
                                        </select>
                                        <button class="btn btn-sm btn-outline-secondary" type="button" id="btn-plus-h">
                                            <i class="bi bi-chevron-right" role="img" aria-label="plus hour"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3 mt-3">
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
                                ${soundSelect}
                                <div class="mb-3 mt-3">
                                    <label for="modal-select-audio" class="form-label">Title</label>
                                    <input class="form-control" id="modal-input-title" type="text" placeholder="Untitled" maxlength="30" aria-label="alarm title">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer alarm-modal-footer">
                            <button type="button" id="btn-test-alarm" class="btn btn-success btn-custom" data-bs-toggle="modal" data-bs-target="#test-alarm-modal" aria-label="test">Test</button>
                            <button type="button" id="btn-close-modal" class="btn btn-secondary btn-custom" data-bs-dismiss="modal" aria-label="Close">Close</button>
                            <button type="button" id="btn-add-alarm" class="btn btn-primary btn-custom" data-bs-dismiss="modal" aria-label="Start">Start</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- alarm modal -->
        <div class="modal fade" id="test-alarm-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-alarm-title2" aria-hidden="true" aria-describedby="test alarm modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h3 class="modal-alarm-title" id="modal-alarm-title2">Alarm</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center">
                                <div class="icon-alarm text-danger vibration m-3">
                                    <i class="bi bi-alarm-fill" role="img" aria-label="display alarm message"></i>
                                </div>
                                <h4 id="set-alarm-title-display"></h4>
                                <p id="set-alarm-time-display"></p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-custom" data-bs-dismiss="modal" aria-label="Close">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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
                                    <option value="3" selected>280 x 150</option>
                                    <option value="4">340 x 200</option>
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
                    <img src="/assets/imgs/logo.png" width="120px" height="60px" alt="home">
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
                                        <div class="col-md-12 mt-4 mb-4">
                                            <div class="card text-center" id="main-card">
                                                ${scrMenu}
                                                <div class="card-body colored fade-in d-flex flex-column align-items-center justify-content-center">
                                                    <h1 class="main-display-title">Set Alarm for ${time}</h1>
                                                    <div class="main-display text-center" id="main-display-time">
                                                        <span class="main-display-time digital-font text-break" id="main-time">${LOCAL_TIME}</span>
                                                    </div>
                                                    <p class="main-display-date text-nowrap digital-font" id="main-date">${LOCAL_DATE}</p>
                                                    <div class="text-justify m-4">
                                                        <button class="btn btn-success btn-lg m-2 btn-custom" type="button" role="button" id="btn-test-alarm2" aria-label="test alarm">Test</button>
                                                        <button class="btn btn-warning btn-lg m-2 btn-custom" type="button" role="button" id="btn-set-alarm" aria-label="reset timer"
                                                            data-bs-toggle="modal" data-bs-target="#set-alarm-modal" aria-label="set alarm">Edit</button>
                                                        <button class="btn btn-primary btn-lg m-2 btn-custom" type="button" role="button" id="btn-add-alarm2" aria-label="set alarm">Set Alarm</button>
                                                    </div>
                                                </div>
                                                <div class="row" id="row-display-alarm">
                                                    <div class="col-md-12">
                                                        <div class="card colored digital-font">
                                                            <div class="card-body text-center mt-0">
                                                                <div id="display-alarm">
                                                                    <h2 class="main-title text-center" id="alarm-title"></h2>
                                                                    <div id="card-alarm-time">
                                                                        <i class="bi bi-alarm"></i>
                                                                        <span id="content-alarm-time"></span>
                                                                    </div>
                                                                    <div id="card-alarm-timer">
                                                                        <i class="bi bi-clock-history m-2"></i>
                                                                        <span id="content-alarm-timer"></span>
                                                                    </div>
                                                                    <button type="button" class="btn btn-danger btn-lg m-2 btn-custom" id="btn-stop-alarm">Stop Alarm</button>
                                                                </div>
                                                            </div>
                                                        </div>
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
                                <div class="row card-link">
                                    <div class="col-lg-12">
                                        <div class="card mb-4">
                                            <h2 class="card-header time-table">Set the alarm for the specified time</h2>
                                            <div class="card-body" id="btns-spectime-table">
                                                ${btns}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- select alarm time & recently used alarm -->
                                <div class="row card-link" style="display:none">
                                    <div class="col-lg-6">
                                        <div class="card mb-4 colored">
                                            <h2 class="card-header time-table">Set the alarm for the specified time</h2>
                                            <div class="card-body digital-font" id="btns-time-table"></div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 over-width-361">
                                        <div class="card mb-4 colored ">
                                            <h2 class="card-header time-table">Recently used
                                                <div class="tools text-right">
                                                    <a role="button" id="btn-recently-used" aria-label="Recently used times edit">
                                                        <i class="icon bi bi-dash-circle infinite-rotate" id="btn-edit" role="img" aria-label="Recently used times edit"></i>
                                                        <i class="bi bi-check-circle" id="btn-confirm" role="img" aria-label="confirm" style="display:none"></i>
                                                    </a>
                                                </div>
                                            </h2>
                                            <div class="card-body digital-font" id="recently-used-list">
                                                <table class="table-history" id="tables-history">
                                                    <caption class="hidden-caption">recently used alarm list</caption>
                                                    <tbody>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12">
                                        <div class="card mb-4">
                                            <h2 class="card-header" id="desc-title">Wake me up at ${time}</h2>
                                            <div class="card-body">
                                                <p><strong>Set an alarm for ${time}.</strong> Set your alarm for ${pathName[3].toString().padStart(2, '0')}:${pathName[4].toString().padStart(2, '0')}. This free alarm clock will wake you up at the exact time.</p>
                                                <p>Set hours and minutes for your online alarm clock. An alarm message appears and a pre-selected sound is played at the set time.</p>
                                                <p>When setting an alarm, you can preview the alert and check the volume by clicking the "Test" button.</p>
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
            <script src="/js/alarmclock.js"></script>
        </div>
    </body>
</html>`;
    res.send(html);
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
            ctx.lineWidth = 4;
            ctx.fillText(`Set Alarm for ${time}`, 968/2, 504*0.8);
            const buffer = canvasLocal.toBuffer("image/jpeg", 0.85);
            fs.writeFileSync(`./images/${imgName}.png`, buffer);
        }
        img.onerror = err => { throw err }
        img.src = `assets/imgs/${imgName}.png`;
    }
})

module.exports = router;
