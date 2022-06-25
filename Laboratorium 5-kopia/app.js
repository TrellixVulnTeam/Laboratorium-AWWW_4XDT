// const express = require('express');
import express from "express";
// Laboratorium 11

import { body, validationResult } from "express-validator";
import bodyParser from "body-parser";

// Koniec Laboratorium 11

const app = express();
const port = 3030;

app.set('view engine', 'pug');

app.use('/css', express.static('css'));

app.use('/images', express.static('images'));

// Laboratorium 9

const {Wycieczka, Zgloszenie} = await import ('./dummy.mjs')

const trip_list = await Wycieczka.findAll({order: [["data_poczatku", "ASC"]]});

// Koniec Laboratorium 9

let trip1 = ["Szczyt wszystkiego", "Krótka wycieczka z wejściem na ten właśnie szczyt.", "Cena: 17 USD"];
let trip2 = ["Dalekie morza", "Mórz jest wiele, więc i opis może być nieco dłuższy niż poprzednio. Atrakcji też może być więcej.", "Cena: 20 USD"];
let trip3 = ["Miasto", "Na świecie mamy jeszcze miasta. Można je zwiedzać.", "Cena: 30 USD"];
let list = [trip1, trip2, trip3];

app.get('/szablon', (req, res) => {
    res.render('mojszablon', {data:list});
})

app.get('/main', (req, res) => {
    res.render('main_page');
})

let index = 0;

app.get('/trip', (req, res) => {
    res.render('trip_page', {data:list, data1:index});
})

app.get('/trip_page1', (req, res) => {
    res.render('trip_page_with_index', {data:list, data1:0});
})

app.get('/trip_page2', (req, res) => {
    res.render('trip_page_with_index', {data:list, data1:1});
})

app.get('/trip_page3', (req, res) => {
    res.render('trip_page_with_index', {data:list, data1:2});
})

app.get('/form', (req, res) => {
    res.render('form');
})

// Laboratorium 9

app.use((req, res, next) => {
    res.locals.trips = trip_list;
    next();
});

// Koniec Laboratorium 9

// Laboratorium 11

app.get('/book/:id(\\d+)', (req, res) => {
    if (!res.locals.trips[req.params.id - 1]) {
        return res.status(400).send("Wycieczka o danym numerze id nie istnieje.");
    }
    res.locals.id = req.params.id;
    res.render('book');
})

app.use(express.json());

app.post('/book/:id(\\d+)',
    bodyParser.urlencoded({ extended: false }),
    body('name').notEmpty().withMessage('Must contain name.'),
    body('surname').notEmpty().withMessage('Must contain surname.'),
    body('email').notEmpty().withMessage('Must contain email.').isEmail().withMessage('Email must be correct.'),
    body('registration_number').notEmpty().withMessage('Must contain registration number.').isInt({min: 1})
        .withMessage('Registration number must br bigger than 0.'),
    async (req, res) => {

        res.locals.id = req.params.id;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const trip = await Wycieczka.findByPk(req.params.id);
        const available = trip.liczba_dostepnych_miejsc;

        if (available < req.body.registration_number) {
            return res.status(400).send("Brak dostępnych miejsc.");
        }

        trip.liczba_dostepnych_miejsc = available - req.body.registration_number;
        await trip.save();

        await Zgloszenie.create({
            imie: req.body.name,
            nazwisko: req.body.surname,
            email: req.body.email,
            liczba_miejsc: req.body.registration_number
        });

        res.render('book');
});

// Koniec Laboratorium 11

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});