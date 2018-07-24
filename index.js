const express = require("express");
const basic_api = express();
//require bodyparser
const bodyParser = require("body-parser")


//---server data
const port = 3000;

//---json-parser config
basic_api.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
basic_api.use(bodyParser.json());


//---routes definition
const users = require("./routes/users");

//---routes usage
//this is the route
basic_api.use("/api/", users)

//---server listener
basic_api.listen(3000, ()=>{
    console.log("API service is up and running @ localhost:3000");
});