// ==UserScript==
// @name         Path Converter [win]/[unix] Copier
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/compass-diproton-clip.user.js
// @version      1.2
// @description  Add [win] and [unix] links after any /compass or \\diproton path to copy transformed versions to clipboard
// @author       https://github.com/kofaysi/
// @match        https://*.ipp.cas.cz/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    const pathRegex = /(\\\\diproton(?:\\[\w.\- ]+)+|\/compass(?:\/[\w.\- ]+)+)/g;

    function convertPath(text, to) {
        if (to === 'unix') {
            return text.replace(/\\\\diproton\\/g, '/compass/').replace(/\\/g, '/');
        } else {
            return text.replace(/\/compass\//g, '\\\\diproton\\').replace(/\//g, '\\');
        }
    }

    function createCopyLink(type, originalPath) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = `[${type}]`;
        link.style.marginLeft = '0.5em';
        link.style.fontSize = '0.8em';
        link.style.textDecoration = 'underline';
        link.style.cursor = 'pointer';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const converted = convertPath(originalPath, type);
            GM_setClipboard(converted);
        });
        return link;
    }

    function processTextNode(node) {
        if (!node.nodeValue.match(pathRegex)) return;

        const parent = node.parentNode;
        const frag = document.createDocumentFragment();
        const parts = node.nodeValue.split(pathRegex);

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                frag.appendChild(document.createTextNode(parts[i]));
            } else {
                const span = document.createElement('span');
                span.textContent = parts[i];
                span.style.whiteSpace = 'pre';

                frag.appendChild(span);
                frag.appendChild(createCopyLink('win', parts[i]));
                frag.appendChild(createCopyLink('unix', parts[i]));
            }
        }

        parent.replaceChild(frag, node);
    }

    function scanPage() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Exclude invisible or script/style tags
                    if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                    const tag = node.parentElement.tagName.toLowerCase();
                    if (['script', 'style', 'textarea', 'input'].includes(tag)) return NodeFilter.FILTER_REJECT;
                    if (!node.nodeValue.match(pathRegex)) return NodeFilter.FILTER_SKIP;
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let node;
        while ((node = walker.nextNode())) {
            processTextNode(node);
        }
    }

    window.addEventListener('load', scanPage);
})();
