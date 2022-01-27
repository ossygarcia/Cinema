const router = require('express').Router()
const List = require('../models/List')
const verify = require('../Verify')


//CREATE
router.post('/createList', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body)
        try {
            const list = await newList.save()
            res.status(200).send(list)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json("You are not allow to Create Movie")
    }
})
//GET ALL LIST MOVIES
router.get('/', verify, async (req, res) => {
    const typeQuery = req.query.type
    const genreQuery = req.query.genre
    let list = []

    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([{
                    $match: {
                        type: typeQuery,
                        genre: genreQuery
                    }
                }, {
                    $sample: {
                        size: 10
                    }
                }])
            } else {
                list = await List.aggregate([{
                    $match: {
                        type: typeQuery,
                    }
                }, {
                    $sample: {
                        size: 10
                    }
                }])
            }
        } else {
            list = await List.aggregate([{
                $sample: {
                    size: 10
                }
            }])
        }
        res.status(200).json(list)
    } catch (err) {
        res.status(500).json()
    }

})

module.exports = router