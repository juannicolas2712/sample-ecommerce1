const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error ('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        validate(value){
            if(value.length <= 6){
                throw new Error('Password length must be greater than 6')
            }

            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not include the word password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer //type of data for the image
    }
},{
    timestamps: true
})

//virtual property: it's not a real field, and it's not stored in the database. It is a relationship between two entities
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){ //we don't have to call it! It's called whenever an object is stringified
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}

// methods can be used by instances of the object
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

// statics is used by the object
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next){
    const user = this  // not required, just to make it easier

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next() // if you don't type it the app will be running for ever, because it will not identify when is the moment before saving a user
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User