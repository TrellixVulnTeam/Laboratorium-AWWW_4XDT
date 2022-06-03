import { Sequelize, DataTypes } from 'sequelize';

// Połączenie z bazą danych - lepiej użyć Postgresa (zadanie 0, patrz również niżej)
// Czy to może skończyć się błędem?
const database = new Sequelize('postgres://jp418374:iks@lkdb:11212/bd');

// Zadanie 1
const Wycieczka = database.define('Wycieczka', {
  // Do uzupełnienia
});

// Zadanie 2
const Zgloszenie = database.define('Zgloszenie', {
  // Do uzupełnienia
});

// Zadanie 3
// Tu dodaj kod odpowiedzialny za utworzenie relacji pomiędzy modelami db.Wycieczka i db.Zgloszenie

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
