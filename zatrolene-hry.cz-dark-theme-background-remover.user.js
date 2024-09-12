// ==UserScript==
// @name         Zatrolene Hry: Remove Background Image
// @namespace    https://github.com/kofaysi/
// @version      1.7
// @description  Remove the background image from body and footer elements on Zatrolene Hry to prevent white blink and allow user theme choice
// @author       https://github.com/kofaysi/
// @match        *://www.zatrolene-hry.cz/*
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
    }

    // Ensure the function runs as soon as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeBackgroundImages);
    } else {
        removeBackgroundImages();
    }

    // Additional fallback for when background changes dynamically after load
    new MutationObserver(removeBackgroundImages).observe(document.body, {
        attributes: true, // Listen for attribute changes
        attributeFilter: ['style'] // Specifically monitor style changes
    });
})();
