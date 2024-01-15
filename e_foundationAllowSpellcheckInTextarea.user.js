// ==UserScript==
// @name         Add Spellcheck to Textarea
// @namespace    http://tampermonkey.net/
// @version      2024-01-16
// @description  Automatically add spellcheck attribute to textarea elements
// @author       Your Name
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
