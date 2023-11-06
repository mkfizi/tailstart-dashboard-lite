/**
 * --------------------------------------------------------------------------
 * Tailstart - Dashboard Lite v0.1.0: app.js
 * Licensed under MIT (https://github.com/mkfizi/dashboard-lite/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

(function () {
    'use strict';

    const app = {};

    app.name = 'Tailstart - Dashboard Lite';
    app.version = '0.1.0';
    app.breakpointSize = 1024;

    app.element = {
        navbar: document.getElementById('navbar'),
        navbarMenu: document.getElementById('navbar-menu'),
        navbarMenuOpen: document.getElementById('navbar-menu-open'),
        navbarMenuClose: document.getElementById('navbar-menu-close'),
        darkModeToggle: document.getElementById('dark-mode-toggle'),
        settingsMenu: document.getElementById('settings-menu'),
        settingsMenuToggle: document.getElementById('settings-menu-toggle'),
        footerCurrentYear: document.getElementById('footer-year'),
        footerAppName: document.getElementById('footer-app-name'),
        footerAppVersion: document.getElementById('footer-app-version'),
    }

    app.view = {

        viewportHeight: {

            // Workaround fix to handle viewport height issue on mobile browsers
            // https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser
            toggle: () => {
                document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
            }
        },

        navbar: {

            // Toggle navbar appearance base on window scroll Y position
            toggle: () => {
                if (app.element.navbar) {
                    const isScrolled = window.scrollY > 0;
                    app.element.navbar.classList[isScrolled ? 'add' : 'remove']('border-neutral-200', 'dark:border-neutral-800', 'shadow');
                    app.element.navbar.classList[isScrolled ? 'remove' : 'add']('border-transparent', 'dark:border-transparent');
                }
            },
        },

        menu: {

            // Open menu
            open: (targetElement) => app.view.menu.toggle(targetElement, true),

            // Close menu
            close: (targetElement) => app.view.menu.toggle(targetElement, false),
        
            // Toggle menu
            toggle: (targetElement, isOpen) => {
                targetElement.classList[isOpen ? 'remove' : 'add']('hidden', 'invisible');
                targetElement.setAttribute('aria-hidden', !isOpen);

                // Set toggle element `[aria-expanded]` attribute value
                document.querySelectorAll(`[aria-controls='${targetElement.id}']`).forEach((currentToggleElement) => {
                    currentToggleElement.setAttribute('aria-expanded', isOpen);
                });
            },

            // Force focus on element before initialize focus trap
            forceFocus: (targetElement) => {
                targetElement.setAttribute('tabindex', 1);
                targetElement.focus();
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 100);
            },

            // Click outside handler
            clickOutside: (targetView, targetElement, event) => {

                // Check if closest element to `event.target` is not the element where its `[aria-labelledby]`
                // or `[aria-controls]` values does not equal to `targetElement.id` value
                if (!event.target.closest(`[aria-labelledby="${targetElement.id}"]`) && !event.target.closest(`[aria-controls="${targetElement.id}"]`)) {
                    targetView.close(targetElement);
                }
            },

            // Escape key handler
            escape: (targetView, targetElement, event) => {
                if (event.key === 'Escape') {
                    targetView.close(targetElement);
                }
            },

            // Focus trap handler
            focusTrap: (targetElement, event) => {
                if (event.key === 'Tab') {
                    const focusableElements = Array.from(targetElement.querySelectorAll('a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]')).filter(currentElement => {
                        return !currentElement.closest('[tabindex="-1"], .hidden, .invisible') || null;
                    });
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (event.shiftKey && (document.activeElement === firstElement || document.activeElement === document.body)) {
                        event.preventDefault();
                        lastElement.focus();
                    } else if (!event.shiftKey && document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            },

            navbar: {

                // Open navbar menu
                open: () => {
                    if (app.element.navbarMenu) {
                        app.view.menu.open(app.element.navbarMenu);
                        app.view.menu.forceFocus(app.element.navbarMenu);
    
                        app.view.menu.navbar.clickOutside = (event) => app.view.menu.clickOutside(app.view.menu.navbar, app.element.navbarMenu, event)
                        app.view.menu.navbar.escape = (event) => app.view.menu.escape(app.view.menu.navbar, app.element.navbarMenu, event)
                        app.view.menu.navbar.focusTrap = (event) => app.view.menu.focusTrap(app.element.navbarMenu, event)
    
                        window.addEventListener('click', app.view.menu.navbar.clickOutside);
                        window.addEventListener('keydown', app.view.menu.navbar.escape);
                        window.addEventListener('keydown', app.view.menu.navbar.focusTrap);
                    }
                },

                // Close navbar menu
                close: () => {
                    if (app.element.navbarMenu) {
                        app.view.menu.close(app.element.navbarMenu);

                        window.removeEventListener('click', app.view.menu.navbar.clickOutside);
                        window.removeEventListener('keydown', app.view.menu.navbar.escape);
                        window.removeEventListener('keydown', app.view.menu.navbar.focusTrap);
                    }
                },

                // Handle when switching view between breakpoint size
                toggleResponsive: () => {
                    if (app.element.navbarMenu) {

                        // If window width past breakpoint size, close menu and remove `[aria-hidden]` attribute from it
                        if (window.innerWidth >= app.breakpointSize) {
                            if (app.element.navbarMenu.getAttribute('aria-hidden') === 'false') {
                                app.view.menu.navbar.close();
                            }

                            app.element.navbarMenu.removeAttribute('aria-hidden');
                        } else {
                            if (!app.element.navbarMenu.getAttribute('aria-hidden')) {
                                app.element.navbarMenu.setAttribute('aria-hidden', true);
                            }
                        }
                    }
                }
            },

            settings: {

                // Open on settings menu
                open: () => {
                    if (app.element.settingsMenu) {
                        app.view.menu.open(app.element.settingsMenu);

                        app.view.menu.settings.clickOutside = (event) => app.view.menu.clickOutside(app.view.menu.settings, app.element.settingsMenu, event)
                        app.view.menu.settings.escape = (event) => app.view.menu.escape(app.view.menu.settings, app.element.settingsMenu, event)

                        window.addEventListener('click', app.view.menu.settings.clickOutside);
                        window.addEventListener('keydown', app.view.menu.settings.escape);
                    }
                },

                // Close on settings menu
                close: () => {
                    if (app.element.settingsMenu) {
                        app.view.menu.close(app.element.settingsMenu);

                        window.removeEventListener('click', app.view.menu.settings.clickOutside);
                        window.removeEventListener('keydown', app.view.menu.settings.escape);
                    }
                },

                // Toggle on settings menu
                toggle: () => {
                    if (app.element.settingsMenu) {
                        let isOpen = (app.element.settingsMenu.getAttribute('aria-hidden') === 'true');

                        isOpen 
                            ? app.view.menu.settings.open()
                            : app.view.menu.settings.close();
                    }
                },
            }
        },

        darkMode: {

            // Toggle dark mode
            toggle: () => {
                const isDarkMode = localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches);
                localStorage.theme = isDarkMode ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', isDarkMode);
            }
        },

        footer: {

            // Initialize footer content with current year, app name and version
            init: () => {
                if (app.element.footerCurrentYear) {
                    app.element.footerCurrentYear.innerHTML = new Date().getFullYear();
                }

                if (app.element.footerAppName) {
                    app.element.footerAppName.innerHTML = app.name;
                }

                if (app.element.footerAppVersion) {
                    app.element.footerAppVersion.innerHTML = app.version;
                }
            }
        },

        // Initialize view
        init: () => {
            app.view.viewportHeight.toggle();
            app.view.footer.init();
            app.view.menu.navbar.toggleResponsive();
        }
    }

    app.event = {
        document: {

            // Handle document 'click' event by attaching a global click event listener instead of applying it on every clickable elements
            click: event => {
                const targetElement = event.target.closest('[id]');
                if (targetElement) {

                    // Delegate method calls using switch case on element id
                    switch (targetElement.id) {
                        case app.element.darkModeToggle?.id:
                            app.view.darkMode.toggle();
                            break;

                        case app.element.navbarMenuOpen?.id:
                            app.view.menu.navbar.open();
                            break;

                        case app.element.navbarMenuClose?.id:
                            app.view.menu.navbar.close();
                            break;

                        case app.element.settingsMenuToggle?.id:
                            app.view.menu.settings.toggle();
                            break;
                    }
                }
            }
        },

        window: {
            
            // Handle window 'resize' event
            resize: () => {
                app.view.viewportHeight.toggle();
                app.view.menu.navbar.toggleResponsive();
            },

            // Handle window 'scroll' event
            scroll: () => {
                app.view.navbar.toggle();
            }
        },

        init: () => {
            document.addEventListener('click', app.event.document.click);
            window.addEventListener('resize', app.event.window.resize);
            window.addEventListener('scroll', app.event.window.scroll);
        }
    },

    app.init = () => {
        app.view.init();
        app.event.init();
    }

    app.init();
})();