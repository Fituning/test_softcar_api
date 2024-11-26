require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');



const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');
const acProgRoutes = require('./routes/ac_prog');
const chargeProgRoutes = require('./routes/charge_prog');


const bodyParser = require("express");
const app = express();

mongoose.connect('mongodb+srv://'+process.env.MONGO_DB_USER+':'+process.env.MONGO_DB_PASSWORD+'@'+process.env.MONGO_DB_URI+'/'+ process.env.MONGO_DB_NAME +'?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée !'+ error.message));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json()); //pour un body en json
app.use(bodyParser.urlencoded({ extended: true })); // pour un body en x-www-form-urlencoded


app.use('/api/auth', userRoutes);
app.use('/api/car', carRoutes);
app.use('/api/ac_prog', acProgRoutes);
app.use('/api/charge_prog', chargeProgRoutes);


module.exports = app;