// ==UserScript==
// @name         Phone Number Call Button Overlay with Disappearing Button
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Detects phone number selection, creates a call button overlay, removes the button when selection is not active. Includes an Easter egg for debugging. Mobile touch events supported.
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Regex to match the formatted phone number
    const phoneRegex = /^(([\+]|00)\d{1,3})?\s?\d{1,3}(\s?\d{2,6}){1,5}$/;

    // Function to format the selected text (remove parentheses, replace dashes/periods with spaces)
    function formatPhoneNumber(text) {
        // Remove parentheses, replace periods and dashes with spaces
        return text.replace(/[().-]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // Function to remove the call button overlay
    function removeCallButton() {
        let existingButton = document.getElementById('callButtonOverlay');
        if (existingButton) {
            existingButton.remove();
        }
    }

    // Function to create a call button overlay
    function createCallButton(phoneNumber) {
        // Remove existing button if present
        removeCallButton();

        // Create a new button element
        const button = document.createElement('button');
        button.id = 'callButtonOverlay';
        button.textContent = 'Call ' + phoneNumber;
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '20px'; // Increased padding for a larger button
        button.style.fontSize = '18px'; // Increased font size
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '10px'; // Larger border radius for smoother look
        button.style.cursor = 'pointer';

        // Set the button to make a call when clicked
        button.onclick = function() {
            alert('Initiating call to: ' + phoneNumber); // Debugging alert
            window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
        };

        // Append the button to the body
        document.body.appendChild(button);
    }

    // Function to handle text selection
    function handleTextSelection() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // Format the selected text before matching with regex
            const formattedText = formatPhoneNumber(selectedText);
            if (phoneRegex.test(formattedText) || selectedText.toLowerCase() === "phone") {
                // Call createCallButton with '123' for the Easter egg when "phone" is selected
                createCallButton(selectedText.toLowerCase() === "phone" ? '123' : formattedText);
            }
        } else {
            // Remove the button if no text is selected
            removeCallButton();
        }
    }

    // Monitor for text selection changes frequently using selectionchange event
    document.addEventListener('selectionchange', handleTextSelection);

    // Monitor clipboard for potential phone number (in case of paste)
    document.addEventListener('paste', function(event) {
        const clipboardText = (event.clipboardData || window.clipboardData).getData('text').trim();
        if (clipboardText) {
            // Format the clipboard text before matching with regex
            const formattedClipboardText = formatPhoneNumber(clipboardText);
            if (phoneRegex.test(formattedClipboardText) || clipboardText.toLowerCase() === "phone") {
                // Call createCallButton with '123' for the Easter egg when "phone" is selected
                createCallButton(clipboardText.toLowerCase() === "phone" ? '123' : formattedClipboardText);
            }
        }
    });

})();
