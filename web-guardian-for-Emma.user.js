// ==UserScript==
// @name         Website Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block all websites except the whitelisted ones
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define the list of allowed domains (whitelist)
    const whitelist = [
        /.*\.google\..*/,          // Google and related services
        /.*\.wikipedia\..*/,       // Wikipedia
        /.*\.encyclopedia\..*/,    // Other encyclopedias
        /.*github\.com.*/,         // GitHub (updated pattern)
        /.*\.mapy\.cz/,            // mapy.cz
        /.*\.seznam\.cz/           // seznam.cz
    ];

    // Get the current domain
    const currentDomain = window.location.hostname;

    // Check if the current domain is in the whitelist
    const isWhitelisted = whitelist.some(pattern => pattern.test(currentDomain));

    // If not whitelisted, redirect to a blocked page or display a blocking message
    if (!isWhitelisted) {
        document.body.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center;">
                <h1>This website is blocked.</h1>
                <p>Dear intruder, ask your papa to whitelist this page for further browsing.</p>
                <p>In rare cases, a repeated attempt to visit this page will cause serious restrictions regarding more house-works and running errands.</p>
                <br>
                <p>Lieber Eindringling, bitte deinen Papa, diese Seite auf die Whitelist zu setzen, damit du weiter surfen kannst.</p>
                <p>In seltenen Fällen kann ein erneuter Versuch, diese Seite zu besuchen, zu ernsthaften Einschränkungen führen, die mehr Hausarbeiten und Besorgungen betreffen.</p>
                <br>
                <p>Querido intruso, pídele a tu papá que ponga esta página en la lista blanca para continuar navegando.</p>
                <p>En raros casos, un intento repetido de visitar esta página causará serias restricciones relacionadas con más tareas domésticas y recados.</p>
            </div>
        `;
        document.title = "Blocked";
    }
})();
