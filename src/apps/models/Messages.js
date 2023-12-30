const Sequelize = require('sequelize')
const { Model } = require('sequelize')

class Message extends Model{
    static init(sequelize){
        super.init(
            {
            text: Sequelize.STRING,
            userDestination: Sequelize.INTEGER,
            UserId: Sequelize.INTEGER
            },
            {
                sequelize
            }
        )

        return this;
    }

    static associate(models){
        this.belongsTo(models.User, {foreignKey: 'userId', as: 'user' })
    }
}

module.exports = Message