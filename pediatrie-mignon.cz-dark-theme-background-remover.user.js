// ==UserScript==
// @name         Remove Background Image in Dark Mode for Pediatrue Mignon
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/dark-theme-background-remover.user.js
// @version      2.2
// @description  Remove the background image from body, footer, header, and other elements on matched sites, including inline and computed styles, when dark mode is enabled in the browser.
// @author       https://github.com/kofaysi/
// @match        *://www.pediatrie-mignon.cz/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to remove background styles
    function clearBackgroundStyles(element) {
        if (element) {
            element.style.backgroundImage = 'none';
            element.style.backgroundColor = 'inherit';
            element.style.background = 'none';
        }
    }

    // Function to remove background images from common elements
    function removeBackgroundImages() {
        const elementsToClear = [
            document.body,
            document.querySelector('#footerCover'),
            document.querySelector('#header'),
            document.querySelector('.header'),
            document.querySelector('#wrapper'),
        ];

        elementsToClear.forEach(clearBackgroundStyles);

        // Additional cleanup for elements with dynamically applied styles
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el) => {
            const computedStyle = getComputedStyle(el);
            if (
                computedStyle.backgroundImage !== 'none' ||
                computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)'
            ) {
                clearBackgroundStyles(el);
            }
        });
    }

    // Check if dark mode is enabled in the user's browser
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Apply background removal if dark mode is enabled
    function checkDarkModeAndApply() {
        if (darkModeMediaQuery.matches) {
            removeBackgroundImages();
        }
    }

    // Run the check once the page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkDarkModeAndApply);
    } else {
        checkDarkModeAndApply();
    }

    // Listen for changes in the user's dark mode preference
    darkModeMediaQuery.addListener(checkDarkModeAndApply);

    // Observe dynamic changes to styles
    new MutationObserver(() => {
        if (darkModeMediaQuery.matches) {
            removeBackgroundImages();
        }
    }).observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
    });
})();
