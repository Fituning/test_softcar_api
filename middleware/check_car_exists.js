const Car = require('../models/car'); // Importez le modèle de la voiture

module.exports = (req, res, next) => {
    // Vérification de l'ID de la voiture (car ID)
    const carId = req.params.id || req.query.id; // Supporte soit le paramètre de route, soit le query parameter
    if (!carId) {
        return res.status(400).json({ error: 'Car ID is required' });
    }

    // Vérifie si la voiture existe
    Car.findById(carId).then((car) => {
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        // else{
        //     res.status(200).json({ error: 'Car found' });
        // }

        // Continue vers la prochaine étape si la voiture existe
        req.car = car; // Stocke la voiture dans `req` pour l'utiliser dans le contrôleur
        next();
    }).catch((error) => {
        res.status(400).json({ error: 'Invalid Car ID' });
    });
};
