const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

const alarmRouter = require('./routes/subRouters/alarmRouter.js');
const timerRouter = require('./routes/subRouters/timerRouter.js');
const timerDayRouter = require('./routes/subRouters/timerDayRouter.js');
const clockRouter = require('./routes/subRouters/clockRouter.js');

const mainAlarmRouter = require('./routes/mainRouters/mainAlarmRouter.js');
const mainTimerRouter = require('./routes/mainRouters/mainTimerRouter.js');
const mainStopwatchRouter = require('./routes/mainRouters/mainStopwatchRouter.js');
const mainClockRouter = require('./routes/mainRouters/mainClockRouter.js');
const mainContactRouter = require('./routes/mainRouters/mainContactRouter.js');
const mainPrivacyRouter = require('./routes/mainRouters/mainPrivacyRouter.js');
const mainTermsRouter = require('./routes/mainRouters/mainTermsRouter.js');

const embedAlarmRouter = require('./routes/embedRouters/embedAlarmRouter.js');
const embedTimerRouter = require('./routes/embedRouters/embedTimerRouter.js');
const embedStopwatchRouter = require('./routes/embedRouters/embedStopwatchRouter.js');
const embedClockRouter = require('./routes/embedRouters/embedClockRouter.js');
const embedLocalClockRouter = require('./routes/embedRouters/embedLocalClockRouter.js');
const embedContact = require('./routes/embedRouters/embedContactRouter.js');
const embedPrivacy = require('./routes/embedRouters/embedPrivacyRouter.js');
const embedTerms = require('./routes/embedRouters/embedTermsRouter.js');

