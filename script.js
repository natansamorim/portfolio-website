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

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
     .from('.hero-text > *', { 
          opacity: 0, 
          y: 30, 
          duration: 0.8,
          stagger: 0.2
      })
     .from('.hero-image', { opacity: 0, scale: 0.95, duration: 1 }, "-=0.5");

    window.addEventListener('load', () => {
        
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

        ScrollTrigger.refresh();
    });

    // --- 4. DATA LAYER E ANALYTICS (GA4) ---
    const trackEvent = (eventName, eventData) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: eventName,
            ...eventData
        });
        console.log(`[Datalayer Push] Evento disparado: ${eventName}`, eventData);
    };

    document.querySelectorAll('.whatsapp-float, #track-wa').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('generate_lead', { lead_type: 'whatsapp_click', source: 'portfolio' });
        });
    });

    const emailBtn = document.getElementById('track-email');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            trackEvent('generate_lead', { lead_type: 'email_click', source: 'portfolio' });
        });
    }

    // --- 5. INTEGRAÇÃO COM WHATSAPP ---
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btnSubmit = leadForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerText;
            
            // 1. Coleta os dados digitados
            const name = document.getElementById('lead-name').value;
            const email = document.getElementById('lead-email').value;
            const message = document.getElementById('lead-message').value;

            // 2. Dispara evento de conversão no GA4
            trackEvent('form_submission', { form_id: 'contact_form', lead_status: 'redirecting_to_whatsapp' });

            // 3. Muda o botão para mostrar que está carregando
            btnSubmit.innerText = 'Abrindo WhatsApp...';
            btnSubmit.style.opacity = '0.8';
            
            // 4. Monta a URL do WhatsApp com o texto pré-formatado
            const numeroWhatsApp = '5562999593986';
            const textoWhatsApp = `Olá Natan! Vim pelo seu portfólio.\n\n*Nome:* ${name}\n*E-mail:* ${email}\n*Projeto/Objetivo:* ${message}`;
            const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;
            
            // 5. Redireciona o usuário (com um leve atraso para garantir o envio do evento pro GA4)
            setTimeout(() => {
                window.open(linkWhatsApp, '_blank'); // Abre em nova aba
                
                // Reseta visualmente o formulário no seu site
                btnSubmit.innerText = 'Redirecionado com Sucesso!';
                btnSubmit.style.backgroundColor = '#25D366'; 
                btnSubmit.style.opacity = '1';
                leadForm.reset();
                
                setTimeout(() => {
                    btnSubmit.innerText = originalText;
                    btnSubmit.style.backgroundColor = '';
                }, 4000);
            }, 800);
        });
    }

    // --- 6. MENU ATIVO DURANTE O SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

});
