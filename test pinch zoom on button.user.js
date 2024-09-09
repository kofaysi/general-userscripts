// ==UserScript==
// @name         Always Visible Button with Pinch Zoom Awareness
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Button stays fixed at the bottom of the visual viewport, updates dynamically during zoom or pinch, and remains inside the visible area at all times.
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the container
    const container = document.createElement('div');
    container.style.position = 'absolute'; // Use absolute positioning relative to the visual viewport
    container.style.left = '0'; 
    container.style.bottom = '0'; 
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999'; 

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

    // Function to keep the button inside the visual viewport
    const adjustButtonPosition = () => {
        // Get visual viewport properties
        const viewportWidth = window.visualViewport.width;
        const viewportHeight = window.visualViewport.height;
        const viewportLeft = window.visualViewport.pageLeft;
        const viewportTop = window.visualViewport.pageTop;

        // Adjust the container's position to ensure the button is inside the visible viewport
        container.style.width = viewportWidth + 'px';
        container.style.left = viewportLeft + 'px';
        container.style.top = viewportTop + viewportHeight - button.offsetHeight + 'px'; // Stick to the bottom of the visible screen

        // Adjust the button size based on the viewport
        button.style.width = (0.8 * viewportWidth) + 'px'; // 80% of the viewport width

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
