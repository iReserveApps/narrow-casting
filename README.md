# i-Reserve Narrow Casting SDK

Kant-en-klare, **klant-neutrale** voorbeelden om boekingen en events uit i-Reserve
op een scherm te tonen. Bedoeld als startpunt: een klant kopieert een voorbeeld,
past `config.js` aan en heeft een werkende narrow-casting-pagina. Werkt rechtstreeks
vanaf `file://`.

## Direct uitproberen (demo-modus)

De voorbeelden werken **meteen**, zonder i-Reserve account: zolang `baseUrl` in
`config.js` nog op de placeholder `JOUWOMGEVING` staat, toont de SDK automatisch
realistische demo-data (uit `shared/demo-data.js`, met tijden rond "nu"). Dubbelklik
`index.html` of een voorbeeld en je ziet live een werkend scherm. Onderin staat dan
`DEMO`.

Wil je het echte netwerk-/CORS-pad naspelen, start dan de meegeleverde mini-server
(geen dependencies):

```bash
node demo/server.js
# open http://localhost:8080/
```

Zodra je in `config.js` een echte `baseUrl` invult, schakelt de SDK automatisch over
naar de live API.

## Snelstart

1. Open `index.html` (de overzichtspagina) in een browser en bekijk de voorbeelden.
2. Lees **[docs/authenticatie-en-cors.md](docs/authenticatie-en-cors.md)** — maak een
   read-only API-gebruiker aan en zet CORS goed in het admin panel.
3. Kies een voorbeeld, open de bijbehorende `config.js` en vul in:
   - `baseUrl` → `https://JOUWOMGEVING.i-reserve.net`
   - `auth` → gebruikersnaam + wachtwoord van de API-gebruiker
   - `search` → het filter (welke producten / welke periode)
   - eventueel `columns` en `columnMap` als jouw velden anders heten
4. Open de `index.html` van dat voorbeeld op het scherm.

## De voorbeelden

| # | Map | Patroon |
|---|---|---|
| 01 | `examples/01-dagrooster-tabel` | Tabel met activiteiten van vandaag, paginatie + optionele foto-slideshow |
| 02 | `examples/02-kamerbordjes` | Gekleurde kamerkaarten met "nu bezig"-filtering |
| 03 | `examples/03-fullscreen-slideshow` | Schermvullende foto's met boekingen-onderschrift |
| 04 | `examples/04-events-grid` | Event-kaartjes met tijd en vrije plaatsen |

## Structuur

```
narrow-casting/
├─ index.html                     ← overzicht / launcher
├─ README.md
├─ shared/                        ← gedeelde, herbruikbare assets
│  ├─ ireserve.css                ← huisstijl via CSS-variabelen (1 plek aanpassen)
│  ├─ ireserve.js                 ← API-helper + datum-/tijdhelpers + polling
│  └─ logo.svg                    ← neutraal i-Reserve placeholder-logo (vervangbaar)
├─ examples/
│  └─ <voorbeeld>/index.html + config.js
└─ docs/
   └─ authenticatie-en-cors.md
```

## Huisstijl aanpassen

Alle kleuren, vormen en het lettertype staan als variabelen bovenin
`shared/ireserve.css` (`:root { --ir-primary: … }`). Pas die aan voor de
i-Reserve- of klant-huisstijl; de hele SDK volgt automatisch. Vervang
`shared/logo.svg` door het echte logo.

## Een voorbeeld los uitleveren

Wil je één voorbeeld aan een klant geven, kopieer dan **de voorbeeldmap én de
`shared/`-map** mee (de voorbeelden verwijzen relatief naar `../../shared/`).
De onderlinge mapstructuur moet gelijk blijven.

## Belangrijk over beveiliging

Bij narrow casting staan de API-credentials leesbaar in de browser. Gebruik daarom
altijd een **read-only API-gebruiker** met toegang tot alleen de benodigde producten.
Zie de beveiligingschecklist in de auth-documentatie.
