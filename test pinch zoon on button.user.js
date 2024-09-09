// ==UserScript==
// @name         Mobile Button with Touch Color Change
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Creates a container with a button that changes color on touch and retains screen width
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.pointerEvents = 'none'; // Allow interaction with underlying elements
    container.style.zIndex = '1000';

    // Create the button
    const button = document.createElement('button');
    button.textContent = 'Touch Me';
    button.style.width = '80%';
    button.style.height = '50px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.pointerEvents = 'auto'; // Allow interaction with the button

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

    // Prevent zoom and resizing for the container
    const preventZoomStyle = document.createElement('style');
    preventZoomStyle.innerHTML = `
      @media screen and (min-width: 0px) {
        div, button {
          touch-action: manipulation; /* Prevents zooming */
          transform: none !important; /* Ensures the elements keep their size */
        }
      }
    `;
    document.head.appendChild(preventZoomStyle);
})();
