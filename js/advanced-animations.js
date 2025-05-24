// Advanced Animations & Visual Effects JavaScript

class AdvancedAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createScrollProgressBar();
        this.initParticleSystem();
        this.initMagneticEffects();
        this.initTextAnimations();
        this.initCursorEffects();
        this.initScrollReveal();
        this.initPerformanceOptimizations();
        this.initThemeSystem();
        this.initPageTransitions();
        this.initAdvancedScrollEffects();
    }

    // ==================== Scroll Progress Bar ====================
    createScrollProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', this.throttle(() => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${Math.min(scrolled, 100)}%`;
        }, 16));
    }

    // ==================== Particle System ====================
    initParticleSystem() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        hero.appendChild(particlesContainer);

        this.createParticles(particlesContainer, 50);
        this.animateParticles();
    }

    createParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and properties
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (3 + Math.random() * 3) + 's';
            
            // Random colors from our palette
            const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(particle);
        }
    }

    animateParticles() {
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach(particle => {
            // Add mouse interaction
            particle.addEventListener('mouseenter', () => {
                particle.style.transform = 'scale(2)';
                particle.style.background = '#f5576c';
            });
            
            particle.addEventListener('mouseleave', () => {
                particle.style.transform = 'scale(1)';
                particle.style.background = particle.dataset.originalColor || '#667eea';
            });
        });
    }

    // ==================== Magnetic Effects ====================
    initMagneticEffects() {
        const magneticElements = document.querySelectorAll('.btn, .project-card, .contact-item');
        
        magneticElements.forEach(element => {
            element.classList.add('magnetic');
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const intensity = 0.3;
                element.style.transform = `translate(${x * intensity}px, ${y * intensity}px) scale(1.02)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }

    // ==================== Text Animations ====================
    initTextAnimations() {
        this.initTypewriterEffect();
        this.initTextShimmer();
        this.initCountUpAnimation();
    }

    initTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typing-effect');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, 100);
        });
    }

    initTextShimmer() {
        const shimmerElements = document.querySelectorAll('h1, h2');
        
        shimmerElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('text-shimmer');
            });
            
            element.addEventListener('animationend', () => {
                element.classList.remove('text-shimmer');
            });
        });
    }

    initCountUpAnimation() {
        const countElements = document.querySelectorAll('[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        countElements.forEach(el => observer.observe(el));
    }

    animateCount(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = Date.now();
        
        const timer = setInterval(() => {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);
            const current = Math.floor(progress * target);
            
            element.textContent = current;
            
            if (progress === 1) {
                clearInterval(timer);
            }
        }, 16);
    }

    // ==================== Cursor Effects ====================
    initCursorEffects() {
        // Custom cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'custom-cursor-follower';
        document.body.appendChild(cursorFollower);
        
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });
        
        // Smooth follower animation
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            requestAnimationFrame(animateFollower);
        };
        animateFollower();
        
        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });
    }

    // ==================== Scroll Reveal ====================
    initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==================== Performance Optimizations ====================
    initPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Lazy load images
        this.initLazyLoading();
        
        // Optimize animations based on device capabilities
        this.optimizeForDevice();
    }

    preloadCriticalResources() {
        const criticalImages = document.querySelectorAll('img[loading="eager"]');
        
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        });
    }

    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    optimizeForDevice() {
        const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                              navigator.deviceMemory <= 2;
        
        if (isLowEndDevice) {
            document.body.classList.add('reduced-animations');
            
            // Disable heavy animations
            const heavyAnimations = document.querySelectorAll('.particle, .text-shimmer');
            heavyAnimations.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        }
    }

    // ==================== Theme System ====================
    initThemeSystem() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-palette"></i>';
        themeToggle.setAttribute('aria-label', 'Changer de thème');
        
        document.body.appendChild(themeToggle);
        
        const themes = ['theme-purple', 'theme-blue', 'theme-orange'];
        let currentTheme = 0;
        
        themeToggle.addEventListener('click', () => {
            // Remove current theme
            document.body.classList.remove(...themes);
            
            // Apply next theme
            currentTheme = (currentTheme + 1) % themes.length;
            document.body.classList.add(themes[currentTheme]);
            
            // Store preference
            localStorage.setItem('preferred-theme', themes[currentTheme]);
            
            // Add feedback animation
            themeToggle.style.transform = 'scale(1.2) rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('preferred-theme');
        if (savedTheme && themes.includes(savedTheme)) {
            document.body.classList.add(savedTheme);
            currentTheme = themes.indexOf(savedTheme);
        }
    }

    // ==================== Page Transitions ====================
    initPageTransitions() {
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href$=".html"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.hostname === window.location.hostname) {
                    e.preventDefault();
                    this.transitionToPage(link.href);
                }
            });
        });
    }

    transitionToPage(url) {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
        
        // Trigger transition
        requestAnimationFrame(() => {
            transition.classList.add('active');
        });
        
        // Navigate after transition
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // ==================== Advanced Scroll Effects ====================
    initAdvancedScrollEffects() {
        // Parallax scrolling
        this.initParallaxScrolling();
        
        // Scroll-triggered animations
        this.initScrollTriggers();
        
        // Smooth scrolling enhancements
        this.enhanceSmoothScrolling();
    }

    initParallaxScrolling() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16));
    }

    initScrollTriggers() {
        const triggerElements = document.querySelectorAll('[data-scroll-trigger]');
        
        triggerElements.forEach(element => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const trigger = entry.target.dataset.scrollTrigger;
                        
                        switch (trigger) {
                            case 'bounce':
                                entry.target.style.animation = 'bounceIn 0.8s ease-out';
                                break;
                            case 'rotate':
                                entry.target.style.animation = 'rotateIn 0.8s ease-out';
                                break;
                            case 'scale':
                                entry.target.style.animation = 'scaleIn 0.8s ease-out';
                                break;
                            default:
                                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                        }
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(element);
        });
    }

    enhanceSmoothScrolling() {
        // Enhanced smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    // Custom smooth scroll with easing
                    this.smoothScrollTo(offsetPosition, 800);
                }
            });
        });
    }

    smoothScrollTo(endY, duration) {
        const startY = window.scrollY;
        const distanceY = endY - startY;
        const startTime = Date.now();
        
        const easeInOutQuart = (t) => {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        };
        
        const timer = setInterval(() => {
            const time = Date.now() - startTime;
            const newY = startY + distanceY * easeInOutQuart(time / duration);
            
            if (time >= duration) {
                clearInterval(timer);
                window.scrollTo(0, endY);
            } else {
                window.scrollTo(0, newY);
            }
        }, 16);
    }

    // ==================== Utility Functions ====================
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ==================== Additional Visual Effects ====================
class VisualEffects {
    static createRipple(element, x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x - rect.left - size / 2}px;
            top: ${y - rect.top - size / 2}px;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    static addGlowEffect(element, color = '#667eea') {
        element.style.boxShadow = `0 0 20px ${color}`;
        element.style.transition = 'box-shadow 0.3s ease';
        
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 2000);
    }

    static shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    static pulseElement(element) {
        element.style.animation = 'pulse 1s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
    }
}

// ==================== Performance Monitor ====================
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        
        this.init();
    }
    
    init() {
        if (process.env.NODE_ENV === 'development') {
            this.createFPSCounter();
        }
        
        this.monitorScrollPerformance();
        this.monitorAnimationPerformance();
    }
    
    createFPSCounter() {
        const fpsCounter = document.createElement('div');
        fpsCounter.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
        `;
        document.body.appendChild(fpsCounter);
        
        const updateFPS = (currentTime) => {
            this.frameCount++;
            
            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                fpsCounter.textContent = `FPS: ${this.fps}`;
                
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
            
            requestAnimationFrame(updateFPS);
        };
        
        requestAnimationFrame(updateFPS);
    }
    
    monitorScrollPerformance() {
        let scrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!scrolling) {
                requestAnimationFrame(() => {
                    // Monitor scroll performance here
                    scrolling = false;
                });
                scrolling = true;
            }
        });
    }
    
    monitorAnimationPerformance() {
        // Monitor long animation frames
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 16.67) { // Longer than 60fps
                        console.warn(`Long animation frame detected: ${entry.duration}ms`);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['measure'] });
        }
    }
}

