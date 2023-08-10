function registrarUsuario(){
var data = {
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
}
fetch('http://localhost:6969/register', {
    // Registra usuário na database
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => { })
        .catch(err => console.log(err));    
}
