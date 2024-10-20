// ==UserScript==
// @name         Pop-up Blocker @svetserialu.io
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/pop-up-blocker-for-svetserialu-io.user.js
// @version      1.4
// @description  Blocks pop-up windows on svetserialu.io
// @author       https://github.com/kofaysi/
// @match        https://svetserialu.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Block pop-up windows by intercepting window.open calls
    (function(open) {
        window.open = function(url, name, features) {
            console.log('Blocked a pop-up window attempt.');
            return null;
        };
    })(window.open);

    // Function to remove pop-up elements
    function removePopups() {
        let popups = document.querySelectorAll('div, iframe, a, span, section');
        popups.forEach(popup => {
            const style = window.getComputedStyle(popup);
            if ((style.position === 'fixed' || style.position === 'absolute') && style.zIndex > 1000) {
                popup.remove();
                console.log('Removed a pop-up element.');
            }
        });
    }

    // Observe for new elements added to the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    removePopups();
                }
            });
        });
    });

    // Start observing the body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check for existing pop-ups
    removePopups();

    // Additional listener for popups created dynamically
    setInterval(removePopups, 1000);

    // Block right-click pop-up menus
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        console.log('Blocked a context menu pop-up.');
    }, true);

    // Block click events that open pop-ups
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'A' && target.hasAttribute('href')) {
            const href = target.getAttribute('href');
            if (href.startsWith('javascript:') || href.includes('pop') || href.includes('popup')) {
                event.preventDefault();
                console.log('Blocked a pop-up link click.');
            }
        }
    }, true);
})();
