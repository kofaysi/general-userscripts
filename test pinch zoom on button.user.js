// ==UserScript==
// @name         Always Centered Button with Visual Viewport Info
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Button stays centered in the visual viewport and updates dynamically with viewport size, position, and zoom info.
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the container
    const container = document.createElement('div');
    container.style.position = 'absolute'; // Absolute positioning relative to the visual viewport
    container.style.display = 'flex'; 
    container.style.justifyContent = 'center'; // Center horizontally
    container.style.alignItems = 'center'; // Center vertically
    container.style.pointerEvents = 'none'; // Ignore interaction for the container itself
    container.style.zIndex = '9999'; // Ensure it's above other elements

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
    button.style.pointerEvents = 'auto'; // Allow interaction with the button
    button.style.touchAction = 'none'; // Prevent zooming or gestures on the button itself
    button.style.transition = 'background-color 0.2s ease'; // Smooth color change
    button.style.transformOrigin = 'center';

    // Function to calculate the zoom level using Visual Viewport API
    const getZoomLevel = () => {
        if (window.visualViewport) {
            return (window.visualViewport.scale).toFixed(2);
        }
        return 'N/A'; // Fallback if Visual Viewport API is unsupported
    };

    // Function to update the button's text with key information
    const updateButtonInfo = () => {
        const viewportWidth = window.visualViewport.width;
        const viewportHeight = window.visualViewport.height;
        const viewportLeft = window.visualViewport.pageLeft;
        const viewportTop = window.visualViewport.pageTop;
        const zoomLevel = getZoomLevel();

        // Update the button text to show viewport dimensions, zoom, and offsets
        button.textContent = `Zoom: ${zoomLevel}, Viewport: ${viewportWidth.toFixed(2)}x${viewportHeight.toFixed(2)}, Top: ${viewportTop.toFixed(2)}, Left: ${viewportLeft.toFixed(2)}`;
    };

    // Function to center the button in the visual viewport
    const adjustButtonPosition = () => {
        // Get visual viewport properties
        const viewportWidth = window.visualViewport.width;
        const viewportHeight = window.visualViewport.height;
        const viewportLeft = window.visualViewport.pageLeft;
        const viewportTop = window.visualViewport.pageTop;

        // Center the container within the viewport
        container.style.width = viewportWidth + 'px';
        container.style.height = viewportHeight + 'px';
        container.style.left = viewportLeft + 'px';
        container.style.top = viewportTop + 'px';

        // Adjust the button size based on the viewport
        button.style.width = (0.8 * viewportWidth) + 'px'; // 80% of the viewport width

        // Update the button information with viewport properties
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
