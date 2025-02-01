// ==UserScript==
// @name         Show Anchors on Page & Text Selection Links
// @namespace    https://github.com/kofaysi/general-userscripts/
// @version      1.2
// @description  Display floating link symbol for headers with an id attribute and for selected text
// @author       You
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
        document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(element => {
            if (!element.id.match(/^\s*$/)) { // Ensure id is not empty or just spaces
                createAnchorIcon(element);
            }
        });
    }

    function createSelectionAnchorIcon(text) {
        const encodedText = encodeURIComponent(text.trim());
        const fullUrl = `${window.location.href}#:~:text=${encodedText}`;
        console.log('Selection URL:', fullUrl);
        
        // Create multiple debug display methods
        const anchor = document.createElement('a');
        anchor.href = fullUrl;
        anchor.textContent = '🔗';
        anchor.style.position = 'fixed';
        anchor.style.left = '10px';
        anchor.style.bottom = '10px';
        anchor.style.textDecoration = 'none';
        anchor.style.fontSize = '16px';
        anchor.style.cursor = 'pointer';
        anchor.style.opacity = '0.6';
        anchor.style.transition = 'opacity 0.2s';
        anchor.style.backgroundColor = 'white';
        anchor.style.padding = '5px';
        anchor.style.borderRadius = '4px';
        anchor.style.boxShadow = '0px 0px 4px rgba(0,0,0,0.3)';
        anchor.title = 'Copy link to selection';
        
        anchor.addEventListener('mouseover', () => anchor.style.opacity = '1');
        anchor.addEventListener('mouseout', () => anchor.style.opacity = '0.6');
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            GM_setClipboard(fullUrl);
            alert(`Copied link: ${fullUrl}`);
        });
        
        document.body.appendChild(anchor);
        setTimeout(() => anchor.remove(), 10000); // Remove after 10 seconds

        // Additional debug display: console and alert
        console.log('Anchor added to body');
        alert(`Debug: Selection link generated: ${fullUrl}`);
    }

    document.addEventListener('mouseup', () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const text = selection.toString();
            if (text.length > 0) {
                createSelectionAnchorIcon(text);
            }
        }
    });

    window.addEventListener('load', addAnchorIcons);
})();
