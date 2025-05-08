// Ajout d'un écouteur d'événement sur le bouton avec l'ID 'fetchBtn'
// Lorsque le bouton est cliqué, la fonction fetchData() est appelée
document.getElementById('fetchBtn').addEventListener('click', fetchData);

// Fonction asynchrone pour récupérer les données depuis l'API via l'endpoint '/competitions'
async function fetchData() {
    try {
        // Appel à l'API (ou au backend local) pour obtenir les compétitions
        const response = await fetch('/competitions');
        const data = await response.json();

        // Affichage des données récupérées
        displayData(data);
    } catch (err) {
        // En cas d'erreur lors de la récupération, affiche un message dans la console
        console.error('Erreur :', err);

        // Affiche un message d’erreur dans le conteneur HTML pour l’utilisateur
        document.getElementById('data-container').innerHTML = 
            '<p>Erreur lors de la récupération des données. Veuillez réessayer.</p>';
    }
}

// Fonction qui insère dynamiquement les données des compétitions dans le HTML
function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // Vide le conteneur avant d'y insérer du contenu

    // Vérifie si le tableau "competitions" est présent dans les données
    if (data.competitions) {
        data.competitions.forEach(competition => {
            
            // Création d'un élément HTML pour chaque compétition
            const card = document.createElement('div');
            card.className = 'competition-card'; 

            // Contenu HTML de la carte
            card.innerHTML = `
                <h3>${competition.name}</h3>
                <p><strong>Code :</strong> ${competition.code || 'N/A'}</p>
                <p><strong>Type :</strong> ${competition.type}</p>
                <p><strong>Zone :</strong> ${competition.area.name}</p>
            `;

            // Ajout de la carte au conteneur
            container.appendChild(card);
        });
    } else {
        // Si aucune donnée disponible, afficher un message à l'utilisateur
        container.innerHTML = '<p>Aucune donnée de compétition disponible.</p>';
    }
}

// Lors du chargement initial de la page, essaie de charger des données locales (offline fallback)
window.onload = async () => {
    try {
        const response = await fetch('/local-data');
        const data = await response.json();

        // Si des compétitions sont trouvées localement, on les affiche
        if (data.competitions) displayData(data);
    } catch (err) {
        // En cas d'erreur (fichier non trouvé, etc.), affiche un message dans la console
        console.log('Aucune donnée locale trouvée.');
    }
};
