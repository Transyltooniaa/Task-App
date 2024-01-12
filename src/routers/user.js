const express = require('express')
const router = new express.Router()
const User = require('../models/user')



router.post('/users', async (req, res) => {
    
    const user = new User(req.body)
    console.log(req.body)
    
    try{
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/users', async(req, res) => {


    try{
        const users = await User.find({})

        if(!users){
            return res.status(404).send()
        }

        res.send(users)

    }catch(e){
        res.status(500).send()
    }

    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})


// We have added ':' in front of id to make it a dynamic value
router.get('/users/:id', async(req, res) => {

    // gives us the id from the url
    const _id = req.params.id

    try{
        const findUser = await User.findById(_id)
        if(!findUser){
            return res.status(404).send()
        }
        res.status(201).send(findUser)

    }catch(e){
        res.status(500).send()
    }

    // User.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)

    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.patch('/users/:id', async(req, res) => {

    // this will return an array of strings of the keys of the object
    const updates = Object.keys(req.body)

    // this will return true if all the elements of the array are true
    const allowedUpdates = ['name', 'email', 'password', 'age'] 

    // this will return true if all the elements of the array are true
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{

        // this will return the updated user but not validate the data 
        // new is set to true so that it will return the updated user otherwise it will return the old user
        // runValidators is set to true so that it will validate the data otherwise it will not validate the data
        
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        const user = await User.findById(req.params.id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        
        if(!user){
            return res.status(404).send()
        }

        res.send(user)

    }catch(e){
        console.log(e)
    }
})


router.delete('/users/:id', async(req, res) => {

    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})



module.exports = router