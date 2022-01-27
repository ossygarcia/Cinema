const router = require('express').Router()
const User = require('../models/User')
const Crypto = require('crypto-js')
const verify = require('../Verify')


//UPDATE
router.put('/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = Crypto.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
        }
        try {
            const NewUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            })
            res.status(200).send(NewUser)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json("You can only Update your acccount")
    }

})

//DELETE
router.delete('/:id', verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).send("User deleted Successfully")
        } catch (err) {
            res.status(500).json("You are not Authorized !")
        }
    } else {
        res.status(400).json("You can only Update your acccount")
    }

})
//GET
router.get('/find/:id', verify, async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
        const {
            password,
            ...info
        } = users._doc
        res.status(200).send(info)
    } catch (err) {
        res.status(500).json("You are not Authorized !")
    }
})
//GET ALL USERS
router.get('/', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const query = req.query.key_users
        try {
            const users = query ? await User.find().limit(5) : await User.find()
            res.status(200).send(users)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json("Sorry, You are not authorized to view all users")
    }
})

//GET ALL STATISTICS
router.get('/stat',async (req, res) => {
    const today = new Date()
    const lastYear = today.setFullYear(today.setFullYear() - 1)

    const yearArray = [
        "January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
    try {
        const data = await User.aggregate([{
                $project: {
                    month: {
                        $month: "$createdAt"
                    }
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {
                        $sum: 1
                    }
                },
            },
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(401).json(err)
    }
})
module.exports = router