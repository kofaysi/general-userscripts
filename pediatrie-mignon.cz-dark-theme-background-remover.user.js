// ==UserScript==
// @name         Remove Background Image in Dark Mode
// @namespace    https://github.com/kofaysi/general-userscripts/blob/main/dark-theme-background-remover.user.js
// @version      2.0
// @description  Remove the background image from body and footer elements on matched sites, but only when dark mode is enabled in the browser
// @author       https://github.com/kofaysi/
// @match        *://www.zatrolene-hry.cz/*
// @match        *://www.pediatrie-mignon.cz/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove background images from the body and footer elements
    function removeBackgroundImages() {
        // Remove the background image from the body
        const bodyElement = document.body;
        bodyElement.style.backgroundImage = 'none';

        // Remove the background image from the footer
        const footerElement = document.querySelector('.footer');
        if (footerElement) {
            footerElement.style.backgroundImage = 'none';
        }

        // Remove the background image from the header
        const headerElement = document.querySelector('.header');
        if (headerElement) {
            headerElement.style.backgroundImage = 'none';
        }
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

    // Additional fallback for when background changes dynamically after load
    new MutationObserver(() => {
        if (darkModeMediaQuery.matches) {
            removeBackgroundImages();
        }
    }).observe(document.body, {
        attributes: true, // Listen for attribute changes
        attributeFilter: ['style'] // Specifically monitor style changes
    });
})();