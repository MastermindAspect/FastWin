const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const session = require('express-session');
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



//use routers
app.use("/hubs", hubsRouter)
app.use("/users", usersRouter);

app.get('/', (req, res) => {
    const model = {title: "Home"}
    res.render("home", {model:model});
});

app.get('/login', (req, res) => {
    const model = {title: "Login"}
    res.render("login", model);
});

const usersManager = require('../bll/usersManager')

app.post('/login', (req, res) => {
    const email = req.body.loginEmail
    const password = req.body.loginPassword
    usersManager.loginUser(email, password, function(loginErrors) {
        if (loginErrors.length > 0) {
            const modal = {
                loginEmail: email,
                loginErrors
            }
            res.render("login", modal)
        } else {
            res.redirect("/")
        }
    })
    
})


app.listen(PORT, HOST);
