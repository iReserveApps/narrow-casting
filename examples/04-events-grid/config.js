/* =====================================================================
   CONFIG — Events-grid met beschikbaarheid
   ---------------------------------------------------------------------
   Toont publieke events/activiteiten als kaartjes met tijd en het aantal
   vrije plaatsen. Gebruikt het EVENT-endpoint i.p.v. boekingen.
   ===================================================================== */
window.NC_CONFIG = {
    baseUrl:  "https://JOUWOMGEVING.i-reserve.net",
    endpoint: "/api/rest/event/filter",

    /* Het event-endpoint is vaak publiek (open inschrijvingen). Heb je toch
       auth nodig, vul dan username/password in; anders mag auth weg. */
    auth: null,

    lang: "nl",

    columns: [
        "EVENT_ID",
        "EVENT_DESC",       // titel
        "OBJ_DESC",         // locatie
        "EVENT_DATE",
        "EVENT_FROMTIME",
        "EVENT_TILLTIME",
        "NUMBER_OF_PLACES", // totaal plaatsen
        "EVENT_BOOKED"      // bezette plaatsen (vrij = totaal - bezet)
    ],

    // Alle events van vandaag t/m 7 dagen vooruit
    search: 'EVENT_DATE >= "0d" AND EVENT_DATE <= "7d"',
    refreshMinutes: 15,

    title: "Activiteiten",

    columnMap: {
        title:   "EVENT_DESC",
        location:"OBJ_DESC",
        date:    "EVENT_DATE",
        from:    "EVENT_FROMTIME",
        til:     "EVENT_TILLTIME",
        total:   "NUMBER_OF_PLACES",
        booked:  "EVENT_BOOKED"
    }
};
