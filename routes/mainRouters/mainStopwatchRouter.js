const express = require('express');
const router = express.Router();
const fs = require('fs');
const isDEPLOY = (fs.readFileSync('./isdeploy.txt', { encoding: 'utf8', flag: 'r' }) != 'true') ? false : true;
let googleTagAds = ['','',];
if (isDEPLOY) {
    googleTagAds[0] =`
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
}

const headLink = fs.readFileSync('./routes/htmlParts/head-link.html', { encoding: 'utf8', flag: 'r' });
const colorMenu = fs.readFileSync('./routes/htmlParts/color-menu.html', { encoding: 'utf8', flag: 'r' });
const scrMenu = fs.readFileSync('./routes/htmlParts/scr-menu.html', { encoding: 'utf8', flag: 'r' });
const shareSns = fs.readFileSync('./routes/htmlParts/share-sns.html', { encoding: 'utf8', flag: 'r' });

const LANG = 'en';
router.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="${LANG}" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="Online stopwatch. The online stopwatch displays up to 1000ths of a second when the start button is clicked. You can also add lap time.">
        <meta name="keywords" content="stopwatch, online stopwatch, digital stopwatch, accurate stopwatch, online, measure 1/1000 of a second, worldtime247.com">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        <link rel="alternate" type="embed" href="https://WorldTime247.com/embed/stopwatch/">
        <meta property="og:title" content="Online Stopwatch - Digital Stopwatch - WorldTime247.com">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="WorldTime247.com">
        <meta property="og:image" content="https://worldtime247.com/stopwatch/image.png">
        <meta property="og:image:width" content="968">
        <meta property="og:image:height" content="504">
        <meta property="og:url" content="https://worldtime247.com/stopwatch/">
        <meta property="og:description" content="Online stopwatch. The online stopwatch displays up to 1000ths of a second when the start button is clicked. You can also add lap time.">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@worldtime247">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#000">
        <title id="main-title">Online Accurate Stopwatch - Millisecond Stopwatch</title>
        <link rel="canonical" href="https://worldtime247.com/stopwatch/">
        ${headLink}
        <link rel="stylesheet" href="/css/styles.css">
        <link rel="stylesheet" href="/css/icons.css">
        ${googleTagAds[0]}
    </head>
    <body class="dark-mode">
        <div class="modal fade" id="embed-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-embed-title" aria-hidden="true" aria-describedby="iframe embed code modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form class="modal-form">
                        <div class="modal-header">
                            <h3 id="embed-modal-label" class="modal-embed-title">Embed Code</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3 mt-2">
                                <label for="modal-select-size" class="form-label">Size</label>
                                <select class="form-select form-select-md mb-4" id="modal-select-clocksize" aria-label="select-clock-size" required>
                                    <option value="1" disabled>200 x 120</option>
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
                                    <div for="embed-html-textarea" class="mb-2">HTML</div>
                                    <a id="clipboard-copy" role="button" role="img" aria-label="clipboard copy">
                                        <i id="icon-clipboard" class="bi bi-clipboard" data-bs-toggle="tooltip" aria-label="clipboard copy icon" data-bs-placement="top" data-bs-trigger="hover"
                                            title="Copy"></i>
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
                    <img src="/assets/imgs/logo.png" width="120px" height="60px" alt="Home">
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
                        <a class="nav-link-top" id="navbarDropdownTools" href="#" role="button" type="button" data-bs-auto-close="outside" data-bs-toggle="dropdown" aria-label="display tools"
                            aria-expanded="false">
                            <div class="nav-link-icon">
                                <i class="bi bi-tools" role="img" aria-label="display tools" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Setting" data-bs-trigger="hover"></i>
                            </div>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="navbarDropdown" aria-label="nav bar dropdown">
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
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <div class="container text-center">
                                    <p>Second Units</p>
                                    <div class="btn-group d-grid gap-1" role="group" id="dropdown-menu-dp" aria-label="Basic radio toggle button group">
                                        <input type="radio" class="btn-check" name="time-digit" id="decimalpoint-0" value="0">
                                        <label class="btn btn-outline-light" for="decimalpoint-0">00:00</label>
                                        <input type="radio" class="btn-check" name="time-digit" id="decimalpoint-1" value="1">
                                        <label class="btn btn-outline-light" for="decimalpoint-1">00:00:0</label>
                                        <input type="radio" class="btn-check" name="time-digit" id="decimalpoint-2" value="2">
                                        <label class="btn btn-outline-light" for="decimalpoint-2">00:00:00</label>
                                        <input type="radio" class="btn-check" name="time-digit" id="decimalpoint-3" value="3" checked>
                                        <label class="btn btn-outline-light" for="decimalpoint-3">00:00:000</label>
                                    </div>
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
                                <a class="nav-link active" href="/stopwatch/"><div class="sb-nav-link-icon"><i class="bi bi-stopwatch" role="img" aria-label="stopwatch"></i></div>Stopwatch</a>
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
                                                    <h1 class="main-display-title">Stopwatch</h1>
                                                    <div class="main-display text-center digital-font " id="main-display-time">
                                                        <span class="main-display-time text-break" id="main-time">00:00</span>
                                                        <span id="digit-point">.000</span>
                                                        <!-- date -->
                                                        <p class="main-display-date text-nowrap digital-font" id="main-date"></p>
                                                    </div>
                                                    <div class="text-justify mt-3" id="button-position">
                                                        <button class="btn btn-warning btn-lg m-2 btn-custom" type="button" role="button" id="btn-reset" aria-label="stopwatch reset"
                                                            disabled>Reset&nbsp;<i class="bi bi-stop-fill" role="img" aria-label="reset time"></i></button>
                                                        <button class="btn btn-success btn-lg m-2 btn-custom" type="button" role="button" id="btn-lap" aria-label="lap time"
                                                            style="display:none">Lap&nbsp;<i class="bi bi-chevron-bar-right" role="img" aria-label="lap time"></i></button>
                                                        <button class="btn btn-primary btn-lg m-2 btn-custom" type="button" role="button" id="btn-start" aria-label="stopwatch start">Start&nbsp;<i
                                                                class="bi bi-play-fill" role="img" aria-label="stopwatch start"></i></button>
                                                        <button class="btn btn-danger btn-lg m-2 btn-custom" type="button" role="button" id="btn-stop" aria-label="stopwatch stop"
                                                            style="display:none;">Stop&nbsp;<i class="bi bi-pause-fill" role="img" aria-label="stopwatch stop"></i></button>
                                                    </div>
                                                </div>
                                                <div class="col-md-12" id="card-laps" style="display:none">
                                                    <div class="card align-items-center p-3">
                                                        <div class="card-body text-justify colored mt-0">
                                                            <table id="tables-laps" class="center table-laps">
                                                                <caption class="hidden-caption">time laps list</caption>
                                                                <thead>
                                                                    <tr>
                                                                        <th class="p-3 pt-0 text-center">LAP</th>
                                                                        <th class="p-3 pt-0 text-center">TIME</th>
                                                                        <th class="p-3 pt-0">TOTAL TIME</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr class="laps-record digital-font">
                                                                        <td class='text-center'></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>
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
                                                    ${googleTagAds[1]}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12">
                                        <div class="card mb-4">
                                            <h2 class="card-header">How to use the accurate online stopwatch</h2>
                                            <div class="card-body">
                                                <p>The accurate <strong>online stopwatch</strong> will display up to thousandths of a second when you click the "Start" button. You can also add laps. Closing the
                                                    stopwatch automatically saves your records and laps. If the duration is long enough, the past days are also displayed.</p>
                                                <p>In the stopwatch settings, you can decide how many fractions of a second you want to set.</p>
                                                <p>To start or stop the stopwatch, click the "Start" or "Stop" button. Click the "Lap" button to add the current time of the lap and stopwatch to the
                                                    lap list. To reset the lap and stopwatch times, click the "Reset" button (this button is displayed when the stopwatch is stopped).</p>
                                                <p>You can add links to a list of different times and laps to your browser's favorites.</p>
                                                <p>Start measuring accurate time using our <strong>online stopwatch</strong> right now.</p>
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
            <script src="/js/stopwatch.js"></script>
        </div>
    </body>
</html>`;
    res.send(html);
})

module.exports = router;