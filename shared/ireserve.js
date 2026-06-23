/* =====================================================================
   i-Reserve Narrow Casting SDK — gedeelde JavaScript helper
   ---------------------------------------------------------------------
   Eén kleine, dependency-vrije library die het ophalen van boekingen uit
   de i-Reserve REST API afhandelt, plus handige datum-/tijdhelpers en een
   eenvoudige polling-loop. Werkt prima vanaf file:// (mits CORS in het
   admin panel is ingesteld — zie docs/authenticatie-en-cors.md).

   Gebruik:
     const client = iReserve.createClient(NC_CONFIG);
     const rows   = await client.fetchBookings();
   ===================================================================== */
(function (global) {
    "use strict";

    /* =================================================================
       Taal (i18n)
       ----------------------------------------------------------------- */
    var IR_LANG = "nl";                         // actieve taal
    function dict() {                           // woordenboek van actieve taal
        var all = global.IR_I18N || {};
        return all[IR_LANG] || all.nl || {};
    }
    /* Bepaalt de taal: ?lang=xx in URL > cfg.lang > "nl". */
    function initLang(cfg) {
        var fromUrl = null;
        try { fromUrl = new URLSearchParams(global.location.search).get("lang"); } catch (e) {}
        var lang = (fromUrl || (cfg && cfg.lang) || "nl").toLowerCase().slice(0, 2);
        if (global.IR_I18N && global.IR_I18N[lang]) IR_LANG = lang;
        return IR_LANG;
    }
    function getLang() { return IR_LANG; }

    /* Vertaal een sleutel ("ui.page") met optionele plaatshouders {n}, {t}… */
    function t(key, params) {
        var node = dict();
        key.split(".").forEach(function (k) { node = (node && node[k] !== undefined) ? node[k] : undefined; });
        var str = (node === undefined) ? key : String(node);
        if (params) str = str.replace(/\{(\w+)}/g, function (m, p) {
            return params[p] !== undefined ? params[p] : m;
        });
        return str;
    }
    /* Kies de waarde voor de actieve taal uit een string of {nl,en}-object. */
    function pick(value) {
        if (value && typeof value === "object") return value[IR_LANG] || value.nl || value[Object.keys(value)[0]] || "";
        return value || "";
    }
    /* Meervoud: kies enkelvoud/meervoud op basis van n. */
    function plural(n, oneKey, otherKey) { return t(n === 1 ? oneKey : otherKey); }

    /* Vul alle elementen met data-i18n="ui.x" met de vertaalde tekst.
       data-i18n-html gebruikt innerHTML (voor strings met opmaak). */
    function applyI18n(root) {
        root = root || document;
        root.querySelectorAll("[data-i18n]").forEach(function (el) {
            el.textContent = t(el.getAttribute("data-i18n"));
        });
        root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
            el.innerHTML = t(el.getAttribute("data-i18n-html"));
        });
    }

    /* ---- URL opbouwen op basis van de config -------------------------- */
    function buildUrl(cfg) {
        var base = (cfg.baseUrl || "").replace(/\/+$/, "");
        var ep   = cfg.endpoint || "/api/rest/booking/filter";
        if (ep.charAt(0) !== "/") ep = "/" + ep;

        var params = new URLSearchParams();
        if (cfg.columns && cfg.columns.length) {
            params.set("columns", cfg.columns.join(","));
        }
        if (cfg.search) params.set("search", cfg.search);
        if (cfg.lang)   params.set("lang", cfg.lang);

        // extra losse querystring-parameters (optioneel)
        if (cfg.params) {
            Object.keys(cfg.params).forEach(function (k) {
                params.set(k, cfg.params[k]);
            });
        }
        var qs = params.toString();
        return base + ep + (qs ? "?" + qs : "");
    }

    /* ---- Basic Auth header -------------------------------------------- */
    function authHeader(cfg) {
        if (!cfg.auth || !cfg.auth.username) return null;
        // btoa = base64. Let op: credentials staan dan in de HTML; gebruik
        // ALTIJD een read-only API-gebruiker (zie de auth-documentatie).
        return "Basic " + btoa(cfg.auth.username + ":" + cfg.auth.password);
    }

    /* ---- Demo-modus -------------------------------------------------
       Actief als cfg.demo === true OF zolang baseUrl nog de placeholder
       "JOUWOMGEVING" bevat. Dan komt de data uit shared/demo-data.js
       i.p.v. de echte API, zodat de voorbeelden direct werken. */
    function isDemo(cfg) {
        return cfg.demo === true || /JOUWOMGEVING/i.test(cfg.baseUrl || "");
    }
    function demoRows(cfg) {
        var src = global.IR_DEMO;
        // IR_DEMO mag een builder-functie zijn (taalafhankelijk) of een vast object.
        var d = (typeof src === "function") ? src(IR_LANG)
              : (src && typeof src.build === "function") ? src.build(IR_LANG)
              : (src || { bookings: [], events: [] });
        var isEvent = /event/i.test(cfg.endpoint || "");
        return isEvent ? (d.events || []) : (d.bookings || []);
    }

    function createClient(cfg) {
        return {
            url: function () { return buildUrl(cfg); },

            /* Haalt de boekingen op. Geeft altijd een array terug. */
            fetchBookings: function () {
                if (isDemo(cfg)) {
                    return Promise.resolve(demoRows(cfg));
                }

                var headers = { "Content-Type": "application/json" };
                var auth = authHeader(cfg);
                if (auth) headers["Authorization"] = auth;

                return fetch(buildUrl(cfg), { headers: headers, cache: "no-store" })
                    .then(function (res) {
                        if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText);
                        return res.json();
                    })
                    .then(function (data) {
                        // De API geeft doorgaans een array terug. Sommige
                        // endpoints verpakken het in { data: [...] }.
                        if (Array.isArray(data)) return data;
                        if (data && Array.isArray(data.data)) return data.data;
                        if (data && Array.isArray(data.results)) return data.results;
                        return [];
                    });
            }
        };
    }

    /* ---- Polling: haal nu op, herhaal elke X minuten ------------------ */
    function poll(cfg, onData, onError) {
        var client = createClient(cfg);
        var minutes = cfg.refreshMinutes || 15;

        var demoTag = isDemo(cfg) ? " · " + t("status.demo") : "";
        function tick() {
            client.fetchBookings()
                .then(function (rows) {
                    setStatus(t("status.updated") + ": " + formatClock(new Date()) + " — " + rows.length + " " + t("status.items") + demoTag, "ok");
                    onData(rows);
                })
                .catch(function (err) {
                    setStatus(t("status.error") + ": " + err.message, "error");
                    if (onError) onError(err);
                })
                .then(function () {
                    setTimeout(tick, minutes * 60 * 1000);
                });
        }
        tick();
    }

    /* ---- Datum-/tijdhelpers (gelokaliseerd via i18n) ------------------ */
    function formatLongDate(d) {
        d = d || new Date();
        var dd = dict();
        var days   = dd.days   || ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"];
        var months = dd.months || ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
        return days[d.getDay()] + " " + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
    }
    function formatClock(d) {
        d = d || new Date();
        return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    }
    /* Knipt "HH:MM:SS" terug naar "HH:MM". Laat andere formaten met rust. */
    function shortTime(t) {
        if (!t) return "";
        var m = String(t).match(/^(\d{1,2}:\d{2})/);
        return m ? m[1] : String(t);
    }
    function timeRange(from, til) {
        from = shortTime(from); til = shortTime(til);
        return til ? (from + " – " + til) : from;
    }

    /* ---- HTML-escape (voorkom kapotte layout / injectie) -------------- */
    function esc(s) {
        if (s === null || s === undefined) return "";
        return String(s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    /* ---- Statusregel linksonder (handig bij debuggen) ----------------- */
    function setStatus(msg, state) {
        var el = document.getElementById("nc-status");
        if (!el) return;
        el.textContent = msg;
        el.setAttribute("data-state", state || "ok");
        el.hidden = false;
    }

    /* ---- "Is dit event nu bezig?" (voor kamerbordjes) ----------------- */
    function isNow(fromTime, tilTime, ref) {
        ref = ref || new Date();
        var nowMin = ref.getHours() * 60 + ref.getMinutes();
        function toMin(t) {
            var m = String(t || "").match(/(\d{1,2}):(\d{2})/);
            return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : null;
        }
        var a = toMin(fromTime), b = toMin(tilTime);
        if (a === null) return false;
        if (b === null) return nowMin >= a;
        return nowMin >= a && nowMin < b;
    }

    /* ---- Chunk een array in pagina's van n -------------------------- */
    function chunk(arr, n) {
        var out = [];
        for (var i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
        return out;
    }

    global.iReserve = {
        createClient:   createClient,
        poll:           poll,
        buildUrl:       buildUrl,
        formatLongDate: formatLongDate,
        formatClock:    formatClock,
        shortTime:      shortTime,
        timeRange:      timeRange,
        isNow:          isNow,
        chunk:          chunk,
        esc:            esc,
        setStatus:      setStatus,
        // i18n
        initLang:       initLang,
        getLang:        getLang,
        t:              t,
        pick:           pick,
        plural:         plural,
        applyI18n:      applyI18n
    };
})(window);
