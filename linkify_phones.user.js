// Separate script for phone numbers
// ==UserScript==
// @name         Linkify Phone Numbers
// @namespace    https://github.com/kofaysi/general-userscripts
// @version      1.0
// @description  Parses the page content for phone numbers and linkifies them.
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const phoneRegex = /^(([\+]|00)\d{1,3})?\s?\d{1,3}(\s?\d{2,6}){2,5}$/g;

    function formatPhoneNumber(text) {
        // Replace non-breaking spaces (&nbsp;) with regular spaces, and then clean up formatting
        return text.replace(/&nbsp;/g, ' ').replace(/[().-]/g, ' ').replace(/\s+/g, ' ').trim();
     }

    function createPhoneLink(phoneNumber) {
        const formattedPhone = formatPhoneNumber(phoneNumber);
        const a = document.createElement('a');
        a.href = `tel:${formattedPhone.replace(/\s/g, '')}`;
        a.textContent = phoneNumber;
        a.style.color = '#4CAF50';
        return a;
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

    function processDocument() {
        const body = document.body;
        linkifyText(body, phoneRegex, createPhoneLink);
    }

    window.addEventListener('load', processDocument);
})();
