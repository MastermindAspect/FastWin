const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const session = require('express-session');
const path = require('path');
const bodyParser = require("body-parser");
const redis = require("redis");
const redisClient = redis.createClient({host: 'redis', port: 6379});
const redisStore = require("connect-redis")(session)
const awilix = require("awilix")

//Hubs
const hubsManager = require("../bll/hubsManager")
const hubsRepository = require("../dal/hubsRepository")
const hubsRouter = require("./routers/hubs-router");
//Tournaments
const tournamentsManager = require("../bll/tournamentsManager");
const tournamentsRepository = require("../dal/tournamentsRepository");
const tournamentsRouter = require("./routers/tournaments-router");
//Users
const usersManager = require("../bll/usersManager");
const usersRepository = require("../dal/usersRepository");
const usersRouter = require("./routers/usersRouter");
//log
const logManager = require("../bll/logManager");
const logRouter = require("./routers/logRouter");
//posts
const postsManager = require("../bll/postsManager");
const postsRepository = require("../dal/postsRepository");
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

//session

app.use(session({
    store: new redisStore({client: redisClient}),
    secret: "something secret",
    saveUninitialized: false,
    resave: false
}))


//cookieparser
app.use(cookieParser());

//csrf
app.use(csrf({ cookie: true }));

app.use(function (req, res, next) {
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.userId = req.session.userId;
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
    try{
        const model = {title: "Home"}
        res.render("home", model);
    }
    catch(error){
        const model = {title: "Error", error}
        res.render("error.hbs", model);
    }
});



/*
app.post("/search", function(req,res){
    const searchWord = request.query.queryString;
    let schema = "SELECT * FROM Posts WHERE title LIKE ? OR Time Like ?";
    const pattern = '%' + searchWord + '%';
    let insertVariables = [pattern, pattern];
    let prevPage = request.query.p - 1;
    let nextPage = prevPage + 2;
    let showPosts = [];
    const postsCount = 3;
    const numberOfPages = Math.ceil(posts.length / postsCount);
    let offset = request.query.p * postsCount;
    if (nextPage >= numberOfPages) nextPage = numberOfPages - 1;
    if (prevPage < 0) prevPage = 0;
    for (var i = offset; i < offset + postsCount; i++) {
        if (posts[i]) showPosts.push(posts[i]);
    }
    let pages = [];
    for (i = 0; i < numberOfPages; i++) {
        pages.push(i + 1);
    }
    response.render('AllPosts', { posts: showPosts, previousPage: prevPage, nextPage: nextPage, pages: pages, errorList: error, q: searchWord });
})
*/


app.listen(PORT, HOST);
