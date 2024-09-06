// ==UserScript==
// @name         Phone Number Call Button Overlay with Disappearing Button and Identity Detection
// @namespace    https://github.com/kofaysi/
// @version      2.2
// @description  Adds floating buttons for Call, Send SMS, Copy, Map, and opening URLs for identity numbers (IČ, IČO, ID, DIČ). Prioritizes showing the Rejstřík button for identity numbers. Buttons aligned horizontally at the bottom of the screen. Mobile touch events supported. Map button opens in the default map application using geo URI. Handles European accents, excludes special characters like !@#$%^&*()_+{}|":<>?=[];'\"~`.
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Booleans to control the visibility of the buttons
    const showCopy = true;  // Show Copy button (only if SMS or Call is true, or address is valid)
    const showSMS = true;   // Show SMS button
    const showCall = true;  // Show Call button
    const showMap = true;   // Show Map button (for valid addresses)
    const showOpenIdentityURL = true; // Show Rejstřík button for valid identity numbers (IČ, IČO, ID, DIČ)

    // Regex to match the formatted phone number
    const phoneRegex = /^(([\+]|00)\d{1,3})?\s?\d{1,3}(\s?\d{2,6}){1,5}$/;

    // Regex to detect invalid special characters
    const specialCharactersRegex = /[!@#$%^&*()_+{}|":<>?=\[\];'\\~`]/;

    // Regex to detect a valid identity number (IČ, IČO, ID, DIČ with optional "CZ" prefix)
    const identityRegex = /(IČ|IČO|ID|DIČ)?\:?\s?(CZ)?[\d\s]{7,8}/i;

    // Function to format the selected text for an identity number
    function formatIdentity(text) {
        // Strip spaces and extract the digits
        const identityNumber = text.replace(/\D/g, '').padStart(8, '0');
        return identityNumber;
    }

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

        // Ensure no special characters from the list (!@#$%^&*()_+{}|":<>?=[];'\"~`)
        const noSpecialCharacters = !specialCharactersRegex.test(selectedText);

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
    function createButtonContainer(phoneNumber, address = null, identityNumber = null) {
        // Remove existing button container if present
        removeButtonContainer();

        // Check if Copy should be shown (only if either SMS or Call is true, or address is valid)
        const showCopyButton = showCopy && (showSMS || showCall || address || identityNumber);

        // Prioritize showing the Rejstřík button for identity over Call and SMS
        const showIdentityButtons = showOpenIdentityURL && identityNumber;

        // If none of the buttons should be shown, return early
        if (!showCopyButton && !showSMS && !showCall && (!showMap || !address) && !showIdentityButtons) return;

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
        if (showCopyButton) {
            const copyButton = createButton('Copy', function() {
                const textToCopy = phoneNumber ? phoneNumber : address ? address : identityNumber;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert(`${phoneNumber ? 'Phone number' : address ? 'Address' : 'Identity number'} copied: ${textToCopy}`); // Confirmation alert
                }).catch(err => {
                    alert('Failed to copy text: ', err);
                });
            });
            container.appendChild(copyButton);
        }

        // If an identity number is detected, prioritize showing the Rejstřík button over Call and SMS
        if (showIdentityButtons) {
            const openURLButton = createButton('Rejstřík', function() {
                const url = `https://or.justice.cz/ias/ui/rejstrik-$firma?ico=${identityNumber}`;
                alert(`Opening URL: ${url}`);
                window.open(url, '_blank');
            });
            container.appendChild(openURLButton);
        } else {
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

        // Check if the selection is a valid identity number
        if (selectedText && identityRegex.test(selectedText)) {
            const formattedIdentity = formatIdentity(selectedText);
            createButtonContainer(null, null, formattedIdentity);
            return;
        }
        
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
            createButtonContainer(null, selectedText);
            return;
        }

        // Remove the button container if no valid phone number, address, or identity number is selected
        removeButtonContainer();
    }

    // Monitor for text selection changes frequently using selectionchange event
    document.addEventListener('selectionchange', handleTextSelection);

    // Monitor clipboard for potential phone number, address, or identity number (in case of paste)
    document.addEventListener('paste', function(event) {
        const clipboardText = (event.clipboardData || window.clipboardData).getData('text').trim();
        if (clipboardText) {
            const formattedClipboardText = formatPhoneNumber(clipboardText);

            // Check for an identity number
            if (identityRegex.test(clipboardText)) {
                const formattedIdentity = formatIdentity(clipboardText);
                createButtonContainer(null, null, formattedIdentity);
            }
        
            // Check for a phone number
            else if (phoneRegex.test(formattedClipboardText)) {
                createButtonContainer(formattedClipboardText);
            }

            // Check for an address
            else if (isValidAddress(clipboardText)) {
                createButtonContainer(null, clipboardText);
            }


        }
    });

})();
