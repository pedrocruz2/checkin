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
        .then(data => {})
        .catch(err => console.log(err));    
}
var dataLogin = {
    email: document.getElementById('usernameLogin').value,
    senha: document.getElementById('passwordLogin').value
};

function verifyLogin() {
    fetch('http://localhost:6969/verify', { // presumindo que /login é o endpoint correto
        method: 'POST',
        body: JSON.stringify(dataLogin),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Erro de autenticação');
        }
    })
    .then(data => {
        // Aqui você pode redirecionar o usuário para outra página ou atualizar a UI
        // Por exemplo: window.location.href = "/dashboard";
    })
    .catch(err => {
        console.log(err);
        // Aqui, você pode informar o usuário sobre um erro de login, por exemplo, através de uma mensagem na tela.
    });
}

