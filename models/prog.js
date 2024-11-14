const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const {VentilationLevel, DaysOfWeek} = require("../enums/car_enum");

const ProgSchema = new Schema({
    name: { type: String, required: false },
    is_active: { type: Boolean, required: true, default: true },
    date_initial: { type: Date, required: true, default: Date.now },
    date_final: { type: Date, required: true, default: Date.now },
    repetition: [{ type: String, enum: DaysOfWeek }],
},
    { _id: false }
);

const prog = mongoose.model("Prog", ProgSchema);

const ACProg = prog.discriminator(
    "ACProg",
    new Schema({
        temperature: {type: Number, required: true},
        ventilation_level: { type: Number, enum: VentilationLevel, default: VentilationLevel.LEVEL_2 },
    })
)

const chargeProg = prog.discriminator(
    "chargeProg",
    new Schema({
        charge_level : {type: Number, required: true},
    })
)

module.exports = {ACProg, chargeProg};