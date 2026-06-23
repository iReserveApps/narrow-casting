/* =====================================================================
   CONFIG — Dagrooster-tabel
   ---------------------------------------------------------------------
   Dit is het ENIGE bestand dat je hoeft aan te passen om dit voorbeeld
   voor jouw locatie werkend te krijgen. Zie docs/authenticatie-en-cors.md
   voor het aanmaken van de API-gebruiker en het instellen van CORS.
   ===================================================================== */
window.NC_CONFIG = {
    /* --- Verbinding --------------------------------------------------- */
    baseUrl:  "https://JOUWOMGEVING.i-reserve.net",
    endpoint: "/api/rest/booking/filter",

    /* Read-only API-gebruiker. LET OP: deze credentials staan leesbaar in
       de browser. Gebruik dus een gebruiker met ALLEEN leesrechten op de
       benodigde producten (zie documentatie). */
    auth: { username: "API_signage", password: "VERVANG_DIT_WACHTWOORD" },

    /* --- Welke velden ophalen ---------------------------------------- */
    columns: [
        "OBJ_TXT_CUSTOM01",  // locatie/ruimte
        "RES_CUSTOM02",      // activiteit/titel
        "RES_FROMDATE",
        "RES_FROMTIME",
        "RES_TILTIME"
    ],

    /* --- Filter (i-Reserve search-DSL) -------------------------------
       "0d" = vandaag. Vul de product-id's van jouw zalen/activiteiten in.
       Voorbeelden:
         startdatum >= "0d" AND startdatum <= "0d"             (alleen vandaag)
         startdatum >= "0d" AND startdatum <= "7d"             (komende week)
         ... AND product IN (101,102,103)                      (specifieke producten)
    */
    search: 'startdatum >= "0d" AND startdatum <= "0d" AND product IN (101,102,103)',

    refreshMinutes: 15,        // hoe vaak nieuwe data ophalen

    /* --- Taal --------------------------------------------------------
       "nl" of "en". Te overschrijven met ?lang=en in de URL. */
    lang:         "nl",

    /* --- Weergave ----------------------------------------------------- */
    title:        { nl: "Programma van vandaag", en: "Today's programme" },
    rowsPerPage:  6,           // aantal regels per pagina (slide)
    pageSeconds:  10,          // seconden dat een tabelpagina blijft staan

    /* Optionele fullscreen foto's tussen de tabelpagina's door.
       Zet op [] om uit te schakelen. Plaats de bestanden in ./slides/ */
    slides:       [],          // bv. ["slides/zaal1.jpg", "slides/evenement.jpg"]
    slideSeconds: 6,

    /* Hoe een rij uit de API op kolommen mapt. Pas de veldnamen hier aan
       als jouw kolommen anders heten. */
    columnMap: {
        activiteit: "RES_CUSTOM02",
        van:        "RES_FROMTIME",
        tot:        "RES_TILTIME",
        locatie:    "OBJ_TXT_CUSTOM01"
    }
};
