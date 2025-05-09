// ==UserScript==
// @name         Gmail Message ID Search Link (Original Message Cell, Instant)
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/ipp.cas.cz-gmail-message-id-link.user.js
// @version      1.3
// @description  Adds a copyable Gmail search link into the Message ID cell as soon as it's revealed
// @author       https://github.com/kofaysi/
// @match        https://mail.google.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Repeatedly look for the Message ID cell
    const tryInsertLink = () => {
        const th = Array.from(document.querySelectorAll("th"))
            .find(el => el.textContent.trim() === "Message ID");

        if (!th) return;

        const td = th.nextElementSibling;
        if (!td || td.dataset.processed || !td.classList.contains("message_id")) return;

        const match = td.textContent.match(/<([^>]+)>/);
        if (!match) return;

        const msgId = match[1];
        const searchUrl = `https://mail.google.com/mail/u/0/#search/rfc822msgid:${msgId}`;

        const link = document.createElement("a");
        link.textContent = "[Copy Search Link]";
        link.href = "#";
        link.style.marginLeft = "10px";
        link.style.color = "#1a73e8";
        link.onclick = (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(searchUrl).then(() => {
                link.textContent = "Copied!";
                setTimeout(() => link.textContent = "[Copy Search Link]", 1500);
            });
        };

        td.appendChild(link);
        td.dataset.processed = "true";
    };

    // Observe mutations and run fallback polling
    const observer = new MutationObserver(tryInsertLink);
    observer.observe(document.body, { childList: true, subtree: true });

    // Retry a few times after load in case Gmail delays rendering
    for (let delay of [500, 1000, 2000, 3000]) {
        setTimeout(tryInsertLink, delay);
    }
})();
