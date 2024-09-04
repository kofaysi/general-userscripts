// ==UserScript==
// @name         Phone Number Call Button Overlay with Easter Egg
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Detects phone number selection, creates a call button overlay, and includes an Easter egg for debugging.
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Regex to match phone numbers
    const phoneRegex = /^(\+?\(?\d{3,4}\)?)?\s?\d{2,4}\s?\d{2,4}\s?\d{2,4}$/;

    // Function to create a call button overlay
    function createCallButton(phoneNumber) {
        // Remove existing button if present
        let existingButton = document.getElementById('callButtonOverlay');
        if (existingButton) {
            existingButton.remove();
        }

        // Create a new button element
        const button = document.createElement('button');
        button.id = 'callButtonOverlay';
        button.textContent = 'Call ' + phoneNumber;
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // Set the button to make a call when clicked
        button.onclick = function() {
            window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
        };

        // Append the button to the body
        document.body.appendChild(button);
    }

    // Monitor for text selection
    document.addEventListener('mouseup', function() {
        const selectedText = window.getSelection().toString().trim();
        if (phoneRegex.test(selectedText) || selectedText.toLowerCase() === "phone") {
            // Call createCallButton with '123' for the Easter egg when "phone" is selected
            createCallButton(selectedText.toLowerCase() === "phone" ? '123' : selectedText);
        }
    });

    // Monitor clipboard for potential phone number
    document.addEventListener('paste', function(event) {
        const clipboardText = (event.clipboardData || window.clipboardData).getData('text').trim();
        if (phoneRegex.test(clipboardText) || clipboardText.toLowerCase() === "phone") {
            // Call createCallButton with '123' for the Easter egg when "phone" is selected
            createCallButton(clipboardText.toLowerCase() === "phone" ? '123' : clipboardText);
        }
    });

})();
