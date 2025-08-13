/**
 * PrivateToolkit Main JavaScript
 * Advanced site navigation, interactions, and UX enhancements
 */

class PrivateToolkitApp {
    constructor() {
        this.isInitialized = false;
        this.scrollPosition = 0;
        this.isScrolling = false;
        this.observedElements = new Set();
        this.animations = new Map();
        this.mediaQueries = {
            mobile: window.matchMedia('(max-width: 768px)'),
            tablet: window.matchMedia('(min-width: 769px) and (max-width: 1024px)'),
            desktop: window.matchMedia('(min-width: 1025px)')
        };

        this.init();
    }

    init() {
        if (this.isInitialized) return;

        this.setupEventListeners();
        this.initializeNavigation();
        this.initializeAnimations();
        this.setupIntersectionObserver();
        this.initializePerformanceOptimizations();
        this.setupAccessibilityFeatures();
        this.initializeThemeSystem();
        this.setupAdvancedInteractions();

        this.isInitialized = true;
        this.triggerInitEvent();
    }

    setupEventListeners() {
        // Core events
        document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        window.addEventListener('load', () => this.handleWindowLoad());
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));
        
        // Navigation events
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Performance events
        window.addEventListener('beforeunload', () => this.handleBeforeUnload());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Media query changes
        Object.values(this.mediaQueries).forEach(mq => {
            mq.addListener(() => this.handleMediaQueryChange());
        });
    }

    initializeNavigation() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupNavigationAnimations();
        this.setupBreadcrumbs();
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!hamburger || !navMenu) return;

        let isMenuOpen = false;

        const toggleMenu = () => {
            isMenuOpen = !isMenuOpen;
            
            hamburger.classList.toggle('active', isMenuOpen);
            navMenu.classList.toggle('active', isMenuOpen);
            document.body.classList.toggle('menu-open', isMenuOpen);
            
            // ARIA accessibility
            hamburger.setAttribute('aria-expanded', isMenuOpen);
            navMenu.setAttribute('aria-hidden', !isMenuOpen);
            
            // Advanced animation sequencing
            if (isMenuOpen) {
                this.animateMenuOpen(navLinks);
            } else {
                this.animateMenuClose(navLinks);
            }
        };

        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                toggleMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenu();
            }
        });
    }

    animateMenuOpen(navLinks) {
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    animateMenuClose(navLinks) {
        navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '0';
                link.style.transform = 'translateY(-10px)';
            }, index * 30);
        });
    }

    setupSmoothScrolling() {
        // Advanced smooth scrolling with easing
        const smoothScrollTo = (target, duration = 1000) => {
            const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
            if (!targetElement) return;

            const start = window.pageYOffset;
            const targetPosition = targetElement.offsetTop - this.getHeaderHeight();
            const distance = targetPosition - start;
            let startTime = null;

            const easeInOutCubic = (t) => {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            };

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);

                window.scrollTo(0, start + distance * ease);

                if (progress < 1) {
                    requestAnimationFrame(animation);
                } else {
                    this.focusElement(targetElement);
                }
            };

            requestAnimationFrame(animation);
        };

        // Handle anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                smoothScrollTo(target);
                this.updateURL(href);
            }
        });

        // Handle initial hash
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) smoothScrollTo(target, 500);
            }, 100);
        }
    }

    setupActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        const updateActiveNav = () => {
            const currentSection = this.getCurrentSection(sections);
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const isActive = href === `#${currentSection}`;
                    link.classList.toggle('active', isActive);
                    
                    if (isActive) {
                        this.highlightActiveNav(link);
                    }
                }
            });
        };

        // Throttled scroll listener for navigation updates
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveNav();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    getCurrentSection(sections) {
        const scrollPosition = window.pageYOffset + this.getHeaderHeight() + 100;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.offsetTop <= scrollPosition) {
                return section.id;
            }
        }
        
        return sections[0]?.id || '';
    }

    highlightActiveNav(activeLink) {
        // Advanced visual feedback for active navigation
        const indicator = document.querySelector('.nav-indicator') || this.createNavIndicator();
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = activeLink.closest('.nav-menu').getBoundingClientRect();
        
        indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
        indicator.style.width = `${linkRect.width}px`;
    }

    createNavIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'nav-indicator';
        document.querySelector('.nav-menu').appendChild(indicator);
        return indicator;
    }

    setupNavigationAnimations() {
        // Header scroll behavior
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
        
        const handleHeaderScroll = () => {
            const scrollTop = window.pageYOffset;
            const isScrollingDown = scrollTop > lastScrollTop;
            const isScrolledEnough = scrollTop > 100;
            
            header.classList.toggle('scrolled', isScrolledEnough);
            header.classList.toggle('hidden', isScrollingDown && isScrolledEnough && scrollTop - lastScrollTop > 5);
            
            lastScrollTop = scrollTop;
        };

        window.addEventListener('scroll', this.throttle(handleHeaderScroll, 16));
    }

    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadAnimations();
        this.setupParallaxEffects();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        animatedElements.forEach(element => {
            const animationType = element.dataset.animate;
            const delay = parseInt(element.dataset.delay) || 0;
            const duration = parseInt(element.dataset.duration) || 600;
            
            this.observedElements.add({
                element,
                animationType,
                delay,
                duration,
                hasAnimated: false
            });
        });
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.handleIntersection(entry);
            });
        }, options);

        // Observe elements with animation data
        this.observedElements.forEach(({ element }) => {
            this.intersectionObserver.observe(element);
        });

        // Observe sections for navigation
        document.querySelectorAll('section[id]').forEach(section => {
            this.intersectionObserver.observe(section);
        });
    }

    handleIntersection(entry) {
        const element = entry.target;
        const animationData = Array.from(this.observedElements).find(data => data.element === element);
        
        if (animationData && !animationData.hasAnimated && entry.isIntersecting) {
            this.triggerAnimation(animationData);
            animationData.hasAnimated = true;
        }
    }

    triggerAnimation({ element, animationType, delay, duration }) {
        setTimeout(() => {
            element.classList.add('animate-in', `animate-${animationType}`);
            element.style.setProperty('--animation-duration', `${duration}ms`);
        }, delay);
    }

    setupHoverAnimations() {
        // Advanced hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .tool-card, .feature-card, .blog-card');
        
        interactiveElements.forEach(element => {
            this.setupElementHover(element);
        });
    }

    setupElementHover(element) {
        let hoverTimeout;
        
        element.addEventListener('mouseenter', (e) => {
            clearTimeout(hoverTimeout);
            this.createRippleEffect(e);
            element.classList.add('hover-active');
        });
        
        element.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                element.classList.remove('hover-active');
            }, 150);
        });
        
        element.addEventListener('mousemove', (e) => {
            this.updateMousePosition(element, e);
        });
    }

    createRippleEffect(e) {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    updateMousePosition(element, e) {
        const rect = element.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        element.style.setProperty('--mouse-x', `${x}%`);
        element.style.setProperty('--mouse-y', `${y}%`);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', this.throttle(() => {
                this.updateParallax(parallaxElements);
            }, 16));
        }
    }

    updateParallax(elements) {
        const scrollTop = window.pageYOffset;
        
        elements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    initializeThemeSystem() {
        this.setupThemeDetection();
        this.setupThemeToggle();
        this.applyThemePreference();
    }

    setupThemeDetection() {
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.prefersDark.addListener(() => this.handleSystemThemeChange());
    }

    setupThemeToggle() {
        const themeToggle = document.querySelector('[data-theme-toggle]');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        this.setTheme(newTheme);
        this.saveThemePreference(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeToggleState(theme);
    }

    initializePerformanceOptimizations() {
        this.setupLazyLoading();
        this.setupResourcePreloading();
        this.setupCriticalResourceHints();
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
    }

    setupAccessibilityFeatures() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIAEnhancements();
        this.setupScreenReaderOptimizations();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Custom keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.focusSearchBox();
                        break;
                    case '/':
                        e.preventDefault();
                        this.openKeyboardShortcuts();
                        break;
                }
            }
            
            // Navigation with arrow keys
            if (e.target.matches('.nav-link')) {
                this.handleNavKeyboard(e);
            }
        });
    }

    setupFocusManagement() {
        // Skip to main content link
        this.createSkipLink();
        
        // Focus trap for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const main = document.getElementById('main') || document.querySelector('main') || document.querySelector('.hero');
            if (main) {
                main.focus();
                main.scrollIntoView();
            }
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupAdvancedInteractions() {
        this.setupCopyToClipboard();
        this.setupTooltips();
        this.setupNotificationSystem();
        this.setupProgressIndicators();
    }

    setupCopyToClipboard() {
        document.addEventListener('click', async (e) => {
            const copyBtn = e.target.closest('[data-copy]');
            if (!copyBtn) return;
            
            const textToCopy = copyBtn.dataset.copy || copyBtn.textContent;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                this.showNotification('Copied to clipboard!', 'success');
            } catch (err) {
                this.fallbackCopyToClipboard(textToCopy);
            }
        });
    }

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            this.setupTooltip(element);
        });
    }

    setupTooltip(element) {
        let tooltip = null;
        
        const showTooltip = (e) => {
            const text = element.dataset.tooltip;
            tooltip = this.createTooltip(text);
            document.body.appendChild(tooltip);
            this.positionTooltip(tooltip, element);
        };
        
        const hideTooltip = () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        };
        
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    }

    createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.setAttribute('role', 'tooltip');
        return tooltip;
    }

    setupNotificationSystem() {
        // Create notification container if it doesn't exist
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const container = document.querySelector('.notification-container');
        const notification = document.createElement('div');
        
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">×</button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto remove
        const timeoutId = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeoutId);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    // Utility functions
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    getHeaderHeight() {
        const header = document.querySelector('.header');
        return header ? header.offsetHeight : 0;
    }

    focusElement(element) {
        if (element) {
            element.setAttribute('tabindex', '-1');
            element.focus();
            element.removeAttribute('tabindex');
        }
    }

    updateURL(hash) {
        if (history.pushState) {
            history.pushState(null, null, hash);
        } else {
            location.hash = hash;
        }
    }

    // Event handlers
    handleDOMReady() {
        document.body.classList.add('dom-ready');
        this.showNotification('Welcome to PrivateToolkit!', 'info', 2000);
    }

    handleWindowLoad() {
        document.body.classList.add('loaded');
        this.hideLoadingSpinner();
    }

    handleResize() {
        this.updateViewportUnits();
        this.handleResponsiveChanges();
    }

    handleScroll() {
        this.scrollPosition = window.pageYOffset;
        this.updateScrollProgress();
    }

    handleGlobalClick(e) {
        // Handle any global click interactions
        this.handleExternalLinks(e);
    }

    handleKeyboard(e) {
        // Global keyboard event handling
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    handleExternalLinks(e) {
        const link = e.target.closest('a[href^="http"]');
        if (link && !link.hostname.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    }

    updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (this.scrollPosition / windowHeight) * 100;
            progressBar.style.transform = `scaleX(${progress / 100})`;
        }
    }

    hideLoadingSpinner() {
        const spinner = document.querySelector('.loading-spinner');
        if (spinner) {
            spinner.classList.add('fade-out');
            setTimeout(() => spinner.remove(), 500);
        }
    }

    triggerInitEvent() {
        const event = new CustomEvent('privatetoolkit:initialized', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
}

// Initialize the application
const app = new PrivateToolkitApp();

// Export for potential external use
window.PrivateToolkitApp = PrivateToolkitApp;

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
