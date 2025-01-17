function createUser(){
    let username = document.getElementById('username').value;
    let pfp = document.getElementById('username').value
    const userStats ={
        username: username,
        pfp: pfp,
        results: 'None'
    };
    localStorage.setItem('user', JSON.stringify(userData));
}