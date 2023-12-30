const { text } = require('express')
const Message = require('../models/Messages')
const User = require('../models/Users')

const crypto = require('crypto')
const moment = require('moment')
const { compare } = require('../../utils')

class MessageController{
    async send(req, res){
        const { text, userSend, userDestination } = req.body

        if(userSend === userDestination){
            return res.status(400).json({message: 'Você nã pode enviar mensagem para você mesmo!'})
        }

        const message = await Message.create({
            text: text,
            userId: userSend,
            userDestination: userDestination
        })

        const formattedData = {
            id: message.id,
            text: message.text,
            userId: message.userId
        }

        const receiver = crypto.createHash('md5').update(`${userDestination}`).digest('hex')
        req.io.emit(`${receiver}`, formattedData)

        return res.status(200).json(formattedData)
    }

    async listAllMessagens(req, res){
        const { userId, myId } = req.params

        const messageReceiver = await Message.findAll({
            raw: true,
            nest: true,
            attributes: ['id', 'text', 'createdAt'],
            include: [
                {
                    model: User, as: 'user',
                    attributes: ['name', 'id']
                }
            ],
            where: {
                userId: userId,
                userDestination: myId
            }
        })

        const messageSend = await Message.findAll({
            raw: true,
            nest: true,
            attributes: ['id', 'text', 'createdAt'],
            include: [
                {
                    model: User, as: 'user',
                    attributes: ['name', 'id']
                }
            ],
            where: {
                userId: myId,
                userDestination: userId
            }
        })

        const messages = [...messageReceiver, ...messageSend]

        if(messages.length === 0){
            return res.status(404).json({message: 'Sem mensagens para carregar!'})
        }

        const formattedData = []
        moment.locale('pt-br')

        for (const item of messages) {
            formattedData.push({
                id: item.id,
                text: item.text,
                hour: moment(item.createdAt).format('mm:ss'),
                user: item.user.name,
                userId: item.user.id
            })
        }

        formattedData.sort(compare)

        return res.status(200).json(formattedData)
    }
}

module.exports = new MessageController()