// ==UserScript==
// @name         Phone Number Call Button Overlay with Disappearing Button and Identity Detection
// @namespace    https://github.com/kofaysi/
// @version      2.7
// @description  Adds floating buttons for Call, Send SMS, Copy, Map, and opening URLs for identity numbers (IČ, IČO, ID, DIČ). Prioritizes showing the Rejstřík button for identity numbers. Buttons fit screen width, remain responsive, and do not zoom with page. Mobile touch events supported. Map button opens in the default map application using geo URI. Handles European accents, excludes special characters like !@#$%^&*()_+{}|":<>?=[];'\"~`.
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Booleans to control the visibility of the buttons
    const showCopy = true;
    const showSMS = true;
    const showCall = true;
    const showMap = true;
    const showOpenIdentityURL = true;

    // Regular expressions
    const phoneRegex = /^(([\+]|00)\d{1,3})?\s?\d{1,3}(\s?\d{2,6}){1,5}$/;
    const specialCharactersRegex = /[!@#$%^&*()_+{}|":<>?=\[\];'\\~`]/;
    const identityRegex = /^(IČ|IČO|ID|DIČ)?\:?\s?(CZ)?(?:\d\s*){7,8}$/i;

    // Utility functions
    const formatIdentity = text => text.replace(/\D/g, '').padStart(8, '0');
    const formatPhoneNumber = text => text.replace(/[().-]/g, ' ').replace(/\s+/g, ' ').trim();
    const removeButtonContainer = () => {
        let existingContainer = document.getElementById('buttonContainerOverlay');
        if (existingContainer) existingContainer.remove();
    };

    // Address validation
    function isValidAddress(selectedText) {
        const hasCapital = /[A-Z]/.test(selectedText);
        const hasNumberWithSpace = /\s\d/.test(selectedText);
        const wordCount = selectedText.trim().split(/\s+/).length;
        const withinWordLimit = wordCount <= 12; // Increased limit to 12 words
        const noSpecialCharacters = !specialCharactersRegex.test(selectedText);
        return hasCapital && hasNumberWithSpace && withinWordLimit && noSpecialCharacters;
    }

    // Button creation function
    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.padding = '15px';
        button.style.fontSize = '16px';
        button.style.margin = '0 5px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.flex = '1';
        button.onclick = onClick;
        return button;
    }

    // Create and display buttons
    function createButtonContainer(phoneNumber, address = null, identityNumber = null) {
        removeButtonContainer();

        const showCopyButton = showCopy && (showSMS || showCall || address || identityNumber);
        const showIdentityButtons = showOpenIdentityURL && identityNumber;

        if (!showCopyButton && !showSMS && !showCall && (!showMap || !address) && !showIdentityButtons) return;

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
        container.style.width = '100vw'; // Full viewport width
        container.style.boxSizing = 'border-box'; // Ensure padding is counted within the width
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        container.style.maxWidth = '100%'; // Ensure it fits within the screen width
        container.style.flexWrap = 'wrap'; // Ensure buttons wrap if there are too many
        container.style.transform = 'scale(1)'; // Prevent zooming effect on buttons
        container.style.userSelect = 'none'; // Prevent user selection of the buttons
        container.style.pointerEvents = 'none'; // Prevent interaction when zooming

        // Disable interaction for zoom and pointer events
        const innerContainer = document.createElement('div');
        innerContainer.style.pointerEvents = 'all'; // Enable interaction inside the container

        if (showCopyButton) {
            const copyButton = createButton('Copy', () => {
                const textToCopy = phoneNumber || address || identityNumber;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    alert(`${phoneNumber ? 'Phone number' : address ? 'Address' : 'Identity number'} copied: ${textToCopy}`);
                }).catch(err => alert('Failed to copy text: ' + err));
            });
            innerContainer.appendChild(copyButton);
        }

        if (showIdentityButtons) {
            const openURLButton = createButton('Rejstřík', () => {
                const url = `https://or.justice.cz/ias/ui/rejstrik-$firma?ico=${identityNumber}`;
                alert(`Opening URL: ${url}`);
                window.open(url, '_blank');
            });
            innerContainer.appendChild(openURLButton);
        } else {
            if (showSMS && phoneNumber) {
                const smsButton = createButton('SMS', () => {
                    alert('Opening SMS to: ' + phoneNumber);
                    window.location.href = `sms:${phoneNumber.replace(/\s/g, '')}`;
                });
                innerContainer.appendChild(smsButton);
            }

            if (showCall && phoneNumber) {
                const callButton = createButton('Call', () => {
                    alert('Initiating call to: ' + phoneNumber);
                    window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
                });
                innerContainer.appendChild(callButton);
            }
        }

        if (showMap && address) {
            const mapButton = createButton('Open in Maps', () => {
                alert('Opening Maps with: ' + address);
                window.location.href = `geo:0,0?q=${encodeURIComponent(address)}`;
            });
            innerContainer.appendChild(mapButton);
        }

        container.appendChild(innerContainer);
        document.body.appendChild(container);
    }

    // Handle text selection
    function handleTextSelection() {
        const selectedText = window.getSelection().toString().trim();

        if (identityRegex.test(selectedText)) {
            const formattedIdentity = formatIdentity(selectedText);
            createButtonContainer(null, null, formattedIdentity);
        } else if (phoneRegex.test(formatPhoneNumber(selectedText))) {
            createButtonContainer(formatPhoneNumber(selectedText));
        } else if (isValidAddress(selectedText)) {
            createButtonContainer(null, selectedText);
        } else {
            removeButtonContainer();
        }
    }

    // Event listeners
    document.addEventListener('selectionchange', handleTextSelection);
    document.addEventListener('paste', event => {
        const clipboardText = (event.clipboardData || window.clipboardData).getData('text').trim();
        handleTextSelection(clipboardText);
    });
})();
