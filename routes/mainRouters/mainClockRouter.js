const express = require('express');
const router = express.Router();
const fs = require('fs');
const isDEPLOY = (fs.readFileSync('./isdeploy.txt', { encoding: 'utf8', flag: 'r' }) != 'true') ? false : true;
let googleTagAds = ['','',''];
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
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;

    googleTagAds[2] = `
    <style>
        .ad_responsive_2 { width: 336px;height: 280px; }
        @media(min-width: 500px) { .ad_responsive_2 { width: 468px;height: 60px; } }
        @media(min-width: 800px) { .ad_responsive_2 { width: 728px;height: 90px; } }
        @media(min-width: 1200px) { .ad_responsive_2 { width: 970px;height: 90px; } }
        @media(min-width: 1400px) { .ad_responsive_2 { width: 1200px;height: 90px; } }
    </style>
    <ins class="adsbygoogle ad_responsive_2"
        style="display:inline-block;"
        data-ad-client="ca-pub-2489741092366129"
        data-ad-slot="5332156109"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;
}

const headLink = fs.readFileSync('./routes/htmlParts/head-link.html', { encoding: 'utf8', flag: 'r' });
const colorMenu = fs.readFileSync('./routes/htmlParts/color-menu.html', { encoding: 'utf8', flag: 'r' });
const scrMenu = fs.readFileSync('./routes/htmlParts/scr-menu.html', { encoding: 'utf8', flag: 'r' });
const shareSns = fs.readFileSync('./routes/htmlParts/share-sns.html', { encoding: 'utf8', flag: 'r' });

const LANG = 'en';
let NOW = new Date();
let timeLabel = 'h23'; //'h12'
const OPTIONS_TIME = { hourCycle: timeLabel, hour: 'numeric', minute: '2-digit', second: '2-digit', };
const OPTIONS_DATE = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
let TIME = NOW.toLocaleTimeString(LANG, OPTIONS_TIME);
let DATE = NOW.toLocaleDateString(LANG, OPTIONS_DATE);

router.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="${LANG}" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="online clock. What time is it now. This website provides the exact current time for all countries and cities around the world.">
        <meta name="keywords" content="current time, time now, exact time, clock, online clock, world time, world time now, digital clock, worldtime247.com">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        <link rel="alternate" type="embed" href="https://WorldTime247.com/embed/clock/">
        <meta property="og:title" content="Online Clock - Online Animation Clock - Online World Time">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="WorldTime247.com">
        <meta property="og:image" content="https://worldtime247.com/clock/image.png">
        <meta property="og:image:width" content="968">
        <meta property="og:image:height" content="504">
        <meta property="og:url" content="https://worldtime247.com/clock/">
        <meta property="og:description" content="online clock. What time is it now. This website provides the exact current time for all countries and cities around the world.">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@worldtime247">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#fff">
        <title id="main-title">Online Animation Clock - Current World Time</title>
        <link rel="canonical" href="https://worldtime247.com/clock/">
        ${headLink}
        <link rel="stylesheet" href="/css/styles.css">
        <link rel="stylesheet" href="/css/icons.css">
        ${googleTagAds[0]}
    </head>
    <body class="dark-mode">
        <!-- create-card modal -->
        <div class="modal fade" id="clock-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="add-clock-modal-label" aria-hidden="true" aria-describedby="clock modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h3 class="modal-title" id="add-clock-modal-label">Add Clock</h3>
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
                                <label for="modal-input-title" class="form-label">Title</label>
                                <input type="text" class="form-control form-control-md" id="modal-input-title" placeholder="text" required value="My mini clock">
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
        <div class="modal fade" id="embed-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="embed-modal-label" aria-hidden="true" aria-describedby="iframe embed code modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h3 class="modal-embed-title" id="embed-modal-label">Embed Code</h3>
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
                            <button type="button" id="embed-close-modal1" class="btn btn-secondary btn-custom" data-bs-dismiss="modal">Close</button>
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
                    <li class="nav-item dropdown">
                        <a class="nav-link-top" id="navbarDropdownTools" href="#" role="button" type="button" aria-label="tools" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                            <i class="bi bi-tools" role="img" aria-label="display tools" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-trigger='hover' title="Setting"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="navbarDropdownTools" aria-label="nav bar dropdown tools">
                            <li class="dropdown-item">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="btnswitch-digital-font" checked>
                                    <label class="form-check-label" for="btnswitch-digital-font">Digital</label>
                                </div>
                            </li>
                            <li class="dropdown-item">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="btnswitch-am-pm">
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
                                <a class="nav-link active" href="/clock/"><div class="sb-nav-link-icon"><i class="bi bi-clock" role="img" aria-label="clock"></i></div>Clock</a>
                            </div>
                        </div>
                    </nav>
                </div>
                <!-- main stage -->
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
                                                    <h1 class="main-display-title">Current Time</h1>
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
                                <div class="row" id="minicard-target">
                                    <div class="col-sm-4 col-md-3 add-minicard">
                                        <div class="card mb-4 colored">
                                            <div class="card-header country-city">
                                                <a href="#" class="add-minicard-head text-center" id="text-add-minicard" onclick="customAddMiniCardInput()" tabindex="-1" data-bs-toggle="modal"
                                                    data-bs-target="#clock-modal" aria-label="add clock modal">
                                                    <span class="add-minicard-name text-ellipsis">Add Clock</span>
                                                </a>
                                            </div>
                                            <div class="card-body country-city-content">
                                                <a href="#" class="infinite-rotate" id="btn-add-minicard" onclick="customAddMiniCardInput()" tabindex="-1" role="button" type="button"
                                                    data-bs-toggle="modal" data-bs-target="#clock-modal" aria-label="add clock modal">
                                                    <i class="bi bi-plus-circle-dotted" role="img" aria-label="add minicard"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- add minicard end -->
                                <!-- world time tables -->
                                <div class="col-xl-12 mb-4 colored">
                                    <div class="accordion accordion-flush" id="accordionPanels">
                                        <div class="accordion-item colored" id="world-time-table">
                                            <h2 class="accordion-header" id="acc-heading-1">
                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#acc-1" aria-expanded="false" aria-controls="acc-1">
                                                    <i class="bi bi-table me-2" role="img" aria-label="world time table"></i>
                                                    Time table for all countries of the world</button>
                                            </h2>
                                            <div id="acc-1" class="accordion-collapse collapse" aria-labelledby="acc-heading-1">
                                                <div class="accordion-body">
                                                    <table id="datatables" class="table-color colored" data-order='[[ 1, "asc" ]]' data-page-length='25'>
                                                        <caption class="hidden-caption">
                                                            List of all country time zones</caption>
                                                        <thead>
                                                            <tr class="tablehead-0">
                                                                <th>Country Name & Code</th>
                                                                <th>Global Time Zone</th>
                                                                <th>Local Time Name</th>
                                                                <th>UTC/GMT</th>
                                                                <th>Time Difference</th>
                                                                <th>Local Time & Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tfoot>
                                                            <tr class="tablefoot-0">
                                                                <th>Country Name & Code</th>
                                                                <th>Standard Time Zone</th>
                                                                <th>Local Time Name</th>
                                                                <th>UTC/GMT</th>
                                                                <th>Time Difference</th>
                                                                <th>Local Time & Date</th>
                                                            </tr>
                                                        </tfoot>
                                                        <tbody id="tbody-target-tabledata"></tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- abstract timezone city -->
                                        <div class="accordion-item" id="searched-cities">
                                            <h2 class="accordion-header" id="acc-heading-2">
                                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#acc-2" aria-expanded="true" aria-controls="acc-2">
                                                    <i class="bi bi-pin-angle me-2" role="img" aria-label="Frequently Searched Cities"></i>What time is it in major cities?</button>
                                            </h2>
                                            <div id="acc-2" class="accordion-collapse collapse show" aria-labelledby="acc-heading-2">
                                                <div class="accordion-body">
                                                    <div class="row p-3 pt-0 table-responsive align-items-start" id="abstract-cities">
                                                        <table class="table table-borderless col-sm-6 col-md-4 col-lg-3" style="table-layout: fixed">
                                                            <caption class="hidden-caption">List of time zone countries in the America</caption>
                                                            <thead class="colored"><tr><th width="25%">America</th></tr></thead>
                                                            <tbody>
                                                                <tr><td><a href="/clock/ar-buenos-aires/" aria-label="Current time in Buenos Aires">Buenos Aires, Argentina</a></td></tr>
                                                                <tr><td><a href="/clock/br-sao-paulo/" aria-label="Current time in Sao Paulo">Sao Paulo, Brazil</a></td></tr>
                                                                <tr><td><a href="/clock/br-rio-branco/" aria-label="Current time in Rio Branco">Rio Branco, Brazil</a></td></tr>
                                                                <tr><td><a href="/clock/ca-toronto/" aria-label="Current time in Toronto">Toronto, Canada</a></td></tr>
                                                                <tr><td><a href="/clock/ca-vancouver/" aria-label="Current time in Vancouver">Vancouver, Canada</a></td></tr>
                                                                <tr><td><a href="/clock/cl-santiago/" aria-label="Current time in Santiago">Santiago, Chile</a></td></tr>
                                                                <tr><td><a href="/clock/mx-mexico-city/" aria-label="Current time in Mexico City">Mexico City, Mexico</a></td></tr>
                                                                <tr><td><a href="/clock/pa-panama/" aria-label="Current time in Panama">Panama, Panama</a></td></tr>
                                                                <tr><td><a href="/clock/us-new-york/" aria-label="Current time in New York">New York, United States</a></td></tr>
                                                                <tr><td><a href="/clock/us-indianapolis/" aria-label="Current time in Indianapolis">Indianapolis, United States</a></td></tr>
                                                                <tr><td><a href="/clock/us-chicago/" aria-label="Current time in Chicago">Chicago, United States</a></td></tr>
                                                                <tr><td><a href="/clock/us-denver/" aria-label="Current time in Denver">Denver, United States</a></td></tr>
                                                                <tr><td><a href="/clock/us-los-angeles/" aria-label="Current time in Los Angeles">Los Angeles, United States</a></td></tr>
                                                                <tr><td><a href="/clock/us-anchorage/" aria-label="Current time in Anchorage">Anchorage, United States</a></td></tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="table table-borderless col-sm-6 col-md-4 col-lg-3" style="table-layout: fixed">
                                                            <caption class="hidden-caption">List of time zone countries in Asia &amp; Oceania</caption>
                                                            <thead class="colored"><tr><th width="25%">Asia</th></tr></thead>
                                                            <tbody>
                                                                <tr><td><a href="/clock/ae-dubai/" aria-label="Current time in Dubai">Dubai, United Arab Emirates</a></td></tr>
                                                                <tr><td><a href="/clock/cn-shanghai/" aria-label="Current time in Shanghai">Shanghai, China</a></td></tr>
                                                                <tr><td><a href="/clock/hk-hong-kong/" aria-label="Current time in Hong Kong">Hong Kong</a></td></tr>
                                                                <tr><td><a href="/clock/id-jakarta/" aria-label="Current time in Jakarta">Jakarta, Indonesia</a></td></tr>
                                                                <tr><td><a href="/clock/in-kolkata/" aria-label="Current time in Kolkata">Kolkata, India</a></td></tr>
                                                                <tr><td><a href="/clock/jp-tokyo/" aria-label="Current time in Tokyo">Tokyo, Japan</a></td></tr>
                                                                <tr><td><a href="/clock/kr-seoul/" aria-label="Current time in Seoul">Seoul, South Korea</a></td></tr>
                                                                <tr><td><a href="/clock/mn-ulaanbaatar/" aria-label="Current time in Ulaanbaatar">Ulaanbaatar, Mongolia</a></td></tr>
                                                                <tr><td><a href="/clock/my-kuala-lumpur/" aria-label="Current time in Kuala Lumpur">Kuala Lumpur, Malaysia</a></td></tr>
                                                                <tr><td><a href="/clock/ph-manila/" aria-label="Current time in Manila">Manila, Philippines</a></td></tr>
                                                                <tr><td><a href="/clock/ru-irkutsk/" aria-label="Current time in Irkutsk">Irkutsk, Russian Federation</a></td></tr>
                                                                <tr><td><a href="/clock/ru-vladivostok/" aria-label="Current time in Vladivostok">Vladivostok, Russian Federation</a></td></tr>
                                                                <tr><td><a href="/clock/sa-riyadh/" aria-label="Current time in Riyadh">Riyadh, Saudi Arabia</a></td></tr>
                                                                <tr><td><a href="/clock/sg-singapore/" aria-label="Current time in Singapore">Singapore, Singapore</a></td></tr>
                                                                <tr><td><a href="/clock/th-bangkok/" aria-label="Current time in Bangkok">Bangkok, Thailand</a></td></tr>
                                                                <tr><td><a href="/clock/vn-ho-chi-minh/" aria-label="Current time in Ho Chi Minh">Ho Chi Minh, Viet Nam</a></td></tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="table table-borderless col-sm-6 col-md-4 col-lg-3" style="table-layout: fixed">
                                                            <caption class="hidden-caption">List of European Time Zone Countries</caption>
                                                            <thead class="colored"><tr><th width="25%">Europe</th></tr></thead>
                                                            <tbody>
                                                                <tr><td><a href="/clock/at-vienna/" aria-label="Current time in Vienna">Vienna, Austria</a></td></tr>
                                                                <tr><td><a href="/clock/be-brussels/" aria-label="Current time in Brussels">Brussels, Belgium</a></td></tr>
                                                                <tr><td><a href="/clock/ch-zurich/" aria-label="Current time in Zurich">Zurich, Switzerland</a></td></tr>
                                                                <tr><td><a href="/clock/de-berlin/" aria-label="Current time in Berlin">Berlin, Germany</a></td></tr>
                                                                <tr><td><a href="/clock/dk-copenhagen/" aria-label="Current time in Copenhagen">Copenhagen, Denmark</a></td></tr>
                                                                <tr><td><a href="/clock/es-madrid/" aria-label="Current time in Madrid">Madrid, Spain</a></td></tr>
                                                                <tr><td><a href="/clock/fi-helsinki/" aria-label="Current time in Helsinki">Helsinki, Finland</a></td></tr>
                                                                <tr><td><a href="/clock/fr-paris/" aria-label="Current time in Paris">Paris, France</a></td></tr>
                                                                <tr><td><a href="/clock/gb-london/" aria-label="Current time in London">London, United Kingdom</a></td></tr>
                                                                <tr><td><a href="/clock/gr-athens/" aria-label="Current time in Athens">Athens, Greece</a></td></tr>
                                                                <tr><td><a href="/clock/it-rome/" aria-label="Current time in Rome">Rome, Italy</a></td></tr>
                                                                <tr><td><a href="/clock/nl-amsterdam/" aria-label="Current time in Amsterdam">Amsterdam, Netherlands</a></td></tr>
                                                                <tr><td><a href="/clock/no-oslo/" aria-label="Current time in Oslo">Oslo, Norway</a></td></tr>
                                                                <tr><td><a href="/clock/pl-warsaw/" aria-label="Current time in Warsaw">Warsaw, Poland</a></td></tr>
                                                                <tr><td><a href="/clock/pt-lisbon/" aria-label="Current time in Lisbon">Lisbon, Portugal</a></td></tr>
                                                                <tr><td><a href="/clock/ru-moscow/" aria-label="Current time in Moscow">Moscow, Russian Federation</a></td></tr>
                                                                <tr><td><a href="/clock/se-stockholm/" aria-label="Current time in Stockholm">Stockholm, Sweden</a></td></tr>
                                                                <tr><td><a href="/clock/tr-istanbul/" aria-label="Current time in Istanbul">Istanbul, Turkey</a></td></tr>
                                                                <tr><td><a id="kyiv2kiev" href="/clock/ua-kyiv/" aria-label="Current time in Kyiv">Kyiv, Ukraine</a></td></tr>
                                                            </tbody>
                                                        </table>
                                                        <table class="table table-borderless col-sm-6 col-md-4 col-lg-3" style="table-layout: fixed">
                                                            <caption class="hidden-caption">List of Africa &amp; Oceania Time Zone Countries</caption>
                                                            <thead class="colored"><tr><th width="25%">Africa &amp; Oceania</th></tr></thead>
                                                            <tbody>
                                                                <tr><td><a href="/clock/cf-bangui/" aria-label="Current time in Bangui">Bangui, Central African Republic</a></td></tr>
                                                                <tr><td><a href="/clock/eg-cairo/" aria-label="Current time in Cairo">Cairo, Egypt</a></td></tr>
                                                                <tr><td><a href="/clock/ke-nairobi/" aria-label="Current time in Nairobi">Nairobi, Kenya</a></td></tr>
                                                                <tr><td><a href="/clock/ma-casablanca/" aria-label="Current time in Casablanca">Casablanca, Morocco</a></td></tr>
                                                                <tr><td><a href="/clock/ng-lagos/" aria-label="Current time in Lagos">Lagos, Nigeria</a></td></tr>
                                                                <tr><td><a href="/clock/sn-dakar/" aria-label="Current time in Dakar">Dakar, Senegal</a></td></tr>
                                                                <tr><td><a href="/clock/za-johannesburg/" aria-label="Current time in Johannesburg">Johannesburg, South Africa</a></td></tr>
                                                                <tr><td><a href="/clock/zm-lusaka/" aria-label="Current time in Lusaka">Lusaka, Zambia</a></td></tr>
                                                                <tr><td><a href="/clock/au-melbourne/" aria-label="Current time in Melbourne">Melbourne, Australia</a></td></tr>
                                                                <tr><td><a href="/clock/au-sydney/" aria-label="Current time in Sydney">Sydney, Australia</a></td></tr>
                                                                <tr><td><a href="/clock/nz-auckland/" aria-label="Current time in Auckland">Auckland, New Zealand</a></td></tr>
                                                                <tr><td><a href="/clock/to-tongatapu/" aria-label="Current time in Tongatapu">Tongatapu, Tonga</a></td></tr>
                                                            </tbody>
                                                        </table>
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
                                                ${googleTagAds[2]}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12">
                                        <div class="card mb-4">
                                            <h2 class="card-header">How to use the online clock</h2>
                                            <div class="card-body">
                                                <p>On our website, you can find the <strong>current time and date for all countries and cities around the world</strong>. You can also check the time difference between
                                                    your current location and another country or city.</p>
                                                <p>Our website displays a cities time of pre-installed clocks in major cities around the world and the exact time in your area in time now.</p>
                                                <p>City times can be added or deleted as desired by the user, and the location of city times can be modified. For cities in city time, clicking on the
                                                    title with the city name will open a separate page with the online clock.</p>
                                                <p>The world time zone table allows you to find quickly a country or city and check the time. You can also click on the table headings to sort by items
                                                    and see the world time based on the web page loading time.</p>
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
            <template id="minicard-template">
                <div class="col-sm-4 col-md-3 minicard">
                    <div class="card mb-4 colored">
                        <div class="card-header country-city colored">
                            <div class="tools text-right">
                                <a href="#" class="new-page" aria-label="local time fullscreen">
                                    <i class="icon bi bi-display" role="img" aria-label="display city"></i>
                                </a>
                                <span class="dropdown">
                                    <span data-toggle="dropdown"></span>
                                    <a class="colored" id="minicardIndex" role="button" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false" aria-label="local time position edit">
                                        <i class="icon bi bi-three-dots-vertical colored" value="" role="img" aria-label="minicard tools"></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark country-city-dropdown" role="menu" aria-label="card drop down">
                                        <li class="dropdown-item" id="card-edit" value="" data-bs-toggle="modal" data-bs-target="#clock-modal">Edit</li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li class="dropdown-item" id="card-move-top">Move To Top</li>
                                        <li class="dropdown-item" id="card-move-up">Move Up</li>
                                        <li class="dropdown-item" id="card-move-down">Move Down</li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li class="dropdown-item" id="card-delete">Delete</li>
                                    </ul>
                                </span>
                            </div>
                            <a href="#" class="new-page" aria-label="local time fullscreen"><span class="minicard-name text-ellipsis"></span></a>
                        </div>
                        <div class="card-body country-city-content">
                            <div class="minicard-local-time digital-font text-ellipsis">AM 00:00:00</div>
                            <div class="minicard-local-diff-time text-ellipsis">Today, 0 hour</div>
                        </div>
                    </div>
            </template>
            <template id="table-item-template">
                <tr class="tablerecord-0">
                    <td class="tabledata-1 d-flex justify-content-between">
                        <span class="tabledata-span-1" id="tdspan-1">
                            <img class="country-flag" id="tdimg-1" width="20px" alt="Country Flag" aria-label="Country Flag"></img>
                            <span id="tdspan-3"></span>
                            <span id="tdspan-4"></span>
                        </span>
                    </td>
                    <td class="tabledata-2"></td>
                    <td class="tabledata-3"></td>
                    <td class="tabledata-4"></td>
                    <td class="tabledata-5"></td>
                    <td class="tabledata-6"></td>
                </tr>
            </template>
            <!-- javascrip -->
            <script src="/lib/bootstrap.bundle.min.js"></script>
            <script src="/lib/datatables/datatables.js"></script>
            <script src="/js/main.js"></script>
            <script src="/lib/tzdata.js"></script>
            <script src="/js/scripts.js"></script>
            <script src="/js/app.js"></script>
        </div>
    </body>
</html>`;
    res.send(html);
})

module.exports = router;