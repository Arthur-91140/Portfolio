// Portfolio Configuration & Settings Manager

class PortfolioConfig {
    constructor() {
        this.settings = {
            // ==================== Visual Settings ====================
            theme: {
                default: 'theme-purple',
                available: ['theme-purple', 'theme-blue', 'theme-orange'],
                autoSwitch: false, // Auto-change theme based on time of day
                respectSystemPreference: true
            },
            
            // ==================== Animation Settings ====================
            animations: {
                enabled: true,
                respectReducedMotion: true,
                particleCount: 50,
                parallaxIntensity: 0.5,
                transitionDuration: 300,
                typewriterSpeed: 100,
                
                // Performance-based adjustments
                adaptToPerformance: true,
                lowEndThreshold: {
                    cores: 2,
                    memory: 2 // GB
                }
            },
            
            // ==================== Interaction Settings ====================
            interactions: {
                customCursor: true,
                magneticEffects: true,
                rippleEffects: true,
                hoverAnimations: true,
                touchOptimizations: true
            },
            
            // ==================== Performance Settings ====================
            performance: {
                lazyLoading: true,
                preloadCritical: true,
                imageOptimization: true,
                animationOptimization: true,
                memoryManagement: true,
                
                // FPS monitoring (development only)
                showFPS: false,
                targetFPS: 60,
                
                // Resource management
                maxParticles: 100,
                maxAnimations: 10
            },
            
            // ==================== Accessibility Settings ====================
            accessibility: {
                respectMotionPreference: true,
                respectContrastPreference: true,
                keyboardNavigation: true,
                screenReaderSupport: true,
                focusManagement: true,
                
                // ARIA enhancements
                dynamicAria: true,
                announcements: true
            },
            
            // ==================== SEO & Analytics ====================
            seo: {
                structuredData: true,
                metaTagsOptimization: true,
                socialMediaTags: true,
                
                // Analytics (if needed)
                analytics: {
                    enabled: false,
                    trackingId: null,
                    trackInteractions: true,
                    trackScrollDepth: true,
                    trackPageViews: true
                }
            },
            
            // ==================== Contact Form Settings ====================
            contact: {
                enableAutosave: true,
                enableValidation: true,
                enableSuggestions: true,
                enableTemplates: true,
                maxMessageLength: 1000,
                
                // Email integration (placeholder)
                emailService: {
                    enabled: false,
                    provider: 'emailjs', // or 'formspree', 'netlify'
                    serviceId: null,
                    templateId: null
                }
            },
            
            // ==================== Development Settings ====================
            development: {
                debugMode: false,
                verboseLogging: false,
                showPerformanceMetrics: false,
                enableDevTools: false
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadUserPreferences();
        this.applySettings();
        this.setupEventListeners();
        this.detectCapabilities();
    }
    
    // ==================== User Preferences Management ====================
    loadUserPreferences() {
        const saved = localStorage.getItem('portfolio-settings');
        if (saved) {
            try {
                const userSettings = JSON.parse(saved);
                this.settings = this.mergeDeep(this.settings, userSettings);
            } catch (error) {
                console.warn('Could not load user preferences:', error);
            }
        }
    }
    
    saveUserPreferences() {
        try {
            localStorage.setItem('portfolio-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Could not save user preferences:', error);
        }
    }
    
    // ==================== Settings Application ====================
    applySettings() {
        this.applyTheme();
        this.applyAnimationSettings();
        this.applyAccessibilitySettings();
        this.applyPerformanceSettings();
    }
    
    applyTheme() {
        const { theme } = this.settings;
        
        // Remove existing theme classes
        theme.available.forEach(themeClass => {
            document.body.classList.remove(themeClass);
        });
        
        // Apply current theme
        document.body.classList.add(theme.default);
        
        // Respect system preference for dark mode (future enhancement)
        if (theme.respectSystemPreference) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('theme-dark');
            }
        }
    }
    
