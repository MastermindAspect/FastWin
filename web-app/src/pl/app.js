const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');

const path = require('path');

const bodyParser = require("body-parser")

//TODO: ADD dashboardContent into a cookie and modify when needed, that way we wont have to run the function everytime we 
//render a view.

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

//Initialize handlebars
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'base',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

app.set('views', path.join(__dirname , '/views/'));

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/js/'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

//routers
const usersRouter = require('./routers/usersRouter');
const hubs_router = require("./routers/hubs-router");

//use routers
app.use("/hubs", hubs_router)
app.use("/users", usersRouter);

app.get('/', (req, res) => {
    const model = {title: "Home"}
    res.render("home", {model:model});
});

app.listen(PORT, HOST);
