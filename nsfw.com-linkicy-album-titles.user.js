// ==UserScript==
// @name         NSFWAlbum Linkify Titles
// @namespace    https://github.com/kofaysi/
// @version      2024-08-01
// @description  Linkify titles on nsfwalbum.com, handling both dash and en dash
// @author       https://github.com/kofaysi/
// @match        https://nsfwalbum.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a link
    function createLink(text) {
        var a = document.createElement('a');
        a.href = `https://nsfwalbum.com/search/${encodeURIComponent(text)}`;
        a.textContent = text;
        return a;
    }

    // Function to process and linkify titles
    function linkifyTitles() {
        var titles = document.querySelectorAll('.gallery_name h6');
        titles.forEach(title => {
            var titleText = title.textContent;
            // Split title text by both dash and en dash
            var parts = titleText.split(/ - | – /);

            // Process each part of the title
            var firstWord = parts[0].split(' ')[0];
            var restBeforeDash = parts[0].substring(firstWord.length).trim();
            var restParts = parts.slice(1);

            // Create new content with links
            var newContent = document.createDocumentFragment();
            newContent.appendChild(createLink(firstWord));
            if (restBeforeDash) {
                newContent.appendChild(document.createTextNode(' '));
                newContent.appendChild(createLink(restBeforeDash));
            }
            restParts.forEach(part => {
                newContent.appendChild(document.createTextNode(' - '));
                newContent.appendChild(createLink(part));
            });

            // Replace the original content with the new content
            title.textContent = '';
            title.appendChild(newContent);
        });
    }

    // Run the linkify function on page load
    window.addEventListener('load', linkifyTitles);
})();
