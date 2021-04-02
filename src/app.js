const path = require('path')
const express = require('express')

require('./db/mongoose')


//const userRouter = require('./routers/user')
//const taskRouter = require('./routers/task')

const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public/')
app.use(express.static(publicDirectoryPath))


// app.use(express.json()) /*automatically parse incoming json to an object so we can access it in our request handlers*/
// app.use(userRouter)
// app.use(taskRouter)




const mongoose = require('mongoose')
const produtoSchema = new mongoose.Schema({
    descr: {
        type: "String",
        required: true,
        trim: true
    },
    preco: {
        type: "Number",
        required: true,
        trim: true
    }
})

const Produto = mongoose.model('Produto', produtoSchema)

const p1 = new Produto ({
    descr: 'cadeira',
    preco: 15.74    
})

p1.save()

module.exports = app