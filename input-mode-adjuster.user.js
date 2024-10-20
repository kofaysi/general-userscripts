// ==UserScript==
// @name         Input Mode Adjuster
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/InputModeAdjuster.user.js
// @version      1.11
// @description  Changes inputmode for input fields with id or placeholder containing "keywords" only if the type is not specified
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define the search strings for regex patterns
    const EMAIL_REGEX = /e-?mail/i;
    const TELEPHONE_REGEX = /(phone|tel|szám)/i;
    const POSTAL_CODE_REGEX = /(code|PSČ|směřovací|irányító)/i;
    const ADDRESS_REGEX = /(adresa|cím|address)/i;

    // Function to change input mode for various fields
    function changeInputModeForVariousFields() {
        // Find all input elements
        const inputs = document.querySelectorAll('input');

        inputs.forEach(input => {
            // Proceed only if the input field does not have a type attribute or its type is set to "text"
            if (!input.hasAttribute('type') || input.getAttribute('type') === 'text') {
                // Check if id or placeholder matches any of the defined regex patterns
                const isEmailInput = EMAIL_REGEX.test(input.id) || EMAIL_REGEX.test(input.placeholder);
                const isTelephoneInput = TELEPHONE_REGEX.test(input.id) || TELEPHONE_REGEX.test(input.placeholder);
                const isPostalCodeInput = POSTAL_CODE_REGEX.test(input.id) || POSTAL_CODE_REGEX.test(input.placeholder) || POSTAL_CODE_REGEX.test(input.name);
                const isAddressInput = ADDRESS_REGEX.test(input.id) || ADDRESS_REGEX.test(input.placeholder);

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
                    // Set inputmode to 'numeric'
                    input.inputMode = 'numeric';
                }
            }
        });
    }

    // Run the function on page load
    window.addEventListener('load', changeInputModeForVariousFields);
})();
