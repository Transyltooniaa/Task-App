const jwt = require('jsonwebtoken')
const User = require('../models/user')



const auth = async (req, res, next) => {
    try{

        // Here we are extracting the token from the header and removing the bearer part
        const token = req.header('Authorization')?.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse');

        // Here tokens.token is used to find the user because we are storing the token in the tokens array 
        const user = await User.findOne({_id:decoded._id},{'tokens.token':token})
        if(!user){
            throw new Error()
        }

        // Here we are storing the token and user in the request object so that we can use it in the route handler
        // We are storing the token so that we can logout from a single device
        req.token = token
        req.user = user
        next()
    }

    catch(e){
        res.status(401).send({error:'Please authenticate'})
        console.log(e)
    }
}

module.exports = auth