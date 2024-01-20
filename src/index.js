const express = require('express')
require('./db/mongoose')


const app = express()
const port = process.env.PORT || 3000

const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')


// Here we are using the middleware function
// app.use((req,res,next)=>{
//     if(req.method === 'GET'){
//         res.send('GET requests are disabled');
//     }
//     else{
    // If we don't call next() then the request will hang and the user will never get a response
//         next();
//     }
// });



// app.use((req,res,next)=>{
//     res.status(503).send('Site is currently down. Check back soon!')
// })


//multer is used to upload files






// automatically parse incoming json to an object
app.use(express.json())

// Registering the router
app.use(userRouter)
app.use(taskRouter)


//
// without middleware: new request -> run route handler
//
// with middleware: new request -> do something -> run route handler


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// Here we are Hashing the password before saving it to the database using bcryptjs library

// const bcrypt = require('bcryptjs')

// const myFuntion = async ()=>{
//     const password = "Red12345!"
//     const hashedPassword = await bcrypt.hash(password,8);
    
//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare("Red12345!",hashedPassword)
//     console.log(isMatch)
// }

// myFuntion()


// JSON WEB TOKENS

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse',{expiresIn:'7 days'})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')

//     console.log(data)
// }

// myFunction()



// const main = async () => {
//     // const task = await Task.findById('65aa7bfd810ec9616c2269ae')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner);
//     const user = await User.findById('65aa79b3ba1db05aa61f1a73')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks);
// }

// main()