    applyAnimationSettings() {
        const { animations } = this.settings;
        
        if (!animations.enabled) {
            document.body.classList.add('no-animations');
        }
        
        if (animations.respectReducedMotion) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                document.body.classList.add('reduced-motion');
                this.settings.animations.enabled = false;
            }
        }
        
        // Set animation CSS custom properties
        document.documentElement.style.setProperty('--animation-duration', `${animations.transitionDuration}ms`);
        document.documentElement.style.setProperty('--parallax-intensity', animations.parallaxIntensity);
    }
    
    applyAccessibilitySettings() {
        const { accessibility } = this.settings;
        
        if (accessibility.respectContrastPreference) {
            const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
            if (prefersHighContrast) {
                document.body.classList.add('high-contrast');
            }
        }
        
        if (accessibility.keyboardNavigation) {
            document.body.classList.add('keyboard-navigation-enabled');
        }
    }
    
    applyPerformanceSettings() {
        const { performance } = this.settings;
        
        if (performance.animationOptimization) {
            // Add will-change properties to animated elements
            const animatedElements = document.querySelectorAll('[data-animate]');
            animatedElements.forEach(el => {
                el.style.willChange = 'transform, opacity';
            });
        }
    }
    
    // ==================== Capability Detection ====================
    detectCapabilities() {
        const capabilities = {
            cores: navigator.hardwareConcurrency || 1,
            memory: navigator.deviceMemory || 1,
            connection: navigator.connection?.effectiveType || 'unknown',
            touch: 'ontouchstart' in window,
            webp: this.supportsWebP(),
            intersection: 'IntersectionObserver' in window,
            performance: 'performance' in window
        };
        
        this.capabilities = capabilities;
        this.adaptToCapabilities();
    }
    
    adaptToCapabilities() {
        const { cores, memory, connection, touch } = this.capabilities;
        const { lowEndThreshold } = this.settings.animations;
        
        // Detect low-end device
        const isLowEnd = cores <= lowEndThreshold.cores || memory <= lowEndThreshold.memory;
        
        if (isLowEnd) {
            this.settings.animations.particleCount = Math.min(this.settings.animations.particleCount, 20);
            this.settings.performance.maxParticles = 30;
            document.body.classList.add('low-end-device');
        }
        
        // Adapt to slow connections
        if (connection === 'slow-2g' || connection === '2g') {
            this.settings.performance.lazyLoading = true;
            this.settings.animations.enabled = false;
            document.body.classList.add('slow-connection');
        }
        
        // Touch device optimizations
        if (touch) {
            this.settings.interactions.customCursor = false;
            this.settings.interactions.hoverAnimations = false;
            document.body.classList.add('touch-device');
        }
    }
    
    // ==================== Settings Getters ====================
    get(path) {
        return this.getNestedProperty(this.settings, path);
    }
    
    set(path, value) {
        this.setNestedProperty(this.settings, path, value);
        this.saveUserPreferences();
        this.applySettings();
    }
    
    // ==================== Event Listeners ====================
    setupEventListeners() {
        // Theme changes
        document.addEventListener('themechange', (e) => {
            this.set('theme.default', e.detail.theme);
        });
        
        // Performance monitoring
        if (this.settings.development.showPerformanceMetrics) {
            this.setupPerformanceMonitoring();
        }
        
        // Window events
        window.addEventListener('resize', this.debounce(() => {
            this.detectCapabilities();
        }, 250));
        
        // Visibility change (pause animations when tab not visible)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('page-hidden');
            } else {
                document.body.classList.remove('page-hidden');
            }
        });
    }
    
    // ==================== Performance Monitoring ====================
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // Monitor long tasks
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn(`Long task detected: ${entry.duration}ms`);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        }
        
        // Memory monitoring
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize / memory.totalJSHeapSize > 0.8) {
                    console.warn('High memory usage detected');
                    this.optimizeMemoryUsage();
                }
            }, 10000);
        }
    }
    
    optimizeMemoryUsage() {
        // Clean up unused animations
        const unusedAnimations = document.querySelectorAll('[data-animation-complete]');
        unusedAnimations.forEach(el => {
            el.style.animation = 'none';
            el.removeAttribute('data-animation-complete');
        });
        
        // Reduce particle count
        if (this.settings.animations.particleCount > 20) {
            this.settings.animations.particleCount = Math.max(20, this.settings.animations.particleCount * 0.7);
        }
        
        // Force garbage collection (if available)
        if (window.gc) {
            window.gc();
        }
    }
    
    // ==================== Utility Methods ====================
    mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }
    
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
    
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }
    
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            if (!current[key]) current[key] = {};
            return current[key];
        }, obj);
        target[lastKey] = value;
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
    
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    
    // ==================== Public API ====================
    
    // Enable/disable features
    enableAnimations() {
        this.set('animations.enabled', true);
    }
    
    disableAnimations() {
        this.set('animations.enabled', false);
    }
    
    setTheme(themeName) {
        if (this.settings.theme.available.includes(themeName)) {
            this.set('theme.default', themeName);
        }
    }
    
    togglePerformanceMode() {
        const isEnabled = this.get('performance.animationOptimization');
        this.set('performance.animationOptimization', !isEnabled);
        this.set('animations.particleCount', isEnabled ? 50 : 20);
    }
    
    exportSettings() {
        return JSON.stringify(this.settings, null, 2);
    }
    
    importSettings(settingsJson) {
        try {
            const imported = JSON.parse(settingsJson);
            this.settings = this.mergeDeep(this.settings, imported);
            this.applySettings();
            this.saveUserPreferences();
            return true;
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }
    
    resetToDefaults() {
        localStorage.removeItem('portfolio-settings');
        location.reload();
    }
    
    // ==================== Debug Helpers ====================
    getCapabilities() {
        return this.capabilities;
    }
    
    getPerformanceInfo() {
        return {
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null,
            timing: performance.timing,
            navigation: performance.navigation
        };
    }
    
    enableDebugMode() {
        this.settings.development.debugMode = true;
        this.settings.development.verboseLogging = true;
        this.settings.development.showPerformanceMetrics = true;
        document.body.classList.add('debug-mode');
        console.log('Debug mode enabled', this.settings);
    }
}

