// ==UserScript==
// @name         Show Anchors on Page & Text Selection Links
// @namespace    https://github.com/kofaysi/general-userscripts/
// @version      1.4
// @description  Display floating link symbol for headers with an id attribute and for selected text (Debug Mode)
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
        
        // Debugging display methods
        // 1. Floating icon at bottom-left
        const anchor1 = document.createElement('a');
        anchor1.href = fullUrl;
        anchor1.textContent = '🔗';
        anchor1.style.position = 'fixed';
        anchor1.style.left = '10px';
        anchor1.style.bottom = '10px';
        anchor1.style.fontSize = '16px';
        anchor1.style.cursor = 'pointer';
        anchor1.style.backgroundColor = 'yellow';
        anchor1.style.padding = '5px';
        anchor1.style.border = '2px solid black';
        anchor1.style.zIndex = '10000';
        document.body.appendChild(anchor1);
        
        // 2. Floating button at top-right
        const anchor2 = document.createElement('button');
        anchor2.textContent = '📌 Copy Selection Link';
        anchor2.style.position = 'fixed';
        anchor2.style.right = '20px';
        anchor2.style.top = '20px';
        anchor2.style.backgroundColor = 'red';
        anchor2.style.color = 'white';
        anchor2.style.padding = '10px';
        anchor2.style.border = 'none';
        anchor2.style.borderRadius = '5px';
        anchor2.style.zIndex = '10000';
        document.body.appendChild(anchor2);
        
        // 3. Console log and alert popup
        console.log('Anchor elements added');
        alert(`Debug: Selection link generated: ${fullUrl}`);

        // Click event handlers
        [anchor1, anchor2].forEach(anchor => {
            anchor.addEventListener('click', (event) => {
                event.preventDefault();
                GM_setClipboard(fullUrl);
                alert(`Copied link: ${fullUrl}`);
            });
            setTimeout(() => anchor.remove(), 15000); // Remove after 15 seconds
        });
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
