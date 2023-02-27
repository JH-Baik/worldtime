/*!
 * WorldTime247 ver0.2.5
 * Copyright (c) 2022 Baik
 * All rights reserved
 * ##############
 *   scripts.js
 * ##############
 */

const colorNames = {
    mono: [0, ""],
    blue: [1, "#1979d2"],
    green: [2, "#388e3c"],
    red: [3, "#d32f2f"],
    orange: [4, "#ff9900"]
};
let miniCardList = ["US_New York", "US_Los Angeles", "US_Honolulu", "US_Anchorage", "GB_London", "AU_Sydney", "CA_Toronto", "KR_Seoul", "CH_Zurich", "DE_Berlin", "SG_Singapore", "RU_Moscow", "CN_Shanghai", "JP_Tokyo", "VN_Ho Chi Minh"];
let cardIndex;

let getMiniCardData = localStorage.getItem("miniCards") ? JSON.parse(window.atob(localStorage.getItem("miniCards"))) : miniCardList;
if (localStorage.getItem("displayConfig")) {
    getLocalData = JSON.parse(localStorage.getItem("displayConfig"));
    isDigitalFont = Boolean(getLocalData.displayConfig.dF);
    isAmpm = Boolean(getLocalData.displayConfig.ap);
    isDateDisplay = Boolean(getLocalData.displayConfig.dD);
    isDarkMode = Boolean(getLocalData.displayConfig.dM);
    isRobot = Boolean(getLocalData.displayConfig.rb);
    colorId = getLocalData.displayConfig.cId;
    fontScale = getLocalData.displayConfig.fS;
    miniCardList = getMiniCardData;
    document.getElementById("btnswitch-digital-font").checked = isDigitalFont;
    document.getElementById("btnswitch-am-pm").checked = isAmpm;
    document.getElementById("btnswitch-date-display").checked = isDateDisplay;
    document.getElementById("btnswitch-dark-mode").checked = isDarkMode;
    document.getElementById("btnswitch-dancing-robot").checked = isRobot;
    document.getElementsByName("btncolor")[colorId].checked = true
} else {
    isDigitalFont = document.getElementById("btnswitch-digital-font").checked;
    isAmpm = document.getElementById("btnswitch-am-pm").checked;
    isDateDisplay = document.getElementById("btnswitch-date-display").checked;
    isDarkMode = document.getElementById("btnswitch-dark-mode").checked;
    isRobot = document.getElementById("btnswitch-dancing-robot").checked;
    colorId = colorCheckedId();
    fontScale = 1;

    function colorCheckedId() {
        var colorButtons = document.getElementsByName("btncolor");
        for (var i = 0; i < colorButtons.length; i++) {
            if (colorButtons[i].checked == true) {
                return colorButtons[i].value
            }
        }
    }
} (function () {
    for (i = 0; i < miniCardList.length; i++) {
        addMiniCard(miniCardList[i])
    }
    let colorMono = document.querySelector("#color-mono");
    if (isDarkMode == false) {
        document.body.classList.remove("dark-mode");
        document.querySelector("#btn-darkmode-true").style.display = "block";
        document.querySelector("#btn-darkmode-false").style.display = "none";
        colorMono.textContent = "Lamp Black";
        colorMono.classList.replace("btn-outline-light", "btn-outline-secondary");
        colorNames.mono[1] = "#495057";
        document.getElementsByName("theme-color")[0].content = "#E9ECEF"
    }
    else {
        document.querySelector("#btn-darkmode-true").style.display = "none";
        document.querySelector("#btn-darkmode-false").style.display = "block";
        colorMono.textContent = "Snow White";
        colorMono.classList.replace("btn-outline-secondary", "btn-outline-light");
        colorNames.mono[1] = "#dee2e6";
        document.getElementsByName("theme-color")[0].content = "#000000"
    }
    resizeFont();
    stringColorChangeToggle("btncolor-" + Object.keys(colorNames)[colorId]);
    digitalFontChangeToggle();
    dateDisplayChangeToggle();
    bgTransparentChange();
})();

