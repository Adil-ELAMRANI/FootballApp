// Importation des modules nécessaires
const express = require('express');
const fetch = require('node-fetch'); // Utilisé pour faire des requêtes HTTP
const fs = require('fs'); // Permet la lecture/écriture de fichiers
const path = require('path'); // Utilitaire pour manipuler les chemins de fichiers
const config = require('./config'); // Fichier de configuration (clé API, port, etc.)

const app = express();

// Sert les fichiers statiques (HTML, CSS, JS) depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route pour récupérer les compétitions depuis l'API externe
app.get('/competitions', async (req, res) => {
    const url = `https://api.football-data.org/v4/competitions`;

    try {
        // Requête vers l'API football-data.org avec la clé API
        const response = await fetch(url, {
            headers: { 'X-Auth-Token': config.API_KEY }
        });

        const data = await response.json();

        // Sauvegarde les données localement dans un fichier JSON
        fs.writeFile('competitions.json', JSON.stringify(data), (err) => {
            if (err) {
                // Si une erreur survient lors de l'enregistrement, renvoyer une erreur
                return res.status(500).send('Erreur lors de la sauvegarde du fichier.');
            }
            // Envoie les données au client
            res.json(data);
        });
    } catch (err) {
        // En cas d'erreur lors de la récupération depuis l'API
        res.status(500).send('Erreur lors de la récupération des données.');
    }
});

// Route pour afficher la page HTML principale
app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour lire les données sauvegardées localement (fallback si l'API ne fonctionne pas)
app.get('/local-data', (req, res) => {
    fs.readFile('competitions.json', 'utf8', (err, data) => {
        if (err) {
            // Si le fichier n'existe pas ou ne peut pas être lu
            return res.status(404).send({ error: 'Données non trouvées.' });
        }
        // Envoie les données locales au client
        res.json(JSON.parse(data));
    });
});

// Démarrage du serveur sur le port défini dans config.js
app.listen(config.PORT, () => {
    console.log(`Serveur démarré sur le port ${config.PORT}`);
});
