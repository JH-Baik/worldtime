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
        <meta name="description" content="Describes the terms and conditions of this website.">
        <meta name="keywords" content="Terms and Conditions">
        <meta name="copyright" content="Copyright (c) Baik">
        <meta name="author" content="Baik">
        <link rel="alternate" type="embed" href="https://WorldTime247.com/embed/terms/">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:site" content="@worldtime247">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#000">
        <title id="main-title">Terms and Conditions | WorldTime247.com</title>
        <link rel="canonical" href="https://worldtime247.com/terms/">
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
                                            <h1 class="card-header" style="font-size:2rem">Terms and Conditions</h1>
                                            <div class="card-body">
                                                <p>Last Updated: December 2, 2022</p>
                                                <p>The following terms (hereinafter referred to as "Terms and Conditions") - which include the <a href="/privacy/">Privacy Policy</a> of this website (hereinafter referred to as "Website") - are a legally binding contractual agreement between you (hereinafter referred to as "User," "you," "your") and Baik's Corporation (hereinafter referred to as "BAIK").</p>
                                                <h2>TERMS AND CONDITIONS TO USE THIS WEBSITE</h2>
                                                    <p>The contents of this Website can be shared, redistributed, embedded, and copied. All we ask is that you include a link back to this Website.</p>
                                                    <p>The contents of this Website cannot be modified or sold without the express written permission of BAIK.</p>
                                                    <p>BAIK is not responsible in any way for the contents of third party websites mentioned or advertised in this Website.</p>
                                                    <p>BAIK is not liable or responsible for adverse effects resulting from the use of this Website.</p>
                                                    <p>BAIK is not liable or responsible for the contents of websites that have a link to this Website, or for websites that use the contents of this Website.</p>
                                                    <p>By using this Website, in any way, you agree to these Terms and Conditions.</p>
                                                    <p>BAIK does not warrant that this Website is or will always be free from errors, interruptions, omissions or defects, or that BAIK will correct any errors, interruptions, omissions or defects. You assume all costs that may arise out of the use of this Website.</p>
                                                    <p>In no situation will BAIK or any of its affiliates, officers, directors, employees, licensors, suppliers or distributors be liable for any direct, indirect, special, incidental, economic or consequential damages arising out of the use of this Website, even if BAIK has been advised of the possibility of such damages. Furthermore, in no situation will liability of BAIK or any of its affiliates, officers, directors, employees, licensors, suppliers or distributors exceed the amount paid by you, if any, to purchase products or services from BAIK.</p>
                                                    <p>BAIK reserves the right to modify these Terms and Conditions at any time, for any reason and without prior notice. In such case, the modified Terms and Conditions will take effect when they are published.</p>
                                                <h2>Prohibited Uses And Intellectual Property</h2>
                                                    <p>We grant you a non-transferable, non-exclusive, revocable license to access and use the Site from one device in accordance with the Terms.</p>
                                                    <p>You shall not use the Site for unlawful or prohibited purposes. You may not use the Site in a way that may disable, damage, or interfere in the Site.</p>
                                                    <p>All content present on the Site includes text, code, graphics, logos, sounds, images, compilation, software used on the Site (hereinafter and hereinbefore the "Content"). The Content is our property or of our contractors and protected by intellectual property laws. You agree to use all copyright and other proprietary notices or restrictions contained in the Content and you are prohibited from changing the Content.</p>
                                                    <p>You may not publish, transmit, modify, reverse engineer, participate in the transfer, or create and sell derivative works, or in any way use any of the Content. Your enjoyment of the Site shall not entitle you to make any illegal and disallowed use of the Content, and in particular, you shall not change proprietary rights or notices in the Content. You shall use the Content only for your personal and non-commercial use. We do not grant you any licenses to our intellectual property unless allowed in this clause.</p>
                                                <h2>Termination and Access Restriction</h2>
                                                    <p>We may terminate your access to the Site and its related services or any part at any time, without notice.</p>
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
                                        <span><a href="/contact/">Contact Me</a> | <a href="/privacy/">Privacy Policy</a> | &copy;2023 worldtime247</span>
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