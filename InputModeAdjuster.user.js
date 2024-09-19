// ==UserScript==
// @name         Input Mode Adjuster
// @namespace    https://github.com/kofaysi/
// @version      1.6
// @description  Changes inputmode for input fields with id or placeholder containing "keywords"
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to change input mode for various fields
    function changeInputModeForVariousFields() {
        // Find all input elements
        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
            // Check if id or placeholder contains 'email', 'e-mail', 'telephone', 'phone', 'tel', or 'postal code'
            const isEmailInput = /e-?mail/i.test(input.id) || /e-?mail/i.test(input.placeholder);
            const isTelephoneInput = /(phone|tel|szám)/i.test(input.id) || /(phone|tel|szám)/i.test(input.placeholder);
            const isPostalCodeInput = /(code|PSČ|směřovací|irányító)/i.test(input.id) || /(code|PSČ|směřovací)/i.test(input.placeholder) || /(code|PSČ|směřovací)/i.test(input.name);
            const isAddressInput = /(adresa|cím|address)/i.test(input.id);

            if (isEmailInput) {
                // Set inputmode to 'email'
                input.inputMode = 'email';
            } else if (isTelephoneInput) {
                // Set inputmode to 'tel'
                input.inputMode = 'tel';
            } else if (isAddressInput) {
                // Set inputmode to 'text' for address fields
                input.inputMode = 'text';
            } else if (isPostalCodeInput) {
                // Set inputmode to 'numeric' based on your preference
                input.inputMode = 'numeric';
            }
        });
    }

    // Run the function on page load
    window.addEventListener('load', changeInputModeForVariousFields);
})();
