const express = require('express')
const Task = require('../models/tasks')
const auth = require('../middleware/auth')
const e = require('express')

// we are creating a new router for tasks 
const router = new express.Router()


// we are creating a new task 
router.post('/tasks',auth,async(req, res) => {
    // const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })


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

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})




// we are fetching a single task by id 
router.get('/tasks/:id',auth ,async(req,res)=>{

    const _id = req.params.id

    try{
        const task = await Task.findById({_id,owner:req.user._id})

        if(!task){
            console.log("No cheating You can't access other's task")
            return res.status(404).send({error:"No cheating You can't access other's task"})

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



router.patch('/tasks/:id',auth ,async(req, res) => {

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
        const task = await Task.findById({_id:req.params.id,owner:req.user._id}) 
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




router.delete('/tasks/:id',auth ,async(req, res) => {
        try{
            const task = await Task.findByIdAndDelete({_id:req.params.id,owner:req.user._id})
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