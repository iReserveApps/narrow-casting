/* =====================================================================
   Demo-data voor de i-Reserve Narrow Casting SDK
   ---------------------------------------------------------------------
   Wordt automatisch gebruikt zolang baseUrl in config.js nog op de
   placeholder "JOUWOMGEVING" staat (of als je demo:true zet). Zo kun je
   alle voorbeelden direct bekijken — ook vanaf file:// — zonder een
   i-Reserve account of CORS-instellingen.

   De data is taalafhankelijk: iReserve roept IR_DEMO(lang) aan met de
   actieve taal ("nl" of "en"), zodat ook de demo-inhoud meeschakelt.

   Bewust opgezet voor de demo:
   - genoeg boekingen (~16) zodat het dagrooster zichtbaar pagineert;
   - Stadskamer en Zaal L zijn NU bezig (kamerbordjes-demo);
   - Zaal S heeft alleen een afgelopen ochtendboeking -> "Beschikbaar".
   ===================================================================== */
(function (global) {
    "use strict";

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function hhmm(h, m) { return pad(h) + ":" + pad(m || 0) + ":00"; }

    var TX = {
        nl: {
            rooms:    { stad:"Stadskamer", s:"Zaal S", m:"Zaal M", l:"Zaal L", xl:"Zaal XL" },
            meetingL: "Projectoverleg nieuwbouw",
            acts:     ["Sollicitatiegesprek","Taalcafé Spaans","Bestuursvergadering","Yoga & ontspanning","Teamtraining Sales","Boekclub","Wijkoverleg gemeente","Lezing duurzaamheid","Schaaktoernooi","Workshop fotografie","Cursus Italiaans","Kinderknutselclub","Netwerkborrel","Repetitie koor"],
            events:   ["Rondleiding museum","Kinderworkshop","Lezing geschiedenis","Wijnproeverij"],
            locs:     ["Hoofdingang","Atelier","Auditorium","Kelder"]
        },
        en: {
            rooms:    { stad:"City room", s:"Room S", m:"Room M", l:"Room L", xl:"Room XL" },
            meetingL: "Project meeting new build",
            acts:     ["Job interview","Spanish language café","Board meeting","Yoga & relaxation","Sales team training","Book club","Community council","Sustainability lecture","Chess tournament","Photography workshop","Italian course","Kids craft club","Networking drinks","Choir rehearsal"],
            events:   ["Museum tour","Kids workshop","History lecture","Wine tasting"],
            locs:     ["Main entrance","Studio","Auditorium","Cellar"]
        }
    };

    function build(lang) {
        var x = TX[lang] || TX.nl;
        var r = x.rooms, a = x.acts;
        var now = new Date();
        var H = now.getHours();
        var iso = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

        // Tijdvenster voor "nu bezig" (Stadskamer + Zaal L)
        var nowFrom = hhmm(Math.max(0, H), 0);
        var nowTil  = hhmm(Math.min(23, H + 1), 30);

        function bk(room, act, from, til) {
            return { OBJ_NAME: room, OBJ_TXT_CUSTOM01: room, RES_CUSTOM01: act, RES_CUSTOM02: act,
                     RES_FROMDATE: iso, RES_FROMTIME: from, RES_TILTIME: til };
        }

        var bookings = [
            bk(r.s,    a[0],        hhmm(8),     hhmm(9)),       // S: afgelopen -> Beschikbaar
            bk(r.m,    a[1],        hhmm(8,30),  hhmm(10)),
            bk(r.xl,   a[2],        hhmm(9),     hhmm(10,30)),
            bk(r.l,    a[3],        hhmm(9,30),  hhmm(11)),
            bk(r.m,    a[4],        hhmm(10),    hhmm(12)),
            bk(r.xl,   a[5],        hhmm(10,30), hhmm(11,30)),
            bk(r.stad, a[6],        nowFrom,     nowTil),        // NU bezig
            bk(r.l,    x.meetingL,  nowFrom,     nowTil),        // NU bezig (meeting)
            bk(r.m,    a[7],        hhmm(13),    hhmm(14,30)),
            bk(r.stad, a[8],        hhmm(14),    hhmm(15)),
            bk(r.xl,   a[9],        hhmm(14,30), hhmm(16)),
            bk(r.l,    a[10],       hhmm(15),    hhmm(16,30)),
            bk(r.m,    a[11],       hhmm(16),    hhmm(17,30)),
            bk(r.xl,   a[12],       hhmm(17),    hhmm(19)),
            bk(r.m,    a[13],       hhmm(19,30), hhmm(21)),
            bk(r.l,    a[5],        hhmm(20),    hhmm(21,30))
        ];
        // Chronologisch sorteren zodat het dagrooster netjes op tijd staat.
        bookings.sort(function (p, q) { return p.RES_FROMTIME.localeCompare(q.RES_FROMTIME); });

        var events = [
            { EVENT_ID:1, EVENT_DESC:x.events[0], OBJ_DESC:x.locs[0], EVENT_DATE:iso, EVENT_FROMTIME:hhmm(11), EVENT_TILLTIME:hhmm(12),    NUMBER_OF_PLACES:20, EVENT_BOOKED:14 },
            { EVENT_ID:2, EVENT_DESC:x.events[1], OBJ_DESC:x.locs[1], EVENT_DATE:iso, EVENT_FROMTIME:hhmm(13), EVENT_TILLTIME:hhmm(14,30), NUMBER_OF_PLACES:12, EVENT_BOOKED:12 },
            { EVENT_ID:3, EVENT_DESC:x.events[2], OBJ_DESC:x.locs[2], EVENT_DATE:iso, EVENT_FROMTIME:hhmm(15), EVENT_TILLTIME:hhmm(16),    NUMBER_OF_PLACES:50, EVENT_BOOKED:31 },
            { EVENT_ID:4, EVENT_DESC:x.events[3], OBJ_DESC:x.locs[3], EVENT_DATE:iso, EVENT_FROMTIME:hhmm(19), EVENT_TILLTIME:hhmm(21),    NUMBER_OF_PLACES:16, EVENT_BOOKED:15 }
        ];

        return { bookings: bookings, events: events };
    }

    // iReserve roept dit aan als IR_DEMO(lang). Ook .build(lang) werkt.
    global.IR_DEMO = build;
    global.IR_DEMO.build = build;
})(window);
