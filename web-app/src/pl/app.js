const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const session = require('express-session');
const path = require('path');
const hubsManager = require("../bll/hubsManager")
const dashboardContent = require("./js/dashboard-sidemenu");
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
//static folders
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/js'));

//bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

//cookieparser

//csrf

//routers
const usersRouter = require('./routers/usersRouter');
const hubsRouter = require("./routers/hubs-router");
const tournamentsRouter = require("./routers/tournaments-router");
//use routers
app.use("/hubs", hubsRouter)
app.use("/users", usersRouter);
app.use("/tournaments", tournamentsRouter)
app.get('/', (req, res) => {
    //When user and session is implemented switch to getDashboardContent(userId, callback)
    /*
    try{
        dashboardContent.getDashboardContent(userId, function(hubs, tournaments){
            const model = {title: "Home", hubs, tournaments}
            console.log(model);
            res.render("home", model);
        })
    }
    catch(error){
        const model = {title: "Error", error}
        res.render("error.hbs", model);
    }
    */
    hubsManager.getAllHubs(function(hubs){

        const model = {title: "Home", hubs}
        console.log(model)
        res.render("home", model);
    })
});

app.listen(PORT, HOST);
