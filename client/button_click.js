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
    if (questions_answered <= num_qs){
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
        new_question_link = "Questions/".concat(question_list[questions_answered - 1])
        x = document.getElementById('question')
        x.src = new_question_link
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