const express = require('express');
//const path = require('path');
const app = express();

app.use(express.static('client'));

//3 kinds of get methods over here:

let q_data = require("./data/q_data.json")
let a_data = require("./data/a_data.json")

app.get("/api/data/q_data/questiontext", function(req, resp){
    //get method for question text, takes questions_answered as a parameter
    const index = parseInt(req.query.index, 10);
    resp.send(q_data[0]["q"][index])
    //Api documentation, url, parameters, function description for each REST get and POST methods on a seperate HTMl page
})

app.get("/api/data/q_data/optiontext", function(req, resp){
    //get method for the text on the buttons, takes questions_answered and the button id as a parameter
    let opt = (req.query.option + '_text');
    const index = parseInt(req.query.index, 10);
    resp.send(q_data[0][opt][index])
})

app.get("/api/data/q_data/score", function(req, resp){
    //gets the score adjustments out of the database
    let opt = req.query.ans;
    let key = req.query.attributekey;
    const index = parseInt(req.query.index, 10);
    resp.send(String(q_data[0][opt][key][index]))
})

app.get("/final", function(req, resp){
    let colour = req.query.colour
    resp.send(a_data["Descriptions"][colour])
})

app.listen(8080, () => console.log('Server running at http://127.0.0.1:8080/'));

//things to do:
//1) okay i feel like we have a server that exists so just do the weird ajax thing
//2) idek what this rest api nonsense is i think this is what i was trying to do here
//3) implement more sophisticated algorithm (stylistic, easy) - hopefully that fixes the eternal crimson bug
//4) add CSS styling
//add styling