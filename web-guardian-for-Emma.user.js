// ==UserScript==
// @name         Website Blocker
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/web-guardian-for-Emma.user.js
// @version      1.10
// @description  Block all websites except the whitelisted ones
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none`
// ==/UserScript==

(function() {
    'use strict';

    // Define the list of allowed domains (whitelist)
    const whitelist = [
        /.*\.?google\..*/,          // Google and related services (optional period)
        /.*\.?wikipedia\..*/,       // Wikipedia (optional period)
        /.*\.?encyclopedia\..*/,    // Other encyclopedias (optional period)
        /.*\.?github\.com.*/,       // GitHub (optional period)
        /.*\.?mapy\.cz/,            // mapy.cz (optional period)
        /.*\.?seznam\.cz/,          // seznam.cz (optional period)
        /.*\.?murena\.io/,          // murena.io (optional period)
        /.*\.?duckduckgo\.com/,     // DuckDuckGo (optional period)
        /.*\.?qwant\.com/,          // Qwant (optional period)
        /.*\.?zatrolene-hry\.cz/,   // zatrolene-hry.cz (optional period)
        /.*\.?boardgamegeek\.com/   // boardgamegeek.com (optional period)
    ];

    // Get the current domain
    const currentDomain = window.location.hostname;

    // Check if the current domain is in the whitelist
    const isWhitelisted = whitelist.some(pattern => pattern.test(currentDomain));

    // If not whitelisted, redirect to a blocked page or display a blocking message
    if (!isWhitelisted) {
        const styles = `
            .blocker-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                text-align: center;
                background-color: #f0f8ff;
            }
            .blocker-message {
                border: 2px solid #add8e6;
                border-radius: 10px;
                padding: 20px;
                background-color: #ffffff; /* Force white background */
                max-width: 600px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .blocker-message h1 {
                color: #005b96;
            }
            .blocker-message p.en-red {
                color: #ff0000; /* English - Red */
            }
            .blocker-message p.en-white {
                color: #000000; /* English - White text on white background */
                background-color: #ffffff; /* Ensure white background */
            }
            .blocker-message p.en-blue {
                color: #0000ff; /* English - Blue */
            }
            .blocker-message p.de-black {
                color: #000000; /* German - Black */
            }
            .blocker-message p.de-red {
                color: #ff0000; /* German - Red */
            }
            .blocker-message p.de-gold {
                color: #ffd700; /* German - Gold */
            }
            .blocker-message p.es-red {
                color: #ff0000; /* Spanish - Red */
            }
            .blocker-message p.es-yellow {
                color: #ffd700; /* Spanish - Yellow */
            }
            .blocker-message hr {
                border: none;
                border-top: 1px solid #ccc;
                margin: 20px 0;
            }
        `;

        // Inject CSS styles into the head
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Display blocking message with dividers
        document.body.innerHTML = `
            <div class="blocker-container">
                <div class="blocker-message">
                    <h1>This website is blocked.</h1>
                    <p class="en-red">Dear intruder, this page is not on the whitelist.</p>
                    <p class="en-white">Ask your papa to whitelist this page for further browsing.</p>
                    <p class="en-blue">Repeated attempts to visit this page might lead to more chores and errands.</p>
                    <hr>
                    <p class="de-black">Lieber Eindringling, diese Seite steht nicht auf der Whitelist.</p>
                    <p class="de-red">Bitte deinen Papa, diese Seite für weiteres Surfen auf die Whitelist zu setzen.</p>
                    <p class="de-gold">Wiederholte Versuche könnten zu mehr Hausarbeiten und Besorgungen führen.</p>
                    <hr>
                    <p class="es-red">Querido intruso, esta página no está en la lista blanca.</p>
                    <p class="es-yellow">Pídele a tu papá que ponga esta página en la lista blanca para continuar navegando.</p>
                    <p class="es-red">Intentos repetidos podrían llevar a más tareas domésticas y recados.</p>
                </div>
            </div>
        `;
        document.title = "Blocked";
    }
})();
