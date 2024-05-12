const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require("cookie-session");
const methodOverride = require('method-override');
//const cron = require('node-cron');
const cronjobs = require('./app/cronjobs/cronjob.js');

const axios = require('axios');


const app = express();

const hostName = "localhost";
const port = 3002;

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(cookieSession({
    name: "session",
    keys: ["secret-key"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours    
    secure: false,
    httpOnly: true,    
  }));




const  IndexRouter = require('./app/routes/IndexRoutes.js');
const UsersRouter = require('./app/routes/UserRoutes.js');
const LocationsRouter = require('./app/routes/LocationRoutes.js');
const DataloggersRouter = require('./app/routes/DataloggerRoutes.js');
const UploadRouter = require('./app/routes/UploadRoutes.js');




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', IndexRouter);
app.use('/users', UsersRouter);
app.use('/locations', LocationsRouter);
app.use('/dataloggers', DataloggersRouter);
app.use('/uploads', UploadRouter);
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('./public'));
app.use(methodOverride('_method'));


cronjobs.taskAlarm.stop();




app.listen(port, () => console.log(`App escuchando en http://${hostName}:${port}`));