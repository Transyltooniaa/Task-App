const express = require('express')
const Task = require('../models/tasks')


const router = new express.Router()

router.post('/tasks',async(req, res) => {
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        console.log(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.send(400).send(e)
    // })
})



router.get('/tasks', async(req,res)=>{

    try{
        const tasks = await Task.find({})
        res.status(201).send(tasks)
    }catch(e){
        res.status(500).send()
    }

    // Task.find({}).then((tasks)=>{
    //     res.status(201).send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})


router.get('/tasks/:id', async(req,res)=>{

    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }

    // Task.findById(req.params.id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})



    router.patch('/tasks/:id', async(req, res) => {
    
        // this will return an array of strings of the keys of the object
        const updates = Object.keys(req.body)
    
        // this will return true if all the elements of the array are true
        const allowedUpdates = ['description', 'completed'] 
    
        // this will return true if all the elements of the array are true
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if(!isValidOperation){
            return res.status(400).send({error: 'Invalid updates'})
        }
    
        try{
    
            // this will return the updated user but not validate the data
            
            // We are using findByIdAndUpdate because we want to use middleware which is not supported by findByIdAndDelete and findByIdAndUpdate
            const task = await Task.findById(req.params.id)
            updates.forEach((update) => task[update] = req.body[update])
            await task.save()

            if(!task){
                return res.status(404).send()
            }
    
            res.send(task)
    
        }catch(e){
            console.log(e)
        }
    })




router.delete('/tasks/:id', async(req, res) => {
        try{
            const task = await Task.findByIdAndDelete(req.params.id)
            if(!task){
                return res.status(404).send()
            }
            res.send(task)
        }catch(e){
            res.status(500).send()
        }
    }
)


module.exports = router