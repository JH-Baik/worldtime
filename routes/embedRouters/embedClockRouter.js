const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="embed code for worldtime247's clock">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        <title id="main-title">Online Clock - WorldTime247.com</title>
        <link rel="canonical" href="https://worldtime247.com/clock/">
        <link rel="stylesheet" href="/css/_styles.css">
        <meta name="theme-color" content="null">
        <link rel="shortcut icon" sizes="16x16" href="/assets/favicons/android-chrome-16x16.png" type="image/png">
        <style>
        </style>
    </head>
    <body class="dark-mode embed">
        <main>
            <div class="colored fade-in text-center pt-3">
                <div class="main-display-title">Current Time</div>
                <div class="main-display" id="main-display-time">
                    <span class="main-display-time digital-font text-break" id="main-time"></span>
                </div>
                <p class="main-display-date text-nowrap" id="main-date"></p>
                <div class="position-absolute top-0 end-0">
                    <a href="/clock/" type="button" role="button" class="btn btn-light btn-floating"
                        id="btn-visitWebsite" aria-label="visit website" title="online clock - current time - exact time - world time - WorldTime247.com" data-toggle="tooltip" target="_blank">
                        <div class="embed-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house-door" viewBox="0 0 16 16">
                                <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>
                            </svg>
                        </div>
                    </a>
                </div>
            </div>
        </main>
        <script src="/js/embed/embed_clock.js"></script>
    </body>
</html>`;
    res.send(html);
});

module.exports = router;