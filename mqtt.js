const mqtt = require('mqtt');

// Utilise l'URL correcte pour le broker MQTT avec TLS/SSL
const client = mqtt.connect('mqtts://lb28a76a.ala.eu-central-1.emqxsl.com:8883', {
    // Ajoute les options si nécessaire (ex. : identifiants)
    username: 'test_api', // Remplace par ton nom d'utilisateur si nécessaire
    password: '2AEB64THEFdik8N'  // Remplace par ton mot de passe si nécessaire
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
