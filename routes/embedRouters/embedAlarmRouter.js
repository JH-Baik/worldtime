const express = require('express');
const router = express.Router();

function timeFormat(h, m) {
    let sign = (h < 12) ? 'AM' : 'PM';
    h = (h % 12 !== 0) ? h % 12 : 12;
    return `${h}:${m.toString().padStart(2, '0')} ${sign}`;
}
const NOW = new Date();
let timeLabel = 'h23'; // 'h12'
const OPTIONS_TIME = { hourCycle: timeLabel, hour: 'numeric', minute: '2-digit', second: '2-digit', };
const OPTIONS_DATE = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
const TIME = NOW.toLocaleTimeString('en', OPTIONS_TIME);
const TODAY = NOW.toLocaleDateString('en', OPTIONS_DATE);

router.get('/', (req, res) => {
    const URL = req.originalUrl.split('/');
    const URL_LENGTH = URL.length;
    let el = '';
    let title = '';
    for (e of URL) {
        if (e !== '' && e !== 'embed') el += `/${e}`;
    }
    el += '/';
    if (el === '/alarmclock/') el = '/';

    const RE = /^(set-alarm-for-)([0-9]|1[0-9]|2[0-3])-([0-9]|[0-5][0-9])$/g;
    if (URL.length > 1 && URL[URL_LENGTH - 2].match(RE)) {
        getSetTime = URL[URL_LENGTH - 2].split('-');
        const TIME = timeFormat(getSetTime[3], getSetTime[4])
        title = `Set Alarm for ${TIME}`;
    }

    const html = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="${title}. embed code for worldtime247's alarm clock">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        <title id="main-title">${title} - Online Alarmclock - WorldTime247.com</title>
        <link rel="canonical" href="https://worldtime247.com${el}">
        <link rel="stylesheet" href="/css/_styles.css">
        <meta name="theme-color" content="null">
        <link rel="shortcut icon" sizes="16x16" href="/assets/favicons/android-chrome-16x16.png" type="image/png">
        <style></style>
    </head>
    <body class="dark-mode embed-alarmclock">
        <main>
            <div class="modal fade" id="alarm-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-alarm-title1" aria-hidden="true"
                aria-describedby="alarm modal">
                <div class="modal-dialog modal-dialog-centered modal-sm">
                    <div class="modal-content">
                        <form class="modal-form">
                            <div class="modal-header">
                                <h3 class="modal-alarm-title" id="modal-alarm-title1">Alarm</h3>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="text-center">
                                    <div class="icon-alarm text-danger vibration m-3">
                                        <i class="bi bi-alarm-fill" role="img" aria-label="display alarm message"></i>
                                    </div>
                                    <h4 id="set-alarm-title-display"></h4>
                                    <h4 id="set-alarm-time-display"></h4>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary btn-custom" data-bs-dismiss="modal" aria-label="Close">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-xl-12">
                        <div class="text-center align-self-center" id="main-card">
                            <div class="card-body colored pt-2 pb-2">
                                <h1 class="main-display-title m-0">${title}</h1>
                                <div class="main-display text-center" id="main-display-time">
                                    <p class="main-display-time digital-font text-break m-0" style="line-height: 1.2;" id="main-time">${TIME}</p>
                                    <span class="main-display-date text-nowrap digital-font m-0" style="line-height: 1.2;" id="main-date">${TODAY}</span>
                                </div>
                            </div>
                            <div class="text-center">
                                <button class="btn btn-primary btn-sm" type="button" role="button" id="btn-set-alarm" aria-label="set alarm">Set Alarm</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" id="row-display-alarm">
                    <div class="col-md-12">
                        <div class="align-items-center">
                            <div class="card-body text-center text-ellipsis p-0">
                                <div id="display-alarm">
                                    <h2 class="main-title m-0" style="line-height: 1.2;" id="alarm-title"></h2>
                                    <div id="card-alarm-time">
                                        <i class="bi bi-alarm"></i>
                                        <span id="content-alarm-time"></span>
                                    </div>
                                    <div id="card-alarm-timer">
                                        <i class="bi bi-clock-history"></i>
                                        <span id="content-alarm-timer"></span>
                                    </div>
                                    <button type="button" class="btn btn-danger btn-sm mt-1" id="btn-stop-alarm">Stop Alarm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="position-absolute top-0 end-0">
                    <a href="/" type="button" role="button" class="btn btn-light btn-floating"
                        id="btn-visitWebsite" aria-label="visit website" title="${title} - Digital Alram Clock - WorldTime247.com" data-toggle="tooltip" target="_blank">
                        <div class="embed-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
                                <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
                            </svg>
                        </div>
                    </a>
                </div>
            </div>
        </main>
        <script src="/lib/bootstrap.bundle.min.js"></script>
        <script src="/js/embed/embed_alarmclock.js"></script>
    </body>
</html>`;
    res.send(html);
});

module.exports = router;