// ==================== Settings Panel UI ====================
class SettingsPanel {
    constructor(config) {
        this.config = config;
        this.isOpen = false;
        this.createPanel();
    }
    
    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'settings-panel';
        panel.innerHTML = `
            <div class="settings-header">
                <h3><i class="fas fa-cog"></i> Paramètres</h3>
                <button class="close-settings"><i class="fas fa-times"></i></button>
            </div>
            <div class="settings-content">
                <div class="setting-group">
                    <h4>Thème</h4>
                    <div class="theme-selector">
                        <button class="theme-btn" data-theme="theme-purple">Violet</button>
                        <button class="theme-btn" data-theme="theme-blue">Bleu</button>
                        <button class="theme-btn" data-theme="theme-orange">Orange</button>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h4>Animations</h4>
                    <label class="setting-toggle">
                        <input type="checkbox" id="animations-toggle" ${this.config.get('animations.enabled') ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                        Activer les animations
                    </label>
                    
                    <label class="setting-range">
                        Vitesse des animations
                        <input type="range" id="animation-speed" min="100" max="1000" step="50" 
                               value="${this.config.get('animations.transitionDuration')}">
                        <span class="range-value">${this.config.get('animations.transitionDuration')}ms</span>
                    </label>
                </div>
                
                <div class="setting-group">
                    <h4>Performance</h4>
                    <label class="setting-toggle">
                        <input type="checkbox" id="performance-toggle" ${this.config.get('performance.animationOptimization') ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                        Mode performance
                    </label>
                    
                    <label class="setting-range">
                        Particules (${this.config.get('animations.particleCount')})
                        <input type="range" id="particle-count" min="0" max="100" step="10" 
                               value="${this.config.get('animations.particleCount')}">
                        <span class="range-value">${this.config.get('animations.particleCount')}</span>
                    </label>
                </div>
                
                <div class="setting-group">
                    <h4>Accessibilité</h4>
                    <label class="setting-toggle">
                        <input type="checkbox" id="reduced-motion" ${this.config.get('accessibility.respectMotionPreference') ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                        Respecter les préférences de mouvement
                    </label>
                </div>
                
                <div class="setting-actions">
                    <button class="btn secondary" onclick="portfolioConfig.resetToDefaults()">
                        Réinitialiser
                    </button>
                    <button class="btn primary" onclick="settingsPanel.exportConfig()">
                        Exporter
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.panel = panel;
        this.bindEvents();
    }
    
    bindEvents() {
        // Toggle panel
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'settings-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-cog"></i>';
        toggleBtn.addEventListener('click', () => this.toggle());
        document.body.appendChild(toggleBtn);
        
        // Close panel
        this.panel.querySelector('.close-settings').addEventListener('click', () => this.close());
        
        // Theme selection
        this.panel.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.config.setTheme(btn.dataset.theme);
                this.updateThemeButtons();
            });
        });
        
        // Settings toggles
        this.panel.querySelector('#animations-toggle').addEventListener('change', (e) => {
            this.config.set('animations.enabled', e.target.checked);
        });
        
        this.panel.querySelector('#performance-toggle').addEventListener('change', (e) => {
            this.config.togglePerformanceMode();
        });
        
        // Range inputs
        this.panel.querySelector('#animation-speed').addEventListener('input', (e) => {
            this.config.set('animations.transitionDuration', parseInt(e.target.value));
            this.panel.querySelector('#animation-speed + .range-value').textContent = e.target.value + 'ms';
        });
        
        this.panel.querySelector('#particle-count').addEventListener('input', (e) => {
            this.config.set('animations.particleCount', parseInt(e.target.value));
            this.panel.querySelector('#particle-count + .range-value').textContent = e.target.value;
        });
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.panel.classList.add('open');
        this.isOpen = true;
    }
    
    close() {
        this.panel.classList.remove('open');
        this.isOpen = false;
    }
    
    updateThemeButtons() {
        const currentTheme = this.config.get('theme.default');
        this.panel.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === currentTheme);
        });
    }
    
    exportConfig() {
        const settings = this.config.exportSettings();
        const blob = new Blob([settings], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// ==================== Initialization ====================
// Global instances
let portfolioConfig;
let settingsPanel;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize configuration
    portfolioConfig = new PortfolioConfig();
    
    // Create settings panel (only in development or with special parameter)
    const showSettings = new URLSearchParams(window.location.search).get('settings') === 'true' ||
                         window.location.hostname === 'localhost';
    
    if (showSettings) {
        settingsPanel = new SettingsPanel(portfolioConfig);
    }
    
    // Add global access for debugging
    window.portfolioConfig = portfolioConfig;
    window.settingsPanel = settingsPanel;
});

// CSS for settings panel
const settingsPanelCSS = `
    .settings-panel {
        position: fixed;
        top: 0;
        right: -400px;
        width: 380px;
        height: 100vh;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border-left: 1px solid var(--glass-border);
        box-shadow: var(--shadow-2xl);
        z-index: 10000;
        transition: right var(--transition-normal);
        overflow-y: auto;
    }
    
