// script.js

// --- 0. IMPORTAÇÕES DO FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- 1. CONFIGURAÇÃO DO SEU FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyAHPCLZcYTbNel2WlaI7KBuTYOmGJG2K_Q",
  authDomain: "natan-santiago-portfolio.firebaseapp.com",
  projectId: "natan-santiago-portfolio",
  storageBucket: "natan-santiago-portfolio.firebasestorage.app",
  messagingSenderId: "459285839610",
  appId: "1:459285839610:web:1e83944c8e44c1c5ef9343",
  measurementId: "G-NHRPHMMNBC"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); 

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO MODAL DE PRIVACIDADE ---
    const modal = document.getElementById("privacy-modal");
    const btnPrivacy = document.getElementById("open-privacy");
    const spanClose = document.getElementsByClassName("close-modal")[0];

    if(btnPrivacy && modal && spanClose) {
        btnPrivacy.onclick = function() { modal.style.display = "block"; }
        spanClose.onclick = function() { modal.style.display = "none"; }
        window.onclick = function(event) {
            if (event.target == modal) { modal.style.display = "none"; }
        }
    }

    // --- EFEITO DE SOMBRA NO HEADER AO ROLAR ---
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.5)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // --- ANIMAÇÕES COM GSAP ---
    gsap.registerPlugin(ScrollTrigger);

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if(document.querySelector('.hero-text')) {
        heroTimeline
         .from('.hero-text > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.2 })
         .from('.hero-image', { opacity: 0, scale: 0.95, duration: 1 }, "-=0.5");
    }

    window.addEventListener('load', () => {
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            gsap.from(title, { scrollTrigger: { trigger: title, start: 'top 90%', toggleActions: 'play none none none' }, opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' });
        });

        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 95%', toggleActions: 'play none none none' }, opacity: 0, y: 50, duration: 0.6, delay: index * 0.15, ease: 'power3.out' });
        });

        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            gsap.from(item, { scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' }, opacity: 0, x: -50, duration: 0.8, ease: 'power3.out' });
        });

        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((skill, index) => {
            gsap.from(skill, { scrollTrigger: { trigger: skill, start: 'top 95%', toggleActions: 'play none none none' }, opacity: 0, y: 40, duration: 0.5, delay: (index % 3) * 0.15, ease: 'power3.out' });
        });

        gsap.from('.contact-container > *', { scrollTrigger: { trigger: '.contact-container', start: 'top 90%', toggleActions: 'play none none none' }, opacity: 0, y: 30, duration: 0.7, stagger: 0.2, ease: 'power3.out' });
        ScrollTrigger.refresh();
    });

    // --- DATA LAYER (Rastreamento extra) ---
    const trackEvent = (eventName, eventData) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, ...eventData });
    };

    document.querySelectorAll('.whatsapp-float, #track-wa').forEach(btn => {
        btn.addEventListener('click', () => trackEvent('generate_lead', { lead_type: 'whatsapp_click', source: 'portfolio' }));
    });

    const emailBtn = document.getElementById('track-email');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => trackEvent('generate_lead', { lead_type: 'email_click', source: 'portfolio' }));
    }

    // --- INTEGRAÇÃO FIRESTORE E WHATSAPP ---
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        // Função async para aguardar a gravação no Firebase
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = leadForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerText;
            
            const name = document.getElementById('lead-name').value;
            const email = document.getElementById('lead-email').value;
            const message = document.getElementById('lead-message').value;

            btnSubmit.innerText = 'Salvando no banco de dados...';
            btnSubmit.style.opacity = '0.8';

            try {
                // 1. Grava no Firebase Firestore
                await addDoc(collection(db, "leads"), {
                    nome: name,
                    email: email,
                    mensagem: message,
                    data_envio: serverTimestamp() 
                });

                // 2. Dispara evento pro Analytics
                trackEvent('form_submission', { form_id: 'contact_form', lead_status: 'captured_and_redirecting' });

                // 3. Abre o WhatsApp com a mensagem pronta
                btnSubmit.innerText = 'Abrindo WhatsApp...';
                const numeroWhatsApp = '5562999593986';
                const textoWhatsApp = `Olá Natan! Vim pelo seu portfólio.\n\n*Nome:* ${name}\n*E-mail:* ${email}\n*Projeto/Objetivo:* ${message}`;
                const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;
                
                setTimeout(() => {
                    window.open(linkWhatsApp, '_blank'); 
                    btnSubmit.innerText = 'Redirecionado com Sucesso!';
                    btnSubmit.style.backgroundColor = '#25D366'; 
                    btnSubmit.style.opacity = '1';
                    leadForm.reset();
                    
                    setTimeout(() => {
                        btnSubmit.innerText = originalText;
                        btnSubmit.style.backgroundColor = '';
                    }, 4000);
                }, 800);

            } catch (error) {
                console.error("Erro ao salvar lead no Firebase: ", error);
                alert("Ocorreu um pequeno erro de rede. Por favor, tente enviar novamente ou chame diretamente no botão do WhatsApp!");
                btnSubmit.innerText = originalText;
                btnSubmit.style.opacity = '1';
            }
        });
    }

    // --- MENU ATIVO DURANTE O SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.3 };

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

    sections.forEach(section => observer.observe(section));
});
