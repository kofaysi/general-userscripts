// ==UserScript==
// @name         Always Visible Button with Zoom Info
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Button stays fixed at the bottom of the screen and shows zoom level, screen width, screen height, button size, and font size.
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
    button.textContent = 'Touch Me';
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

    // Function to calculate the zoom level (current viewport width vs. initial viewport width)
    const getZoomLevel = () => {
        return (window.outerWidth / window.innerWidth).toFixed(2);
    };

    // Function to update the button's text with key information
    const updateButtonInfo = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const buttonWidth = button.offsetWidth;
        const buttonHeight = button.offsetHeight;
        const fontSize = window.getComputedStyle(button).fontSize;
        const zoomLevel = getZoomLevel();

        button.textContent = `Zoom: ${zoomLevel}, Screen: ${screenWidth}x${screenHeight}, Button: ${buttonWidth}x${buttonHeight}, Font: ${fontSize}`;
    };

    // Function to adjust the size and position of the button dynamically
    const adjustButtonSizeAndPosition = () => {
        // Get the viewport width and height
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Adjust the container's width and position based on the current viewport size
        container.style.width = viewportWidth + 'px';
        container.style.height = '50px'; // Fixed height for the button container

        // Adjust the button size based on the viewport
        button.style.width = (0.8 * viewportWidth) + 'px'; // 80% of the viewport width

        // Update the button with the latest information
        updateButtonInfo();
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

    // Adjust button size and position when the window is resized or zoomed
    window.addEventListener('resize', adjustButtonSizeAndPosition);

    // Initial call to set the button size and position correctly
    adjustButtonSizeAndPosition();
})();
