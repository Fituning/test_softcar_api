const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const {VentilationLevel, DaysOfWeek} = require("../enums/car_enum");

const ACProgSchema = new Schema({
    name: { type: String, required: false },
    is_active : {type: Boolean, required : true, default: true},
    temperature: {type: Number, required: true},
    date_initial: {type: Date, required: true, default: Date.now},
    date_final: {type: Date, required: true, default: Date.now},
    ventilation_level: { type: Number, enum: VentilationLevel, default: VentilationLevel.LEVEL_2 },
    repetition: [{type: String, enum: DaysOfWeek}],
})

module.exports = mongoose.model("ACProg", ACProgSchema);