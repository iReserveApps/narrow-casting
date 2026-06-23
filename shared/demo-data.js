/* =====================================================================
   Demo-data voor de i-Reserve Narrow Casting SDK
   ---------------------------------------------------------------------
   Wordt automatisch gebruikt zolang baseUrl in config.js nog op de
   placeholder "JOUWOMGEVING" staat (of als je demo:true zet). Zo kun je
   alle voorbeelden direct in deze repo bekijken — ook vanaf file:// —
   zonder een i-Reserve account of CORS-instellingen.

   Vul je een echte baseUrl in, dan wordt dit bestand genegeerd en haalt
   de SDK de data uit de echte API.
   ===================================================================== */
(function (global) {
    "use strict";

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function hhmm(h, m) { return pad(h) + ":" + pad(m || 0) + ":00"; }

    var now = new Date();
    var H = now.getHours();
    var iso = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

    // Eén boeking die NU bezig is (voor de kamerbordjes-demo)
    var nowFrom = hhmm(Math.max(0, H), 0);
    var nowTil  = hhmm(Math.min(23, H + 1), 30);

    var bookings = [
        { OBJ_NAME: "Stadskamer", OBJ_TXT_CUSTOM01: "Stadskamer", RES_CUSTOM01: "Wijkoverleg gemeente",   RES_CUSTOM02: "Wijkoverleg gemeente",   RES_FROMDATE: iso, RES_FROMTIME: nowFrom,      RES_TILTIME: nowTil },
        { OBJ_NAME: "Zaal S",     OBJ_TXT_CUSTOM01: "Zaal S",     RES_CUSTOM01: "Sollicitatiegesprek",    RES_CUSTOM02: "Sollicitatiegesprek",    RES_FROMDATE: iso, RES_FROMTIME: hhmm(9),     RES_TILTIME: hhmm(10, 30) },
        { OBJ_NAME: "Zaal M",     OBJ_TXT_CUSTOM01: "Zaal M",     RES_CUSTOM01: "Teamtraining Sales",     RES_CUSTOM02: "Teamtraining Sales",     RES_FROMDATE: iso, RES_FROMTIME: hhmm(10),    RES_TILTIME: hhmm(12) },
        { OBJ_NAME: "Zaal L",     OBJ_TXT_CUSTOM01: "Zaal L",     RES_CUSTOM01: "Cursus Italiaans",       RES_CUSTOM02: "Cursus Italiaans",       RES_FROMDATE: iso, RES_FROMTIME: hhmm(12, 30), RES_TILTIME: hhmm(14) },
        { OBJ_NAME: "Zaal XL",    OBJ_TXT_CUSTOM01: "Zaal XL",    RES_CUSTOM01: "Netwerkborrel",          RES_CUSTOM02: "Netwerkborrel",          RES_FROMDATE: iso, RES_FROMTIME: hhmm(17),    RES_TILTIME: hhmm(19) },
        { OBJ_NAME: "Zaal M",     OBJ_TXT_CUSTOM01: "Zaal M",     RES_CUSTOM01: "Repetitie koor",         RES_CUSTOM02: "Repetitie koor",         RES_FROMDATE: iso, RES_FROMTIME: hhmm(19, 30), RES_TILTIME: hhmm(21) },
        { OBJ_NAME: "Zaal S",     OBJ_TXT_CUSTOM01: "Zaal S",     RES_CUSTOM01: "Vergadering VvE",        RES_CUSTOM02: "Vergadering VvE",        RES_FROMDATE: iso, RES_FROMTIME: hhmm(20),    RES_TILTIME: hhmm(21, 30) },
        { OBJ_NAME: "Zaal L",     OBJ_TXT_CUSTOM01: "Zaal L",     RES_CUSTOM01: "Workshop fotografie",    RES_CUSTOM02: "Workshop fotografie",    RES_FROMDATE: iso, RES_FROMTIME: hhmm(14),    RES_TILTIME: hhmm(16) }
    ];

    var events = [
        { EVENT_ID: 1, EVENT_DESC: "Rondleiding museum",   OBJ_DESC: "Hoofdingang", EVENT_DATE: iso, EVENT_FROMTIME: hhmm(11),    EVENT_TILLTIME: hhmm(12),    NUMBER_OF_PLACES: 20, EVENT_BOOKED: 14 },
        { EVENT_ID: 2, EVENT_DESC: "Kinderworkshop",       OBJ_DESC: "Atelier",     EVENT_DATE: iso, EVENT_FROMTIME: hhmm(13),    EVENT_TILLTIME: hhmm(14, 30), NUMBER_OF_PLACES: 12, EVENT_BOOKED: 12 },
        { EVENT_ID: 3, EVENT_DESC: "Lezing geschiedenis",  OBJ_DESC: "Auditorium",  EVENT_DATE: iso, EVENT_FROMTIME: hhmm(15),    EVENT_TILLTIME: hhmm(16),    NUMBER_OF_PLACES: 50, EVENT_BOOKED: 31 },
        { EVENT_ID: 4, EVENT_DESC: "Wijnproeverij",        OBJ_DESC: "Kelder",      EVENT_DATE: iso, EVENT_FROMTIME: hhmm(19),    EVENT_TILLTIME: hhmm(21),    NUMBER_OF_PLACES: 16, EVENT_BOOKED: 15 }
    ];

    global.IR_DEMO = { bookings: bookings, events: events };
})(window);
