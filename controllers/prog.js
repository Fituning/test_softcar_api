const {ACProg,chargeProg} = require("../models/prog");
const response = require('../utils');

function addProgram(req, res, carProgType, newProg) {

    try {
        newProg.save().then(prog => {
            req.car[carProgType].push(prog._id); // Ajouter l'ID de la programmation à la voiture
            req.car.save().then(car => {
                car.populate(carProgType) // Remplir le champ avec les objets complets
                    .then(populatedCar => {
                        res.status(200).json(populatedCar); // Répondre avec la voiture mise à jour
                    })
                    .catch(error => {
                        res.status(400).json({ error: `An error occurred while populating car: \n` + error });
                    });
            }).catch(error => {
                prog.deleteOne();
                res.status(400).json({ error: `An error occurred while saving the program: \n` + error });
            });
        }).catch(error => {
            res.status(400).json({ error: `An error occurred when creating the program: \n` + error });
        });
    } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred: " + error.message });
    }
}

exports.addACProg = (req, res) => {
    let repetition = req.body.repetition;
    if (typeof repetition === "string") {
        repetition = JSON.parse(repetition); // Convertir la chaîne en tableau
    }

    // todo check is DateTime are well ordered

    try{
        const newProg = new ACProg({
            name: req.body.name,
            temperature: req.body.temperature,
            date_initial: req.body.date_initial,
            date_final: req.body.date_final,
            ventilation_level: req.body.ventilation_level,
            repetition : repetition,
        })
        addProgram(req, res, "ac_prog", newProg)
    }catch (error) {
        console.error("Erreur lors de l'ajout de la programmation :", error);
    }
}

exports.addChargeProg = (req, res) => {
    let repetition = req.body.repetition;
    if (typeof repetition === "string") {
        repetition = JSON.parse(repetition); // Convertir la chaîne en tableau
    }

    // todo check is DateTime are well ordered

    try{
        const newProg = new chargeProg({
            name: req.body.name,
            date_initial: req.body.date_initial,
            date_final: req.body.date_final,
            repetition : repetition,
            charge_level : req.body.charge_level,
        })
        addProgram(req, res, "charge_prog", newProg)
    }catch (error) {
        console.error("Erreur lors de l'ajout de la programmation :", error);
    }
}

exports.toggleProgActivation = (req, res) => {
    const progId = req.body.id;
    const enabled = req.body.enabled;
    try {
        ACProg.findById(progId).then(prog => {
            if(enabled){
                // Récupérer la date actuelle comme base
                const now = new Date();

                // Si l'heure initiale est dans le passé, déplacer les deux dates à demain
                if (prog.date_initial < now) {
                    now.setDate(now.getDate() + 1);
                    prog.date_initial = copyTimeToNext(prog.date_initial, now);
                    prog.date_final = copyTimeToNext(prog.date_final, now);
                } else {
                    // Sinon, aligner uniquement les heures sur aujourd'hui
                    prog.date_initial = copyTimeToNext(prog.date_initial, now);
                    prog.date_final = copyTimeToNext(prog.date_final, now);
                }

                prog.is_active = enabled;
            }else{
                prog.is_active = enabled;
            }

            prog.save().then(prog => {
                res.status(200).json(response(true, null, prog));// todo check what to return
            }).catch(error => {
                res.status(400).json(response(false, null, null, error));//todo check error status
            })
        }).catch(error => {
            res.status(400).json(response(false, null, null, error));//todo check error status
        })

    } catch (error) {
        res.status(500).json({error: "An unexpected error occurred: " + error.message});
    }

}

function copyTimeToNext(sourceDate, baseDate) {
    // Récupérer l'heure, les minutes, les secondes et les millisecondes de la source
    const hours = sourceDate.getHours();
    const minutes = sourceDate.getMinutes();

    const newDate = new Date(baseDate);
    newDate.setHours(hours,minutes);

    return newDate;
}

