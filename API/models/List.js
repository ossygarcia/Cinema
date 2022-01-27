const mongoose = require('mongoose')

const ListSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        require: true
    },
    type: {
        type: String,
        require: true,
        unique: true
    },
    genre: {
        type: String,
        require: true
    },
    content: {
        type: Array,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('List', ListSchema)