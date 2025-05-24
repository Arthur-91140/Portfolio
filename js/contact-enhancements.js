// Contact Page Enhanced Functionality

document.addEventListener('DOMContentLoaded', function() {
    initAdvancedFormValidation();
    initFormAutosave();
    initSmartFormFields();
    initContactAnimations();
    initAvailabilityCalendar();
    initContactAnalytics();
});

// ==================== Advanced Form Validation ====================
function initAdvancedFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const validator = new FormValidator(form);
    
    // Custom validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
            message: 'Le nom doit contenir uniquement des lettres'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Veuillez entrer une adresse email valide'
        },
        subject: {
            required: true,
            message: 'Veuillez sélectionner un sujet'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Le message doit contenir entre 10 et 1000 caractères'
        },
        privacy: {
            required: true,
            message: 'Vous devez accepter la politique de confidentialité'
        }
    };

    // Apply validation rules
    Object.keys(validationRules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            validator.addField(field, validationRules[fieldName]);
        }
    });

    // Real-time validation
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validator.validateForm()) {
            await handleFormSubmission(form);
        } else {
            showValidationErrors();
        }
    });
}

// ==================== Form Validator Class ====================
class FormValidator {
    constructor(form) {
        this.form = form;
        this.fields = new Map();
        this.errors = new Map();
    }

    addField(field, rules) {
        this.fields.set(field, rules);
        
        // Add real-time validation
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.clearFieldError(field));
    }

    validateField(field) {
        const rules = this.fields.get(field);
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire';
        }
        // Length validation
        else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Minimum ${rules.minLength} caractères requis`;
        }
        else if (rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `Maximum ${rules.maxLength} caractères autorisés`;
        }
        // Pattern validation
        else if (rules.pattern && value && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message || 'Format invalide';
        }
        // Checkbox validation
        else if (field.type === 'checkbox' && rules.required && !field.checked) {
            isValid = false;
            errorMessage = rules.message || 'Ce champ est obligatoire';
        }

        if (!isValid) {
            this.errors.set(field, errorMessage);
            this.showFieldError(field, errorMessage);
        } else {
            this.errors.delete(field);
            this.clearFieldError(field);
        }

        return isValid;
    }

    validateForm() {
        let isFormValid = true;
        
        this.fields.forEach((rules, field) => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    showFieldError(field, message) {
        const errorSpan = field.parentElement.querySelector('.form-error');
        if (errorSpan) {
            errorSpan.textContent = message;
            field.parentElement.classList.add('error');
            
            // Add shake animation
            field.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                field.style.animation = '';
            }, 500);
        }
    }

    clearFieldError(field) {
        const errorSpan = field.parentElement.querySelector('.form-error');
        if (errorSpan) {
            errorSpan.textContent = '';
            field.parentElement.classList.remove('error');
        }
    }
}

// ==================== Form Autosave ====================
function initFormAutosave() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const autosaveKey = 'contact-form-autosave';
    
    // Load saved data
    loadFormData();
    
    // Save data on input
    form.addEventListener('input', debounce(saveFormData, 1000));
    
    // Clear saved data on successful submission
    form.addEventListener('formSubmitted', clearFormData);

    function saveFormData() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (key !== 'privacy') { // Don't save privacy checkbox
                data[key] = value;
            }
        }
        
        localStorage.setItem(autosaveKey, JSON.stringify(data));
        showAutosaveIndicator();
    }

    function loadFormData() {
        try {
            const savedData = localStorage.getItem(autosaveKey);
            if (savedData) {
                const data = JSON.parse(savedData);
                
                Object.keys(data).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field && data[key]) {
                        field.value = data[key];
                        
                        // Trigger change event for custom styling
                        field.dispatchEvent(new Event('input'));
                    }
                });
                
                showRestoreNotification();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        }
    }

    function clearFormData() {
        localStorage.removeItem(autosaveKey);
    }

    function showAutosaveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'autosave-indicator';
        indicator.innerHTML = '<i class="fas fa-save"></i> Sauvegardé automatiquement';
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            indicator.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(indicator);
            }, 300);
        }, 2000);
    }

    function showRestoreNotification() {
        const notification = document.createElement('div');
        notification.className = 'restore-notification';
        notification.innerHTML = `
            <div class="restore-content">
                <i class="fas fa-history"></i>
                <span>Données précédentes restaurées</span>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// ==================== Smart Form Fields ====================
function initSmartFormFields() {
    // Email domain suggestions
    initEmailSuggestions();
    
    // Phone number formatting
    initPhoneFormatting();
    
    // Message templates
    initMessageTemplates();
    
    // Subject-based form customization
    initSubjectCustomization();
}

