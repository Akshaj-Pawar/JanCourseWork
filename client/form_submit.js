//this code is called when the form is submitted
const img_form = document.getElementById("img_upload");
img_form.addEventListener('submit', async function(event){
    event.preventDefault();
    //if statement to prevent trying to post if server is offline
    online = await getServerHealth();
    if (online){
        const imgFormData = new FormData(img_form)
        const img_key = String(imgFormData.get("selected_colour"))
        if (!imgFormData || img_key=='Click List Colours After Finishing All Questions') {
            //you can only submit this form after answering all questions
            return;
        }
        const formJSON = JSON.stringify(Object.fromEntries(imgFormData.entries()))
        console.log(formJSON)
        //posting
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
        //this displays all the images of the colour you submitted so the user can see that their psot succeeded
        console.log('listing1')
        list_pictures(img_key)
    }
    else {
        alert( 'Server is temporarily unavailable');
    }
})