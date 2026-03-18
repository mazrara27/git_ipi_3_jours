document.addEventListener("DOMContentLoaded", () => {
    
    // ================= 1. FETCH DES COMPOSANTS (HEADER / FOOTER) =================
    
   async function loadComponent(elementId, filePath) {
    const container = document.getElementById(elementId);
    if (!container) return;

    try {
        const response = await fetch(filePath);
        const html = await response.text();
        container.innerHTML = html;

        // --- Logique spécifique pour le Footer ---
        if (elementId === 'footer-container') {
            const surpriseLink = document.getElementById('surprise-link');
            const modal = document.getElementById('video-modal');
            const video = document.getElementById('surprise-video');
            const closeBtn = document.querySelector('.close-modal');

            if (surpriseLink && modal && video) {
                surpriseLink.addEventListener('click', (e) => {
                    e.preventDefault(); // Empêche de suivre le lien #
                    modal.style.display = 'flex'; // Affiche la modale
                    
                    // FORCE LA LECTURE ICI
                    video.muted = false; // On retire le mute pour le son !
                    video.play().catch(error => {
                        console.log("Lecture auto bloquée, tentative en muted...");
                        video.muted = true;
                        video.play();
                    });
                });

                // Fermeture de la modale
                closeBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                    video.pause();
                    video.currentTime = 0;
                });
            }
        }
    } catch (error) {
        console.error("Erreur de chargement :", error);
    }
}

    // Fonction pour mettre en valeur le lien de la page actuelle
    function highlightActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            // Si le href du lien correspond à la fin de l'URL actuelle
            if (currentPath.includes(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });
    }

    // On lance le chargement
    loadComponent('header-container', 'navigation.html');
    loadComponent('footer-container', 'footer.html');


    // ================= 2. GESTION DU FORMULAIRE (page contact.html) =================
    
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Empêche le rechargement brutal
            alert("Merci ! Votre message a bien été validé par le HTML et soumis avec succès.");
            contactForm.reset();
        });
    }
});
// Fonction pour initialiser la surprise une fois le footer chargé
function initSurpriseVideo() {
    const surpriseLink = document.getElementById('surprise-link');
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('surprise-video');
    const closeBtn = document.querySelector('.close-modal');

    if (surpriseLink && modal && video) {
        surpriseLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            video.play(); // Lance la vidéo automatiquement
        });

        // Fermer la modale
        const closeModal = () => {
            modal.style.display = 'none';
            video.pause(); // Arrête la vidéo
            video.currentTime = 0; // Remet au début
        };

        closeBtn.addEventListener('click', closeModal);
        
        // Fermer si on clique en dehors de la vidéo
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

// MISE À JOUR de ta fonction loadComponent existante :
// Dans loadComponent('footer-container', 'footer.html'), 
// appelle initSurpriseVideo() juste après container.innerHTML = html;
// 1. APPLICATION IMMÉDIATE DU THÈME (AVANT LE CHARGEMENT DU DOM)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

document.addEventListener("DOMContentLoaded", () => {
    
    // Fonction pour gérer le switch de thème
    function initThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        const themeIcon = toggleBtn.querySelector('i');
        const themeText = document.getElementById('theme-text');

        // Mise à jour visuelle du bouton selon l'état actuel
        const updateBtnUI = () => {
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.className = 'fas fa-sun';
                themeText.innerText = 'Mode Clair';
            } else {
                themeIcon.className = 'fas fa-moon';
                themeText.innerText = 'Mode Sombre';
            }
        };

        updateBtnUI(); // Appel initial

        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Sauvegarde du choix
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            updateBtnUI();
        });
    }

    // MODIFICATION DE TA FONCTION LOADCOMPONENT EXISTANTE
    async function loadComponent(elementId, filePath) {
        const container = document.getElementById(elementId);
        if (!container) return;

        try {
            const response = await fetch(filePath);
            const html = await response.text();
            container.innerHTML = html;

            // Si on vient de charger le header, on initialise le bouton de thème
            if (elementId === 'header-container') {
                initThemeToggle();
                highlightActiveLink();
            }
            
            // Si c'est le footer, on initialise la vidéo surprise
            if (elementId === 'footer-container') {
                initSurpriseVideo();
            }
        } catch (error) {
            console.error("Erreur Fetch : ", error);
        }
    }

    loadComponent('header-container', 'navigation.html');
    loadComponent('footer-container', 'footer.html');
});