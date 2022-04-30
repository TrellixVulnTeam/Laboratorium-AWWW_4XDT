import express from 'express';

let app = express();
app.get('/strona-testowa', (req, res) => {
    res.status(200).send('') });

app.listen(8080);