/* =====================================================================
   Demo-server voor de i-Reserve Narrow Casting SDK
   ---------------------------------------------------------------------
   Optioneel. De voorbeelden werken al direct vanaf file:// dankzij de
   ingebouwde demo-modus (zie shared/demo-data.js). Deze mini-server is
   handig als je het ECHTE netwerk-/CORS-pad wilt naspelen: hij serveert
   de repo én een nep-API op /api/rest/... met dezelfde demo-data.

   Geen dependencies nodig. Starten:
       node demo/server.js
   Open daarna in de browser:
       http://localhost:8080/                         (overzicht)
       http://localhost:8080/examples/01-dagrooster-tabel/   (voorbeeld)

   Wil je dat een voorbeeld de API i.p.v. de demo-modus aanspreekt, zet
   dan in zijn config.js baseUrl op "http://localhost:8080".
   ===================================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");           // repo-root
const PORT = process.env.PORT || 8080;

function pad(n) { return (n < 10 ? "0" : "") + n; }
function hhmm(h, m) { return pad(h) + ":" + pad(m || 0) + ":00"; }

function dataset() {
    const now = new Date();
    const H = now.getHours();
    const iso = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
    const bookings = [
        { OBJ_NAME:"Stadskamer", OBJ_TXT_CUSTOM01:"Stadskamer", RES_CUSTOM01:"Wijkoverleg gemeente", RES_CUSTOM02:"Wijkoverleg gemeente", RES_FROMDATE:iso, RES_FROMTIME:hhmm(Math.max(0,H)), RES_TILTIME:hhmm(Math.min(23,H+1),30) },
        { OBJ_NAME:"Zaal S",  OBJ_TXT_CUSTOM01:"Zaal S",  RES_CUSTOM01:"Sollicitatiegesprek", RES_CUSTOM02:"Sollicitatiegesprek", RES_FROMDATE:iso, RES_FROMTIME:hhmm(9),  RES_TILTIME:hhmm(10,30) },
        { OBJ_NAME:"Zaal M",  OBJ_TXT_CUSTOM01:"Zaal M",  RES_CUSTOM01:"Teamtraining Sales", RES_CUSTOM02:"Teamtraining Sales", RES_FROMDATE:iso, RES_FROMTIME:hhmm(10), RES_TILTIME:hhmm(12) },
        { OBJ_NAME:"Zaal L",  OBJ_TXT_CUSTOM01:"Zaal L",  RES_CUSTOM01:"Cursus Italiaans", RES_CUSTOM02:"Cursus Italiaans", RES_FROMDATE:iso, RES_FROMTIME:hhmm(12,30), RES_TILTIME:hhmm(14) },
        { OBJ_NAME:"Zaal XL", OBJ_TXT_CUSTOM01:"Zaal XL", RES_CUSTOM01:"Netwerkborrel", RES_CUSTOM02:"Netwerkborrel", RES_FROMDATE:iso, RES_FROMTIME:hhmm(17), RES_TILTIME:hhmm(19) },
        { OBJ_NAME:"Zaal M",  OBJ_TXT_CUSTOM01:"Zaal M",  RES_CUSTOM01:"Repetitie koor", RES_CUSTOM02:"Repetitie koor", RES_FROMDATE:iso, RES_FROMTIME:hhmm(19,30), RES_TILTIME:hhmm(21) },
        { OBJ_NAME:"Zaal L",  OBJ_TXT_CUSTOM01:"Zaal L",  RES_CUSTOM01:"Workshop fotografie", RES_CUSTOM02:"Workshop fotografie", RES_FROMDATE:iso, RES_FROMTIME:hhmm(14), RES_TILTIME:hhmm(16) }
    ];
    const events = [
        { EVENT_ID:1, EVENT_DESC:"Rondleiding museum", OBJ_DESC:"Hoofdingang", EVENT_DATE:iso, EVENT_FROMTIME:hhmm(11), EVENT_TILLTIME:hhmm(12), NUMBER_OF_PLACES:20, EVENT_BOOKED:14 },
        { EVENT_ID:2, EVENT_DESC:"Kinderworkshop", OBJ_DESC:"Atelier", EVENT_DATE:iso, EVENT_FROMTIME:hhmm(13), EVENT_TILLTIME:hhmm(14,30), NUMBER_OF_PLACES:12, EVENT_BOOKED:12 },
        { EVENT_ID:3, EVENT_DESC:"Lezing geschiedenis", OBJ_DESC:"Auditorium", EVENT_DATE:iso, EVENT_FROMTIME:hhmm(15), EVENT_TILLTIME:hhmm(16), NUMBER_OF_PLACES:50, EVENT_BOOKED:31 },
        { EVENT_ID:4, EVENT_DESC:"Wijnproeverij", OBJ_DESC:"Kelder", EVENT_DATE:iso, EVENT_FROMTIME:hhmm(19), EVENT_TILLTIME:hhmm(21), NUMBER_OF_PLACES:16, EVENT_BOOKED:15 }
    ];
    return { bookings, events };
}

const TYPES = { ".html":"text/html", ".css":"text/css", ".js":"application/javascript", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".json":"application/json" };

http.createServer((req, res) => {
    const url = req.url.split("?")[0];

    // Nep-API met CORS-headers (zodat ook file:// het zou mogen ophalen)
    if (url.indexOf("/api/rest/") === 0) {
        const d = dataset();
        const body = /event/i.test(url) ? d.events : d.bookings;
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        });
        return res.end(JSON.stringify(body));
    }

    // Statische bestanden uit de repo
    let p = path.join(ROOT, decodeURIComponent(url));
    if (url === "/" || url.endsWith("/")) p = path.join(p, "index.html");
    fs.readFile(p, (err, data) => {
        if (err) { res.writeHead(404); return res.end("404 — " + url); }
        res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "text/plain" });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log("i-Reserve NC demo draait op http://localhost:" + PORT + "/");
    console.log("Open bv. http://localhost:" + PORT + "/examples/01-dagrooster-tabel/");
});
