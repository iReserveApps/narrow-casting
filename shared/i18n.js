/* =====================================================================
   i-Reserve Narrow Casting SDK — vertalingen (i18n)
   ---------------------------------------------------------------------
   Voeg een taal toe door een nieuw blok (bv. "de", "fr") toe te voegen
   met dezelfde sleutels. De actieve taal wordt bepaald door (in volgorde):
     1. ?lang=xx in de URL          (handig om te demonstreren)
     2. lang in config.js
     3. standaard "nl"
   Strings kunnen plaatshouders bevatten: {n}, {m}, {t}, {u}.
   ===================================================================== */
(function (global) {
    "use strict";

    global.IR_I18N = {
        nl: {
            locale: "nl-NL",
            days:   ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],
            months: ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],
            ui: {
                activity:   "Activiteit",
                time:       "Tijd",
                location:   "Locatie",
                page:       "Pagina {n} / {m}",
                noToday:    "Geen activiteiten vandaag",
                noEvents:   "Geen geplande activiteiten",
                available:  "Beschikbaar",
                now:        "NU BEZIG",
                fromTime:   "vanaf {t}",
                untilTime:  "tot {t}",
                full:       "Vol",
                placeOne:   "plek",
                placeOther: "plekken",
                placesFree: "{n} {u} vrij",
                spotsLeft:  "Nog {n} {u}",
                poweredBy:  "Powered by i-Reserve"
            },
            status: { updated: "Bijgewerkt", items: "items", demo: "DEMO", error: "Fout bij ophalen" },
            launcher: {
                subtitle:  "Narrow Casting SDK",
                lead:      "Kant-en-klare, klant-neutrale voorbeelden om boekingen van i-Reserve op een scherm te tonen. Kopieer een voorbeeldmap, pas <code>config.js</code> aan, en je hebt een werkende narrow-casting-pagina. Werkt rechtstreeks vanaf <code>file://</code>.",
                tip:       "<strong>Tip:</strong> de voorbeelden tonen direct <em>demo-data</em> zolang <code>baseUrl</code> nog op <code>JOUWOMGEVING</code> staat — gewoon openen en bekijken.",
                card01t:   "Dagrooster-tabel",
                card01d:   "Tabel met activiteiten van vandaag, automatische paginatie en optionele foto-slideshow ertussen.",
                card02t:   "Kamerbordjes “nu bezig”",
                card02d:   "Gekleurde kamerkaarten die per ruimte tonen wat er nú bezig is, anders het eerstvolgende.",
                card03t:   "Fullscreen slideshow",
                card03d:   "Schermvullende foto's met onderaan een balk die door de boekingen van vandaag loopt.",
                card04t:   "Events-grid",
                card04d:   "Kaartjes met publieke activiteiten, inclusief tijd en het aantal vrije plaatsen.",
                docsTitle: "Eerst dit lezen",
                docsIntro: "Voordat een voorbeeld live werkt moet je een API-gebruiker aanmaken en CORS toestaan in het admin panel:",
                docsStart: "Aan de slag",
                docsAuth:  "Authenticatie & CORS",
                footer:    "i-Reserve Narrow Casting SDK · neutrale voorbeelden voor eigen implementatie"
            }
        },

        en: {
            locale: "en-GB",
            days:   ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
            ui: {
                activity:   "Activity",
                time:       "Time",
                location:   "Location",
                page:       "Page {n} / {m}",
                noToday:    "No activities today",
                noEvents:   "No scheduled activities",
                available:  "Available",
                now:        "IN USE",
                fromTime:   "from {t}",
                untilTime:  "until {t}",
                full:       "Full",
                placeOne:   "spot",
                placeOther: "spots",
                placesFree: "{n} {u} free",
                spotsLeft:  "{n} {u} left",
                poweredBy:  "Powered by i-Reserve"
            },
            status: { updated: "Updated", items: "items", demo: "DEMO", error: "Fetch error" },
            launcher: {
                subtitle:  "Narrow Casting SDK",
                lead:      "Ready-made, client-neutral examples for showing i-Reserve bookings on a screen. Copy an example folder, edit <code>config.js</code>, and you have a working narrow-casting page. Runs straight from <code>file://</code>.",
                tip:       "<strong>Tip:</strong> the examples show <em>demo data</em> right away while <code>baseUrl</code> is still set to <code>JOUWOMGEVING</code> — just open and view.",
                card01t:   "Day schedule table",
                card01d:   "Table with today's activities, automatic pagination and an optional photo slideshow in between.",
                card02t:   "Room signs “in use”",
                card02d:   "Coloured room cards showing what's on now per room, otherwise the next booking.",
                card03t:   "Fullscreen slideshow",
                card03d:   "Full-screen photos with a caption bar cycling through today's bookings.",
                card04t:   "Events grid",
                card04d:   "Cards with public activities, including time and the number of free places.",
                docsTitle: "Read this first",
                docsIntro: "Before an example works live you must create an API user and allow CORS in the admin panel:",
                docsStart: "Getting started",
                docsAuth:  "Authentication & CORS",
                footer:    "i-Reserve Narrow Casting SDK · neutral examples for your own implementation"
            }
        }
    };
})(window);