function initEmailSuggestions() {
    const emailField = document.getElementById('email');
    if (!emailField) return;

    const commonDomains = [
        'gmail.com', 'yahoo.fr', 'hotmail.fr', 'orange.fr', 
        'outlook.fr', 'laposte.net', 'free.fr', 'wanadoo.fr'
    ];

    emailField.addEventListener('input', function() {
        const value = this.value;
        const atIndex = value.indexOf('@');
        
        if (atIndex > 0 && atIndex < value.length - 1) {
            const domain = value.substring(atIndex + 1);
            const suggestions = commonDomains.filter(d => 
                d.startsWith(domain.toLowerCase()) && d !== domain.toLowerCase()
            );
            
            if (suggestions.length > 0) {
                showEmailSuggestions(this, suggestions, value.substring(0, atIndex + 1));
            } else {
                hideEmailSuggestions();
            }
        } else {
            hideEmailSuggestions();
        }
    });

    function showEmailSuggestions(field, suggestions, prefix) {
        hideEmailSuggestions();
        
        const suggestionBox = document.createElement('div');
        suggestionBox.className = 'email-suggestions';
        suggestionBox.innerHTML = suggestions.map(domain => 
            `<div class="suggestion-item" data-email="${prefix}${domain}">
                ${prefix}<strong>${domain}</strong>
            </div>`
        ).join('');
        
        field.parentElement.appendChild(suggestionBox);
        
        // Add click handlers
        suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                field.value = item.dataset.email;
                field.dispatchEvent(new Event('input'));
                hideEmailSuggestions();
            });
        });
    }

    function hideEmailSuggestions() {
        const existing = document.querySelector('.email-suggestions');
        if (existing) {
            existing.remove();
        }
    }
}

function initMessageTemplates() {
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    
    if (!subjectField || !messageField) return;

    const templates = {
        'stage': 'Bonjour Arthur,\n\nJe vous contacte concernant une opportunité de stage au sein de notre entreprise. Nous recherchons un stagiaire en développement...\n\nCordialement,',
        'projet': 'Bonjour Arthur,\n\nJ\'ai découvert vos projets sur GitHub et j\'aimerais discuter d\'une possible collaboration sur...\n\nBien à vous,',
        'emploi': 'Bonjour Arthur,\n\nNous avons une opportunité d\'emploi qui pourrait vous intéresser. Le poste consiste en...\n\nCordialement,',
        'question': 'Bonjour Arthur,\n\nJ\'ai une question technique concernant votre projet... Pourriez-vous m\'éclairer sur...\n\nMerci d\'avance,',
        'conseil': 'Bonjour Arthur,\n\nJe suis également étudiant en informatique et j\'aimerais avoir vos conseils sur...\n\nMerci pour votre temps,'
    };

    subjectField.addEventListener('change', function() {
        if (templates[this.value] && !messageField.value.trim()) {
            showTemplateOption(this.value);
        }
    });

    function showTemplateOption(subject) {
        const templateBtn = document.createElement('button');
        templateBtn.type = 'button';
        templateBtn.className = 'template-btn';
        templateBtn.innerHTML = '<i class="fas fa-magic"></i> Utiliser un modèle';
        
        templateBtn.addEventListener('click', () => {
            messageField.value = templates[subject];
            messageField.dispatchEvent(new Event('input'));
            templateBtn.remove();
            messageField.focus();
        });
        
        messageField.parentElement.insertBefore(templateBtn, messageField);
        
        setTimeout(() => {
            templateBtn.classList.add('show');
        }, 100);
    }
}

function initSubjectCustomization() {
    const subjectField = document.getElementById('subject');
    const companyField = document.getElementById('company');
    
    if (!subjectField || !companyField) return;

    subjectField.addEventListener('change', function() {
        const isWorkRelated = ['stage', 'emploi', 'projet'].includes(this.value);
        
        if (isWorkRelated) {
            companyField.parentElement.style.display = 'block';
            companyField.setAttribute('required', '');
        } else {
            companyField.parentElement.style.display = 'none';
            companyField.removeAttribute('required');
        }
    });
}

// ==================== Contact Animations ====================
function initContactAnimations() {
    // Floating animation for contact items
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect for icons
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const icons = document.querySelectorAll('.contact-icon');
        
        icons.forEach(icon => {
            const speed = 0.5;
            icon.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 16));
}

// ==================== Availability Calendar ====================
function initAvailabilityCalendar() {
    const availabilitySection = document.querySelector('.availability');
    if (!availabilitySection) return;

    // Create a mini calendar showing availability
    const calendar = createMiniCalendar();
    const availabilityHeader = availabilitySection.querySelector('.availability-header');
    
    if (availabilityHeader) {
        availabilityHeader.appendChild(calendar);
    }
}

function createMiniCalendar() {
    const calendar = document.createElement('div');
    calendar.className = 'mini-calendar';
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Available dates (simulate availability)
    const availableDates = [
        new Date(2025, 5, 15), // June 15, 2025
        new Date(2025, 5, 22), // June 22, 2025
        new Date(2025, 6, 1),  // July 1, 2025
        new Date(2025, 6, 15)  // July 15, 2025
    ];
    
    calendar.innerHTML = `
        <h4><i class="fas fa-calendar"></i> Prochaines disponibilités</h4>
        <div class="calendar-dates">
            ${availableDates.map(date => `
                <div class="calendar-date available">
                    <span class="date-day">${date.getDate()}</span>
                    <span class="date-month">${getMonthName(date.getMonth())}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    return calendar;
}

