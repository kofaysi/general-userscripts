// ==UserScript==
// @name         Replace Duplicate Starting Letters
// @namespace    https://github.com/kofaysi/
// @version      0.3
// @description  Replace duplicate starting letters of words with single letters in a specific editor
// @author       https://github.com/kofaysi/
// @match        https://www.zatrolene-hry.cz/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace duplicate starting letters
    function replaceDuplicateStartingLetters(text) {
        return text.replace(/\b(\w)\1+/g, '$1');
    }

    // Function to handle input events
    function onInputChange(event) {
        const editor = event.target;
        const originalContent = editor.innerHTML;
        const modifiedContent = originalContent.replace(/(\b\w)\1+/g, '$1');

        if (originalContent !== modifiedContent) {
            // Update content if it has been modified
            editor.innerHTML = modifiedContent;
            // Set cursor to the end of the content
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    // Function to observe and modify the content of the editor
    function observeEditor() {
        const editor = document.querySelector('.ck-editor__editable[contenteditable="true"]');
        if (!editor) return;

        // Attach input event listener to the editor
        editor.addEventListener('input', onInputChange);
    }

    // Wait for the page to fully load before observing
    window.addEventListener('load', observeEditor);

})();
