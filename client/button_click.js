let online = true;
questions_answered = 0
num_qs = 10
X = [0, 0, 0]
ABorC = 'A'
let attribute_scores = [0, 0, 0]
let attribute_keys = ['Warmth', 'Grace', 'Virtuosity']
let flags = 
{
    'Lover': 0,
    'Explorer': 0,
    'Survivor': 0,
    'Feral': 0,
    'Hero': 0,
    'Dreamer': 0,
    'Healer': 0,
    'Orderly': 0,
    'Wistful': 0,
    'Utilitarian': 0,
    'At Peace': 0
    //currently this feature is not in use
}


//this is the parent function called upon each button press, most other functions will be called by it, including the functions that update the text shown on screen and the colour scores that determine final colour assignment
async function log_answer()
{
    //if statement ensures graceful handling of server disconnection by preventing the state of the program being changed while offline, otherwise changes are amde that aren't saved
    online = await getServerHealth();
    if (online)
    {
        questions_answered++
        //need to ensure you can't keep pressing buttons after we've run out of questions
        if (questions_answered <= num_qs){
            //updating scores
            for (let i = 0; i < 3; i++){
                key = attribute_keys[i];
                extract_score((questions_answered - 2), key, ans)
                .then(x_score => {
                    attribute_scores[i] += x_score;
                    console.log(attribute_scores[i])
                })
            }
            console.log(attribute_scores);
    
            //update title
            qstring = questions_answered.toString()
            new_title = 'Q'.concat(qstring, ": ")
            document.getElementById('title').innerHTML = new_title;
    
            //update question
            update_question(questions_answered - 1)
            
            //update the button texts
            button_ids = ['A', 'B', 'C', 'D', 'E', 'F']
            for (let i = 0; i < 6; i++) {
                option = button_ids[i];
                update_button(option, (questions_answered - 1))
              }
        }
        
        //this block is called after the last button press, it displays the details of the colour the user was assigned to
        if (questions_answered > num_qs) {
            
            console.log(attribute_scores)

            //the scores are plugged into fitness functions correspondign to each colour, the highest fitness colour is identified
            colour_list = create_colour_list(attribute_scores[0], attribute_scores[1], attribute_scores[2])
            console.log(colour_list)
            fit_colour_key = find_fittest_colour(colour_list)
            
            //updates a div to show the detaisl of the colour assigned
            fetch('http://127.0.0.1:8080/api/final?colour=' + fit_colour_key)
             .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    document.getElementById('answer').innerHTML='Error: File does not exist'
                }})
             .then(body =>document.getElementById('answer').innerHTML=body)
             .catch((error) => {
                document.getElementById('answer').innerHTML='Error: Could not connect to server'
             })

            console.log('just before list pictures: ' + fit_colour_key)

            //displays all images associated with the assigned colour
            list_pictures(fit_colour_key)
        }
    }
}

function update_question(index)
{
    //updates the question text
    const url = 'http://127.0.0.1:8080/api/data/q_data/questiontext?index=' + String(index);
    fetch(url)
         .then(response => {
            if (response.ok) {
                return response.text()
            }
            else {
                document.getElementById('question').innerHTML='Error: File does not exist'
            }})
         .then(body =>document.getElementById('question').innerHTML=body)
         .catch((error) => {
            document.getElementById('question').innerHTML='Error: Could not connect to server'
         })
}

function update_button(option, index)
{
    //called once for each button every new question, updates the display text of the button
    const url = 'http://127.0.0.1:8080/api/data/q_data/optiontext?index=' + String(index) + '&option=' + option;
    fetch(url)
         .then(response => {
            if (response.ok) {
                return response.text()
            }
            else {
                document.getElementById(option).innerHTML='Error: File does not exist'
            }})
         .then(body =>document.getElementById(option).innerHTML=body)
         .catch((error) => {
            document.getElementById(option).innerHTML='Error: Could not connect to server'
         })
}

function extract_score(index, key, ans)
{
    //called thrice every time an answer is submitted, retrieves the warmth, grace and virtuosity increments associated with the given question-option combination, see q_data for clarification
    const url = 'http://127.0.0.1:8080/api/data/q_data/score?index=' + String(index) + '&attributekey=' + key + '&ans=' + ans;
    
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => {
           if (response.ok) {
               return response.text()
           }
           else {
               console.log('Error: File does not exist')
               resolve(0)
           }})
        .then(body => {
            console.log(body);
            x_score = parseInt(body, 10);
            if (isNaN(x_score)) {
                console.log('Error: Response is not a valid number');
                resolve(0)
            } 
            else {
                resolve(x_score)
            }
        })
        .catch((error) => {
           console.log('Error: Could not connect to server')
           resolve(0)
        })
    })
}

