// ==UserScript==
// @name         Show Anchors on Page & Text Selection Links
// @namespace    https://github.com/kofaysi/general-userscripts/
// @version      1.6
// @description  Display floating link symbol for headers with an id attribute and for selected text (Optimized for Bromite)
// @author       https://github.com/kofaysi/
// @match        *://*/*
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
            navigator.clipboard.writeText(fullUrl).then(() => {
                alert(`Copied link: ${fullUrl}`);
            }).catch(err => console.error('Clipboard copy failed:', err));
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
        
        // 1. Floating button at bottom-right
        const anchor1 = document.createElement('button');
        anchor1.textContent = '🔗 Copy Selection Link';
        anchor1.style.position = 'fixed';
        anchor1.style.right = '20px';
        anchor1.style.bottom = '20px';
        anchor1.style.backgroundColor = '#28a745';
        anchor1.style.color = 'white';
        anchor1.style.padding = '10px';
        anchor1.style.border = 'none';
        anchor1.style.borderRadius = '5px';
        anchor1.style.cursor = 'pointer';
        anchor1.style.zIndex = '10000';
        document.body.appendChild(anchor1);
        
        // 2. Append a small notification in-page
        const anchor2 = document.createElement('div');
        anchor2.textContent = `🔗 Link copied! ${fullUrl}`;
        anchor2.style.position = 'fixed';
        anchor2.style.left = '50%';
        anchor2.style.top = '50px';
        anchor2.style.transform = 'translateX(-50%)';
        anchor2.style.backgroundColor = '#ffcc00';
        anchor2.style.color = 'black';
        anchor2.style.padding = '8px';
        anchor2.style.border = '2px solid black';
        anchor2.style.borderRadius = '5px';
        anchor2.style.zIndex = '10000';
        document.body.appendChild(anchor2);

        // Click event handler
        anchor1.addEventListener('click', () => {
            navigator.clipboard.writeText(fullUrl).then(() => {
                alert(`Copied link: ${fullUrl}`);
            }).catch(err => console.error('Clipboard copy failed:', err));
        });
        
        setTimeout(() => {
            anchor1.remove();
            anchor2.remove();
        }, 10000); // Remove after 10 seconds
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
