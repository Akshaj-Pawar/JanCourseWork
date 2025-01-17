const express = require('express');
//const path = require('path');
const app = express();

app.use(express.static('client'));

//3 kinds of get methods over here:

//app.get("/", function(req, resp){
//
//})

//app.get('/api/data', (req, res) => {
//    res.json({ message: 'Hello from the server!' });
//});

//app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, 'question_page.html'));
//});

app.listen(8080, () => console.log('Server running at http://127.0.0.1:8080/'));

//things to do:
//1) okay i feel like we have a server that exists so just do the weird ajax thing
//2) idek what this rest api nonsense is i think this is what i was trying to do here
//3) implement more sophisticated algorithm (stylistic, easy) - hopefully that fixes the eternal crimson bug
//4) add CSS styling
//add styling