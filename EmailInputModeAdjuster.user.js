// ==UserScript==
// @name         Email Input Mode Adjuster
// @namespace    https://github.com/kofaysi/general-userscripts/edit/main/EmailInputModeAdjuster.user.js
// @version      0.1
// @description  Changes inputmode for input fields with id or placeholder containing 'email' or 'e-mail'
// @author       https://github.com/kofaysi
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to change input mode for email fields
    function changeInputModeForEmailFields() {
        // Find all input elements
        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
            // Check if id or placeholder contains 'email' or 'e-mail'
            const isEmailInput = /e-?mail/i.test(input.id) || /e-?mail/i.test(input.placeholder);

            if (isEmailInput) {
                // Set inputmode to 'email'
                input.inputMode = 'email';
            }
        });
    }

    // Run the function on page load
    window.addEventListener('load', changeInputModeForEmailFields);
})();
