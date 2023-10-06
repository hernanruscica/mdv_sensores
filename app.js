const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');



const app = express();

const hostName = "localhost";
const port = 3001;

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');


const indexRouter = require('./app/routes/indexRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('./public'));


app.listen(port, () => console.log(`App escuchando en http://${hostName}:${port}`));