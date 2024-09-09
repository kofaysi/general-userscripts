// ==UserScript==
// @name         Always Visible Mobile Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Creates a button that stays fixed at the bottom of the screen regardless of page zoom or scroll
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the container
    const container = document.createElement('div');
    container.style.position = 'fixed'; // Fixes the container to the viewport
    container.style.bottom = '10px'; // 10px from the bottom of the viewport
    container.style.left = '0';
    container.style.width = '100vw'; // 100% of the viewport width
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.pointerEvents = 'none'; // Allows interaction with underlying page elements
    container.style.zIndex = '9999'; // Ensures the button is on top of other elements

    // Create the button
    const button = document.createElement('button');
    button.textContent = 'Touch Me';
    button.style.width = '80vw'; // 80% of the viewport width
    button.style.height = '50px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.pointerEvents = 'auto'; // Allows interaction with the button
    button.style.transformOrigin = 'center';
    button.style.touchAction = 'none'; // Prevents zooming on the button

    // Add touch event listeners
    button.addEventListener('touchstart', () => {
        button.style.backgroundColor = '#28a745'; // Change color on touch
    });

    button.addEventListener('touchend', () => {
        button.style.backgroundColor = '#007bff'; // Change back to original color
    });

    // Append the button to the container and the container to the body
    container.appendChild(button);
    document.body.appendChild(container);

    // Optional: Disable zoom on the page to prevent any pinch-zoom interaction
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    document.head.appendChild(meta);

})();