const GLOBAL_DAYS = ['Global-Family-Day', 'Chinese-New-Year', 'Korean-New-Year', 'World-Wetlands-Day', 'Valentines-Day', 'World-Cancer-Day', "Intl-Womens-Day",
  'World-Day-for-Water', 'World-Health-Day', 'Labor-Day', "Buddhas-Birthday", 'World-Environment-Day', 'World-Blood-Donor-Day', 'Intl-Youth-Day',
  'Intl-Day-of-Peace', 'Korean-Thanksgiving', 'United-Nations-Day', 'Halloween', "Childrens-Day", 'Thanksgiving', 'Black-Friday', 'Christmas', 'New-Year',
];
const CITIES = ["at-vienna", "ae-dubai", "af-kabul", "ag-antigua", "ai-anguilla", "be-brussels", "am-yerevan", "ao-luanda", "aq-mcmurdo", "aq-casey", "aq-davis", "aq-dumontdurville", "aq-mawson", "aq-palmer", "aq-rothera", "aq-syowa", "aq-troll", "aq-vostok", "ar-buenos-aires", "ar-cordoba", "ar-salta", "ar-jujuy", "ar-tucuman", "ar-catamarca", "ar-la-rioja", "ar-san-juan", "ar-mendoza", "ar-san-luis", "ar-rio-gallegos", "ar-ushuaia", "as-pago-pago", "ch-zurich", "au-lord-howe", "au-macquarie", "au-hobart", "au-melbourne", "au-sydney", "au-broken-hill", "au-brisbane", "au-lindeman", "au-adelaide", "au-darwin", "au-perth", "au-eucla", "aw-aruba", "de-berlin", "az-baku", "dk-copenhagen", "bb-barbados", "bd-dhaka", "es-madrid", "bf-ouagadougou", "fi-helsinki", "bh-bahrain", "bi-bujumbura", "bj-porto-novo", "bl-st-barthelemy", "bm-bermuda", "bn-brunei", "bo-la-paz", "bq-kralendijk", "br-noronha", "br-belem", "br-fortaleza", "br-recife", "br-araguaina", "br-maceio", "br-bahia", "br-sao-paulo", "br-campo-grande", "br-cuiaba", "br-santarem", "br-porto-velho", "br-boa-vista", "br-manaus", "br-eirunepe", "br-rio-branco", "bs-nassau", "bt-thimphu", "bw-gaborone", "fr-paris", "bz-belize", "ca-st-johns", "ca-halifax", "ca-glace-bay", "ca-moncton", "ca-goose-bay", "ca-blanc-sablon", "ca-toronto", "ca-nipigon", "ca-thunder-bay", "ca-iqaluit", "ca-pangnirtung", "ca-atikokan", "ca-winnipeg", "ca-rainy-river", "ca-resolute", "ca-rankin-inlet", "ca-regina", "ca-swift-current", "ca-edmonton", "ca-cambridge-bay", "ca-yellowknife", "ca-inuvik", "ca-creston", "ca-dawson-creek", "ca-fort-nelson", "ca-whitehorse", "ca-dawson", "ca-vancouver", "cc-cocos", "cd-kinshasa", "cd-lubumbashi", "cf-bangui", "cg-brazzaville", "gb-london", "ci-abidjan", "ck-rarotonga", "cl-santiago", "cl-punta-arenas", "cl-easter", "cm-douala", "cn-shanghai", "cn-urumqi", "co-bogota", "cr-costa-rica", "cu-havana", "cv-cape-verde", "cw-curacao", "cx-christmas", "cy-nicosia", "cy-famagusta", "gr-athens", "ie-dublin", "it-rome", "dj-djibouti", "nl-amsterdam", "dm-dominica", "do-santo-domingo", "dz-algiers", "ec-guayaquil", "ec-galapagos", "no-oslo", "eg-cairo", "eh-el-aaiun", "er-asmara", "pl-warsaw", "es-ceuta", "es-canary", "et-addis-ababa", "pt-lisbon", "fj-fiji", "fk-stanley", "fm-chuuk", "fm-pohnpei", "fm-kosrae", "fo-faroe", "ru-kaliningrad", "ga-libreville", "ru-moscow", "gd-grenada", "ge-tbilisi", "gf-cayenne", "se-stockholm", "gh-accra", "tr-istanbul", "gl-nuuk", "gl-danmarkshavn", "gl-scoresbysund", "gl-thule", "gm-banjul", "gn-conakry", "gp-guadeloupe", "gq-malabo", "ua-kyiv", "ua-kiev", "gs-south-georgia", "gt-guatemala", "gu-guam", "gw-bissau", "gy-guyana", "hk-hong-kong", "hn-tegucigalpa", "ad-andorra", "ht-port-au-prince", "al-tirane", "id-jakarta", "id-pontianak", "id-makassar", "id-jayapura", "ax-mariehamn", "il-jerusalem", "ba-sarajevo", "in-kolkata", "io-chagos", "iq-baghdad", "ir-tehran", "is-reykjavik", "bg-sofia", "by-minsk", "jm-jamaica", "jo-amman", "jp-tokyo", "ke-nairobi", "kg-bishkek", "kh-phnom-penh", "ki-tarawa", "ki-kanton", "ki-kiritimati", "km-comoro", "kn-st-kitts", "kp-pyongyang", "kr-seoul", "kr-dokdo", "kr-busan", "kw-kuwait", "ky-cayman", "kz-almaty", "kz-qyzylorda", "kz-qostanay", "kz-aqtobe", "kz-aqtau", "kz-atyrau", "kz-oral", "la-vientiane", "lb-beirut", "lc-st-lucia", "cz-prague", "lk-colombo", "lr-monrovia", "ls-maseru", "de-busingen", "ee-tallinn", "gg-guernsey", "ly-tripoli", "ma-casablanca", "gi-gibraltar", "hr-zagreb", "hu-budapest", "mf-marigot", "mg-antananarivo", "mh-majuro", "mh-kwajalein", "im-isle-of-man", "ml-bamako", "mm-yangon", "mn-ulaanbaatar", "mn-hovd", "mn-choibalsan", "mo-macau", "mp-saipan", "mq-martinique", "mr-nouakchott", "ms-montserrat", "je-jersey", "mu-mauritius", "mv-maldives", "mw-blantyre", "mx-mexico-city", "mx-cancun", "mx-merida", "mx-monterrey", "mx-matamoros", "mx-mazatlan", "mx-chihuahua", "mx-ojinaga", "mx-hermosillo", "mx-tijuana", "mx-bahia-banderas", "my-kuala-lumpur", "my-kuching", "mz-maputo", "na-windhoek", "nc-noumea", "ne-niamey", "nf-norfolk", "ng-lagos", "ni-managua", "li-vaduz", "lt-vilnius", "np-kathmandu", "nr-nauru", "nu-niue", "nz-auckland", "nz-chatham", "om-muscat", "pa-panama", "pe-lima", "pf-tahiti", "pf-marquesas", "pf-gambier", "pg-port-moresby", "pg-bougainville", "ph-manila", "pk-karachi", "lu-luxembourg", "pm-miquelon", "pn-pitcairn", "pr-puerto-rico", "ps-gaza", "ps-hebron", "lv-riga", "pt-madeira", "pt-azores", "pw-palau", "py-asuncion", "qa-qatar", "re-reunion", "mc-monaco", "md-chisinau", "me-podgorica", "mk-skopje", "mt-malta", "ro-bucharest", "rs-belgrade", "ua-simferopol", "ru-kirov", "ru-volgograd", "ru-astrakhan", "ru-yekaterinburg", "ru-omsk", "ru-novosibirsk", "ru-barnaul", "ru-tomsk", "ru-novokuznetsk", "ru-krasnoyarsk", "ru-irkutsk", "ru-chita", "ru-yakutsk", "ru-khandyga", "ru-vladivostok", "ru-ust-nera", "ru-magadan", "ru-sakhalin", "ru-srednekolymsk", "ru-kamchatka", "ru-anadyr", "rw-kigali", "sa-riyadh", "sb-guadalcanal", "sc-mahe", "sd-khartoum", "ru-saratov", "sg-singapore", "sh-st-helena", "ru-ulyanovsk", "sj-longyearbyen", "ru-samara", "sl-freetown", "si-ljubljana", "sn-dakar", "so-mogadishu", "sr-paramaribo", "ss-juba", "st-sao-tome", "sv-el-salvador", "sx-lower-princes", "sy-damascus", "sz-mbabane", "tc-grand-turk", "td-ndjamena", "tf-kerguelen", "tg-lome", "th-bangkok", "tj-dushanbe", "tk-fakaofo", "tl-dili", "tm-ashgabat", "tn-tunis", "to-tongatapu", "sk-bratislava", "tt-port-of-spain", "tv-funafuti", "tw-taipei", "tz-dar-es-salaam", "sm-san-marino", "ug-kampala", "um-midway", "um-wake", "us-new-york", "us-detroit", "us-louisville", "us-monticello", "us-indianapolis", "us-vincennes", "us-winamac", "us-marengo", "us-petersburg", "us-vevay", "us-chicago", "us-tell-city", "us-knox", "us-menominee", "us-center", "us-new-salem", "us-beulah", "us-denver", "us-boise", "us-phoenix", "us-los-angeles", "us-anchorage", "us-juneau", "us-sitka", "us-metlakatla", "us-yakutat", "us-nome", "us-adak", "us-honolulu", "uy-montevideo", "uz-samarkand", "uz-tashkent", "va-vatican", "vc-st-vincent", "ve-caracas", "vg-tortola", "vi-st-thomas", "vn-ho-chi-minh", "vu-efate", "wf-wallis", "ws-apia", "ye-aden", "yt-mayotte", "za-johannesburg", "zm-lusaka", "zw-harare"];

