require('dotenv').config();
const mqtt = require('mqtt');

// Utilise l'URL correcte pour le broker MQTT avec TLS/SSL
console.log(process.env.MQTT_DB_USER);

const client = mqtt.connect('mqtts://lb28a76a.ala.eu-central-1.emqxsl.com:8883', {
    // Ajoute les options si nécessaire (ex. : identifiants)
    username: process.env.MQTT_DB_USER, // Remplace par ton nom d'utilisateur si nécessaire
    password: process.env.MQTT_DB_PASSWORD  // Remplace par ton mot de passe si nécessaire
});

client.on('connect', () => {
    console.log('Connecté au broker MQTT');
});

client.on('error', (error) => {
    console.error('Erreur de connexion MQTT :', error);
});

// // Test de publication
// client.publish('test/topic', 'Hello MQTT', { qos: 1 }, (error) => {
//     if (error) {
//         console.error('Erreur lors de l\'envoi du message MQTT :', error);
//     } else {
//         console.log('Message de test MQTT envoyé');
//     }
// });

module.exports = client; // Exporter le client MQTT pour l'utiliser ailleurs
