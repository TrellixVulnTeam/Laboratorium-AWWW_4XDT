// Laboratorium 9

// Taka wersja import pozwoli obsłużyć ewentualne błędy...

const { database, Wycieczka, Zgloszenie } = await import('./database.mjs');

try {
    const wycieczka1 = await Wycieczka.create({
        nazwa: "Szczyt wszystkiego",
        krotki_opis: "Krótka wycieczka z wejściem na ten właśnie szczyt.",
        opis: "Tu kolejny fragment tekstu. Może się składać z kilku akapitów. W pierwszej wersji tekst na pewno nie będzie opływał obrazka, ale to poprawimy później.",
        obrazek: "./images/image1.jpg",
        cena: 17,
        data_poczatku: '2021-08-09',
        data_konca: '2021-10-12',
        liczba_dostepnych_miejsc: 12
    });

    const wycieczka2 = await Wycieczka.create({
        nazwa: "Dalekie morza",
        krotki_opis: "Mórz jest wiele, więc i opis może być nieco dłuższy niż poprzednio. Atrakcji też może być więcej.",
        opis: "Tu kolejny fragment tekstu. Może się składać z kilku akapitów. W pierwszej wersji tekst na pewno nie będzie opływał obrazka, ale to poprawimy później.",
        obrazek: "./images/image2.jpg",
        cena: 20,
        data_poczatku: '2021-09-15',
        data_konca: '2021-10-12',
        liczba_dostepnych_miejsc: 10
    });

    await Wycieczka.create({
        nazwa: "Miasto",
        krotki_opis: "Na świecie mamy jeszcze miasta. Można je zwiedzać.",
        opis: "Tu kolejny fragment tekstu. Może się składać z kilku akapitów. W pierwszej wersji tekst na pewno nie będzie opływał obrazka, ale to poprawimy później.",
        obrazek: "./images/image3.jpg",
        cena: 30,
        data_poczatku: '2021-10-23',
        data_konca: '2021-10-26',
        liczba_dostepnych_miejsc: 65
    });

    console.log("Stworzono wycieczkę 3");

    const zgloszenie1 = await Zgloszenie.create({
        imie: "Julia",
        nazwisko: "P",
        email: "ja@gmail.com",
        liczba_miejsc: 2
    });

    const zgloszenie2 = await Zgloszenie.create({
        imie: "Julia1",
        nazwisko: "P",
        email: "ja1@gmail.com",
        liczba_miejsc: 3
    });

    await wycieczka1.addZgloszenie(zgloszenie1);
    await wycieczka2.addZgloszenie(zgloszenie2);

    console.log("Stworzono wycieczkę i zgłoszenie 1");
    console.log("Stworzono wycieczkę i zgłoszenie 2");

} catch (err) {
    console.error(err.message);
    throw err;
}

export { Wycieczka, Zgloszenie };

// Koniec Laboratorium 9