// Separate script for identity numbers
// ==UserScript==
// @name         Linkify Identity Numbers
// @namespace    https://github.com/kofaysi/general-userscripts
// @version      1.0
// @description  Parses the page content for identity numbers and linkifies them.
// @author       https://github.com/kofaysi/
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const identityRegex = /^(?:IČ|IČO|ID|DIČ)\s?:?\s?(CZ)?(?:\d\s*){7,8}$/gi;

    function formatIdentity(text) {
        return text.replace(/\D/g, '').padStart(8, '0');
    }

    function createIdentityLink(identityNumber) {
        const formattedIdentity = formatIdentity(identityNumber);
        const a = document.createElement('a');
        a.href = `https://or.justice.cz/ias/ui/rejstrik-$firma?ico=${formattedIdentity}`;
        a.textContent = identityNumber;
        a.style.color = '#FF5733';
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
        linkifyText(body, identityRegex, createIdentityLink);
    }

    window.addEventListener('load', processDocument);
})();
