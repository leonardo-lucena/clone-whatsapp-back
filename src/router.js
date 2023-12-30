const { Router } = require('express')
const UserController = require('./apps/controllers/UserController')

const routes = new Router()

routes.get('/health', (req, res) => {
    return res.send({ message: 'Connected with Success!'})
})

routes.post('/user', UserController.insert)

module.exports = routes