const express = require('express');
//const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.static('client'));

//3 kinds of get methods over here:

let colour = 'Crimson: Speaks to a raw and passionate heart'

app.get("/final", function(req, resp){
    resp.send(colour)
})

app.listen(8080, () => console.log('Server running at http://127.0.0.1:8080/'));

//Bug: cannot load local resources (js files) even when moved into the client folder

//things to do:
//1) okay i feel like we have a server that exists so just do the weird ajax thing
//2) idek what this rest api nonsense is i think this is what i was trying to do here
//3) implement more sophisticated algorithm (stylistic, easy) - hopefully that fixes the eternal crimson bug
//4) add CSS styling
//add styling