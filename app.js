const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const methodOverride = require('method-override');


const app = express();

const hostName = "localhost";
const port = 3001;

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

app.use(cookieSession({
    name: "session",
    keys: ["secret-key"],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours    
  }));


const  IndexRouter = require('./app/routes/IndexRoutes.js');
const UsersRouter = require('./app/routes/UserRoutes.js');
const LocationsRouter = require('./app/routes/LocationRoutes.js');
const DataloggersRouter = require('./app/routes/DataloggerRoutes.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', IndexRouter);
app.use('/users', UsersRouter);
app.use('/locations', LocationsRouter);
app.use('/dataloggers', DataloggersRouter);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('./public'));
app.use(methodOverride('_method'));



app.listen(port, () => console.log(`App escuchando en http://${hostName}:${port}`));