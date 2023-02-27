/*!
 * Start Bootstrap - SB Admin v7.0.5 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2022 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */

/*!
 * Simple-DataTables
 * https://github.com/fiduswriter/Simple-DataTables/wiki
*/

/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ############
 *   main.js
 * ############
 */

let sidebarToggle = document.body.querySelector('#sidebarToggle');
if (sidebarToggle) {
    //persist sidebar toggle between refreshes
    if (localStorage.getItem('sb|sidebar-toggle') == 'true') {
        document.body.classList.toggle('sb-sidenav-toggled');
    }

    sidebarToggle.addEventListener('click', (event) => {
        event.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    });
}

function openFullscreenMode() {
    var doc = document.documentElement;
    if (doc.requestFullscreen) doc.requestFullscreen();
    else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
    else if (doc.mozRequestFullScreen) doc.mozRequestFullScreen();
    else if (doc.msRequestFullscreen) doc.msRequestFullscreen();
    document.querySelector(".sb-nav-fixed").style = "display: none;";
    document.querySelector("#btn-share").style = "display: none;";
    getFullscreenSection = document.querySelector(".fullscreen-section-child");
    fullscreenDisplay = document.querySelector(".fullscreen-display");
    fullscreenDisplay.style = "display: block; margin-top:76px;";
    fullscreenDisplay.appendChild(getFullscreenSection);
    btnFullscreen.style.display = "none";
    btnExitFullscreen.style.display = "block";
    document.body.style.overflow = "hidden"
}

function exitFullscreenMode() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
}

addEventListener("fullscreenchange", (event) => {
    if (document.fullscreenElement == null) exitEvent();
    function exitEvent() {
        getFullscreenSection = document.querySelector(".fullscreen-section-child");
        fullscreenParent = document.querySelector(".fullscreen-section-parent");
        fullscreenParent.insertBefore(getFullscreenSection, fullscreenParent.firstChild);
        fullscreenDisplay.style = "display: none";
        document.querySelector(".sb-nav-fixed").style = "display: block;";
        document.querySelector("#btn-share").style = "display: block;";
        btnExitFullscreen.style.display = "none";
        btnFullscreen.style.display = "block";
        document.body.style.overflow = "auto"
    }
});

function darkThemeChangeToggle() {
    document.getElementById('btnswitch-dark-mode').checked = isDarkMode;
    let colorMono = document.querySelector('#color-mono');

    if (document.querySelector('body').classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        document.querySelector('#btn-darkmode-true').style.display = 'block';
        document.querySelector('#btn-darkmode-false').style.display = 'none';
        colorMono.textContent = 'Lamp Black';
        colorMono.classList.replace('btn-outline-light', 'btn-outline-primary');
        colorNames.mono[1] = '#495057';
        if (colorId == 0) stringColorChangeToggle('btncolor-mono');
        if (colorId == 4) {
            stringColorChangeToggle('btncolor-mono');
            document.querySelector('#btncolor-mono').checked = true;
        }
        document.getElementsByName('theme-color')[0].content = '#E9ECEF';
    } else {
        document.body.classList.add('dark-mode');
        document.querySelector('#btn-darkmode-true').style.display = 'none';
        document.querySelector('#btn-darkmode-false').style.display = 'block';
        colorMono.textContent = 'Snow White';
        colorMono.classList.replace('btn-outline-primary', 'btn-outline-light');
        colorNames.mono[1] = '#dee2e6';
        if (colorId == 0) {
            stringColorChangeToggle('btncolor-orange');
            document.querySelector('#btncolor-orange').checked = true;
        }
        document.getElementsByName('theme-color')[0].content = '#000000';
    }

    saveLocalstorage();
}

// SNS share button event handling
function shareSns(){
    const btnShareFb = document.querySelector('#btn-sns-facebook');
    const btnShareTw = document.querySelector('#btn-sns-twitter');
    const btnSharePr = document.querySelector('#btn-sns-pinterest');
    const btnShareLi = document.querySelector('#btn-sns-linkedin');
    const btnShareRd = document.querySelector('#btn-sns-reddit');
    const btnShareWa = document.querySelector('#btn-sns-whatsapp');
    const btnShareCl = document.querySelector('#btn-sns-copylink');

    const sendText = document.querySelector('#main-title').textContent;
    const HREF = location.href;
    const stageW = (window.innerWidth > 500) ? 500 : window.innerWidth;
    const stageH = (window.innerHeight > 600) ? 600 : window.innerHeight;
    
    btnShareFb.addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${HREF}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });
    btnShareTw.addEventListener('click', () => {
        window.open(`https://twitter.com/intent/tweet?text=${sendText.replace(/[|]/gi,'-')}&url=${HREF}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });
    btnSharePr.addEventListener('click', () => {
        window.open(`https://pinterest.com/pin/create/button/?url=${HREF}&media=${HREF}image.png&description=${sendText}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });
    btnShareLi.addEventListener('click', () => {
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${HREF}&title=${sendText}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });
    btnShareRd.addEventListener('click', () => {
        window.open(`https://reddit.com/submit?url=${HREF}&title=${sendText}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });
    btnShareWa.addEventListener('click', () => {
        window.open(`https://api.whatsapp.com/send/?phone&app_absent=0&text=${HREF}`, 'Popup', `width=${stageW}, height=${stageH}`);
    });

    btnShareCl.addEventListener('click', () => {
        navigator.clipboard.writeText(HREF)
            .then(() => {
                document.querySelector('.bi-link-45deg').style.display = 'none';
                document.querySelector('#link-copied').style.display = 'inline-block';

                setTimeout(() => {
                    document.querySelector('#link-copied').style.display = 'none';
                    document.querySelector('.bi-link-45deg').style.display = 'inline-block';
                }, 2000);
            })
            .catch(err => {
                document.querySelector('#link-copy-failed').style.display = 'block';
            })
    });
}