dotenv.config();
app.set('port', process.env.PORT || 3000);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/')));
app.use('/', mainAlarmRouter);
app.use('/timer/', mainTimerRouter);
app.use('/stopwatch/', mainStopwatchRouter);
app.use('/clock/', mainClockRouter);
app.use('/contact/', mainContactRouter);
app.use('/privacy/', mainPrivacyRouter);
app.use('/terms/', mainTermsRouter);

app.use('/embed/alarmclock/', embedAlarmRouter);
app.use('/embed/timer/', embedTimerRouter);
app.use('/embed/stopwatch/', embedStopwatchRouter);
app.use('/embed/clock/', embedClockRouter);
app.use('/embed/contact/', embedContact);
app.use('/embed/privacy/', embedPrivacy);
app.use('/embed/terms/', embedTerms);

app.use(express.static(path.join(__dirname, '/')));

app.use('/image.png', express.static('assets/imgs/alarm.png'));
app.use('/timer/image.png', express.static('assets/imgs/timer.png'));
app.use('/clock/image.png', express.static('assets/imgs/clock.png'));
app.use('/stopwatch/image.png', express.static('assets/imgs/stopwatch.png'));

for (let city of CITIES) {
  var cc = city.split('-')[0].toUpperCase();
  app.use(`/clock/${city}/image.png`, express.static('images/clock.png'));
  app.use(`/clock/${city}/${cc}.jpg`, express.static(`assets/icons/country-icon/${cc}.svg`));
  app.use(`/embed/clock/${city}/image.png`, express.static('images/clock.png'));
  app.use(`/clock/${city}/*/`, clockRouter);
  app.use(`/embed/clock/${city}/*/`, embedLocalClockRouter);
}

for (let day of GLOBAL_DAYS) {
  app.use(`/timer/${day}/image.png`, express.static('images/timer.png'));
  app.use(`/timer/${day}/20*/image.png`, express.static('images/timer.png'));
  app.use(`/timer/${day}/${day}-20*.png`, express.static(`images/${day}.png`));
  app.use(`/timer/${day}/20*/${day}-20*.png`, express.static(`images/${day}.png`));
  app.use(`/embed/timer/${day}/image.png`, express.static('images/timer.png'));
  app.use(`/embed/timer/${day}/20*/image.png`, express.static('images/timer.png'));
  app.use(`/embed/timer/${day}/`, embedTimerRouter);
  app.use(`/embed/timer/${day}/20*/`, embedTimerRouter);
  app.use(`/timer/${day}/20*/`, timerDayRouter);
  app.use(`/timer/${day}/`, timerDayRouter);
}

app.use('/set-timer-for-*/image.png', express.static('images/timer.png'));
app.use('/embed/set-timer-for-*/image.png', express.static('images/timer.png'));
app.use('/set-alarm-for-*/image.png', express.static('images/alarm.png'));
app.use('/embed/set-alarm-for-*/image.png', express.static('images/alarm.png'));

app.use('/set-timer-for-*/', timerRouter);
app.use('/embed/set-timer-for-*/', embedTimerRouter);

app.use('/set-alarm-for-*/', alarmRouter);
app.use('/embed/set-alarm-for-*/', embedAlarmRouter);

app.use('/err404', express.static('errors/404.html'));
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    morgan('combined')(req, res, next);
  } else {
    morgan('dev')(req, res, next)
  }
});

app.get(path.join('/'), function (req, res) {
  res.sendFile(path.join(__dirname, '/'));
});
//not found page
app.use(function (req, res, next) {
  res.status(404).sendFile(path.join(__dirname, '/errors/404.html'));
});
//internal server error
app.use(function (req, res, next) {
  res.status(500).sendFile(path.join(__dirname, '/errors/500.html'));
});

//listen GET
app.listen(app.get('port'), () => {
  console.log('standby port no.', app.get('port'));
});
