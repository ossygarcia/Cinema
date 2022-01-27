const router = require('express').Router()
const Movie = require('../models/Movie')
const verify = require('../Verify')


//CREATE
router.post('/create', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body)
        try {
            const saveMovie = await newMovie.save()
            res.status(200).send(saveMovie)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json("You are not allow to Create Movie")
    }
})

router.put('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updateMovie = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            })
            res.status(200).send(updateMovie)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json("You can not Update Movies")
    }
})
//DELETE USER
router.delete('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await Movie.findByIdAndDelete(req.params.id)
            res.status(200).send("The Movie have been deleted Successfully")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(400).json("You are not allowed to delete movie")
    }
})
//GET MOVIES
router.get('/find/:id', verify, async (req, res) => {
    try {
        const users = await Movie.findById(req.params.id)
        res.status(200).send(users)
    } catch (err) {
        res.status(500).json(err)
    }
})
//GET RANDOM MOVIE
router.get('/random', verify, async (req, res) => {
    const type = req.query.type
    let movie;
    try {
        if (type === "series") {
            movie = await Movie.aggregate([{
                    $match: {
                        isSeries: true
                    },
                },
                {
                    $sample: {
                        size: 1
                    }
                }
            ])
        } else {
            movie = await Movie.aggregate([{
                    $match: {
                        isSeries: false
                    },
                },
                {
                    $sample: {
                        size: 1
                    }
                }
            ])
        }
        res.status(200).json(movie)
    } catch (err) {
        console.log(err)
    }
})

//GET ALL MOVIES
router.get('/', verify, async (req, res) => {
    try {
        const movie = await Movie.find()
        res.status(200).send(movie.reverse())
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router