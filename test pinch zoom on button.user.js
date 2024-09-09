// ==UserScript==
// @name         Always Visible Button with Visual Viewport Info
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Button stays fixed at the bottom of the screen and shows real-time viewport info using Visual Viewport API.
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the container
    const container = document.createElement('div');
    container.style.position = 'fixed'; // Fixes the container to the viewport
    container.style.left = '0'; // Align left
    container.style.bottom = '0'; // Align at the bottom
    container.style.width = '100vw'; // Full viewport width
    container.style.display = 'flex'; // Center the button horizontally
    container.style.justifyContent = 'center';
    container.style.pointerEvents = 'none'; // Allow interaction with underlying elements
    container.style.zIndex = '9999'; // High z-index to ensure visibility

    // Create the button
    const button = document.createElement('button');
    button.textContent = 'Loading...';
    button.style.width = '80vw'; // 80% of viewport width
    button.style.height = '50px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.pointerEvents = 'auto'; // Enable interaction with the button
    button.style.touchAction = 'none'; // Prevent zooming or gestures on the button itself
    button.style.transition = 'background-color 0.2s ease'; // Smooth color change
    button.style.transformOrigin = 'center';

    // Function to calculate the zoom level using Visual Viewport API
    const getZoomLevel = () => {
        if (window.visualViewport) {
            return (window.visualViewport.scale).toFixed(2);
        }
        return 'N/A'; // Fallback if the Visual Viewport API is unsupported
    };

    // Function to update the button's text with key information
    const updateButtonInfo = () => {
        const screenWidth = window.visualViewport.width;
        const screenHeight = window.visualViewport.height;
        const buttonWidth = button.offsetWidth;
        const buttonHeight = button.offsetHeight;
        const fontSize = window.getComputedStyle(button).fontSize;
        const zoomLevel = getZoomLevel();

        // Update the button text
        button.textContent = `Zoom: ${zoomLevel}, Screen: ${screenWidth.toFixed(2)}x${screenHeight.toFixed(2)}, Button: ${buttonWidth}x${buttonHeight}, Font: ${fontSize}`;
    };

    // Function to adjust the size and position of the button dynamically
    const adjustButtonPosition = () => {
        // Adjust the button size based on the viewport
        button.style.width = (0.8 * window.visualViewport.width) + 'px'; // 80% of the viewport width
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
        button.style.backgroundColor = '#28a745'; // Change color on touch
    });

    button.addEventListener('touchend', () => {
        button.style.backgroundColor = '#007bff'; // Change back to original color
    });

    // Append the button to the container and the container to the body
    container.appendChild(button);
    document.body.appendChild(container);

    // Initial call to set the button size and position correctly
    adjustButtonPosition();
    setupVisualViewportListeners();

})();
