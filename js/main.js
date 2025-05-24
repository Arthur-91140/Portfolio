// Modern Portfolio JavaScript - Arthur Pruvost Rivière

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initScrollEffects();
    initHeaderScrollBehavior();
    initContactForm();
    initProjectCards();
    initSmoothScrolling();
    initSkillTagsInteraction();
    initParallaxEffects();
    initTypewriterEffect();
    initLoadingAnimations();
});

// ==================== Scroll Effects & Animations ====================
function initScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.timeline-item, .interest-item, .project-card, .skill-tag');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animation = `fadeInUp 0.8s ease-out forwards`;
                        child.style.animationDelay = `${index * 0.1}s`;
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections with animation
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// ==================== Header Scroll Behavior ====================
function initHeaderScrollBehavior() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Add scrolled class for styling
                if (scrollTop > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide/show header on scroll
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
                isScrolling = false;
            });
        }
        isScrolling = true;
    });
}

// ==================== Contact Form ====================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Add floating label effect
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        // Add focus/blur handlers for floating labels
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });

        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Form submission with enhanced UX
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(contactForm);
        const formValues = {};
        
        for (let [key, value] of formData.entries()) {
            formValues[key] = value;
        }
        
        // Simulate form submission delay
        setTimeout(() => {
            console.log('Formulaire soumis avec les valeurs suivantes:', formValues);
            
            // Create and show success message
            const successMessage = createSuccessMessage();
            contactForm.innerHTML = '';
            contactForm.appendChild(successMessage);
            
            // Add success animation
            setTimeout(() => {
                successMessage.classList.add('show');
            }, 100);
            
        }, 2000);
    });
}

function createSuccessMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-success';
    messageDiv.innerHTML = `
        <div class="success-animation">
            <div class="checkmark">
                <svg width="52" height="52" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="25" fill="none" stroke="#4CAF50" stroke-width="2"/>
                    <path fill="none" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" 
                          stroke-linejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <h3>Message envoyé avec succès!</h3>
            <p>Merci de votre message. Je vous répondrai dans les plus brefs délais.</p>
            <button onclick="location.reload()" class="btn primary">
                <i class="fas fa-envelope"></i>
                Envoyer un nouveau message
            </button>
        </div>
    `;
    
    // Add CSS for success message
    const style = document.createElement('style');
    style.textContent = `
        .form-success {
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.5s ease;
            text-align: center;
            padding: 2rem;
        }
        .form-success.show {
            opacity: 1;
            transform: scale(1);
        }
        .success-animation {
            animation: bounceIn 0.8s ease-out;
        }
        .checkmark svg {
            width: 60px;
            height: 60px;
            margin-bottom: 1rem;
        }
        .checkmark circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            animation: checkmark-circle 0.6s ease-in-out forwards;
        }
        .checkmark path {
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: checkmark-path 0.5s ease-in-out 0.3s forwards;
        }
        @keyframes checkmark-circle {
            to { stroke-dashoffset: 0; }
        }
        @keyframes checkmark-path {
            to { stroke-dashoffset: 0; }
        }
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    return messageDiv;
}

// ==================== Project Cards Enhancement ====================
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / (rect.width / 2);
            const deltaY = (e.clientY - centerY) / (rect.height / 2);
            
            const rotateX = deltaY * -10;
            const rotateY = deltaX * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });

        // Add click ripple effect
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple keyframes
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// ==================== Smooth Scrolling ====================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== Skill Tags Interaction ====================
function initSkillTagsInteraction() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            // Create floating particles effect
            createParticles(tag);
        });
        
        tag.addEventListener('click', () => {
            // Add pulse animation
            tag.style.animation = 'pulse 0.3s ease-in-out';
            setTimeout(() => {
                tag.style.animation = '';
            }, 300);
        });
    });
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            animation: particle-float 1s ease-out forwards;
        `;
        
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        
        particle.style.setProperty('--random-x', `${randomX}px`);
        particle.style.setProperty('--random-y', `${randomY}px`);
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // Add particle animation keyframes
    if (!document.getElementById('particle-style')) {
        const particleStyle = document.createElement('style');
        particleStyle.id = 'particle-style';
        particleStyle.textContent = `
            @keyframes particle-float {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--random-x), var(--random-y)) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(particleStyle);
    }
}

// ==================== Parallax Effects ====================
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero, .page-header');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ==================== Typewriter Effect ====================
function initTypewriterEffect() {
    const heroTitle = document.querySelector('.hero-text h2');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid #667eea';
    heroTitle.style.animation = 'blink 1s infinite';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
                heroTitle.style.animation = 'none';
            }, 1000);
        }
    };
    
    // Start typewriter effect after a delay
    setTimeout(typeWriter, 1000);
    
    // Add blinking cursor animation
    const blinkStyle = document.createElement('style');
    blinkStyle.textContent = `
        @keyframes blink {
            0%, 50% { border-color: transparent; }
            51%, 100% { border-color: #667eea; }
        }
    `;
    document.head.appendChild(blinkStyle);
}

// ==================== Loading Animations ====================
function initLoadingAnimations() {
    // Add loading states for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.animation = 'fadeIn 0.5s ease-out';
        });
    });
    
    // Add staggered animation for navigation items
    const navItems = document.querySelectorAll('nav ul li');
    navItems.forEach((item, index) => {
        item.style.animation = `slideInDown 0.8s ease-out ${index * 0.1}s both`;
    });
    
    // Add loading animation styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideInDown {
            from {
                transform: translateY(-30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(loadingStyle);
}

// ==================== Utility Functions ====================

// Debounce function for performance
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==================== Performance Optimizations ====================

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        'css/style.css',
        'js/main.js'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    preloadResources();
});

// ==================== Error Handling ====================
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to a logging service
});

// ==================== Accessibility Improvements ====================

// Keyboard navigation for custom elements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus indicators for keyboard users
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #667eea !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(focusStyle);