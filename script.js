// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- ANIMAÇÕES COM GSAP ---
    gsap.registerPlugin(ScrollTrigger);

    // Animação do Hero Section
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
     .from('.hero-text > *', { 
          opacity: 0, 
          y: 30, 
          duration: 0.8,
          stagger: 0.2
      })
     .from('.hero-image', { opacity: 0, scale: 0.95, duration: 1 }, "-=0.5");

    // Animação dos Títulos das Seções
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Animação dos Cards de Projeto (Stagger)
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Animação da Timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Animação das Habilidades
    gsap.from('.skill-item', {
        scrollTrigger: {
            trigger: '.skills-list',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Animação da Seção de Contato
    gsap.from('.contact-container > *', {
        scrollTrigger: {
            trigger: '.contact-container',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // --- EFEITO DE SOMBRA NO HEADER AO ROLAR ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

});
