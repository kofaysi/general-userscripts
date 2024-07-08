// ==UserScript==
// @name         Input Mode Adjuster
// @namespace    https://github.com/kofaysi/general-userscripts/edit/main/InputModeAdjuster.user.js
// @version      2024-01-11
// @description  Changes inputmode for input fields with id or placeholder containing "keywords"
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to change input mode for email, telephone, and postal code fields
    // see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode
    function changeInputModeForVariousFields() {
        // Find all input elements
        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
            // Check if id or placeholder contains 'email', 'e-mail', 'telephone', 'phone', 'tel', or 'postal code'
            const isEmailInput = /e-?mail/i.test(input.id) || /e-?mail/i.test(input.placeholder);
            const isTelephoneInput = /(phone|tel)/i.test(input.id) || /(phone|tel)/i.test(input.placeholder);
            const isPostalCodeInput = /(code|PSČ|směřovací)/i.test(input.id) || /(code|PSČ|směřovací)/i.test(input.placeholder) || /(code|PSČ|směřovací)/i.test(input.name);
            
            if (isEmailInput) {
                // Set inputmode to 'email'
                input.inputMode = 'email';
            } else if (isTelephoneInput) {
                // Set inputmode to 'tel'
                input.inputMode = 'tel';
            } else if (isPostalCodeInput) {
                // Set inputmode to 'numeric' or 'text' based on your preference
                input.inputMode = 'numeric'; // or 'text'
            }
        });
    }

    // Run the function on page load
    window.addEventListener('load', changeInputModeForVariousFields);
})();