function create_colour_list(W, G, V, flags)
{
    //plugs the three scores into fitness functions for each colour, then returns the object contianing all of them
    //note that the flag feature has not been implemented, if it were to be implemented things wou;ld be reshuffled tor duce the bias
    colour_list = {
        'Crimson': ((3*Math.sqrt(2) / 2)*W - (3*Math.sqrt(2) / 4)*G - (3*Math.sqrt(2) / 4)*V), //works
        'Scarlet': (Math.sqrt(5)*W), //too close to crimson for comfort, also the friendship + passion route is the only way to get to scarlet which isn't exactly what we want
        'Mahogany': (W - 2*V),
        'Afterglow': (-(1/2)*W + 2*G + (1/2)*V), //win
        'Fuchsia': ((3*Math.sqrt(2) / 4)*W + (3*Math.sqrt(2) / 4)*G + (3*Math.sqrt(2) / 2)*V), 
        'Tyrian': (2*V - G), 
        'Golden': (2*G + W), //way too clsoe to afterglow for comfort
        'Mint': ((3*Math.sqrt(2) / 4)*G - (3*Math.sqrt(2) / 4)*W - (3*Math.sqrt(2) / 2)*V), //didnt work, superseded by afterglow, too close to azure
        'Verdant': ((-2)*V - (1/2)*W - (1/2)*G), //overwhelmed by black, needs flags
        'Azure': (G - 2*W), 
        'Cerulean': ((-2)*W - G),
        'Black': ((-1)*Math.sqrt(5)*G) 
        //i feel like if we shift grace to more mean order and structure and elegance it solves a lot of these problems
    }
    return(colour_list)
}

function find_fittest_colour(colour_list)
{
    //finds the colour with highest fitness score form the colour list
    let colour_key_list = Object.keys(colour_list);
    let colour_funct_list = Object.values(colour_list);
    let max_value = -100;
    let max_index = 0;
    for (let i = 0; i < colour_funct_list.length; i++){
        c_value = colour_funct_list[i];
        if (c_value > max_value){
            max_value = c_value;
            max_index = i;
        }
    }
    console.log(colour_key_list[max_index])
    return(colour_key_list[max_index])
}

function getServerHealth()
{
    //confirms whether the server is currently online
    const url = 'http://127.0.0.1:8080/api/health'

    return fetch(url)
        .then((response) => {
            if (response.ok) {
                return(true);
            }
            else {
                return(true);
            }
        })
        .catch((error) => {
            online = false;
            console.log(online);
            document.getElementById('question').innerHTML='Error: Could not connect to server';
            return(false);
         })
}

function list_colours(){
    //lists colour entities in a_data
    if (questions_answered > num_qs){
        const url = 'http://127.0.0.1:8080/api/data/a_data/colour_list';
        fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                document.getElementById('CL').innerHTML='Error: File does not exist';
            }
        })
        .then(body => {
            //displays a list of all colours to the user, just under the list button
            const container1 = document.getElementById('CL')
            container1.replaceChildren()
            for(let i = 0; i < body.length; i++) {
                let div_new = document.createElement("div")
                div_new.innerHTML = body[i]
                container1.appendChild(div_new)
            }
            //updates the form to include list of options
            const container2 = document.getElementById('colour_selection')
            container2.replaceChildren();
            for(let i = 0; i < body.length; i++) {
                let opt_new = document.createElement("option")
                opt_new.innerHTML = body[i]
                container2.appendChild(opt_new)
            }
        })
        .catch((error) => {
            document.getElementById('CL').innerHTML='Error: Could not connect to server';
        })
    }
}

function list_pictures(colour){
    //lists all pictures associated with a given colour
    const url = 'http://127.0.0.1:8080/api/data/a_data/picture_list?colour=' + colour;
    fetch(url)
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
        else {
            document.getElementById('CL').innerHTML='Error: File does not exist';
        }
    })
    .then(body => {
        const container = document.getElementById('pictures')
        container.replaceChildren()
        //listing involves creating many image elements via a for loop
        for(let i = 0; i < body.length; i++) {
            let img_new = document.createElement("img");
            img_new.alt = colour + ' ' + String(i);
            img_new.src = body[i]
            img_new.style.maxHeight = "100%";
            img_new.style.width = "auto"; 
            container.appendChild(img_new)
        }
    })
    .catch((error) => {
        document.getElementById('CL').innerHTML='Error: Could not connect to server';
    })
}