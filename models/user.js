const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {Schema} = require("mongoose");

const {NotificationMode, Theme} = require("../enums/car_enum");

const preferences = new Schema({
    theme: { type: String, enum: Theme, default: Theme.LIGHT },
    notifications: { type: String, enum: NotificationMode, default: NotificationMode.ON },
    language: { type: String, default: "fr" },
    selected_car: { type: Schema.Types.ObjectId, ref: "Car", required: false, default: null },
})

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    vehicle: [{ type: Schema.Types.ObjectId, ref: "vehicle" }],
    preferences: { type: preferences, default: () => ({}) },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);