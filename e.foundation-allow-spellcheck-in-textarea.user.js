// ==UserScript==
// @name         Add Spellcheck to Textarea
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/e.foundation-allow-spellcheck-in-textarea.user.js
// @version      0.3
// @description  Automatically add spellcheck attribute to textarea elements
// @author       https://github.com/kofaysi/
// @match        https://community.e.foundation/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to add spellcheck attribute
    function addSpellcheck() {
        // Modify the selector to target your specific textarea
        var textareas = document.querySelectorAll('textarea.d-editor-input');
        textareas.forEach(function(textarea) {
            textarea.setAttribute('spellcheck', 'true');
        });
    }

    // Run the function when the document is fully loaded
    window.addEventListener('DOMContentLoaded', addSpellcheck);
}());
