// ==UserScript==
// @name         GitLab Button Color Changer
// @namespace    http://tampermonkey.net/
// @version      2024-08-06
// @description  Change button icon color on GitLab
// @author       https://github.com/kofaysi/
// @match        https://gitlab.e.foundation/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Function to apply the custom styles to GitLab button icons
     */
    function applyStyles() {
        // Create a new <style> element
        const style = document.createElement('style');
        // Define the CSS rules for button icon colors with !important
        style.innerHTML = `
            .gl-button.gl-button.btn-default .gl-icon, 
            .gl-button.gl-button.btn-dashed .gl-icon, 
            .gl-button.gl-button.btn-block.btn-default .gl-icon, 
            .gl-button.gl-button.btn-block.btn-dashed .gl-icon {
                color: rgb(255, 158, 0) !important; /* Important: Set icon color to rgb(255, 158, 0) with !important */
            }
        `;
        // Append the <style> element to the document head
        document.head.appendChild(style);
    }

    /**
     * Wait for the page to fully load and then apply the custom styles.
     * The setTimeout is used to ensure styles are applied after any late-loading scripts.
     */
    window.addEventListener('load', function() {
        setTimeout(applyStyles, 2000); // Important: Adjust timeout if necessary
    });
})();
