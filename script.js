// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DO MODAL DE PRIVACIDADE ---
    const modal = document.getElementById("privacy-modal");
    const btnPrivacy = document.getElementById("open-privacy");
    const spanClose = document.getElementsByClassName("close-modal")[0];

    if(btnPrivacy && modal && spanClose) {
        btnPrivacy.onclick = function() {
            modal.style.display = "block";
        }
        spanClose.onclick = function() {
            modal.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // --- 2. EFEITO DE SOMBRA NO HEADER AO ROLAR ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // --- 3. ANIMAÇÕES COM GSAP (Anti-Bug da Tela Preta) ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
     .from('.hero-text > *', { 
          opacity: 0, 
          y: 30, 
          duration: 0.8,
          stagger: 0.2
      })
     .from('.hero-image', { opacity: 0, scale: 0.95, duration: 1 }, "-=0.5");


    // window.load garante que o Javascript só vai calcular o scroll
    // DEPOIS que todas as imagens tiverem carregado.
    window.addEventListener('load', () => {
        
        // Títulos
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 90%', 
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Cards: Animação separada um a um para evitar sumiço
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 95%', 
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                delay: index * 0.15,
                ease: 'power3.out'
            });
        });

        // Timeline
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: -50,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Habilidades
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((skill, index) => {
            gsap.from(skill, {
                scrollTrigger: {
                    trigger: skill,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 40,
                duration: 0.5,
                delay: (index % 3) * 0.15,
                ease: 'power3.out'
            });
        });

        // Contato
        gsap.from('.contact-container > *', {
            scrollTrigger: {
                trigger: '.contact-container',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Força a atualização do GSAP (segurança extra)
        ScrollTrigger.refresh();
    });

});
