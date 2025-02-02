// ==UserScript==
// @name         Selected Text Overlay
// @namespace    https://github.com/kofaysi/general-userscripts/
// @version      1.1
// @description  Show selected text in an overlay rectangle at the bottom-left corner with improved design and disappearance mechanism
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let overlay = document.createElement('div');
    overlay.id = 'textOverlay';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '20px';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.padding = '10px';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.color = 'white';
    overlay.style.borderRadius = '8px';
    overlay.style.fontSize = '16px';
    overlay.style.maxWidth = '100%';
    overlay.style.textAlign = 'center';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'none';
    overlay.style.wordBreak = 'break-word';
    overlay.style.boxSizing = 'border-box';
    overlay.style.userSelect = 'none';
    overlay.style.pointerEvents = 'none';
    overlay.style.touchAction = 'none';
    document.body.appendChild(overlay);

    document.addEventListener('mouseup', function() {
        let selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            overlay.textContent = selectedText;
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    });

    document.addEventListener('click', function(event) {
        if (!overlay.contains(event.target)) {
            overlay.style.display = 'none';
        }
    });
})();
