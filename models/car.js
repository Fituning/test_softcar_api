const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { VentilationLevel, AirConditioningMode, DoorState, SoftwareStatus } = require('../enums/car_enum');
const {Schema} = require("mongoose");


const batterySchema = new Schema(
    {
        charge_level: { type: Number, required: true, default: 100 }, // en %
        battery_health: { type: Number, required: true, default: 100 }, // en %
        charging_time: { type: Number, required: false, default: 0 }, // en minutes
        charging_power: { type: Number, required: true, default: 0 } // en kW
    },
    {_id : false}
);

const airConditioningSchema = new Schema(
    {
        temperature: { type: Number, default: 20 },
        ventilation_level: { type: Number, enum: VentilationLevel, default: VentilationLevel.OFF },
        mode: { type: String, enum: AirConditioningMode, default: AirConditioningMode.OFF },
        ac_is_active: { type: Boolean, default: false},
        front_defogging: { type: Boolean, default: false },
        back_defogging: { type: Boolean, default: false }
    },
    {_id : false}
);

const carSchema = new Schema({
    vin: { type: String, required: true, unique: true }, // Numéro VIN unique
    // todo ajouter date de mis en circulation
    color: { type: String, required: true },
    kilometres: { type: Number, required: true, default:0 },
    last_interview: { type: String, required: false , default: null},
    software_status: { type: String, enum: SoftwareStatus, default: SoftwareStatus.UP_TO_DATE },
    average_consumption: { type: Number, required: true, default: 0 },
    remaining_range: { type: Number, required: true, default: 200 },//km
    gps_location: {
        type: [Number],
        required: true,
        default: [47.06612603801956, 7.107213090213195],
        validate: {
            validator: function(value) {
                return value.length === 2;
            },
            message: 'Position GPS doit contenir latitude et longitude'
        }
    },
    right_door: { type: String, enum: DoorState, default: DoorState.CLOSED },
    left_door: { type: String, enum: DoorState, default: DoorState.CLOSED },
    hood: { type: String, enum: DoorState, default: DoorState.CLOSED },
    charging_socket_is_connected: { type: Boolean, default: false },
    charge_is_activated: { type: Boolean, default: false },
    battery: {
        type: batterySchema,
        required: true,
        default: {
            charge_level: 100,
            battery_health: 100,
            charging_time: null,
            charging_power: 0
        }
    },
    air_conditioning: {
        type: airConditioningSchema,
        required: true,
        default: {
            temperature: 20,
            ventilation_level: VentilationLevel.OFF,
            mode: AirConditioningMode.OFF,
            ac_is_active: false,
            front_defogging: false,
            back_defogging: false
        }
    },
    ac_prog: [{ type: Schema.Types.ObjectId, ref: "ACProg" }],
    charge_prog: [{ type: Schema.Types.ObjectId, ref: "chargeProg" }]
});

carSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Car', carSchema);
