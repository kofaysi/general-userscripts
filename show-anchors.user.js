// ==UserScript==
// @name         Show Anchors on Page & Text Selection Links
// @namespace    https://github.com/kofaysi/general-userscripts/
// @version      1.7
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

        // Create a bottom fixed container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.width = '100vw';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.zIndex = '9999';

        // Create a large button inside the container
        const button = document.createElement('button');
        button.textContent = '🔗 Copy Selection Link';
        button.style.width = '80vw';
        button.style.height = '50px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '10px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', () => {
            navigator.clipboard.writeText(fullUrl).then(() => {
                alert(`Copied link: ${fullUrl}`);
            }).catch(err => console.error('Clipboard copy failed:', err));
        });

        container.appendChild(button);
        document.body.appendChild(container);
        
        setTimeout(() => {
            container.remove();
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

