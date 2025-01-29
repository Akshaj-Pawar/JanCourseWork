const img_form = document.getElementById("img_upload");
img_form.addEventListener('submit', async function(event){
    event.preventDefault();
    const imgFormData = new FormData(img_form)
    const img_key = String(imgFormData.get("selected_colour"))
    if (!imgFormData || img_key=='I havent finished the questions') {
        return;
    }
    const formJSON = JSON.stringify(Object.fromEntries(imgFormData.entries()))
    console.log(formJSON)
    const response = await fetch("/api/data/a_data/add_picture", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: formJSON
    });
    if (response.ok){
        const responseBody = await response.text();
        console.log("response from POST: ", responseBody)
        }
    else {
        alert( 'Problem with POST request ' + response.statusText);
    }
})