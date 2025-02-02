// ==UserScript==
// @name         Selected Text Overlay
// @namespace    https://github.com/kofaysi/general-userscripts/
// @version      1.0
// @description  Show selected text in an overlay rectangle at the bottom-left corner
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.bottom = '10px';
    overlay.style.left = '10px';
    overlay.style.padding = '10px';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.color = 'white';
    overlay.style.borderRadius = '5px';
    overlay.style.fontSize = '16px';
    overlay.style.maxWidth = '80%';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'none';
    overlay.style.wordBreak = 'break-word';
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
