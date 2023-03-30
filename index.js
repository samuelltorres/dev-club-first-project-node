
// control + c   =>  Para de rodar o servidor


const port = 3000
const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())


/*
        - Query params => meusite.com/users?nome=samuell&age=18   // FILTROS
        - Route params => /users/2    // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
        - Request Body => {"name":"Samuell","age":}

        - GET          => Buscar informação no back-end
        - POST         => Criar informação no back-end
        - PUT / PATCH  => Alterar/Atualizar informações no back-end
        - DELETE       => Deletar informaçoes no back-end

        - Middleware   => INTERCEPTADOR  => Tem o poder de parar ou alterar dados da requisição
*/


//  QUERY
/*
app.get('/users', (request, response) => {
    const {name,age} = request.query    // Esse padrao chama destructuring assignment

//  return response.json({name: name, age: age}) 
    return response.json({name, age})            // ESSA ABREVIAÇÃO SÓ FUNCIONA QUANDO OS VALORES SAO IGUAIS (CHAVE E VALOR TEM O MESMO NOME)
})
*/




//  ROUTE PARAMS
/*
app.get('/users/:id', (request, response) => {

    const {id} = request.params
    console.log(id)

//  return response.send('Hello Express')
    return response.json({id})
})
*/




// REQUEST BODY


const users = []

const checkUserId = (request, response, next) => {
    const {id} = request.params   //  Pega o id do usuario

    const index = users.findIndex(user => user.id === id)   // encontra qual posição o usuario está no array por meio do findIndex. (Se nao encontra ele responde como -1)

    if(index<0){
        return response.status(404).json({error: "User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.get('/users', (request, response) => {
    return response.json(users)
    
})

app.post('/users', (request, response) => {
    const {name, age} = request.body

    const user = { id: uuid.v4(), name, age}

    users.push(user)

    return response.status(201).json(user)
})

app.put('/users/:id', checkUserId, (request, response) => {
    const {name, age} = request.body    // Pega as informaçoes que quer atualizar (nome e idade)
    const index = request.userIndex
    const id = request.userId
    
    const updateUser = {id, name, age}    // cria o usuario atualizado
    
    users[index] = updateUser  // vai no array de usuarios, na posição do usuario e atualiza no updateUser
    return response.json(updateUser)   // retorna no insomnia o usuario atualizado
})

app.delete('/users/:id', checkUserId, (request, response) => {    
    const index = request.userIndex

    users.splice(index,1)   // deleta a pessoa com o id informado

    return response.status(204).json(users)   // responde como 204, mensagem de sucesso.
})








app.listen(port, () => {
    console.log(` 🚀  Server started on port ${port}`)
})