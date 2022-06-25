import express, { static as _static } from "express";
import _body_parser from "body-parser";
import { ValidationError } from "sequelize";
import { body, check, validationResult} from "express-validator";
import session from "express-session";
import { get_db_postgres } from "./database/database.mjs";
import { get_all_wycieczki, get_wycieczka } from "./database/queries.mjs";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const { urlencoded, json } = _body_parser;

export const app = express();
const port = 3000;
const saltRounds = 10;

app.set("view engine", "pug");
app.set("views", "./views");
app.use(_static("public"));

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(session({
    secret: 'keyboard cat'
}));

get_db_postgres().then((db) => {
  app.get("/", async (req, res, next) => {
    const all = await get_all_wycieczki(db);
    res.render("main", { trips: all });
  });

  const with_wycieczka =
    (init_transaction = false) =>
    async (req, res, next) => {
      let t = null;
      if (init_transaction) t = await db.sequelize.transaction();
      const { wycieczka, zgloszenia } = await get_wycieczka(db, req.params.id, t);
      if (!wycieczka) {
        next(new Error(`Nie można odnaleźć wycieczki z id: ${req.params.id}`));
      }
      res.locals.trip = wycieczka;
      res.locals.t = t;
      return next();
    };

  app.get("/trip/:id(\\d+)", with_wycieczka(), async (req, res, next) => {
    res.render("trip", { trip: res.locals.trip });
  });

  app.get("/book/:id(\\d+)", with_wycieczka(), async (req, res, next) => {
    console.log('WIOOWIW');
    res.render("book", { trip: res.locals.trip });
  });

  function parseErrors(mapped) {
    const parsed = {};
    Object.keys(mapped).forEach((key) => {
      parsed[`${key}_error`] = mapped[key].msg;
    });
    return parsed;
  }

  async function withCommit(t, callback) {
    await t.commit();
    return callback();
  }

  async function withRollback(t, callback) {
    await t.rollback();
    return callback();
  }

  app.post(
    "/book/:id(\\d+)",
    with_wycieczka(true),
    check("email").isEmail().withMessage("Proszę wpisać poprawny email!"),
    check("first_name").notEmpty().withMessage("Imię nie może być puste!"),
    check("last_name").notEmpty().withMessage("Nazwisko nie może być puste!"),
    check("n_people")
      .isInt({ min: 0 })
      .withMessage("Liczba zgłoszeń musi być większa od 0!"),
    async (req, res, next) => {
      const { trip } = res.locals;
      const { t } = res.locals;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return withRollback(t, () =>
          res.render("book", { ...{ trip }, ...parseErrors(errors.mapped()) })
        );
      }
      if (req.body.n_people > trip.liczba_dostepnych_miejsc) {
        return withRollback(t, () =>
          res.render("book", {
            trip,
            error_info: "Brak wystarczającej liczby wolnych miejsc!",
          })
        );
      }
      try {
        const zgloszenie = await db.Zgloszenie.create(
          {
            imie: req.body.first_name,
            nazwisko: req.body.last_name,
            email: req.body.email,
            liczba_miejsc: req.body.n_people,

          },
          { transaction: t }
        );
        await trip.addZgloszenie(zgloszenie);
        trip.liczba_dostepnych_miejsc -= req.body.n_people;
        await trip.save({ transaction: t });

        return withCommit(t, () =>
          res.redirect(`/book-success/${req.params.id}`)
        );
      } catch (error) {
        if (error instanceof ValidationError) {
          return withRollback(t, () =>
            res.render("book", {
              trip,
              error_info: "Wprowadzono niepoprawne dane!",
            })
          );
        }
        return withRollback(t, () =>
          res.render("book", { trip, error_info: "Nieznany błąd!" })
        );
      }
    }
  );

  app.get(
    "/book-success/:id(\\d+)",
    with_wycieczka(),
    async (req, res, next) => {
      res.render("book", {
        trip: res.locals.trip,
        info: "Z powodzeniem zarezerwowano wycieczkę!",
      });
    }
  );

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
                await db.Zgloszenie.create({
                    imie: user.name,
                    nazwisko: user.last_name,
                    email: user.email,
                    liczba_miejsc: 1,
                    WycieczkaId: 1,
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
                let reservations = await db.Zgloszenie.findAll({
                    where: {
                        email: req.body.email
                    }
                });
                res.render('successful_login', { reservations });
            });

        });

    app.get('/successful_login', async (req, res) => {
        let reservations = await db.Zgloszenie.findAll({
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

  app.use((err, req, res) => {
    res.render("error", { error: err });
  });

  app.use((err, req, res, next) => {
    res.render("error", { error: "Nie znaleziono strony o podanym adresie!" });
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
