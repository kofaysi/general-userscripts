// ==UserScript==
// @name         Phone Number Call Button Overlay with Disappearing Button
// @namespace    https://github.com/kofaysi/
// @version      1.7
// @description  Detects phone number selection, creates a call, SMS, and copy button overlay, removes the button when selection is not active. Includes an Easter egg for debugging. Mobile touch events supported.
// @author       https://github.com/kofaysi/
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

    // Function to remove all buttons (Call, SMS, Copy)
    function removeButtons() {
        const buttonIds = ['callButtonOverlay', 'smsButtonOverlay', 'copyButtonOverlay'];
        buttonIds.forEach(buttonId => {
            let existingButton = document.getElementById(buttonId);
            if (existingButton) {
                existingButton.remove();
            }
        });
    }

    // Function to create a button element
    function createButton(id, text, action) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.bottom = `${10 + (50 * document.getElementsByTagName('button').length)}px`; // Position them dynamically below each other
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '15px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '10px';
        button.style.cursor = 'pointer';
        button.onclick = action;

        document.body.appendChild(button);
    }

    // Function to create Call, SMS, and Copy buttons
    function createButtons(phoneNumber) {
        // Remove existing buttons if present
        removeButtons();

        // Create "Call" button
        createButton('callButtonOverlay', 'Call ' + phoneNumber, function() {
            window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
        });

        // Create "Send SMS" button
        createButton('smsButtonOverlay', 'Send SMS', function() {
            window.location.href = `sms:${phoneNumber.replace(/\s/g, '')}`;
        });

        // Create "Copy" button
        createButton('copyButtonOverlay', 'Copy', function() {
            navigator.clipboard.writeText(phoneNumber)
                .then(() => {
                    alert('Phone number copied: ' + phoneNumber);
                })
                .catch(err => {
                    alert('Failed to copy phone number: ' + err);
                });
        });
    }

    // Function to handle text selection
    function handleTextSelection() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // Format the selected text before matching with regex
            const formattedText = formatPhoneNumber(selectedText);
            if (phoneRegex.test(formattedText) || selectedText.toLowerCase() === "phone") {
                // Call createButtons with '123' for the Easter egg when "phone" is selected
                createButtons(selectedText.toLowerCase() === "phone" ? '123' : formattedText);
            }
        } else {
            // Remove the buttons if no text is selected
            removeButtons();
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
                // Call createButtons with '123' for the Easter egg when "phone" is selected
                createButtons(clipboardText.toLowerCase() === "phone" ? '123' : formattedClipboardText);
            }
        }
    });

})();
