const User = require('../models/Users')

class UserController {
    async insert(req, res){
        let user = await User.findOne({
            where: { email: req.body.email }
        })

        if(user){
            return res.status(400).json({message: 'Já existe um usuário com esse e-mail!'})
        }

        user = await User.create(req.body)
        const formattedData = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        return res.status(200).json(formattedData)
    }
}

module.exports = new UserController();