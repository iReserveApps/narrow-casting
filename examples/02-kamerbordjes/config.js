/* =====================================================================
   CONFIG — Kamerbordjes ("nu bezig")
   ---------------------------------------------------------------------
   Toont per ruimte wat er NU bezig is (anders het eerstvolgende, anders
   "Beschikbaar"). Filtert client-side op het huidige tijdstip.
   ===================================================================== */
window.NC_CONFIG = {
    baseUrl:  "https://JOUWOMGEVING.i-reserve.net",
    endpoint: "/api/rest/booking/filter",
    auth: { username: "API_signage", password: "VERVANG_DIT_WACHTWOORD" },

    columns: [
        "OBJ_NAME",       // ruimtenaam (waarop we groeperen)
        "RES_CUSTOM01",   // activiteit/titel
        "RES_FROMDATE",
        "RES_FROMTIME",
        "RES_TILTIME"
    ],

    // Alle boekingen van vandaag voor de relevante ruimtes
    search: 'startdatum >= "0d" AND startdatum <= "0d" AND product IN (101,102,103,104,105,106)',

    refreshMinutes: 5,   // korter interval: "nu bezig" moet actueel zijn

    title: "What's going on?",

    /* Ruimtes met vaste volgorde + accentkleur. Laat leeg ([]) om de
       ruimtes automatisch uit de data af te leiden.
       'match' = de waarde in OBJ_NAME waarop deze kaart matcht. */
    rooms: [
        { match: "Stadskamer", label: "Stadskamer", color: "#ea72ad" },
        { match: "Zaal S",     label: "S",          color: "#3ea992" },
        { match: "Zaal M",     label: "M",          color: "#7161a8" },
        { match: "Zaal L",     label: "L",          color: "#ea7373" },
        { match: "Zaal XL",    label: "XL",         color: "#72bfd5" }
    ],

    columnMap: {
        room:     "OBJ_NAME",
        activity: "RES_CUSTOM01",
        from:     "RES_FROMTIME",
        til:      "RES_TILTIME"
    }
};
