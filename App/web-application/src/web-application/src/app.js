const express = require('express');
const handlebars = require("handlebars");
const exphbs = require('express-handlebars');
const path = require("path");
const mysql = require("mysql")

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
const db = mysql.createConnection({
    host: "db",
    user: "root",
    passsword: "abc123",
    database: "myDB"
})
//Initialize handlebars
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultLayout: 'base',
    layoutsDir: __dirname + '/pl/src/views/layouts/',
    partialsDir: __dirname + '/pl/src/views/partials/'
}));
app.set('views', path.join(__dirname, '/pl/src/views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/pl/src/public/'));
app.use(express.static(__dirname + '/pl/src/js'));

app.use(express.json());


const db = mysql.createConnection({
    host: "db",
    user: "root",
    password: "abc123",
    database: "myDB"
})

app.get('/', (req, res) => {
    res.render("home", {title: "Home"});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);