    .settings-panel.open {
        right: 0;
    }
    
    .settings-toggle {
        position: fixed;
        top: 50%;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-gradient);
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 9999;
        transition: all var(--transition-normal);
    }
    
    .settings-toggle:hover {
        transform: scale(1.1) rotate(90deg);
    }
    
    .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-lg);
        border-bottom: 1px solid var(--glass-border);
    }
    
    .settings-content {
        padding: var(--space-lg);
    }
    
    .setting-group {
        margin-bottom: var(--space-xl);
    }
    
    .setting-group h4 {
        margin-bottom: var(--space-md);
        color: var(--text-color);
    }
    
    .theme-selector {
        display: flex;
        gap: var(--space-sm);
    }
    
    .theme-btn {
        flex: 1;
        padding: var(--space-sm);
        border: 2px solid var(--border-color);
        border-radius: var(--radius-md);
        background: var(--bg-light);
        cursor: pointer;
        transition: all var(--transition-normal);
    }
    
    .theme-btn.active {
        background: var(--primary-gradient);
        color: white;
        border-color: var(--primary-color);
    }
    
    .setting-toggle {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        margin-bottom: var(--space-md);
    }
    
    .toggle-slider {
        position: relative;
        width: 50px;
        height: 24px;
        background: var(--bg-light);
        border-radius: 12px;
        transition: background var(--transition-normal);
        cursor: pointer;
    }
    
    .toggle-slider::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        transition: transform var(--transition-normal);
    }
    
    .setting-toggle input:checked + .toggle-slider {
        background: var(--primary-color);
    }
    
    .setting-toggle input:checked + .toggle-slider::before {
        transform: translateX(26px);
    }
    
    .setting-toggle input {
        display: none;
    }
    
    .setting-range {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        margin-bottom: var(--space-md);
    }
    
    .setting-range input[type="range"] {
        width: 100%;
    }
    
    .range-value {
        text-align: right;
        font-size: 0.9rem;
        color: var(--text-light);
    }
    
    .setting-actions {
        display: flex;
        gap: var(--space-md);
        margin-top: var(--space-xl);
    }
    
    .close-settings {
        background: none;
        border: none;
        font-size: 1.2rem;
        color: var(--text-light);
        cursor: pointer;
        transition: color var(--transition-fast);
    }
    
    .close-settings:hover {
        color: var(--text-color);
    }
`;

// Add styles to document
const settingsStyleSheet = document.createElement('style');
settingsStyleSheet.textContent = settingsPanelCSS;
document.head.appendChild(settingsStyleSheet);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioConfig, SettingsPanel };
}