questions_answered = 0
cri_ans = 'ABBAC'
fuc_ans = 'BCACA'
ver_ans = 'CACBB'
num_qs = 5
X = [0, 0, 0]
ABorC = 'A'

function log_answer()
{
    questions_answered++
    if (ans == cri_ans[questions_answered-2]){
        crimson++
    }
    else if (ans == fuc_ans[questions_answered-2]){
        fuchsia++
    }
    else if (ans == ver_ans[questions_answered-2]){
        verdant++
    }
    //update title
    qstring = questions_answered.toString()
    new_title = 'Q'.concat(qstring, ": ")
    document.getElementById('title').innerHTML = new_title;
    //update question
    new_question_link = "file:///Users/akshajpawar/Desktop/WritingBlog/Questions/".concat(question_list[questions_answered - 1])
    x = document.getElementById('question')
    x.src = new_question_link
    
    if (questions_answered > num_qs) {
        if (crimson > 2){
            localStorage.setItem('colour', 'file:///Users/akshajpawar/Desktop/WritingBlog/Crimson.html');
        }
        if (fuchsia > 2){
            fetch_answer('Fuchsia.html')
        }
        if (verdant > 2){
            fetch_answer('Verdant.html')
        }
        window.location.href = "file:///Users/akshajpawar/Desktop/WritingBlog/final_page.html"
    }
}

function fetch_answer(file_string){
    fetch(file_string)
        .then(response => {
            console.log('Response received');
            alert('working');
            if (!response.ok) {
                throw new Error('Network response was not ok');
                }
            return response.text();
            })
        .then(data => {
            localStorage.setItem('colour', data);
            alert('working');
            })
        .catch(error => {
            console.error('Error fetching the HTML file:', error);
            });
}

function logarythm_answer(ABorC, questions_answered){
    questions_answered += 1;
    if (questions_answered >= num_qs)
    {
        document.addEventListener("DOMContentLoaded", function load_f_page() {
            fetch('final_page.html')
               .then(response => response.text())
               .then(template => {document.documentElement.innerHTML = template});
        })

    }
    if(ABorC == route1_answers[questions_answered - 1]) 
    {
        X[0] += 1;
        console.log('A')
    }
    if(ABorC == route1_answers[questions_answered - 1]) 
        {
            X[1] += 1;
            console.log('B')
        }
    if(ABorC == route1_answers[questions_answered - 1]) 
        {
            X[2] += 1;
            console.log('C')
        }
    document.addEventListener("DOMContentLoaded", function load_q_page() {
        fetch('question_page.html')
           .then(response => response.text())
           .then(template => {document.documentElement.innerHTML = template});
        console.log('fetched')
    })
}

log_answer(ABorC)