try {
    Intl.DateTimeFormat("en-US",{timeZone: "Europe/Kyiv"});
} catch (err) {
    if (tzDatum[374].tzName == "Europe/Kyiv") {
        tzDatum[374].tzName = "Europe/Kiev";
    }
}

function bgTransparentChange() {
    if (isRobot) {
        if (isDarkMode) document.querySelector('#main-card').style.backgroundColor = 'rgba(0,0,0,0)';
        if (!isDarkMode) document.querySelector('#main-card').style.backgroundColor = 'rgba(255,255,255,0)';
    } else if (!isRobot) {
        if (isDarkMode) document.querySelector('#main-card').style.backgroundColor = 'rgba(0,0,0)';
        if (!isDarkMode) document.querySelector('#main-card').style.backgroundColor = 'rgba(255,255,255)';
    }
}

// When the user scrolls down 200px from the top of the document, show the button
let btnBackToTop = document.getElementById("btn-back-to-top");
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        btnBackToTop.classList.remove("disappear");
        btnBackToTop.classList.add("appear")
    }
    else {
        if (btnBackToTop.classList.contains("appear")) {
            btnBackToTop.classList.add("disappear");
            setTimeout(function () {
                btnBackToTop.classList.remove("appear")
            }, 501)
        }
    }
}
btnBackToTop.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0
}
const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')];
if (window.innerWidth > 991) {
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

const fontScaleMin = 0;
const fontScaleMax = 3;
let btnFontScaleUp = document.querySelector("#btn-fontscale-up");
btnFontScaleUp.addEventListener("click", () => {
    if (fontScale < fontScaleMax) fontScale++;
    resizeFont()
});
let btnFontScaleDown = document.querySelector("#btn-fontscale-down");
btnFontScaleDown.addEventListener("click", () => {
    if (fontScale > fontScaleMin) fontScale--;
    resizeFont()
});

function resizeFont() {
    const fontSizeObj = {
        time: [12, 14, 16, 20],
        date: [4, 5, 6, 7],
        title: [3, 3.5, 4, 4.5]
    };
    document.querySelector("#main-time").style.fontSize = `${fontSizeObj.time[fontScale]}vmin`;
    document.querySelector("#main-date").style.fontSize = `${fontSizeObj.date[fontScale]}vmin`;
    saveLocalstorage()
}

// fullscreen processing
let btnFullscreen = document.querySelector("#btn-fullscreen");
btnFullscreen.addEventListener("click", openFullscreenMode);
// exit fullscreen
let btnExitFullscreen = document.querySelector("#btn-exit-fullscreen");
btnExitFullscreen.addEventListener("click", exitFullscreenMode);

function miniCardDelete(e) {
    let miniCardsNode = document.querySelectorAll(".minicard");
    miniCardsNode[e.dataset.index].querySelector(".card-header").style.backgroundColor = "red";
    miniCardsNode[e.dataset.index].querySelector(".card-body").style.backgroundColor = "red";
    miniCardsNode[e.dataset.index].querySelector(".card-body").style.transition = "all 1s";
    miniCardsNode[e.dataset.index].querySelector(".card-header").style.transition = "all 1s";
    setTimeout(() => {
        miniCardList.splice(e.dataset.index, 1);
        removeElement = miniCardsNode[e.dataset.index];
        removeElement.parentNode.removeChild(removeElement);
        saveLocalstorage()
    }, 700)
}

function miniCardTop(e) {
    let miniCardsNode = document.querySelectorAll(".minicard");
    miniCardsNode[e.dataset.index].querySelector(".card-header").style.backgroundColor = "#4192c9";
    miniCardsNode[e.dataset.index].querySelector(".card-body").style.backgroundColor = "#4192c9";
    miniCardsNode[0].querySelector(".card-header").style.backgroundColor = "#4192c9";
    miniCardsNode[0].querySelector(".card-body").style.backgroundColor = "#4192c9";
    setTimeout(() => {
        miniCardsNode[e.dataset.index].querySelector(".card-header").style.backgroundColor = "";
        miniCardsNode[e.dataset.index].querySelector(".card-body").style.backgroundColor = "";
        miniCardsNode[0].querySelector(".card-header").style.backgroundColor = "";
        miniCardsNode[0].querySelector(".card-body").style.backgroundColor = "";
        let goToTopCard = miniCardList.splice(e.dataset.index, 1).toString();
        miniCardList.unshift(goToTopCard);
        saveLocalstorage()
    }, 350)
}

function miniCardUpDown(e) {
    let miniCardsNode = document.querySelectorAll(".minicard");
    let nextIdx = parseInt(e.dataset.index);
    if (e.dataset.index > 0 && e.id == "card-move-up") {
        nextIdx = parseInt(e.dataset.index) - 1
    }
    else if (e.dataset.index < miniCardList.length - 1 && e.id == "card-move-down") {
        nextIdx = parseInt(e.dataset.index) + 1
    }
    else return;
    miniCardsNode[e.dataset.index].querySelector(".card-header").style.backgroundColor = "#4192c9";
    miniCardsNode[e.dataset.index].querySelector(".card-body").style.backgroundColor = "#4192c9";
    miniCardsNode[nextIdx].querySelector(".card-header").style.backgroundColor = "#4192c9";
    miniCardsNode[nextIdx].querySelector(".card-body").style.backgroundColor = "#4192c9";
    setTimeout(() => {
        miniCardsNode[e.dataset.index].querySelector(".card-header").style.backgroundColor = "";
        miniCardsNode[e.dataset.index].querySelector(".card-body").style.backgroundColor = "";
        miniCardsNode[nextIdx].querySelector(".card-header").style.backgroundColor = "";
        miniCardsNode[nextIdx].querySelector(".card-body").style.backgroundColor = "";
        if (e.dataset.index > 0 && e.id == "card-move-up") {
            let target = miniCardList.splice(e.dataset.index, 1).toString();
            miniCardList.splice(nextIdx, 0, target)
        }
        else if (e.dataset.index < miniCardList.length - 1 && e.id == "card-move-down") {
            let target = miniCardList.splice(e.dataset.index, 1).toString();
            miniCardList.splice(nextIdx, 0, target)
        }
        else return;
        saveLocalstorage()
    }, 350)
}
let tzChangeElement = document.querySelectorAll("#modal-select-country, #modal-select-timezone");
tzChangeElement.forEach(tz => {
    tz.addEventListener("change", e => {
        if (e.target.id == "modal-select-country") {
            document.querySelector("#modal-select-timezone").textContent = "";
            citySelect(e.target.value, "")
        }
        else {
            titleInput()
        }
    })
});
document.querySelector("#createNewCard").addEventListener("click", e => {
    let ncCountry = document.getElementById("modal-select-country");
    let ncCity = document.getElementById("modal-select-timezone");
    let ncTitle = document.getElementById("modal-input-title");
    if (!ncCountry.value) {
        ncCountry.focus();
        return
    }
    let isMatch = false;
    for (e of tzDatum) {
        if (ncTitle.value == "" && e.cc == ncCountry.value && e.city == ncCity.value) {
            isMatch = true;
            ncTitle.value = `${ncCity.value}, ${e.ctr}`;
            break
        }
        else if (ncTitle.value == `${ncCity.value}, ${e.ctr}`) {
            isMatch = true;
            break
        }
    }
    let title = isMatch ? "" : `_${ncTitle.value}`;
    const INPUT_DATA = `${ncCountry.value}_${ncCity.value}${title}`;
    if (document.querySelector("#createNewCard").textContent == "Save") {
        let miniCardsNode = document.querySelectorAll(".minicard");
        miniCardsNode[cardIndex].querySelector(".card-header").style.backgroundColor = "#20c997";
        miniCardsNode[cardIndex].querySelector(".card-body").style.backgroundColor = "#20c997";
        setTimeout(() => {
            miniCardsNode[cardIndex].querySelector(".card-header").style.backgroundColor = "";
            miniCardsNode[cardIndex].querySelector(".card-body").style.backgroundColor = "";
            miniCardList[cardIndex] = INPUT_DATA;
            saveLocalstorage()
        }, 500);
        return
    }
    let addCardsHeaderNode = document.querySelector(".add-minicard .card-header");
    let addCardsBodyNode = document.querySelector(".add-minicard .card-body");
    addCardsHeaderNode.style.backgroundColor = "blue";
    addCardsBodyNode.style.backgroundColor = "blue";
    addCardsHeaderNode.style.transition = "all 1s";
    addCardsBodyNode.style.transition = "all 1s";
    setTimeout(() => {
        addCardsHeaderNode.style.backgroundColor = "";
        addCardsBodyNode.style.backgroundColor = "";
        addMiniCard();
        miniCardList.push(INPUT_DATA);
        saveLocalstorage()
    }, 700)
});

function customAddMiniCardInput() {
    countrySelect();
    citySelect()
}
document.querySelector("#modal-input-title").addEventListener("keypress", e => {
    if (e.keyCode == 13) {
        e.preventDefault();
        document.querySelector("#createNewCard").click()
    }
});
document.getElementById("clock-modal").addEventListener("shown.bs.modal", () => {
    document.getElementById("modal-select-country").focus()
});
document.getElementById("clock-modal").addEventListener("hidden.bs.modal", () => {
    document.querySelector(".modal-title").textContent = "Add Clock";
    document.querySelector("#createNewCard").textContent = "Add Clock";
    document.querySelector("#modal-select-country").innerHTML = '<option selected disabled value="">Choose Country</option>';
    document.querySelector("#modal-select-timezone").innerHTML = '<option selected disabled value="">Choose City - Time Zone</option>';
    document.querySelector("#modal-input-title").value = "My mini clock"
});

function miniCardEdit(target) {
    document.querySelector(".modal-title").textContent = "Edit Clock";
    document.querySelector("#createNewCard").textContent = "Save";
    const MINICARD = miniCardList[target.dataset.index].split("_");
    countrySelect(MINICARD[0]);
    citySelect(MINICARD[0], MINICARD[1]);
    if (MINICARD[2] !== "" && MINICARD[2] !== undefined) titleInput(MINICARD[2]);
    cardIndex = target.dataset.index
}

function titleInput(title) {
    const CITY = document.getElementById("modal-select-timezone").value;
    const COUNTRY_CODE = document.getElementById("modal-select-country").value;
    let cc;
    tzDatum.forEach(e => {
        if (e.cc == COUNTRY_CODE && e.city == CITY) cc = e.ctr
    });
    document.getElementById("modal-input-title").value = title ? title : cc !== undefined ? `${CITY}, ${cc}` : ""
}

function citySelect(mcCode, mcCity) {
    let selectCityElement = document.getElementById("modal-select-timezone");
    let city = [];
    for (let i = 0; i < tzDatum.length; i++) {
        if (mcCode == tzDatum[i].cc) {
            city.push(tzDatum[i].city);
            countryName = tzDatum[i].ctr
        }
    }
    const CITY = new Set(city);
    let uniqueCity = [...CITY].sort();
    if (!mcCity) mcCity = uniqueCity[0];
    let utc;
    for (let i = 0; i < uniqueCity.length; i++) {
        let option = document.createElement("option");
        tzDatum.forEach(e => {
            if (e.city == uniqueCity[i] && e.cc == mcCode) utc = e.diffOffset
        });
        option.innerText = uniqueCity[i] + ` (${numToTime(utc)})`;
        option.value = uniqueCity[i];
        selectCityElement.append(option);
        if (mcCity == uniqueCity[i]) option.selected = true
    }
    selectCountryElement = document.getElementById("modal-select-country");
    if (selectCountryElement.value) {
        let btnForm = document.getElementById("createNewCard");
        btnForm.disabled = false;
        btnForm.classList.replace("btn-outline-primary", "btn-primary")
    }
    return titleInput()
}

function countrySelect(mcCode) {
    selectCountryElement = document.getElementById("modal-select-country");
    if (!selectCountryElement.value) {
        let btnForm = document.getElementById("createNewCard");
        btnForm.disabled = true;
        btnForm.classList.replace("btn-primary", "btn-outline-primary")
    }
    let country = [];
    for (let i = 0; i < tzDatum.length; i++) {
        country[i] = tzDatum[i].ctr + "_" + tzDatum[i].cc
    }
    const COUNTRY = new Set(country);
    let uniqueCountry = [...COUNTRY].sort();
    for (let i = 0; i < uniqueCountry.length; i++) {
        let option = document.createElement("option");
        nc = uniqueCountry[i].split("_");
        option.innerText = nc[0];
        option.value = nc[1];
        selectCountryElement.append(option);
        if (mcCode == nc[1]) option.selected = true
    }
}
let checkBoxAll = document.querySelectorAll("li input");
checkBoxAll.forEach(checkBox => {
    checkBox.addEventListener("change", e => {
        if (e.target.id == "btnswitch-dark-mode") btnDarkThemeChangeToggle();
        if (e.target.id == "btnswitch-digital-font") {
            isDigitalFont = !isDigitalFont;
            digitalFontChangeToggle()
        }
        if (e.target.id == "btnswitch-date-display") {
            isDateDisplay = !isDateDisplay;
            dateDisplayChangeToggle()
        }
        
        if (e.target.id == 'btnswitch-dancing-robot') {
            isRobot = !isRobot;
            document.querySelector('#btnswitch-dancing-robot').checked = isRobot;
            document.querySelector('canvas').style.display = (isRobot) ? 'block' : 'none';
            bgTransparentChange();
        }

        if (e.target.id == "btnswitch-am-pm") isAmpm = !isAmpm;
        if (e.target.id.substr(0, 8) == "btncolor") stringColorChangeToggle(e.target.id);
        saveLocalstorage();
    })
});

function dateDisplayChangeToggle() {
    document.querySelector("#main-date").style.display = isDateDisplay ? "block" : "none"
}

function digitalFontChangeToggle() {
    timeDisplayElement = document.querySelectorAll(".digital-font");
    timeFontStyle = isDigitalFont ? "Digital Italic" : "Open Sans";
    timeDisplayElement.forEach(e => {
        e.style.fontFamily = timeFontStyle
    })
}

function stringColorChangeToggle(e) {
    let [btn, colorName] = e.split("-");
    coloredElement = document.querySelectorAll(".colored, .dataTable-selector");
    coloredElement.forEach(e => {
        e.style.color = colorNames[colorName][1]
    });
    colorId = colorNames[colorName][0]
}

//nav darkmode switch
document.querySelector('#btn-darkmode-true').addEventListener('click', () => { btnDarkThemeChangeToggle() });
document.querySelector('#btn-darkmode-false').addEventListener('click', () => { btnDarkThemeChangeToggle() });

function btnDarkThemeChangeToggle() {
    isDarkMode = !isDarkMode;
    bgTransparentChange();
    darkThemeChangeToggle();
}

function addMiniCard() {
    try {
        document.querySelector("#minicard-template").content;
    } catch {
        return;
    }
    let template = document.querySelector("#minicard-template");
    let miniCardNode = document.querySelector("#minicard-target");
    let cloneNode = document.importNode(template.content, true);
    let miniCardMenu = cloneNode.querySelectorAll(".minicard ul > .dropdown-item");
    miniCardMenu.forEach(tool => {
        tool.addEventListener("click", eTool => {
            if (eTool.target.id == "card-edit") miniCardEdit(eTool.target);
            if (eTool.target.id == "card-move-top") miniCardTop(eTool.target);
            if (eTool.target.id == "card-move-up" || eTool.target.id == "card-move-down") miniCardUpDown(eTool.target);
            if (eTool.target.id == "card-delete") miniCardDelete(eTool.target)
        })
    });
    miniCardNode.insertBefore(cloneNode, miniCardNode.firstChild);
    let colors = document.querySelectorAll(".btn-check");
    let color;
    colors.forEach(e => {
        if (e.checked) color = e.id.split("-")
    });
    miniCardNode.querySelector(".colored").style.color = colorNames[color[1]][1];
    miniCardNode.querySelector(".bi-three-dots-vertical").style.color = colorNames[color[1]][1];
    if (isDigitalFont) miniCardNode.querySelector(".digital-font").style.fontFamily = "Digital Italic"
}

//go to the share button
let btnShare = document.querySelector("#btn-share");
btnShare.addEventListener("click", () => {
    document.querySelector('#last-card').style.backgroundColor = "#30bde7";
    setTimeout(() => {
        let lastCard = document.querySelector('#last-card');
        lastCard.style.backgroundColor = "";
        lastCard.style.transition = "all 0.7s";
        lastCard.addEventListener('transitionend', () => {
            lastCard.style.transition = "all 0s";
        }, false);
    }, 750);
    window.scrollTo(0, document.body.scrollHeight);
});

document.querySelector("#embed-code").addEventListener("click", e => {
    const IFRAME_URL = `/embed${location.pathname}#`;
    let defaultFrameSize = 4;
    embedFrameChangeSize(defaultFrameSize);
    let embedElement = document.querySelector("#modal-select-clocksize");
    embedElement.addEventListener("change", e => {
        embedFrameChangeSize(e.target.value)
    });

    function embedFrameChangeSize(size) {
        const FRAME_SIZES = {
            1: [200, 120],
            2: [240, 130],
            3: [280, 150],
            4: [340, 200],
            5: [360, 240],
            6: [360, 270],
            7: [510, 310],
            8: [640, 360],
            9: [1280, 720],
            0: ["100%", "100%"]
        };
        previewIframe = document.querySelector("#modal-preview");
        previewIframe.width = FRAME_SIZES[size][0];
        previewIframe.height = FRAME_SIZES[size][1];
        previewIframe.src = `${IFRAME_URL}dF=${isDigitalFont ? 1 : 0}&ap=${isAmpm ? 1 : 0}&dD=${isDateDisplay ? 1 : 0}&dM=${isDarkMode ? 1 : 0}&cId=${colorId}`;
        embedUrlElement = document.querySelector("#embedURL");
        const TEXTAREA_URL = `<iframe width="${FRAME_SIZES[size][0]}"height="${FRAME_SIZES[size][1]}"\nsrc="${previewIframe.src}"allowfullscreen="true"></iframe>`;
        embedUrlElement.textContent = TEXTAREA_URL;
        document.querySelector("#embed-modal").addEventListener("hidden.bs.modal", () => {
            embedElement.value = 4;
            previewIframe.src = ""
        })
    }
});

// copy to clipboard
document.getElementById('clipboard-copy').onclick = () => {
    var content = document.getElementById('embedURL').textContent;

    navigator.clipboard.writeText(content)
        .then(() => {
            document.querySelector('#icon-clipboard').style.display = 'none';
            document.querySelector('#icon-copied').style.display = 'inline-block';

            setTimeout(() => {
                document.querySelector('#icon-copied').style.display = 'none';
                document.querySelector('#icon-clipboard').style.display = 'inline-block';
            }, 3000);
        })
        .catch(err => {
            document.querySelector('#clipboard-copy-failed').style.display = 'block';
        })
}

document.querySelector("#location-name").value = 'https://worldtime247.com' + location.pathname;

//SNS share button event handling
shareSns();

function saveLocalstorage() {
    let localStorageConfig = {
        displayConfig:
        {
            dF: isDigitalFont ? 1 : 0,
            ap: isAmpm ? 1 : 0,
            dD: isDateDisplay ? 1 : 0,
            dM: isDarkMode ? 1 : 0,
            cId: colorId,
            fS: fontScale,
            rb: isRobot ? 1 : 0
        }
    };
    localStorage.setItem("displayConfig", JSON.stringify(localStorageConfig));
    localStorage.setItem("miniCards", window.btoa(JSON.stringify(miniCardList)))
}

