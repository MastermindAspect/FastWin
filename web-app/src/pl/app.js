const express = require('express');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const session = require('express-session');
const path = require('path');
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");
const awilix = require("awilix")

//Hubs
const hubsManager = require("../bll/hubsManager")
const hubsRepository = require("../dalMySQL/hubsRepository")
const hubsRouter = require("./routers/hubs-router");
//Tournaments
const tournamentsManager = require("../bll/tournamentsManager");
const tournamentsRepository = require("../dalMySQL/tournamentsRepository");
const tournamentsRouter = require("./routers/tournaments-router");
//Users
const usersManager = require("../bll/usersManager");
const usersRepository = require("../dalMySQL/usersRepository");
const usersRouter = require("./routers/usersRouter");
//log
const logManager = require("../bll/logManager");
const logRouter = require("./routers/logRouter");
//posts
const postsManager = require("../bll/postsManager");
const postsRepository = require("../dalMySQL/postsRepository");
const postsRouter = require("./routers/postsRouter");

const dashboardContent = require("./js/dashboard-sidemenu");

const sequelizeSetup = require("../dal/sequelizeSetup");


//Awilix container setup
const container = awilix.createContainer()
container.register("hubsManager", awilix.asFunction(hubsManager))
container.register("hubsRepository", awilix.asFunction(hubsRepository))
container.register("hubsRouter", awilix.asFunction(hubsRouter))
container.register("tournamentsManager", awilix.asFunction(tournamentsManager))
container.register("tournamentsRepository", awilix.asFunction(tournamentsRepository))
container.register("tournamentsRouter", awilix.asFunction(tournamentsRouter))
container.register("dashboardContent", awilix.asFunction(dashboardContent))

container.register("usersManager", awilix.asFunction(usersManager))
container.register("usersRepository", awilix.asFunction(usersRepository))
container.register("usersRouter", awilix.asFunction(usersRouter))

container.register("logManager", awilix.asFunction(logManager))
container.register("logRouter", awilix.asFunction(logRouter))

container.register("postsManager", awilix.asFunction(postsManager))
container.register("postsRepository", awilix.asFunction(postsRepository))
container.register("postsRouter", awilix.asFunction(postsRouter))

container.register("db", awilix.asValue(sequelizeSetup))

const theDashboardContent = container.resolve("dashboardContent")
const theTournamentsRouter = container.resolve("tournamentsRouter")
const theHubsRouter = container.resolve("hubsRouter")
const theUsersRouter = container.resolve("usersRouter")
const theLogRouter = container.resolve("logRouter")
const thePostsRouter = container.resolve("postsRouter")

const theHubsManager = container.resolve("hubsManager")
const theTournamentsManager = container.resolve("tournamentsManager")

//TODO: ADD dashboardContent into a cookie and modify when needed, that way we wont have to run the function everytime we 
//render a view.

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

//added equal helper

Handlebars.registerHelper('if_eq', function(a, b, options) {
    if(a === b)
        return options.fn(this);
    else
        return options.inverse(this);
});


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
app.use(cookieParser());

//csrf
app.use(csrf({ cookie: true }));

app.use(function (req, res, next) {
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.username;
    res.locals.csrfToken = req.csrfToken();

    theDashboardContent.getDashboardContent(req.session.userId,req.session.loggedIn,function(hubs,tournaments){
        res.locals.hubs = hubs
        res.locals.tournaments = tournaments
        next();
    })
});



app.use("/hubs", theHubsRouter)
app.use("/users", theUsersRouter);
app.use("/log", theLogRouter)
app.use("/posts", thePostsRouter)
app.use("/tournaments", theTournamentsRouter)
app.get('/', (req, res) => {
    theHubsManager.getAllHubs(function(hubs, dbError1) {
        theTournamentsManager.getAllTournaments(function(tournaments, dbError2) {
            if (dbError1 || dbError2) {
                console.log(dbError2)
                const model = {
                    error: [dbError1, dbError2]
                }
                res.render("error.hbs", model);
            } else {
                const randomHubs = []
                if (hubs.length > 3) {
                    let randomHub = Math.floor(Math.random() * hubs.length)
                    for (let i = 0; i < 3; i++){
                        randomHubs.push(hubs[randomHub])
                        randomHub++
                        if (randomHub == hubs.length) {
                            randomHub = 0
                        }
                    }
                } else {
                    for (hub in hubs) {
                        randomHubs.push(hubs[hub])
                    }
                }
                const randomTournaments = []
                if (tournaments.length > 3) {
                    let randomTournament = Math.floor(Math.random() * tournaments.length)
                    for (let i = 0; i < 3; i++){
                        randomTournaments.push(tournaments[randomTournament])
                        randomTournament++
                        if (randomTournament == tournaments.length) {
                            randomTournament = 0
                        }
                    }
                } else {
                    for (tournament in tournaments) {
                        randomTournaments.push(tournaments[tournament])
                    }
                }
                const model = {
                    title: "Home",
                    featuredHubs: randomHubs,
                    featuredTournaments: randomTournaments
                }
                    res.render("home", model);
            }
        })
    })
});

app.get('/about', (req, res) => {
    const modal = {
        title: "About"
    }
    res.render("about", modal);
})

app.listen(PORT, HOST);
