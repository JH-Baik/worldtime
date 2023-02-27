const express = require('express');
const router = express.Router();
const fs = require('fs');
const isDEPLOY = (fs.readFileSync('./isdeploy.txt', { encoding: 'utf8', flag: 'r' }) != 'true') ? false : true;
let googleTagAds = ['',];
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
}

const headLink = fs.readFileSync('./routes/htmlParts/head-link.html', { encoding: 'utf8', flag: 'r' });
const colorMenu = fs.readFileSync('./routes/htmlParts/color-menu.html', { encoding: 'utf8', flag: 'r' });

const LANG = 'en';

router.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="${LANG}" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="If you have any questions about worldtime247, please contact me">
        <meta name="keywords" content="contact baik">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        <link rel="alternate" type="embed" href="https://WorldTime247.com/embed/contact/">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@worldtime247">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#000">
        <title id="main-title">Contact Me | WorldTime247.com</title>
        <link rel="canonical" href="https://worldtime247.com/contact/">
        ${headLink}
        <link rel="stylesheet" href="/css/styles.css">
        <link rel="stylesheet" href="/css/icons.css">
        ${googleTagAds[0]}
    </head>
    <body class="dark-mode">
        <div class="sb-nav-fixed" style="display: block;">
            <nav class="sb-topnav navbar navbar-expand">
                <!-- Navbar Brand-->
                <a class="navbar-brand ps-1" href="/" role="button" type="button">
                    <img src="/assets/imgs/logo.png" width="120p" height="60p" alt="Home">
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
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="navbarDropdown" aria-label="nav bar drop down">
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
                <div class="fullscreen-section-parent" id="layoutSidenav_content">
                    <div class="fullscreen-section-child">
                        <main>
                            <div class="container-fluid px-4 py-3">
                                <div class="col-lg-12">
                                    <div class="card mt-3 mb-3 colored" id="contact-form">
                                        <div class="card-heading mt-5 contact-me">
                                            <h1>Contact Me</h1>
                                        </div>
                                        <div class="card-body">
                                            <form class="row" method="post" action="">
                                                <div class="mb-3 mt-1 row">
                                                    <label class="col-sm-2 col-md-2 col-lg-3 control-label"></label>
                                                    <div class="col-sm-9 col-md-8 col-lg-6">
                                                        <div class="form-floating mb-3">
                                                            <input type="text" class="form-control" id="user-name" spellcheck="false" placeholder="Optional">
                                                            <label for="user-name">Your Name</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-3 mt-1 row">
                                                    <label class="col-sm-2 col-md-2 col-lg-3 control-label"></label>
                                                    <div class="col-sm-9 col-md-8 col-lg-6">
                                                        <div class="form-floating mb-3">
                                                            <input id="user-phone" type="tel" name="user-phone" spellcheck="false" placeholder="Optional">
                                                            <label for="user-phone">Your Phone Number</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-3 row">
                                                    <label class="col-sm-2 col-md-2 col-lg-3 control-label"></label>
                                                    <div class="col-sm-9 col-md-8 col-lg-6">
                                                        <div class="form-floating mb-3">
                                                            <input type="email" class="form-control" id="email-address" spellcheck="false" placeholder="Enter a valid e-mail address" required>
                                                            <label for="email-address">Email Address</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-3 row">
                                                    <label class="col-sm-2 col-md-2 col-lg-3 control-label"></label>
                                                    <div class="col-sm-9 col-md-8 col-lg-6">
                                                        <div class="form-floating">
                                                            <textarea class="form-control" placeholder="Leave a comment here" id="comments" spellcheck="false" required></textarea>
                                                            <label for="comments">Comments</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-4 mt-3 row text-center">
                                                    <!-- Submit success message-->
                                                    <div class="d-none" id="submitSuccessMessage">
                                                        <div class="text-center text-white mb-3"><div class="fw-bolder">Message submission successful!</div></div>
                                                    </div>
                                                    <!-- Submit error message-->
                                                    <div class="d-none" id="submitErrorMessage">
                                                        <div class="text-center text-danger mb-3">Error sending message!</div>
                                                    </div>
                                                    <div class="col-md-12">
                                                        <button type="submit" class="btn btn-custom btn-primary" id="btnSubmit">Send</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-12">
                                        <div class="card mt-3 mb-3">
                                            <h2 class="card-header">About this site</h2>
                                            <div class="card-body">
                                                <p>As a small project to study JavaScript, I made several online clocks with different functions, along with a <strong>clock to check the current world time.</strong></p>
                                                <p>The front-end of this site uses Vanilla JavaScript and the Bootstrap framework, and the back-end was built with Node.js. Text data crawling was done
                                                    using Python and the BeautifulSoup library.</p>
                                                <p>IANA 2022 data was applied to the time zone data, and JavaScript libraries such as datatable, datetimepicker, moment.js, and some open sources were
                                                    applied according to the characteristics of each clock.</p>
                                                <p>If there are any errors or corrections on this site, or if you have any questions , please feel free to leave a message and I will respond.</p>
                                                <p>Also, I would like to express my sincere thanks to the numerous coding-related bloggers who have greatly helped me to implement features I had not
                                                    known about, and I would also like to thank those who visited this site and read this article to the end.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-lg btn-secondary show-none" aria-label="back-to-top button" id="btn-back-to-top">
                                <i class="bi bi-chevron-compact-up" role="img" aria-label="back to top"></i>
                            </button>
                        </main>
                        <footer class="py-3 bg-dark">
                            <div class="container-fluid px-4">
                                <div class="d-flex align-items-center justify-content-center small">
                                    <div class="text-muted">
                                        <span><a href="/privacy/">Privacy Policy</a> | <a href="/terms/">Terms of Service</a> | &copy;2023 worldtime247</span>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
            <!-- javascrip -->
            <script src="/lib/bootstrap.bundle.min.js"></script>
            <script src="/js/main.js"></script>
            <script src="/js/contact.js"></script>
        </div>
    </body>
</html>`;
    res.send(html);
})

module.exports = router;