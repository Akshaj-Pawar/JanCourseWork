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

function log_answer()
{
    questions_answered++
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
    
    if (questions_answered > num_qs) {
        
        //normalise attribute_scores
        //attribute_scores[0] -= 10
        //attribute_scores[2] -= 10
        console.log(attribute_scores)

        colour_list = create_colour_list(attribute_scores[0], attribute_scores[1], attribute_scores[2])
        console.log(colour_list)
        fit_colour_key = find_fittest_colour(colour_list)

        fetch('http://127.0.0.1:8080/final?colour=' + fit_colour_key)
         .then(response => {
            if (response.ok) {
                return response.text()
            }
            else {
                document.getElementById('answer').innerHTML='Error: File does not exist'
            }})
         .then(body =>document.getElementById('answer').innerHTML=body)
         .catch((error) => {
            document.getElementById('answer').innerHTML='Error: Could not connect to server'
         })
    }
}

function update_question(index)
{
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
    //note that the flag feature has no been implemented, if it were to be implemented things wou;ld be reshuffled tor duce the bias
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