// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS ---
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section,.hero');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    const typingElement = document.getElementById('typing-effect');

    // --- EFEITO DE SOMBRA NO HEADER AO ROLAR ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- DESTAQUE DO LINK DE NAVEGAÇÃO ATIVO ---
    const observerOptionsNav = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // 40% da seção visível
    };

    const navObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptionsNav);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // --- ANIMAÇÃO DOS ELEMENTOS AO ENTRAR NA TELA ---
    const observerOptionsAnimate = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 10% do elemento visível
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para a animação ocorrer apenas uma vez
            }
        });
    }, observerOptionsAnimate);

    animatedElements.forEach(el => {
        animateObserver.observe(el);
    });

    // --- FUNCIONALIDADE DE COPIAR E-MAIL ---
    if (copyEmailBtn && emailText) {
        copyEmailBtn.addEventListener('click', () => {
            const email = emailText.textContent;
            navigator.clipboard.writeText(email).then(() => {
                // Feedback visual
                const originalIcon = copyEmailBtn.innerHTML;
                copyEmailBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyEmailBtn.innerHTML = originalIcon;
                }, 2000);
            }).catch(err => {
                console.error('Falha ao copiar e-mail: ', err);
            });
        });
    }

    // --- EFEITO DE DIGITAÇÃO ---
    if (typingElement) {
        const words =;
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const speed = isDeleting? 100 : 150;

            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex--);
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex++);
            }

            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }

            setTimeout(type, speed);
        }
        type();
    }
});