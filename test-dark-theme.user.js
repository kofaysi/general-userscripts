// ==UserScript==
// @name         Dark Theme Detector
// @namespace    https://github.com/example/dark-theme-detector
// @version      1.0
// @description  Detects if the browser is in dark mode and displays a notification on the page.
// @author       YourName
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if dark mode is enabled
    function isDarkModeEnabled() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Function to create and display a notification
    function displayNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#333';
        notification.style.color = '#fff';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '1000';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.fontSize = '14px';

        document.body.appendChild(notification);

        // Automatically remove the notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Display the notification based on dark mode status
    if (isDarkModeEnabled()) {
        displayNotification('Dark mode is enabled!');
    } else {
        displayNotification('Dark mode is not enabled.');
    }

    // Listen for changes in the user's dark mode preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        if (event.matches) {
            displayNotification('Dark mode is now enabled!');
        } else {
            displayNotification('Dark mode is now disabled.');
        }
    });
})();
