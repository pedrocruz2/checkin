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


function verifyLogin() {
    // Coletando os dados do formulário (assumindo que os IDs dos inputs são 'usernameLogin' e 'passwordLogin')
    const dataLogin = {
        email: document.getElementById('usernameLogin').value,
        senha: document.getElementById('passwordLogin').value
    };

    console.log(dataLogin);

    fetch('http://localhost:6969/verify', {
        method: 'POST',
        body: JSON.stringify(dataLogin),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro de autenticação');
        }
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
        // Aqui, você pode informar o usuário sobre um erro de login, por exemplo, através de uma mensagem na tela.
    });
}

