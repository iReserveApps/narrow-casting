/* =====================================================================
   CONFIG — Fullscreen slideshow met onderschrift
   ---------------------------------------------------------------------
   Schermvullende foto's die roteren, met onderaan een balk die door de
   boekingen van vandaag heen loopt. Ideaal voor lobby/entree-schermen.
   ===================================================================== */
window.NC_CONFIG = {
    baseUrl:  "https://JOUWOMGEVING.i-reserve.net",
    endpoint: "/api/rest/booking/filter",
    auth: { username: "API_signage", password: "VERVANG_DIT_WACHTWOORD" },

    columns: [
        "RES_CUSTOM02",      // titel/activiteit
        "OBJ_TXT_CUSTOM01",  // locatie
        "RES_FROMDATE",
        "RES_FROMTIME",
        "RES_TILTIME"
    ],
    search: 'startdatum >= "0d" AND startdatum <= "0d"',
    refreshMinutes: 15,

    lang: "nl",          // "nl" of "en" — te overschrijven met ?lang=en

    title: { nl: "Vandaag bij ons", en: "Today with us" },

    /* Schermvullende foto's (plaats ze in ./slides/). Niet-bestaande
       bestanden worden automatisch overgeslagen. */
    slides:       ["slides/foto-1.svg", "slides/foto-2.svg", "slides/foto-3.svg"],
    slideSeconds: 8,         // hoe lang elke foto blijft staan

    columnMap: {
        title:    "RES_CUSTOM02",
        location: "OBJ_TXT_CUSTOM01",
        from:     "RES_FROMTIME",
        til:      "RES_TILTIME"
    }
};
