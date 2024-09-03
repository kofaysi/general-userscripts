// ==UserScript==
// @name         Replace Duplicate Starting Letters
// @namespace    https://github.com/kofaysi/
// @version      0.2
// @description  Replace duplicate starting letters of words with single letters in a specific editor
// @author       https://github.com/kofaysi/
// @match        *://www.zatrolene-hry.cz/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace duplicate starting letters
    function replaceDuplicateStartingLetters(text) {
        return text.replace(/\b(\w)\1+/g, '$1');
    }

    // Function to observe and modify the content of the editor
    function observeEditor() {
        const editor = document.querySelector('.ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline.ck-blurred');
        if (!editor) return;

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const newText = replaceDuplicateStartingLetters(editor.innerText);
                    if (newText !== editor.innerText) {
                        editor.innerText = newText;
                    }
                }
            });
        });

        observer.observe(editor, { childList: true, characterData: true, subtree: true });
    }

    // Wait for the page to fully load before observing
    window.addEventListener('load', observeEditor);

})();
