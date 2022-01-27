const router = require("express").Router()
const User = require('../models/User')
const Crypto = require('crypto-js')
const jwt = require('jsonwebtoken')


//Register New User
router.post('/register', async (req, res) => {
    const Myusers = new User({
        username: req.body.username,
        email: req.body.email,
        password: Crypto.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    })
    try {
        const users = await Myusers.save()
        res.status(200).json(users)
    } catch (err) {
        res.status(401).send("Can't login", err)
    }
})

//Existing User Sign in
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });

        !user && res.status(401).json("Wrong Password/Username")

        const bytes = Crypto.AES.decrypt(user.password, process.env.SECRET_KEY)
        const orignalPassword = bytes.toString(Crypto.enc.Utf8)

        orignalPassword !== req.body.password && res.status(500).json("Wrong Username/Password")
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.SECRET_KEY, {
            expiresIn: "5d"
        })

        const {
            password,
            ...info
        } = user._doc

        res.status(200).json({
            ...info,
            accessToken
        })
    } catch (err) {
        res.status(401).send("Wrong Email/Password")
    }
})
module.exports = router