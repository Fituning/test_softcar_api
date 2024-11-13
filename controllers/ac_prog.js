const ACProg = require('../models/ac_prog');

exports.addACProg = (req, res) => {
    let repetition = req.body.repetition;
    if (typeof repetition === "string") {
        repetition = JSON.parse(repetition); // Convertir la chaîne en tableau
    }

    try{
        const newProg = new ACProg({
            name: req.body.name,
            temperature: req.body.temperature,
            date_initial: req.body.date_initial,
            date_final: req.body.date_final,
            ventilation_level: req.body.ventilation_level,
            repetition : repetition,
        })

        newProg.save().then(prog => {
            req.car.ac_prog.push(prog._id);
            req.car.save().then(
                (car) => {
                    car.populate("ac_prog") // Remplir le champ ac_prog avec les objets complets
                        .then(populatedCar => {
                            res.status(200).json(populatedCar); // Répondre avec la voiture et les programmations complètes
                        })
                        .catch(error => {
                            res.status(400).json({ error: "An error occurred while populating AC programs: \n" + error });
                        });
                }
            ).catch(
                (error) => {
                    prog.deleteOne();
                    res.status(400).json({ error : "An error occurred while saving new AC program : \n "+ error });
                }
            );
        }).catch(
            (error) => {
                res.status(400).json({ error : "An error occurred when creating new AC program : \n "+ error });
            }
        );
    }catch (error) {
        console.error("Erreur lors de l'ajout de la programmation :", error);
    }
}

