const express = require('express');
const router = express.Router();
const lunar2solar = require('../route-data/lunardate.js');

const YR = parseInt(new Date().getFullYear());
function secondsToHMS(seconds) {
    const DAYS = parseInt(seconds / (3600 * 24));
    const HOURS = parseInt(seconds / 3600 % 24);
    const MINUTES = parseInt(seconds % 3600 / 60).toString();
    const SECONDS = parseInt(seconds % 3600 % 60).toString();
    const TIME_FORMAT = (HOURS || DAYS) ? `${HOURS.toString().padStart(2, '0')}:${MINUTES.padStart(2, '0')}:${SECONDS.padStart(2, '0')}` :
        `${MINUTES.padStart(2, '0')}:${SECONDS.padStart(2, '0')}`;
    let days = DAYS == '0' ? '' : (parseInt(DAYS) > 1) ? `${DAYS}Days` : `${DAYS}Day`;
    return [days, TIME_FORMAT];
}

function checkQuery(getSetDay) {
    for (someDay of gl) {
        const DAY = someDay[0].replace(/\s/gi, '-').replace(/[']/gi, '');
        if (DAY == getSetDay) {
            isHash = false;
            return someDay;
        }
    } return false;
}

function getSpecialDay(year, day) {
    switch (day) {
        case 'Thanksgiving':
            first = new Date(year, 10, 1);
            day_of_week = first.getDay();
            return `11-${22 + (11 - day_of_week) % 7}`;
        case 'Black Friday':
            first = new Date(year, 10, 1);
            day_of_week = first.getDay();
            return `11-${23 + (11 - day_of_week) % 7}`;
        case 'Korean New Year':
            return lunar2solar(year + '0101');
        case 'Korean Thanksgiving':
            return lunar2solar(year + '0815');
        case "Buddha's Birthday":
            return lunar2solar(year + '0408');
        case 'Chinese New Year':
            return lunar2solar(year + '0101');
        default:
            return;
    }
}

let gl = [
    ['New Year', '1-1'],
    ['Chinese New Year', getSpecialDay(YR, 'Chinese New Year')],
    ['Korean New Year', getSpecialDay(YR, 'Korean New Year')],
    ['World Wetlands Day', '2-2'],
    ["Valentine's Day", '2-14'],
    ['World Cancer Day', '2-4'],
    ["Intl Women's Day", '3-8'],
    ['World Day for Water', '3-22'],
    ['World Health Day', '4-7'],
    ['Labor Day', '5-1'],
    ["Buddha's Birthday", getSpecialDay(YR, "Buddha's Birthday")],
    ['World Environment Day', '6-5'],
    ['World Blood Donor Day', '6-14'],
    ['Intl Youth Day', '8-12'],
    ['Intl Day of Peace', '9-21'],
    ['Korean Thanksgiving', getSpecialDay(YR, 'Korean Thanksgiving')],
    ['United Nations Day', '10-24'],
    ['Halloween', '10-31'],
    ["Children's Day", '11-20'],
    ['Thanksgiving', getSpecialDay(YR, 'Thanksgiving')],
    ['Black Friday', getSpecialDay(YR, 'Black Friday')],
    ['Christmas', '12-25'],
];

function getDate(globalDay, year) {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const SP_DAY = ['Thanksgiving', 'Black Friday', 'Korean New Year', 'Korean Thanksgiving', "Buddha's Birthday", 'Chinese New Year'];
    if (SP_DAY.includes(globalDay[0])) globalDay[1] = getSpecialDay(year, globalDay[0]);
    let gMonthDay = globalDay[1].split('-');
    let M = MONTHS[parseInt(gMonthDay[0]) - 1];
    let D = gMonthDay[1];
    let targetDay = new Date((`${D}-${M}-${year}`)).getTime() / 86400000;
    let today = new Date(new Date().toDateString()).getTime() / 86400000;
    if ((targetDay - today) < -29) {
        year = year + 1;
        if (SP_DAY.includes(globalDay[0])) {
            globalDay[1] = getSpecialDay(year, globalDay[0]);
            gMonthDay = globalDay[1].split('-');
            M = MONTHS[parseInt(gMonthDay[0]) - 1];
            D = gMonthDay[1];
        };
        targetDay = new Date((`${D}-${M}-${year}`)).getTime() / 86400000;
    }
    const GAP_DAY = targetDay - today;
    const SHOW_GAP = (Math.abs(GAP_DAY) < 2) ? DAY_NAME[GAP_DAY + 1] : `${GAP_DAY} Days`;
    return [year, M, D, GAP_DAY, SHOW_GAP];
}

router.get('/', (req, res) => {
    const URL = req.originalUrl.split('/');
    let el = '';
    for (e of URL) {
        if (e !== '' && e !== 'embed') el += `/${e}`;
    }
    el += '/';
    const el_LENGTH = el.split('/').length;
    let title = 'Online Timer';
    let mainDisplayTime = ['','',];
    if (el.match(/\b(set-timer-for-)[0-9]{1,5}[\-](Hour|Minute|Second)\b/g)) {
        let h = 0; let m = 0; let s = 0;
        let getSetTime = el.split('/')[el_LENGTH - 2].split('-');
        title = `${getSetTime[3]} ${getSetTime[4]} Timer`;
        if (getSetTime[4] == 'Hour') {
            h = getSetTime[3];
        } else if (getSetTime[4] == 'Minute') {
            m = getSetTime[3];
        } else if (getSetTime[4] == 'Second') {
            s = getSetTime[3];
        }
        const offsetT = h * 3600 + m * 60 + s;
        mainDisplayTime = secondsToHMS(offsetT);
    }

    const URL_LENGTH = URL.length;
    let spDay = URL[URL_LENGTH - 2];
    let year = YR;

    if (spDay.match(/\b(20)[0-9]{2}\b/g)) {
        year = parseInt(spDay);
        spDay = checkQuery(URL[URL_LENGTH - 3], year);
        date = getDate(spDay, year);
        title = `${spDay[0]} ${year}`;
    } else if (checkQuery(spDay)) {
        spDay = checkQuery(URL[URL_LENGTH - 2]);
        date = getDate(spDay, year);
        title = `${spDay[0]} ${year}`;
    }

    const html = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="embed code for worldtime247's timer">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        <title id="main-title">${title} - WorldTime247.com</title>
        <link rel="canonical" href="https://worldtime247.com${el}">
        <link rel="stylesheet" href="/css/_styles.css">
        <link rel="stylesheet" href="/css/icons.css">
        <meta name="theme-color" content="null">
        <link rel="shortcut icon" sizes="16x16" href="/assets/favicons/android-chrome-16x16.png" type="image/png">
        <style></style>
    </head>
    <body class="dark-mode embed-alarmclock">
        <div class="modal fade" id="test-timer-modal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-timer-title2" aria-hidden="true"
            aria-describedby="test timer modal">
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
        <main>
            <div class="container-fluid">
                <div class="row ">
                    <div class="col-md-12 p-0">
                        <div class="colored align-item-center">
                            <div class="card-body text-center">
                                <!-- main display -->
                                <h1 class="main-display-title">${title}</h1>
                                <div class="days-display text-center digital-font m-1" id="main-display-time">
                                    <span class="bi bi-arrow-up" role="img" aria-label="alarm past time" id="icon-past-time"></span>
                                    <span id="main-days">${mainDisplayTime[0]}</span>
                                    <span id="sub-days"></span>
                                    <span id="main-hours"></span>
                                    <span class="main-display-time" id="main-time">${mainDisplayTime[1]}</span>
                                </div>
                                <div class="main-display-date text-nowrap digital-font" id="dateTime-set-display"></div>
                                <div class="main-display-date text-nowrap digital-font" id="past-alarm-display"></div>
                                <span id="btn-group" style="display:inline-block;">
                                    <button class="btn btn-warning mt-3 btn-custom" type="button" role="button" id="btn-reset-timer"
                                        aria-label="reset timer">Reset</button>
                                    <button class="btn btn-danger mt-3 btn-custom" type="button" role="button" id="btn-stop-timer"
                                        aria-label="stop timer">Stop</button>
                                    <button class="btn btn-primary mt-3 btn-custom" type="button" role="button" id="btn-start-timer"
                                        aria-label="Start timer" style="display:none;">Start</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="position-absolute top-0 end-0">
                    <a href="${el}" type="button" role="button" class="btn btn-light btn-floating" id="btn-visitWebsite" aria-label="visit website"
                        title="${title} - Online Digital Timer - WorldTime247.com" data-toggle="tooltip" target="_blank">
                        <div class="embed-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
                                <path
                                    d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z">
                            </svg>
                        </div>
                    </a>
                </div>
            </div>
        </main>
        <!-- javascrip -->
        <script src="/lib/bootstrap.bundle.min.js"></script>
        <script src="/lib/lunardate.js"></script>
        <script src="/js/embed/embed_timer.js"></script>
    </body>
</html>`;
    res.send(html);
});

module.exports = router;