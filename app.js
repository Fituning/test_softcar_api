const express = require('express');
const mongoose = require('mongoose');



const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');


const bodyParser = require("express");
const app = express();

mongoose.connect('mongodb+srv://cazancoth:KQ3xZc5Lk2Avbfql@cluster0.cadku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

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


module.exports = app;