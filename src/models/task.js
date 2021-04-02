const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const taskSchema = new mongoose.Schema({
    description: {
        type: "String",
        required: true,
        trim: true
    },
    completed: {
        type: "Boolean",
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // it has to be exactly the same as it is written in models/user.js => mongoose.model('User', userSchema)
    }
}, {
    timestamps: true
})

// taskSchema.pre('save', async function (next){
//     const task = this  // not required, just to make it easier

//     console.log('before saving task!')

//     next() // if you don't type it the app will be running for ever, because it will not identify when is the moment before saving a user
// })

const Task = mongoose.model('Task', taskSchema)

module.exports = Task