function getMonthName(monthIndex) {
    const months = [
        'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
        'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    return months[monthIndex];
}

// ==================== Contact Analytics ====================
function initContactAnalytics() {
    // Track form interactions (for improvement purposes)
    const form = document.getElementById('contact-form');
    if (!form) return;

    const analytics = {
        formStarted: false,
        formCompleted: false,
        interactionTimes: {},
        fieldFocusTimes: {}
    };

    // Track form start
    form.addEventListener('focusin', function() {
        if (!analytics.formStarted) {
            analytics.formStarted = true;
            analytics.startTime = Date.now();
            console.log('📝 Formulaire démarré');
        }
    });

    // Track field interactions
    const formFields = form.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            analytics.fieldFocusTimes[field.name] = Date.now();
        });

        field.addEventListener('blur', () => {
            if (analytics.fieldFocusTimes[field.name]) {
                const focusTime = Date.now() - analytics.fieldFocusTimes[field.name];
                analytics.interactionTimes[field.name] = focusTime;
            }
        });
    });

    // Track form completion
    form.addEventListener('submit', () => {
        analytics.formCompleted = true;
        analytics.completionTime = Date.now() - analytics.startTime;
        
        console.log('📊 Analyse du formulaire:', {
            tempsTotal: `${Math.round(analytics.completionTime / 1000)}s`,
            tempsParChamp: Object.keys(analytics.interactionTimes).map(field => ({
                champ: field,
                temps: `${Math.round(analytics.interactionTimes[field] / 1000)}s`
            }))
        });
    });
}

// ==================== Form Submission Handler ====================
async function handleFormSubmission(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
    form.classList.add('form-loading');
    
    try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('📧 Formulaire soumis:', data);
        
        // Show success message
        showSuccessMessage(form);
        
        // Clear autosaved data
        form.dispatchEvent(new CustomEvent('formSubmitted'));
        
        // Track successful submission
        console.log('✅ Message envoyé avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi:', error);
        showErrorMessage();
        
        // Restore form state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        form.classList.remove('form-loading');
    }
}

function showSuccessMessage(form) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <div class="success-animation">
            <div class="checkmark">
                <svg width="52" height="52" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="25" fill="none" stroke="#4CAF50" stroke-width="2"/>
                    <path fill="none" stroke="#4CAF50" stroke-width="3" stroke-linecap="round" 
                          stroke-linejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <h3>Message envoyé avec succès! 🎉</h3>
            <p>Merci pour votre message. Je vous répondrai dans les plus brefs délais.</p>
            <p><strong>Temps de réponse habituel :</strong> moins de 24 heures</p>
            <button onclick="location.reload()" class="btn primary">
                <i class="fas fa-envelope"></i>
                Envoyer un nouveau message
            </button>
        </div>
    `;
    
    form.parentElement.innerHTML = '';
    form.parentElement.appendChild(successDiv);
    
    // Trigger animation
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 100);
}

function showErrorMessage() {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Erreur lors de l'envoi. Veuillez réessayer.</span>
            <button onclick="this.parentElement.parentElement.remove()" class="close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

function showValidationErrors() {
    const errorNotification = document.createElement('div');
    errorNotification.className = 'validation-notification';
    errorNotification.innerHTML = `
        <div class="validation-content">
            <i class="fas fa-info-circle"></i>
            <span>Veuillez corriger les erreurs dans le formulaire</span>
        </div>
    `;
    
    document.body.appendChild(errorNotification);
    
    setTimeout(() => {
        errorNotification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        errorNotification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(errorNotification)) {
                document.body.removeChild(errorNotification);
            }
        }, 300);
    }, 3000);
}

// ==================== Utility Functions ====================
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

// ==================== Additional Styles ====================
const additionalStyles = `
    .autosave-indicator {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-gradient);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 0.9rem;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .autosave-indicator.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .restore-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    }
    
    .restore-notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .restore-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
    }
    
    .restore-content i {
        color: var(--primary-color);
    }
    
    .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #718096;
        margin-left: auto;
    }
    
    .email-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: var(--shadow-md);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .suggestion-item {
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .suggestion-item:hover {
        background-color: #f7fafc;
    }
    
    .template-btn {
        background: var(--secondary-gradient);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.85rem;
        cursor: pointer;
        margin-bottom: 12px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    .template-btn.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .mini-calendar {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: var(--shadow-md);
        margin-top: 20px;
        max-width: 300px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .mini-calendar h4 {
        text-align: center;
        margin-bottom: 16px;
        color: var(--primary-color);
    }
    
    .calendar-dates {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .calendar-date {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px;
        border-radius: 8px;
        background: var(--bg-light);
        min-width: 60px;
    }
    
    .calendar-date.available {
        background: var(--primary-gradient);
        color: white;
    }
    
    .date-day {
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .date-month {
        font-size: 0.8rem;
        opacity: 0.8;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .error-notification,
    .validation-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: #fed7d7;
        color: #c53030;
        border: 1px solid #feb2b2;
        border-radius: 8px;
        padding: 16px;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    }
    
    .error-notification.show,
    .validation-notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .error-content,
    .validation-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);