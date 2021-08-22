const express = require('express');
const bodyParser = require("body-parser");
const awilix = require("awilix")

//authentication
const authentication = require("./authenticate/authentication")

//Hubs
const hubsManager = require("../bll/hubsManager")
const hubsRepository = require("../dal/hubsRepository")
const hubsRouter = require("./routers/hubs-router");
//Users
const usersManager = require("../bll/usersManager");
const usersRepository = require("../dal/usersRepository");
const usersRouter = require("./routers/usersRouter");
//log
const logManager = require("../bll/logManager");
const logRouter = require("./routers/logRouter");
//token
//const tokenRouter = require("./routers/token-router")

const sequelizeSetup = require("../dal/sequelizeSetup");


//Awilix container setup
const container = awilix.createContainer()
//container.register("tokenRouter",awilix.asFunction(tokenRouter))
container.register("authentication", awilix.asFunction(authentication))
container.register("hubsManager", awilix.asFunction(hubsManager))
container.register("hubsRepository", awilix.asFunction(hubsRepository))
container.register("hubsRouter", awilix.asFunction(hubsRouter))

container.register("usersManager", awilix.asFunction(usersManager))
container.register("usersRepository", awilix.asFunction(usersRepository))
container.register("usersRouter", awilix.asFunction(usersRouter))

container.register("logManager", awilix.asFunction(logManager))
container.register("logRouter", awilix.asFunction(logRouter))

container.register("db", awilix.asValue(sequelizeSetup))

//const theTokenRouter = container.resolve("tokenRouter")
const theHubsRouter = container.resolve("hubsRouter")
const theUsersRouter = container.resolve("usersRouter")
const theLogRouter = container.resolve("logRouter")

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    res.setHeader("Access-Control-Expose-Headers", "*")
    next()

})

/*request(options, function (error, response, body){
    if (error) console.log(error)

    console.log(body)
})*/

//bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

//jsonToken'

//app.use("/token", theTokenRouter)
app.use("/hubs", theHubsRouter)
app.use("/users", theUsersRouter);
app.use("/", theLogRouter)

app.listen(PORT, HOST);
