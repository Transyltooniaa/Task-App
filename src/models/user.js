const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/tasks')

// Here we are creating a new schema for the user This is done so that we can use the middleware function
// This is done so that we can use the middleware function
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        unique : true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },

    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },

    // Here we are creating a new field tokens which is an array of objects and each object contains a token
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
},{
    timestamps:true,
})


// Here we are creating a virtual property which is not stored in the database but it is used to create a relationship between two entities
// Here we are creating a virtual property which is not stored in the database but it is used to create a relationship between two entities
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})


// Here we are creating a new function to hide the password and tokens from the user 
userSchema.methods.generateAuthToken = async function(){

    // this is used to access the current user object
    const user = this;
    // USER._ID is a object and we are converting it to string because jwt.sign() takes string as a parameter  and thisismynewcourse is the secret key which is used to generate the token
    const token = jwt.sign({_id:user._id.toString()},'thisismynewcourse')
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}


userSchema.methods.getPublicProfile = function(){
    const user = this;
    const userObject = user.toObject();
    
    delete userObject.password;
    delete userObject.tokens;

    return userObject
}


// we are creating a new function to hide the password and tokens from the user
// statics is used to create a model method instead of instance method
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


//we are using normal function because we want to use this because arrow function don't bind this it is undefined

// Here we are creating a new middleware function to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    const user = this
    
    // Here we are checking if the password is modified or not if it is modified then we are hashing it
    // isModified is a function which is provided by mongoose which returns true if the password is modified else it returns false
    // We are using this because we don't want to hash the password again and again when we are updating the user
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    // next is used to tell the program that the middleware function is over and we can move to the next function
    next()
})


// Here we are creating a new middleware function to delete the tasks of the user before deleting the user
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})


// Here we are creating a new model for the user
const User = mongoose.model('User', userSchema);



module.exports = User
