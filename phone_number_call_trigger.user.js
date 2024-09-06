// ==UserScript==
// @name         Phone Number Call Button Overlay with Disappearing Button
// @namespace    https://github.com/kofaysi/
// @version      1.8
// @description  Adds floating buttons for Call, Send SMS, Copy, and Map when a phone number or address is selected. Buttons aligned horizontally at the bottom of the screen. Mobile touch events supported. Map button opens in the default map application using geo URI.
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Booleans to control the visibility of the buttons
    const showCopy = true;  // Show Copy button (only if SMS or Call is true)
    const showSMS = true;   // Show SMS button
    const showCall = true;  // Show Call button
    const showMap = true;   // Show Map button (for valid addresses)

    // Regex to match the formatted phone number
    const phoneRegex = /^(([\+]|00)\d{1,3})?\s?\d{1,3}(\s?\d{2,6}){1,5}$/;

    // Regex to detect valid addresses
    const addressRegex = /^[A-Za-z0-9\s]{1,64}$/;  // Simple regex to ensure no special characters

    // Function to format the selected text (remove parentheses, replace dashes/periods with spaces)
    function formatPhoneNumber(text) {
        return text.replace(/[().-]/g, ' ').replace(/\s+/g, ' ').trim(); // Remove parentheses, replace periods and dashes with spaces
    }

    // Function to remove the button container overlay
    function removeButtonContainer() {
        let existingContainer = document.getElementById('buttonContainerOverlay');
        if (existingContainer) {
            existingContainer.remove();
        }
    }

    // Function to check if a string is a valid address based on the criteria
    function isValidAddress(selectedText) {
        // Check if it contains at least one capital letter
        const hasCapital = /[A-Z]/.test(selectedText);

        // Check if it contains at least one number preceded by a space
        const hasNumberWithSpace = /\s\d/.test(selectedText);

        // Check if it contains no more than 8 space-separated words
        const wordCount = selectedText.trim().split(/\s+/).length;
        const withinWordLimit = wordCount <= 8;

        // Ensure no special characters (!@#$%^&*()_+{}|":<>?=[];'\)
        const noSpecialCharacters = addressRegex.test(selectedText);

        return hasCapital && hasNumberWithSpace && withinWordLimit && noSpecialCharacters;
    }

    // Function to create a button
    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.padding = '15px';
        button.style.fontSize = '16px';
        button.style.margin = '0 5px'; // Spacing between buttons
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.flex = '1'; // Ensure buttons take equal space
        button.onclick = onClick;
        return button;
    }

    // Function to create the button container and add buttons
    function createButtonContainer(phoneNumber, address = null) {
        // Remove existing button container if present
        removeButtonContainer();

        // Check if Copy should be shown (only if either SMS or Call is true)
        const showCopyButton = showCopy && (showSMS || showCall);

        // If none of the buttons should be shown, return early
        if (!showCopyButton && !showSMS && !showCall && (!showMap || !address)) return;

        // Create a container for the buttons
        const container = document.createElement('div');
        container.id = 'buttonContainerOverlay';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '0';
        container.style.right = '0';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.padding = '0 20px';
        container.style.width = '100%'; // Take full width of the screen
        container.style.boxSizing = 'border-box'; // Ensure padding is counted within the width
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // Semi-transparent background for the button container

        // Conditionally create and append the Copy button
        if (showCopyButton && phoneNumber) {
            const copyButton = createButton('Copy', function() {
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    alert('Phone number copied: ' + phoneNumber); // Confirmation alert
                }).catch(err => {
                    alert('Failed to copy text: ', err);
                });
            });
            container.appendChild(copyButton);
        }

        // Conditionally create and append the SMS button
        if (showSMS && phoneNumber) {
            const smsButton = createButton('SMS', function() {
                alert('Opening SMS to: ' + phoneNumber); // Debugging alert
                window.location.href = `sms:${phoneNumber.replace(/\s/g, '')}`;
            });
            container.appendChild(smsButton);
        }

        // Conditionally create and append the Call button
        if (showCall && phoneNumber) {
            const callButton = createButton('Call', function() {
                alert('Initiating call to: ' + phoneNumber); // Debugging alert
                window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
            });
            container.appendChild(callButton);
        }

        // Add Map button if a valid address is detected and showMap is true
        if (showMap && address) {
            const mapButton = createButton('Open in Maps', function() {
                alert('Opening Maps with: ' + address);
                window.location.href = `geo:0,0?q=${encodeURIComponent(address)}`;  // Use geo: URI to open default map app
            });
            container.appendChild(mapButton);
        }

        // Append the container to the body
        document.body.appendChild(container);
    }

    // Function to handle text selection
    function handleTextSelection() {
        const selectedText = window.getSelection().toString().trim();

        // Check if the selection is a valid phone number
        if (selectedText) {
            const formattedText = formatPhoneNumber(selectedText);
            if (phoneRegex.test(formattedText)) {
                createButtonContainer(formattedText);
                return;
            }
        }

        // Check if the selection is a valid address
        if (selectedText && isValidAddress(selectedText)) {
            createButtonContainer(null, selectedText);  // Pass the address to the container
        } else {
            // Remove the button container if no valid phone number or address is selected
            removeButtonContainer();
        }
    }

    // Monitor for text selection changes frequently using selectionchange event
    document.addEventListener('selectionchange', handleTextSelection);

    // Monitor clipboard for potential phone number or address (in case of paste)
    document.addEventListener('paste', function(event) {
        const clipboardText = (event.clipboardData || window.clipboardData).getData('text').trim();
        if (clipboardText) {
            const formattedClipboardText = formatPhoneNumber(clipboardText);

            // Check for a phone number
            if (phoneRegex.test(formattedClipboardText)) {
                createButtonContainer(formattedClipboardText);
            }

            // Check for an address
            else if (isValidAddress(clipboardText)) {
                createButtonContainer(null, clipboardText);
            }
        }
    });

})();
