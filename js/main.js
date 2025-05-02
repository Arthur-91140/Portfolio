// main.js - Script principal du portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Dans un environnement réel, ici on enverrait les données du formulaire à un serveur
            const formData = new FormData(contactForm);
            const formValues = {};
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // Simulation d'envoi réussi
            console.log('Formulaire soumis avec les valeurs suivantes:', formValues);
            
            // Affichage d'un message de confirmation
            const confirmationMessage = document.createElement('div');
            confirmationMessage.className = 'form-confirmation';
            confirmationMessage.innerHTML = `
                <div class="confirmation-icon">✓</div>
                <h3>Message envoyé avec succès!</h3>
                <p>Merci de votre message. Je vous répondrai dans les plus brefs délais.</p>
            `;
            
            // Remplacer le formulaire par le message de confirmation
            contactForm.innerHTML = '';
            contactForm.appendChild(confirmationMessage);
        });
    }
    
    // Animation pour les projets
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('animated');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('animated');
        });
    });
    
    // Intersection Observer pour les animations au scroll
    if ('IntersectionObserver' in window) {
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -100px 0px"
        };
        
        const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('appear');
                    appearOnScroll.unobserve(entry.target);
                }
            });
        }, appearOptions);
        
        // Appliquer l'animation à différentes sections
        const sections = document.querySelectorAll('.about, .education, .experience, .interests, .projects-preview, .project-full');
        sections.forEach(section => {
            appearOnScroll.observe(section);
        });
    }
    
    // Smooth scrolling pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Correction du CSS pour le footer de la page de contact
    const footerLinks = document.querySelector('.footer-links');
    if (footerLinks && !footerLinks.querySelector('ul')) {
        const linksList = document.createElement('ul');
        linksList.innerHTML = `
            <li><a href="index.html">Accueil</a></li>
            <li><a href="projects.html">Projets</a></li>
            <li><a href="contact.html">Contact</a></li>
        `;
        footerLinks.appendChild(linksList);
    }
});
