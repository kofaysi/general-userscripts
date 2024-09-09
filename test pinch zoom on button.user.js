// ==UserScript==
// @name         Centered Button with Viewport Info
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Button stays centered in the viewport and shows real-time viewport information using Visual Viewport API.
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the container
    const container = document.createElement('div');
    container.style.position = 'absolute'; // Use absolute positioning relative to the visual viewport
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.pointerEvents = 'none'; // Prevent interaction blocking
    container.style.zIndex = '9999'; // Ensure the button stays on top

    // Create the button
    const button = document.createElement('button');
    button.textContent = 'Loading...';
    button.style.width = '80vw'; 
    button.style.height = '50px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.pointerEvents = 'auto'; 
    button.style.touchAction = 'none'; 
    button.style.transition = 'background-color 0.2s ease'; 
    button.style.transformOrigin = 'center';

    // Function to calculate the zoom level using Visual Viewport API
    const getZoomLevel = () => {
        if (window.visualViewport) {
            return (window.visualViewport.scale).toFixed(2);
        }
        return 'N/A';
    };

    // Function to update the button's text with key viewport information
    const updateButtonInfo = () => {
        const viewportWidth = window.visualViewport.width;
        const viewportHeight = window.visualViewport.height;
        const viewportTop = window.visualViewport.pageTop;
        const viewportLeft = window.visualViewport.pageLeft;

        // Update the button text with the viewport values
        button.textContent = `Viewport Width: ${viewportWidth.toFixed(2)}px, Height: ${viewportHeight.toFixed(2)}px, Top: ${viewportTop.toFixed(2)}px, Left: ${viewportLeft.toFixed(2)}px`;
    };

    // Function to keep the button centered in the visual viewport
    const adjustButtonPosition = () => {
        // Get visual viewport properties
        const viewportWidth = window.visualViewport.width;
        const viewportHeight = window.visualViewport.height;
        const viewportLeft = window.visualViewport.pageLeft;
        const viewportTop = window.visualViewport.pageTop;

        // Center the button in the visible portion of the screen
        container.style.left = viewportLeft + (viewportWidth / 2) - (button.offsetWidth / 2) + 'px';
        container.style.top = viewportTop + (viewportHeight / 2) - (button.offsetHeight / 2) + 'px';

        updateButtonInfo();
    };

    // Event listeners for resizing and scrolling using Visual Viewport API
    const setupVisualViewportListeners = () => {
        if (window.visualViewport) {
            window.visualViewport.onresize = adjustButtonPosition;
            window.visualViewport.onscroll = adjustButtonPosition;
        } else {
            console.error('Visual Viewport API is not supported on this browser.');
        }
    };

    // Add touch event listeners to change the color of the button
    button.addEventListener('touchstart', () => {
        button.style.backgroundColor = '#28a745'; 
    });

    button.addEventListener('touchend', () => {
        button.style.backgroundColor = '#007bff'; 
    });

    // Append the button to the container and the container to the body
    container.appendChild(button);
    document.body.appendChild(container);

    // Initial call to set the button size and position correctly
    adjustButtonPosition();
    setupVisualViewportListeners();

})();
