const express = require('express');
const handlebars = require("handlebars");
const exphbs = require('express-handlebars');
const path = require("path");
const bodyParser = require("body-parser")
const mysql = require("mysql");
const dashboardContent = require("../src/pl/src/js/dashboard-sidemenu");

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
    layoutsDir: __dirname + '/pl/src/views/layouts/',
    partialsDir: __dirname + '/pl/src/views/partials/'
}));
app.set('views', path.join(__dirname , '/pl/src/views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/pl/src/public/'));
app.use(express.static(__dirname + '/pl/src/js'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
//routers
const hubs_router = require("./pl/src/js/hubs-router.js");

//use routers
app.use("/hubs", hubs_router)

app.get('/', (req, res) => {
    const model = {title: "Home", dashboardItems: dashboardContent.getDashboardContent()}
    res.render("home", {model:model});
});

app.listen(PORT, HOST);
