const Sequelize = require('sequelize')
const User = require('../apps/models/Users')
const Message = require('../apps/models/Messages')

const models = [User, Message];

const databaseConfig = require('../configs/db')

class Database {
    constructor(){
        this.init()
    }
    init(){
        this.connection = new Sequelize(databaseConfig)

        models
        .map((model) => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models))
    }
}

module.exports = new Database();