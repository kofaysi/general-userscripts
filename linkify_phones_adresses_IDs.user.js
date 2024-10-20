// ==UserScript==
// @name         Linkify Phones Addresses IDs
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/linkify_phones_adresses_IDs.user.js
// @version      0.5
// @description  Parses the page content for addresses, identity numbers, and phone numbers, linkifying them hierarchically (addresses first, then identity, then phone numbers) if they are not already in a link. Address regex limits to 64 characters, identity regex does not consume pretexts.
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Regular expressions
    const phoneRegex = /(([\+]|00)\d{1,3})?\s?\d{1,3}(\s?\d{2,6}){1,5}/g;
    
    // Adjust the identity regex to avoid consuming the pretexts (IČ, IČO, etc.)
    const identityRegex = /(?:IČ|IČO|ID|DIČ)\s?:?\s?(CZ)?(?:\d\s*){7,8}/gi;

    // The address regex now extends up to 64 characters
    const addressRegex = /\b([A-Z][a-zA-Z]+\s+\d[\w\s]{0,64})/g;
    
    const specialCharactersRegex = /[!@#$%^&*()_+{}|":<>?=\[\];'\\~`]/;

    // Utility functions
    const formatIdentity = text => text.replace(/\D/g, '').padStart(8, '0');
    const formatPhoneNumber = text => text.replace(/[().-]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Address validation
    function isValidAddress(selectedText) {
        const hasCapital = /[A-Z]/.test(selectedText);
        const hasNumberWithSpace = /\s\d/.test(selectedText);
        const wordCount = selectedText.trim().split(/\s+/).length;
        const withinWordLimit = wordCount <= 12;
        const noSpecialCharacters = !specialCharactersRegex.test(selectedText);
        return hasCapital && hasNumberWithSpace && withinWordLimit && noSpecialCharacters;
    }

    // Function to linkify the detected texts
    function linkifyText(node, regex, createLinkFn) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        let currentNode;

        while (currentNode = walker.nextNode()) {
            textNodes.push(currentNode);
        }

        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;

            // Skip if the parent is already an anchor tag
            if (parent.tagName.toLowerCase() === 'a') {
                return;
            }

            const matches = textNode.nodeValue.match(regex);
            if (matches) {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                matches.forEach(match => {
                    const matchIndex = textNode.nodeValue.indexOf(match, lastIndex);
                    if (matchIndex !== lastIndex) {
                        fragment.appendChild(document.createTextNode(textNode.nodeValue.slice(lastIndex, matchIndex)));
                    }

                    // Create the link for the detected match
                    const link = createLinkFn(match);
                    fragment.appendChild(link);

                    lastIndex = matchIndex + match.length;
                });

                if (lastIndex < textNode.nodeValue.length) {
                    fragment.appendChild(document.createTextNode(textNode.nodeValue.slice(lastIndex)));
                }

                parent.replaceChild(fragment, textNode);
            }
        });
    }

    // Function to create phone link
    function createPhoneLink(phoneNumber) {
        const formattedPhone = formatPhoneNumber(phoneNumber);
        const a = document.createElement('a');
        a.href = `tel:${formattedPhone.replace(/\s/g, '')}`;
        a.textContent = formattedPhone;
        a.style.color = '#4CAF50';
        return a;
    }

    // Function to create identity link
    function createIdentityLink(identityNumber) {
        const formattedIdentity = formatIdentity(identityNumber);
        const a = document.createElement('a');
        a.href = `https://or.justice.cz/ias/ui/rejstrik-$firma?ico=${formattedIdentity}`;
        a.textContent = formattedIdentity;
        a.style.color = '#FF5733';
        return a;
    }

    // Function to create map link for valid addresses
    function createMapLink(address) {
        const a = document.createElement('a');
        a.href = `geo:0,0?q=${encodeURIComponent(address)}`;
        a.textContent = address;
        a.style.color = '#007BFF';
        return a;
    }

    // Function to process the whole document in a hierarchical manner
    function processDocument() {
        const body = document.body;

        // Linkify addresses first
        linkifyText(body, addressRegex, (match) => {
            if (isValidAddress(match)) {
                return createMapLink(match);
            }
            return document.createTextNode(match);
        });

        // Linkify identity numbers next
        linkifyText(body, identityRegex, createIdentityLink);

        // Finally, linkify phone numbers
        linkifyText(body, phoneRegex, createPhoneLink);
    }

    // Run the linkify process when the DOM is fully loaded
    window.addEventListener('load', processDocument);
})();
