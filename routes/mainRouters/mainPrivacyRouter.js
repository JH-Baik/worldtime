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
        <meta name="description" content="Describes the privacy policy of this website.">
        <meta name="keywords" content="privacy policy">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        <link rel="alternate" type="embed" href="https://WorldTime247.com/embed/privacy/">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@worldtime247">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#000">
        <title id="main-title">Privacy Policy | WorldTime247.com</title>
        <link rel="canonical" href="https://worldtime247.com/privacy/">
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
                            <div class="row">
                                    <div class="col-xl-12">
                                        <div class="card mt-3 mb-3">
                                            <h1 class="card-header" style="font-size:2rem">Privacy Policy</h1>
                                            <div class="card-body">
                                                <p>Last Updated: December 2, 2022</p>
                                                <p>This site is owned and operated by Baik's Corporation (hereinafter referred to as "BAIK"). Your privacy on the Internet is of the utmost importance to us. At BAIK, we want to make your experience online satisfying and safe.</p>
                                                <p>Because we gather certain types of information about our users, we feel you should fully understand the terms and conditions surrounding the capture and use of that information. This privacy statement discloses what information we gather and how we use it.</p>
                                                <h2>INFORMATION BAIK GATHERS AND TRACKS</h2>
                                                    <p>BAIK gathers two types of information about users:</p>
                                                    <p>Information that users provide through optional, voluntary submissions. These are voluntary submissions to receive our electronic newsletters, to participate in our message boards or forums, to email a friend, and from participation in polls and surveys:</p>
                                                    <p>Information BAIK gathers through aggregated tracking information derived mainly by tallying page views throughout our sites. This information allows us to better tailor our content to readers' needs and to help our advertisers and sponsors better understand the demographics of our audience. Because BAIK derives its revenue mainly from sponsorships and advertising, providing such aggregated demographic data is essential to keeping our service free to users. Under no circumstances does BAIK divulge any information about an individual user to a third party.</p>
                                                    <p>BAIK Gathers User Information In The Following Processes:</p>
                                                    <p>Optional Voluntary Information</p>
                                                    <p>We offer the following free services, which require some type of voluntary submission of personal information by users:</p>
                                                    <p><strong>1. Electronic newsletters</strong></p>
                                                    <p>We will offer a free electronic newsletter to users. BAIK gathers the email addresses of users who voluntarily subscribe. Users may remove themselves from this mailing list by following the link provided in every newsletter that points users to the subscription management page. Users can also subscribe to the newsletters at the time of registration.</p>
                                                    <p><strong>2. Message boards/forums</strong></p>
                                                    <p>Users of the site's Message Boards and Forums must register separately for these services (both are free of charge) in order to post messages, although they needn't register to visit the site. During registration the user is required to supply a username, password, and email address.</p>
                                                    <p><strong>3. "E-mail this to a friend" Service</strong></p>
                                                    <p>Our site users can choose to electronically forward a link, page, or documents to someone else by clicking "e-mail this to a friend". The user must provide their email address, as well as that of the recipient. This information is used only in the case of transmission errors and, of course, to let the recipient know who sent the email. The information is not used for any other purpose.</p>
                                                    <p><strong>4. Polling</strong></p>
                                                    <p>We may offer interactive polls to users so they can easily share their opinions with other users and see what our audience thinks about important issues. Opinions or other responses to polls are aggregated and are not identifiable to any particular user. BAIK may use a system to "tag" users after they have voted, so they can vote only once on a particular question. This tag is not correlated with information about individual users.</p>
                                                    <p><strong>5. Surveys</strong></p>
                                                    <p>BAIK may occasionally conduct user surveys to better target our content to our audience. We sometimes share the aggregated demographic information in these surveys with our sponsors, advertisers and partners. We never share any of this information about specific individuals with any third party.</p>
                                                    <p>Children</p>
                                                    <p>Consistent with the Federal Children's Online Privacy Protection Act of 1998 (COPPA), we will never knowingly request personally identifiable information from anyone under the age of 13 without requesting parental consent.</p>
                                                    <p>Usage tracking</p>
                                                    <p>BAIK tracks user traffic patterns throughout all of our sites. However, we do not correlate this information with data about individual users. BAIK does break down overall usage statistics according to a user's domain name, browser type, and MIME type by reading this information from the browser string (information contained in every user's browser).</p>
                                                    <p>BAIK sometimes tracks and catalogs the search terms that users enter in our Search function, but this tracking is never associated with individual users. We use tracking information to determine which areas of our sites users like and don't like based on traffic to those areas. We do not track what individual users read, but rather how well each page performs overall. This helps us continue to build a better service for you.</p>
                                                    <p>Cookies</p>
                                                    <p>We may place a text file called a "cookie" in the browser files of your computer. The cookie itself does not contain Personal Information although it will enable us to relate your use of this site to information that you have specifically and knowingly provided. But the only personal information a cookie can contain is information you supply yourself. A cookie can't read data off your hard disk or read cookie files created by other sites. BAIK uses cookies to track user traffic patterns (as described above). Our advertising system delivers a one-time cookie to better track ad impressions and click rates.</p>
                                                    <p>You can refuse cookies by turning them off in your browser. If you've set your browser to warn you before accepting cookies, you will receive the warning message with each cookie. You do not need to have cookies turned on to use this site. However, you do need cookies to participate actively in message boards, forums, polling and surveys.</p>
                                                <h2>USE OF INFORMATION</h2>
                                                    <p>BAIK uses any information voluntarily given by our users to enhance their experience in our network of sites, whether to provide interactive or personalized elements on the sites or to better prepare future content based on the interests of our users.</p>
                                                    <p>As stated above, we use information that users voluntarily provide in order to send out electronic newsletters and to enable users to participate in polls, surveys, message boards, and forums. We send out newsletters to subscribers on a regular schedule (depending on the newsletter), and occasionally send out special editions when we think subscribers might be particularly interested in something we are doing. BAIK never shares newsletter mailing lists with any third parties, including advertisers, sponsors or partners.</p>
                                                    <p>When we use tracking information to determine which areas of our sites users like and don't like based on traffic to those areas. We do not track what individual users read, but rather how well each page performs overall. This helps us continue to build a better service for you. We track search terms entered in Search function as one of many measures of what interests our users. But we don't track which terms a particular user enters.</p>
                                                    <p>SHARING OF THE INFORMATION</p>
                                                    <p>BAIK uses the above-described information to tailor our content to suit your needs and help our advertisers better understand our audience's demographics. This is essential to keeping our service free. We will not share information about individual users with any third party, except to comply with applicable law or valid legal process or to protect the personal safety of our users or the public.</p>
                                                <h2>SECURITY</h2>
                                                    <p>BAIK operates secure data networks protected by industry standard firewall and password protection systems. Our security and privacy policies are periodically reviewed and enhanced as necessary and only authorized individuals have access to the information provided by our customers.</p>
                                                <h2>YOUR CONSENT</h2>
                                                    <p>By using this site, you consent to the collection and use of this information by BAIK. If we decide to change our privacy policy, we will post those changes on this page so that you are always aware of what information we collect, how we use it, and under what circumstances we disclose it.</p>
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
                                        <span><a href="/contact/">Contact Me</a> | <a href="/terms/">Terms of Service</a> | &copy;2023 worldtime247</span>
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