// ==UserScript==
// @name         MediaWiki Spellcheck Toggle
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/ipp.cas.cz-spellchecker.user.js
// @version      1.1
// @description  Toggle spellcheck mode on MediaWiki pages without editing
// @author       https://github.com/kofaysi/
// @match        https://*wiki.tok.ipp.cas.cz/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURATION
    const spellTabId = 'ca-spellcheck';
    const spellTabLabel = 'Spellcheck'; // You can replace this with a symbol like '📝' or '🔤'

    // Insert new tab before "Read"
    const tabList = document.querySelector('#p-views .vector-menu-content-list');
    if (!document.getElementById(spellTabId) && tabList) {
        const li = document.createElement('li');
        li.id = spellTabId;
        li.className = 'mw-list-item';

        const a = document.createElement('a');
        a.href = '#';
        a.title = 'Toggle spellcheck mode (Ctrl+Alt+S)';
        const span = document.createElement('span');
        span.textContent = spellTabLabel;
        a.appendChild(span);
        li.appendChild(a);

        tabList.insertBefore(li, tabList.firstChild);

        a.addEventListener('click', toggleSpellMode);
    }

    // Toggle function
    function toggleSpellMode(e) {
        e.preventDefault();
        const body = document.body;
        const active = document.designMode === 'on';

        if (active) {
            body.removeAttribute('contenteditable');
            document.designMode = 'off';
            document.getElementById(spellTabId).classList.remove('selected');
        } else {
            body.setAttribute('contenteditable', 'true');
            document.designMode = 'on';
            document.getElementById(spellTabId).classList.add('selected');
        }
    }

    // Keyboard shortcut: Ctrl + Alt + S
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
            toggleSpellMode(e);
        }
    });
})();
