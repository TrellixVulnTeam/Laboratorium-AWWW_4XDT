// const { Sequelize, DataTypes } = require('sequelize');
//
// // Połączenie z bazą danych
// const sequelize = new Sequelize('postgres://jp418374:iks@lkdb:11212/bd');
//
// const get_db = async () => {
//     try {
//
//         // Sprawdzenie poprawności połączenia
//
//         await sequelize.authenticate();
//         console.log('Connection to the database has been established successfully.');
//
//         const db = {};
//
//         db.sequelize = sequelize;
//
//         // Uzupełnij treść modułu wycieczka.js implementującego model Wycieczka
//         db.Wycieczka = require("./wycieczka.js")(sequelize, Sequelize, DataTypes);
//
//         // Uzupełnij treść modułu zgloszenie.js implementującego model Zgloszenie
//         db.Zgloszenie = require("./zgloszenie.js")(sequelize, Sequelize, DataTypes);
//
//         // Tu dodaj kod odpowiedzialny za utworzenie relacji pomiędzy modelami db.Wycieczka i db.Zgloszenie
//
//         // Synchronizacja
//         await db.sequelize.sync();
//
//         return db;
//     } catch (error) {
//         console.error(error.message);
//         throw error;
//     }
// };
//
// module.exports = get_db;