// ==UserScript==
// @name         Selected Text Overlay
// @namespace    https://github.com/kofaysi/general-userscripts/
// @version      1.3
// @description  Creates a floating button that copies the direct link to the selected text using the text fragment feature.
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function removeButtonContainer() {
        let existingContainer = document.getElementById('buttonContainerOverlay');
        if (existingContainer) existingContainer.remove();
    }

    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.padding = '15px';
        button.style.fontSize = '16px';
        button.style.margin = '0 5px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.flex = '1';
        button.onclick = onClick;
        return button;
    }

    function createButtonContainer(selectedText) {
        removeButtonContainer();

        if (!selectedText) return;

        const encodedText = encodeURIComponent(selectedText).replace(/%20/g, " ");
        const selectionURL = `${window.location.href}#::text=${encodedText}`;

        const container = document.createElement('div');
        container.id = 'buttonContainerOverlay';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '0';
        container.style.right = '0';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.padding = '0 20px';
        container.style.width = '100vw';
        container.style.boxSizing = 'border-box';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        container.style.flexWrap = 'wrap';
        container.style.transform = 'scale(1)';
        container.style.userSelect = 'none';
        container.style.pointerEvents = 'none';
        container.style.touchAction = 'none';

        const innerContainer = document.createElement('div');
        innerContainer.style.pointerEvents = 'all';
        innerContainer.style.transform = 'scale(1)';

        const copyButton = createButton('Copy Link', async () => {
            try {
                await navigator.clipboard.writeText(selectionURL);
                alert('Link copied to clipboard: ' + selectionURL);
            } catch (err) {
                alert('Failed to copy link: ' + err);
            }
        });
        innerContainer.appendChild(copyButton);

        container.appendChild(innerContainer);
        document.body.appendChild(container);
    }

    function handleTextSelection() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            createButtonContainer(selectedText);
        } else {
            removeButtonContainer();
        }
    }

    document.addEventListener('selectionchange', handleTextSelection);
})();
