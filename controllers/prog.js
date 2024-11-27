const {ACProg,chargeProg, prog} = require("../models/prog");
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

exports.getAllProg = (progType, onlyActive = false) => {
    return async (req, res) => {
        const car = req.car; // Récupérer la voiture depuis le middleware
        try {
            // Construire le filtre de recherche
            const filter = {
                __t: progType,
                _id: { $in: [...car.ac_prog, ...car.charge_prog] }, // Correspondre aux programmations associées à la voiture
            };

            // Ajouter le filtre `is_active` si onlyActive est true
            if (onlyActive) {
                filter.is_active = true;
            }

            // Récupérer toutes les programmations correspondantes
            prog.find(filter).sort({ date_initial: 1 }).then(async (progs) => {
                const now = new Date();
                const today = now.getDay(); // Jour actuel (0: dimanche, 1: lundi, etc.)

                await progs.forEach((prog) => {
                    if (prog.date_final < now && prog.is_active && prog.repetition <= 0) {
                        prog.is_active = false;
                        prog.save(); // Mettre à jour la programmation dans la base de données
                    }
                })

                if(onlyActive){
                    await progs.map((p) => {
                        if (p.repetition && p.repetition.length > 0) {
                            // S'il y a des répétitions, calculer le prochain jour correspondant
                            const daysOfWeekMap = {
                                MON: 1,
                                TUE: 2,
                                WED: 3,
                                THU: 4,
                                FRI: 5,
                                SAT: 6,
                                SUN: 0,
                            };

                            const nextDay = p.repetition
                                .map((day) => daysOfWeekMap[day]) // Convertir les jours en numéros
                                .map((day) => (day >= today ? day : day + 7)) // Trouver les prochains jours
                                .sort((a, b) => a - b)[0]; // Prendre le plus proche

                            if (nextDay) {
                                const daysToAdd = nextDay - today;
                                const nextTrigger = new Date(now);
                                nextTrigger.setDate(now.getDate() + daysToAdd);
                                nextTrigger.setHours(p.date_initial.getHours(), p.date_initial.getMinutes());
                                p.next_trigger = nextTrigger; // Stocker la prochaine exécution
                            }
                        } else {
                            // Si pas de répétition, utiliser `date_initial` comme déclenchement
                            p.next_trigger = p.date_initial;
                        }
                        return p;
                    });
                }
                // // Trier les programmations par `next_trigger`
                // await progs.sort((a, b) => {
                //     return a.next_trigger - b.next_trigger;
                // });
                //
                //
                // // Si `onlyActive` est true, filtrer à nouveau les programmations pour ne renvoyer que les actives
                // const filteredProgs = onlyActive
                //     ? progs.filter((p) => p.is_active)
                //     : progs;

                // Trier les programmations par heure ou `next_trigger`
                const filteredProgs = onlyActive
                    ? progs.sort((a, b) => a.next_trigger - b.next_trigger)
                    : progs.sort((a, b) => {
                        const aTime = a.date_initial.getHours() * 60 + a.date_initial.getMinutes();
                        const bTime = b.date_initial.getHours() * 60 + b.date_initial.getMinutes();
                        return aTime - bTime;
                    });


                // Retourner les programmations
                return res.status(200).json(response(true, null, filteredProgs));
            }).catch((error) => {
                return res.status(400).json(response(false, null, null, error)); // Gérer les erreurs spécifiques
            });

        } catch (error) {
            // Gestion des erreurs générales
            return res.status(500).json({ success: false, error: error.message });
        }
    };
};


exports.toggleProgActivation = (req, res) => {
    const progId = req.body.id;
    const enabled = req.body.enabled;
    try {

        prog.findOne({ _id: progId }).then(prog => {
            if(enabled && prog.repetition.length <= 0) {
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
        res.status(500).json(response(false, null, null, error));
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

