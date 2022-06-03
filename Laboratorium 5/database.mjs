// Laboratorium 9

import {Sequelize, DataTypes, DATEONLY, INTEGER} from 'sequelize';

// Połączenie z bazą danych - lepiej użyć Postgresa (zadanie 0, patrz również niżej)
// Czy to może skończyć się błędem?
const database = new Sequelize('postgres://jp418374:iks@localhost:11212/bd');

// Zadanie 1
const Wycieczka = database.define('Wycieczka', {
    nazwa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    opis: {
        type: DataTypes.STRING(2000)
    },
    krotki_opis: {
        type: DataTypes.STRING
    },
    obrazek: {
        type: DataTypes.STRING
    },
    cena: {
        type: DataTypes.INTEGER
    },
    data_poczatku: {
        type: DataTypes.DATEONLY,
        validate: {
            isDateSmallerThanEnding(value) {
                if (value > this.data_konca) {
                    throw new Error("Data początku jest większa niż data końca.");
                }
            }
        }
    },
    data_konca: {
        type: DataTypes.DATEONLY
    },
    liczba_dostepnych_miejsc: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'wycieczki'
});

// Zadanie 2
const Zgloszenie = database.define('Zgloszenie', {
    imie: {
        type: DataTypes.STRING
    },
    nazwisko: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    liczba_miejsc: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'zgloszenia'
});

// Zadanie 3
// Tu dodaj kod odpowiedzialny za utworzenie relacji pomiędzy modelami db.Wycieczka i db.Zgloszenie
Wycieczka.hasMany(Zgloszenie);
Zgloszenie.belongsTo(Wycieczka);

await Wycieczka.sync({ force: true });
console.log("Tabela wycieczki została stworzona.");

await Zgloszenie.sync({ force: true });
console.log("Tabela zgloszenia została stworzona.");

// Zadania 4-6 w innych plikach

// ========================================
// Zadanie 0 - kontynuacja; proszę napisać kod poniżej, wg komentarzy

try {
    // Sprawdzenie poprawności połączenia (authenticate; co się dzieje, gdy błąd?)
    console.log('Nawiązuję połączenie z bazą...');
    await database.authenticate();
    console.log('Udało się.');

    // Jeśli modele zostały zmodyfikowane, to należy zmodyfikować tabele w bazie tak, by były zgodne.
    // Co się stanie z danymi? (sync)
    console.log('Synchronizuję modele z zawartością bazy...');
    await database.sync();
    console.log('Udało się.');
} catch (err) {
    // Nawiązywanie połączenia i synchronizacja mogły się nie udać, co wtedy?
    console.error(err.message);
    throw err;
}

export { database, Wycieczka, Zgloszenie };

// Koniec Laboratorium 9
