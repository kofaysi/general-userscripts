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

    function applyStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .gl-button.gl-button.btn-default .gl-icon, 
            .gl-button.gl-button.btn-dashed .gl-icon, 
            .gl-button.gl-button.btn-block.btn-default .gl-icon, 
            .gl-button.gl-button.btn-block.btn-dashed .gl-icon {
                color: rgb(255, 158, 0);
            }
        `;
        document.head.appendChild(style);
    }

    // Apply styles when the page has fully loaded
    window.addEventListener('load', function() {
        setTimeout(applyStyles, 2000); // Adjust timeout if necessary
    });
})();