// ==================== Initialize Everything ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize advanced animations
    new AdvancedAnimations();
    
    // Initialize performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        new PerformanceMonitor();
    }
    
    // Add global event listeners for visual effects
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('ripple') || e.target.closest('.ripple')) {
            const element = e.target.classList.contains('ripple') ? e.target : e.target.closest('.ripple');
            VisualEffects.createRipple(element, e.clientX, e.clientY);
        }
    });
    
    // Add CSS for dynamic effects
    const dynamicStyles = `
        .custom-cursor {
            position: fixed;
            width: 10px;
            height: 10px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        }
        
        .custom-cursor-follower {
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.5;
        }
        
        .custom-cursor.cursor-hover {
            transform: scale(2);
            background: var(--secondary-color);
        }
        
        .custom-cursor-follower.cursor-hover {
            transform: scale(1.5);
            border-color: var(--secondary-color);
        }
        
        .theme-toggle {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--primary-gradient);
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            transition: all var(--transition-normal);
            z-index: 1000;
        }
        
        .theme-toggle:hover {
            transform: scale(1.1);
            box-shadow: var(--shadow-xl);
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .reduced-animations * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
        }
        
        /* Hide custom cursor on touch devices */
        @media (hover: none) and (pointer: coarse) {
            .custom-cursor,
            .custom-cursor-follower {
                display: none;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedAnimations, VisualEffects, PerformanceMonitor };
}