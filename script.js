// script.js

// --- 0. FIREBASE IMPORTS ---
// We use the CDN version compatible with native browsers
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyAHPCLZcYTbNel2WlaI7KBuTYOmGJG2K_Q",
  authDomain: "natan-santiago-portfolio.firebaseapp.com",
  projectId: "natan-santiago-portfolio",
  storageBucket: "natan-santiago-portfolio.firebasestorage.app",
  messagingSenderId: "459285839610",
  appId: "1:459285839610:web:1e83944c8e44c1c5ef9343",
  measurementId: "G-NHRPHMMNBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Start Database

document.addEventListener('DOMContentLoaded', () => {

    // --- PRIVACY MODAL LOGIC ---
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

    // --- MOBILE NAV TOGGLE ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('is-open');
            navMenu.classList.toggle('is-open');
        });
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('is-open');
                navMenu.classList.remove('is-open');
            });
        });
    }

    // --- HEADER BORDER ON SCROLL ---
    const header = document.querySelector('.header');
    if (header) {
        const toggleHeaderState = () => {
            header.classList.toggle('is-scrolled', window.scrollY > 20);
        };
        toggleHeaderState();
        window.addEventListener('scroll', toggleHeaderState, { passive: true });
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- HERO CURSOR SPOTLIGHT ---
    const hero = document.querySelector('.hero');
    if (hero && !prefersReducedMotion) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            hero.style.setProperty('--x', `${x}%`);
            hero.style.setProperty('--y', `${y}%`);
        });
    }

    // --- DEVICE CAPABILITY CHECK ---
    const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const enableCursorFX = supportsFinePointer && !prefersReducedMotion;

    // --- SCROLL PROGRESS BAR + RAIL RULER SYNC ---
    const scrollProgress = document.querySelector('.scroll-progress');
    const railDot = document.querySelector('.rail-progress-dot');
    if (scrollProgress || railDot) {
        const updateProgress = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            if (scrollProgress) scrollProgress.style.width = `${progress}%`;
            if (railDot) railDot.style.top = `${progress}%`;
        };
        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    }

    // --- RAIL LIVE CLOCK (San Diego) ---
    const railTime = document.getElementById('railTime');
    if (railTime) {
        const updateClock = () => {
            const formatter = new Intl.DateTimeFormat('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Los_Angeles'
            });
            railTime.textContent = formatter.format(new Date());
        };
        updateClock();
        setInterval(updateClock, 30000);
    }

    // --- GLOBAL CURSOR SPOTLIGHT + CUSTOM CURSOR ---
    const spotlight = document.querySelector('.cursor-spotlight');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (enableCursorFX && spotlight) {
        document.body.classList.add('has-custom-cursor');
        let ringX = window.innerWidth / 2;
        let ringY = window.innerHeight / 2;
        let targetX = ringX;
        let targetY = ringY;

        document.addEventListener('mousemove', (e) => {
            document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
            document.documentElement.style.setProperty('--my', `${e.clientY}px`);
            spotlight.classList.add('is-active');
            targetX = e.clientX;
            targetY = e.clientY;
            if (cursorDot) cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });

        document.addEventListener('mouseleave', () => spotlight.classList.remove('is-active'));

        const animateRing = () => {
            ringX += (targetX - ringX) * 0.16;
            ringY += (targetY - ringY) * 0.16;
            if (cursorRing) cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateRing);
        };
        requestAnimationFrame(animateRing);

        document.querySelectorAll('a, button, .tilt-card, input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing && cursorRing.classList.add('is-active'));
            el.addEventListener('mouseleave', () => cursorRing && cursorRing.classList.remove('is-active'));
        });
    }

    // --- TILT CARDS (project / behance) ---
    if (enableCursorFX) {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(700px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-4px)`;
            });
            card.addEventListener('mouseleave', () => { card.style.transform = ''; });
        });
    }

    // --- MAGNETIC BUTTONS ---
    if (enableCursorFX) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${(x * 0.25).toFixed(1)}px, ${(y * 0.35).toFixed(1)}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    // --- SIGNAL CHART: SPARKLINE DRAW-IN ---
    const signalChart = document.querySelector('.signal-chart');
    if (signalChart) {
        const linePath = signalChart.querySelector('.line');
        if (linePath && linePath.getTotalLength) {
            const length = linePath.getTotalLength();
            signalChart.style.setProperty('--line-length', length);
        }
        const chartObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    signalChart.classList.add('is-drawn');
                    obs.disconnect();
                }
            });
        }, { threshold: 0.4 });
        chartObserver.observe(signalChart);
    }

    // --- SIGNAL PANEL: ANIMATED COUNTERS ---
    const statValues = document.querySelectorAll('.signal-stat-value[data-target]');
    if (statValues.length) {
        const animateCount = (el) => {
            const target = el.getAttribute('data-target');
            const prefix = el.getAttribute('data-prefix') || '';
            const suffix = el.getAttribute('data-suffix') || '';
            const numeric = parseFloat(target.replace(/[^0-9.]/g, '')) || 0;
            const isDecimal = target.includes('.');
            const duration = 1400;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = numeric * eased;
                el.textContent = prefix + (isDecimal ? current.toFixed(2) : Math.round(current).toLocaleString('en-US')) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            if (prefersReducedMotion) {
                el.textContent = prefix + target + suffix;
            } else {
                requestAnimationFrame(step);
            }
        };

        const statObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statValues.forEach(el => statObserver.observe(el));
    }

    // --- GSAP ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        if(document.querySelector('.hero-text')) {
            heroTimeline
             .from('.hero-text > *', { opacity: 0, y: 24, duration: 0.7, stagger: 0.12 })
             .from('.hero-visual, .hero-image', { opacity: 0, y: 16, duration: 0.8 }, "-=0.4");
        }

        window.addEventListener('load', () => {
            const sectionHeaders = document.querySelectorAll('.section-title, .section-mark');
            sectionHeaders.forEach(title => {
                gsap.from(title, { scrollTrigger: { trigger: title, start: 'top 90%', toggleActions: 'play none none none' }, opacity: 0, y: 24, filter: 'blur(4px)', duration: 0.7, ease: 'power2.out' });
            });

            const projectCards = document.querySelectorAll('.project-card, .bento-item, .case-item');
            projectCards.forEach((card, index) => {
                gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 95%', toggleActions: 'play none none none' }, opacity: 0, y: 30, filter: 'blur(6px)', duration: 0.6, delay: (index % 3) * 0.08, ease: 'power2.out' });
            });

            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                gsap.from(item, { scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' }, opacity: 0, x: -24, duration: 0.6, ease: 'power2.out' });
            });

            const skillItems = document.querySelectorAll('.skill-item');
            skillItems.forEach((skill, index) => {
                gsap.from(skill, { scrollTrigger: { trigger: skill, start: 'top 95%', toggleActions: 'play none none none' }, opacity: 0, y: 24, filter: 'blur(4px)', duration: 0.6, delay: (index % 3) * 0.08, ease: 'power2.out' });
            });

            gsap.from('.contact-container > *', { scrollTrigger: { trigger: '.contact-container', start: 'top 90%', toggleActions: 'play none none none' }, opacity: 0, y: 20, filter: 'blur(4px)', duration: 0.7, stagger: 0.12, ease: 'power2.out' });
            ScrollTrigger.refresh();
        });
    }

    // --- DATA LAYER (Extra Tracking) ---
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

    // --- FIRESTORE AND WHATSAPP INTEGRATION ---
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        // Function is now "async" to await the database response
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = leadForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.innerText;
            
            const name = document.getElementById('lead-name').value;
            const email = document.getElementById('lead-email').value;
            const message = document.getElementById('lead-message').value;

            // Visually change the button
            btnSubmit.innerText = 'Saving to database...';
            btnSubmit.style.opacity = '0.8';

            try {
                // 1. Tries to save data to Firebase ("leads" Collection)
                await addDoc(collection(db, "leads"), {
                    nome: name,
                    email: email,
                    mensagem: message,
                    data_envio: serverTimestamp() // Pulls exact server time
                });

                // 2. Notifies Analytics that the lead was successfully saved
                trackEvent('form_submission', { form_id: 'contact_form', lead_status: 'captured_and_redirecting' });

                // 3. Mounts and triggers WhatsApp
                btnSubmit.innerText = 'Opening WhatsApp...';
                const numeroWhatsApp = '5562999593986';
                const textoWhatsApp = `Hello Natan! I'm reaching out from your portfolio.\n\n*Name:* ${name}\n*E-mail:* ${email}\n*Project/Goal:* ${message}`;
                const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoWhatsApp)}`;
                
                setTimeout(() => {
                    window.open(linkWhatsApp, '_blank'); 
                    btnSubmit.innerText = 'Successfully Redirected!';
                    btnSubmit.style.backgroundColor = '#25D366'; 
                    btnSubmit.style.opacity = '1';
                    leadForm.reset();
                    
                    setTimeout(() => {
                        btnSubmit.innerText = originalText;
                        btnSubmit.style.backgroundColor = '';
                    }, 4000);
                }, 800);

            } catch (error) {
                // If there's a block or client internet failure
                console.error("Error saving lead to Firebase: ", error);
                alert("A minor network error occurred. Please try submitting again or reach out directly via the WhatsApp button!");
                btnSubmit.innerText = originalText;
                btnSubmit.style.opacity = '1';
            }
        });
    }

    // --- ACTIVE MENU DURING SCROLL ---
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