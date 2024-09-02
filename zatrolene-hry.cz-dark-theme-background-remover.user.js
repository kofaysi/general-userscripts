// ==UserScript==
// @name         Zatrolene Hry: Remove Background Image
// @namespace    https://github.com/kofaysi/
// @version      1.6
// @description  Remove the specific background image on Zatrolene Hry to prevent white blink and allow user theme choice
// @author       https://github.com/kofaysi/
// @match        *://www.zatrolene-hry.cz/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the background image from the body
    function removeBodyBackgroundImage() {
        const bodyElement = document.body;

        // Remove any background image from the body
        bodyElement.style.backgroundImage = 'none';
        // Optional: Uncomment the line below to force a specific background color
        //bodyElement.style.background = '#000000'; // Set to a dark background color to prevent white flash
    }

    // Immediately set a background color to prevent white flash before DOM is fully loaded
    // Optional: Uncomment the line below to set a default background color
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
