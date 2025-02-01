// ==UserScript==
// @name         Show Anchors on Page
// @namespace    https://github.com/kofaysi/general-userscripts/
// @version      1.0
// @description  Display floating link symbol for elements with an id attribute
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function createAnchorIcon(element) {
        const anchor = document.createElement('a');
        anchor.href = `#${element.id}`;
        anchor.textContent = '🔗';
        anchor.style.position = 'absolute';
        anchor.style.left = '-20px';
        anchor.style.top = '0';
        anchor.style.textDecoration = 'none';
        anchor.style.fontSize = '16px';
        anchor.style.cursor = 'pointer';
        anchor.style.opacity = '0.6';
        anchor.style.transition = 'opacity 0.2s';
        anchor.title = `Copy link to #${element.id}`;

        anchor.addEventListener('mouseover', () => anchor.style.opacity = '1');
        anchor.addEventListener('mouseout', () => anchor.style.opacity = '0.6');
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const fullUrl = `${window.location.origin}${window.location.pathname}#${element.id}`;
            GM_setClipboard(fullUrl);
            alert(`Copied link: ${fullUrl}`);
        });

        element.style.position = 'relative'; // Ensure element has relative positioning
        element.prepend(anchor);
    }

    function addAnchorIcons() {
        document.querySelectorAll('[id]').forEach(element => {
            if (!element.id.match(/^\s*$/)) { // Ensure id is not empty or just spaces
                createAnchorIcon(element);
            }
        });
    }

    window.addEventListener('load', addAnchorIcons);
})();
