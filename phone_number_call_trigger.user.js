// ==UserScript==
// @name         Phone Number to Call Trigger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Detects phone number selection and issues a call intent
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to validate phone numbers (simple regex for demonstration)
    function isValidPhoneNumber(text) {
        // Basic regex for phone numbers (adjust as necessary)
        const phoneRegex = /^(\+?\(?\d{3,4}\)?)?\s?\d{3}\s?\d{3}\s?\d{3}$/;
        return phoneRegex.test(text);
    }

    // Function to handle phone number detection and call intent
    function handlePhoneNumberSelection(text) {
        if (isValidPhoneNumber(text)) {
            // Intent to make a phone call using tel: protocol
            const telLink = `tel:${text}`;
            window.location.href = telLink;
        }
    }

    // Monitor for text selection
    document.addEventListener('mouseup', function() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            handlePhoneNumberSelection(selectedText);
        }
    });

    // Monitor clipboard for potential phone number (restricted in many browsers)
    document.addEventListener('paste', function(event) {
        const clipboardText = (event.clipboardData || window.clipboardData).getData('text').trim();
        if (clipboardText) {
            handlePhoneNumberSelection(clipboardText);
        }
    });

})();
