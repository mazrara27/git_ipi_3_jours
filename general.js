// 1. CHARGEMENT DU HEADER
fetch('header.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('header-placeholder').innerHTML = html;
    })
    .catch(error => console.error('Erreur lors du chargement du header:', error));

// 2. CHARGEMENT DES DONNÉES
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        document.querySelectorAll('.data-prenom').forEach(el => el.textContent = data.prenom);
        document.querySelectorAll('.data-nom').forEach(el => el.textContent = data.nom);
        document.querySelectorAll('.data-metier').forEach(el => el.textContent = data.metier);
        document.querySelectorAll('.data-email').forEach(el => el.textContent = data.email);
        document.querySelectorAll('.data-annee').forEach(el => el.textContent = data.annee);
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));

// 3. GESTION DU FORMULAIRE DE CONTACT
const formulaireContact = document.getElementById('contact-form');

if (formulaireContact) {
    
    // --- NOUVEAU : Pré-remplissage du message selon l'URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const offreChoisie = urlParams.get('offre');
    const champMessage = document.getElementById('message');

    if (offreChoisie && champMessage) {
        if (offreChoisie === 'classic') {
            champMessage.value = "Bonjour, je suis intéressé(e) par l'Offre Classic à 50€. Pourrions-nous en discuter ?";
        } else if (offreChoisie === 'pro') {
            champMessage.value = "Bonjour, je suis intéressé(e) par l'Offre Pro à 100€. Pourrions-nous en discuter ?";
        } else if (offreChoisie === 'ultra') {
            champMessage.value = "Bonjour, je souhaite obtenir un devis pour l'Offre Ultra Pro. Voici mon projet : ";
        }
    }
    // --------------------------------------------------------

    // Gestion de l'envoi du formulaire
    formulaireContact.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const formData = new FormData(this);
        const nom = formData.get('nom');
        const email = formData.get('email');
        const message = formData.get('message');

        const contenuFichier = `Date d'envoi: ${new Date().toLocaleString('fr-FR')}\n\nNom: ${nom}\nEmail: ${email}\n\nMessage:\n${message}`;

        const now = new Date();
        const dateStr = now.getFullYear() + "-" + 
                        String(now.getMonth() + 1).padStart(2, '0') + "-" + 
                        String(now.getDate()).padStart(2, '0') + "_" + 
                        String(now.getHours()).padStart(2, '0') + "-" + 
                        String(now.getMinutes()).padStart(2, '0') + "-" + 
                        String(now.getSeconds()).padStart(2, '0');
        
        const nomFichier = `contact_${dateStr}.txt`;

        const blob = new Blob([contenuFichier], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = nomFichier;
        document.body.appendChild(a);
        a.click(); 
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.reset();
        alert('Votre message a été généré sous forme de fichier !');
    });
}