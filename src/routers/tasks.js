const express = require('express')
const Task = require('../models/tasks')

// we are creating a new router for tasks 
const router = new express.Router()


// we are creating a new task 
router.post('/tasks',async(req, res) => {
    const task = new Task(req.body)
    try{
        // save is a method provided by mongoose to save the data to the database
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


// we are fetching all the tasks 
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



// we are fetching a single task by id 
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
    // example: ['name', 'age']  
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
                console.log("task not found")
                return res.status(404).send() , console.log("task not found")
            }

            else{
                res.send(task)
            }  

        }catch(e){
            res.status(500).send()
        }
    }
)


module.exports = router