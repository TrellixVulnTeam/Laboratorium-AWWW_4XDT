import express from "express";
import bcrypt from "bcrypt";
import session from "express-session";
import { body, validationResult } from "express-validator";
import bodyParser from "body-parser";
import getDB from "./database.mjs";

const app = express();
const port = 3033;

app.set('view engine', 'pug');

app.use(session({
    secret: 'keyboard cat'
}));

const db = await getDB();
const saltRounds = 10;

// Create a test trip
const trip2 = await db.Trip.create({
    name: "Trip 2",
    price: 308.9,
    description: "Desc2",
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

app.get('/login', (req, res) => {
    if (req.session.email) {
        return res.redirect('/successful_login');
    }
    res.render('login');
});

let get_trip_id = 1;

app.post('/successful_registration',
    bodyParser.urlencoded({ extended: false }),
    body('name').notEmpty().withMessage('Must contain name.'),
    body('surname').notEmpty().withMessage('Must contain surname.'),
    body('email').notEmpty().withMessage('Must contain email.').isEmail().withMessage('Email must be correct.'),
    body('password').notEmpty().withMessage('Must contain password.').isLength({ min: 5 }).withMessage('Password must have at least 5 letters.'),
    body('confirm_password').notEmpty().withMessage('Must contain confirmation password.')
        // Custom validator to check if password and confirm password are the same.
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        bcrypt.hash(req.body.password, saltRounds).then(async function (hash) {
            let user = await db.User.create({
                name: req.body.name,
                last_name: req.body.surname,
                email: req.body.email,
                password: hash,
            });
            // Give user one booking to display later on successful_login page.
            await db.Reservation.create({
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                number_of_seats: get_trip_id,
                myTripID: trip2.id,
                myUserID: user.id,
            });
            get_trip_id++;
        });

        res.render('successful_registration');
});

app.post('/successful_login',
    bodyParser.urlencoded({ extended: false }),
    body('email').notEmpty().withMessage('Must contain email.').isEmail().withMessage('Email must be correct.'),
    body('password').notEmpty().withMessage('Must contain password.').isLength({ min: 5 }).withMessage('Wrong password.'),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const user = await db.User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (user === null) {
            return res.status(400).send("User not found");
        }

        return bcrypt.compare(req.body.password, user.password, async function(err, result) {
            if (err) {
                return res.status(400).send(err);
            } else if (!result) {
                return res.status(400).send("Wrong password");
            }
            // Save user's email in session.
            req.session.email = req.body.email;
            // Get user's reservations to display.
            let reservations = await db.Reservation.findAll({
                where: {
                    email: req.body.email
                }
            });
            res.render('successful_login', { reservations });
        });

});

app.get('/successful_login', async (req, res) => {
    let reservations = await db.Reservation.findAll({
        where: {
            email: req.session.email
        }
    });
    res.render('successful_login', { reservations });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});