const express = require('express');
//const path = require('path');
const app = express();

app.use(express.json())
app.use(express.static('client'));

app.get("/api/health", function(req, resp){
    resp.send('functionality moment')
})

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
    resp.json(a_data["Descriptions"][colour])
})

app.get("/api/data/a_data/colour_list", function(req, resp){
    list = Object.keys(a_data["Descriptions"])
    resp.json(list)
})

app.get('/api/data/a_data/picture_list', function(req, resp){
    let colour = req.query.colour
    list = Object.values(a_data["Image_URLs"][colour])
    resp.json(list)
})

app.post("/api/data/a_data/add_picture", function(req, resp){
    const url = req.body.image_url
    const post_key = req.body.selected_colour
    console.log(a_data["Image_URLs"][post_key])
    console.log(typeof a_data["Image_URLs"][post_key]);
    (a_data["Image_URLs"][post_key]).push(url)
    console.log(a_data["Image_URLs"][post_key])
})

app.listen(8080, () => console.log('Server running at http://127.0.0.1:8080/'));

//things to do:
//1) okay i feel like we have a server that exists so just do the weird ajax thing
//2) idek what this rest api nonsense is i think this is what i was trying to do here
//3) implement more sophisticated algorithm (stylistic, easy) - hopefully that fixes the eternal crimson bug
//4) add CSS styling
//add styling