// ==UserScript==
// @name         Remove Background Image and Prevent White Blink
// @namespace    https://github.com/kofaysi/
// @version      1.6
// @description  Remove the background image and prevent white blink during page load
// @author       https://github.com/kofaysi/
// @match        *://www.zatrolene-hry.cz/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the background image from the body and set a default dark background color
    function removeBodyBackgroundImage() {
        const bodyElement = document.body;

        // Remove any background image from the body
        bodyElement.style.backgroundImage = 'none';
        //bodyElement.style.background = '#000000'; // Set to a dark background color to prevent white flash
    }

    // Immediately set a dark background color to prevent white flash before DOM is fully loaded
    //document.documentElement.style.background = '#000000'; // Set a dark color for the entire HTML

    // Ensure the function runs as soon as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeBodyBackgroundImage);
    } else {
        removeBodyBackgroundImage();
    }

    // Additional fallback for when background changes dynamically after load
    new MutationObserver(removeBodyBackgroundImage).observe(document.body, {
        attributes: true, // Listen for attribute changes
        attributeFilter: ['style'] // Specifically monitor style changes
    });

})();
