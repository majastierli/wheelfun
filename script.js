document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        console.log('Form submitted with data:', formData);

        formMessage.textContent = `Thank you, ${formData.name}! Your message has been received. We'll get back to you at ${formData.email} soon.`;
        formMessage.className = 'message success';

        setTimeout(() => {
            form.reset();
            formMessage.style.display = 'none';
        }, 5000);
    });

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            console.log(`Navigating to: ${section}`);
            
            if (section === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (section === 'contact') {
                document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
            } else if (section === 'about') {
                document.querySelector('.content').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = '#f44336';
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
        });
    });
});