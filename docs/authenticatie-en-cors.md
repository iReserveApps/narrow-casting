# Authenticatie & CORS instellen

Deze handleiding legt uit hoe je een narrow-casting-scherm verbinding laat maken
met de i-Reserve REST API: het aanmaken van een API-gebruiker, het instellen van
de authenticatie in de HTML, en het toestaan van CORS in het admin panel — dat
laatste is nodig omdat de pagina meestal als `file://` of vanaf een ander domein
draait.

---

## 1. Hoe de koppeling werkt

Elk voorbeeld haalt data op via een GET-request naar de REST API:

```
GET https://JOUWOMGEVING.i-reserve.net/api/rest/booking/filter?columns=...&search=...
Authorization: Basic <base64(gebruiker:wachtwoord)>
```

- **`booking/filter`** → reserveringen/boekingen (dagrooster, kamerbordjes, slideshow).
- **`event/filter`** → publieke events met beschikbaarheid (events-grid).

De `columns`-parameter bepaalt welke velden terugkomen; de `search`-parameter is het
filter (zie §5).

---

## 2. API-gebruiker aanmaken (read-only!)

> ⚠️ **Belangrijk:** bij narrow casting staan de inloggegevens leesbaar in de HTML
> (de browser stuurt ze mee). Gebruik daarom **nooit** een beheerdersaccount, maar
> een aparte gebruiker met **alleen leesrechten** op precies de producten die het
> scherm nodig heeft.

1. Log in op het i-Reserve **admin panel** als beheerder.
2. Ga naar **Gebruikers / Medewerkers** en maak een nieuwe gebruiker aan, bijvoorbeeld
   `API_signage`.
3. Geef deze gebruiker een **rol/rechtenprofiel met uitsluitend leesrechten** op
   boekingen/events. Geen schrijf-, verwijder- of beheerrechten.
4. Beperk waar mogelijk de toegang tot **alleen de relevante producten/zalen**.
5. Kies een sterk, uniek wachtwoord en noteer het. Dit vul je straks in `config.js` in.

> 💡 Maak per locatie/scherm-groep eventueel een aparte gebruiker, zodat je
> credentials per scherm kunt intrekken zonder de rest te raken.

---

## 3. Authenticatie in de HTML (Basic Auth)

De SDK regelt dit automatisch. Je vult alleen je gegevens in `config.js` in:

```js
auth: { username: "API_signage", password: "JOUW_WACHTWOORD" },
```

De helper (`shared/ireserve.js`) bouwt hier de header van:

```js
"Authorization": "Basic " + btoa(username + ":" + password)
```

Heeft een endpoint geen authenticatie nodig (sommige **publieke** event-endpoints),
zet dan `auth: null`.

---

## 4. CORS toestaan in het admin panel  ⭐

Dit is de stap die het vaakst vergeten wordt. De browser blokkeert standaard
requests naar een ander domein dan waarvan de pagina komt. Een narrow-casting-pagina
draait meestal als bestand (`file://`) of op een lokaal kastje — een **andere origin**
dan `https://JOUWOMGEVING.i-reserve.net`. Daarom moet de API expliciet toestaan dat
deze origin requests mag doen (CORS = Cross-Origin Resource Sharing).

### Welke origin moet je toestaan?

| Hoe draait het scherm? | Origin die je whitelidst |
|---|---|
| Als los bestand geopend (`file://.../index.html`) | `null` |
| Vanaf een lokale webserver | `http://localhost` of `http://<ip-adres>` |
| Gehost op een (sub)domein | `https://signage.jouwdomein.nl` |

> Bij `file://` stuurt de browser letterlijk de origin **`null`**. Die moet dus in de
> whitelist staan. Kan dat niet, host de pagina dan via een mini-webserver (zie §7).

### Waar in het admin panel

1. Open het **admin panel** → **Instellingen** → **API / Koppelingen** (of
   **Beveiliging / CORS** — de exacte naam kan per versie verschillen).
2. Zoek de instelling **"Toegestane origins" / "CORS allowed origins"**.
3. Voeg de origin(s) uit de tabel hierboven toe, één per regel, bijvoorbeeld:
   ```
   null
   https://signage.jouwdomein.nl
   ```
4. Opslaan. De API stuurt dan de juiste `Access-Control-Allow-Origin` header terug.

> Vermijd `*` (alles toestaan) in productie. Whitelist alleen de origins die je echt
> gebruikt. `*` werkt bovendien niet in combinatie met Basic Auth credentials in
> sommige browsers.

---

## 5. Het filter (search-DSL)

De `search`-parameter gebruikt relatieve datums en eenvoudige logica:

| Voorbeeld | Betekenis |
|---|---|
| `startdatum >= "0d" AND startdatum <= "0d"` | alleen vandaag |
| `startdatum >= "0d" AND startdatum <= "7d"` | vandaag t/m 7 dagen vooruit |
| `startdatum >= "-1d"` | vanaf gisteren |
| `... AND product IN (101,102,103)` | beperk tot deze product-id's |

`"0d"` = vandaag, `"7d"` = over 7 dagen, `"-1d"` = gisteren. Combineer met `AND` / `OR`.
De product-id's vind je in het admin panel bij het betreffende product/zaal.

De `columns`-parameter bepaalt de velden in het antwoord, bijvoorbeeld
`OBJ_TXT_CUSTOM01,RES_CUSTOM02,RES_FROMTIME,RES_TILTIME`.

---

## 6. Testen of het werkt

Test eerst los van de browser met `curl` (geen CORS-restrictie, dus puur de
auth/filter-check):

```bash
curl -u "API_signage:JOUW_WACHTWOORD" \
  'https://JOUWOMGEVING.i-reserve.net/api/rest/booking/filter?columns=RES_CUSTOM02,RES_FROMTIME,RES_TILTIME&search=startdatum%20%3E%3D%20%220d%22%20AND%20startdatum%20%3C%3D%20%220d%22'
```

- **JSON terug** → auth en filter zijn goed. Open daarna het scherm in de browser.
- **401 Unauthorized** → gebruikersnaam/wachtwoord of rechten kloppen niet (§2).
- **In de browser leeg, in curl wél data** → vrijwel zeker CORS (§4). Open de
  DevTools-console (F12); een CORS-melding bevestigt dit.

Linksonder op elk scherm staat een statusregel met de laatste ophaalstatus/foutmelding.

---

## 7. Alternatief: hosten via een mini-webserver

Lukt het niet om origin `null` te whitelisten, draai de pagina dan via een lokale
webserver. Dan heb je een nette `http://localhost`-origin:

```bash
# in de map van het voorbeeld
python3 -m http.server 8080
# open daarna http://localhost:8080 op het scherm
```

Whitelist vervolgens `http://localhost:8080` (of het IP) in §4.

---

## 8. Beveiligingschecklist

- [ ] Aparte API-gebruiker, **alleen leesrechten**, beperkt tot de juiste producten.
- [ ] Sterk, uniek wachtwoord; periodiek roteren.
- [ ] Alleen de benodigde origins in de CORS-whitelist (geen `*`).
- [ ] Geen beheeraccount in `config.js`.
- [ ] Bij twijfel: zet een eigen reverse-proxy ertussen die de credentials
      server-side toevoegt, zodat ze niet in de HTML staan.
