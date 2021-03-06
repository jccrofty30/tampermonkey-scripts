// ==UserScript==
// @name         GitLab -- Image Lightbox
// @namespace    GLTweaks
// @version      2019.5.9
// @description  Default image click to lightbox
// @author       Jason Croft
// @supportURL   https://github.com/jccrofty30/tampermonkey-scripts/issues
// @match        https://<your domain here>/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function attachEvents() {
        document.addEventListener('click', function(e) {
            var target = e.target;

            if (
                target.tagName.toLowerCase() !== 'img'
                || isException(target)
            ) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            var image = document.getElementById('lightboxImage');
            image.src = target.getAttribute('src');

            createFullLink(image.src);
            toggleLightbox();
        }, true);
    }

    function checkSize() {
        var img = document.getElementById('lightboxImage');
        if (img.clientHeight > window.innerHeight * 0.85) {
            img.style.height = '85%';
            img.style.width = 'auto';
        }
        else if (img.clientHeight > window.innerWidth * 0.85) {
            img.style.height = 'auto';
            img.style.width = '85%';
        }
    }

    function createBackdrop() {
        var shader = document.createElement('DIV');
        shader.addEventListener('click', function() { toggleLightbox(); }, true);
        shader.id = 'lightboxShader';
        shader.style.backgroundColor = '#000';
        shader.style.height = '100%';
        shader.style.left = '0';
        shader.style.opacity = '0.8';
        shader.style.position = 'absolute';
        shader.style.top = '0';
        shader.style.width = '100%';
        shader.style.zIndex = '9997';

        document.getElementById('lightboxContainer').appendChild(shader);
    }

    function createContainer() {
        var container = document.createElement('DIV');
        container.id = 'lightboxContainer';
        container.style.alignItems = 'center';
        container.style.display = 'none';
        container.style.height = '100%';
        container.style.justifyContent = 'center';
        container.style.left = '0';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.padding = '0';
        container.style.width = '100%';
        container.style.zIndex = '9996';

        document.body.appendChild(container);
    }

    function createFullLink(url) {
        var exists = document.getElementById('lightboxFullImage') !== null;

        var button = (!exists) ? document.createElement('BUTTON') : document.getElementById('lightboxFullImage');
        button.setAttribute('data-url', url);

        if (!exists) {
            button.addEventListener('click', function(e) {
                openFull(e.target.getAttribute('data-url'));
            }, true);
            button.className = 'btn btn-default';
            button.id = 'lightboxFullImage';
            button.innerHTML = 'View Full';
            button.style.marginLeft = '1.5em';
            button.style.zIndex = '9998';

            document.getElementById('lightboxContainer').appendChild(button);
        }
    }

    function createImage() {
        var img = document.createElement('IMG');
        img.id = 'lightboxImage';
        img.style.height = 'auto';
        img.style.width = '85%';
        img.style.zIndex = '9998';

        document.getElementById('lightboxContainer').appendChild(img);
    }

    function isException(target) {
        return /avatar/.test(target.className) || target.parentElement.id === 'logo';
    }

    function openFull(url) {
        window.open(url);
    }

    function toggleLightbox() {
        var container= document.getElementById('lightboxContainer');
        container.style.display = (container.style.display === 'none') ? 'flex' : 'none';
        checkSize();
    }

    createContainer();
    createBackdrop();
    createImage();
    attachEvents();
})();
