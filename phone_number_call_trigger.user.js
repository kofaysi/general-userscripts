// ==UserScript==
// @name         Phone Number Call Button Overlay with Disappearing Button
// @namespace    https://github.com/kofaysi/
// @version      1.8
// @description  Adds floating buttons for Call, Send SMS, and Copy when phone number is selected. Buttons aligned horizontally at the bottom of the screen. Mobile touch events supported.
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
        return text.replace(/[().-]/g, ' ').replace(/\s+/g, ' ').trim(); // Remove parentheses, replace periods and dashes with spaces
    }

    // Function to remove the button container overlay
    function removeButtonContainer() {
        let existingContainer = document.getElementById('buttonContainerOverlay');
        if (existingContainer) {
            existingContainer.remove();
        }
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
    function createButtonContainer(phoneNumber) {
        // Remove existing button container if present
        removeButtonContainer();

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

        // Create the Copy button
        const copyButton = createButton('Copy', function() {
            navigator.clipboard.writeText(phoneNumber).then(() => {
                alert('Phone number copied: ' + phoneNumber); // Confirmation alert
            }).catch(err => {
                alert('Failed to copy text: ', err);
            });
        });

        // Create the Send SMS button
        const smsButton = createButton('SMS', function() {
            alert('Opening SMS to: ' + phoneNumber); // Debugging alert
            window.location.href = `sms:${phoneNumber.replace(/\s/g, '')}`;
        });

        // Create the Call button
        const callButton = createButton('Call', function() {
            alert('Initiating call to: ' + phoneNumber); // Debugging alert
            window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
        });

        // Append buttons to the container
        container.appendChild(copyButton);
        container.appendChild(smsButton);
        container.appendChild(callButton);

        // Append the container to the body
        document.body.appendChild(container);
    }

    // Function to handle text selection
    function handleTextSelection() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // Format the selected text before matching with regex
            const formattedText = formatPhoneNumber(selectedText);
            if (phoneRegex.test(formattedText) || selectedText.toLowerCase() === "phone") {
                // Call createButtonContainer with '123' for the Easter egg when "phone" is selected
                createButtonContainer(selectedText.toLowerCase() === "phone" ? '123' : formattedText);
            }
        } else {
            // Remove the button container if no text is selected
            removeButtonContainer();
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
                // Call createButtonContainer with '123' for the Easter egg when "phone" is selected
                createButtonContainer(clipboardText.toLowerCase() === "phone" ? '123' : formattedClipboardText);
            }
        }
    });

})();
