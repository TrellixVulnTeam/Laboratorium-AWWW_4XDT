const express = require('express');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('view engine', 'pug');

app.use('/css', express.static('css'));

app.use('/images', express.static('images'));

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

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});