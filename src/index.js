const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/tasks')

const app = express()
const port = process.env.PORT || 3000

const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

// automatically parse incoming json to an object
app.use(express.json())

// Registering the router
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const bcrypt = require('bcryptjs')

const myFuntion = async ()=>{
    const password = "Red12345!"
    const hashedPassword = await bcrypt.hash(password,8);
    
    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare("Red12345!",hashedPassword)
    console.log(isMatch)
}

myFuntion()