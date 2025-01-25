questions_answered = 0
cri_ans = 'ABBAC'
fuc_ans = 'BCACA'
ver_ans = 'CACBB'
num_qs = 10
X = [0, 0, 0]
ABorC = 'A'
let warmth = 0
let grace = 0
let virtosity = 0
let attribute_scores = [warmth, grace, virtosity]
let attribute_keys = ['Warmth', 'Grace', 'Virtosity']

function log_answer()
{
    questions_answered++
    if (questions_answered <= num_qs){
        //if (ans == cri_ans[questions_answered-2]){
        //    crimson++
        //}
        //else if (ans == fuc_ans[questions_answered-2]){
        //    fuchsia++
        //}
        //else if (ans == ver_ans[questions_answered-2]){
        //    verdant++
        //}

        //updating scores
        console.log(ans)
        for (let i = 0; i < 3; i++){
            score = attribute_scores[i]
            key = attribute_keys[i]
            score += 1
            //update_score((questions_answered - 2), score, key, ans)
        }
        console.log(attribute_scores)

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
        //if (crimson > 2){
        //    localStorage.setItem('colour', 'Crimson.html');
        //}
        //if (fuchsia > 2){
        //    fetch_answer('Fuchsia.html')
        //}
        //if (verdant > 2){
        //    fetch_answer('Verdant.html')
        //}
        fetch('http://127.0.0.1:8080/final')
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
                console.log("file exists probably")
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

function update_score(index, score, key, ans)
{
    const url = 'http://127.0.0.1:8080/api/data/q_data/score?index=' + String(index) + '&attributekey=' + key + '&ans=' + ans;
    fetch(url)
    .then(response => {
       if (response.ok) {
           console.log("file exists probably")
           return response.text()
       }
       else {
           console.log('Error: File does not exist')
       }})
    .then(body => {
        console.log(body);
        int_body = parseInt(body, 10);
        if (isNaN(int_body)) {
            console.log('Error: Response is not a valid number');
        } 
        else {
            score += int_body
        }
    })
    .catch((error) => {
       console.log('Error: Could not connect to server')
    })
}