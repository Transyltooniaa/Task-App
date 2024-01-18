const mongoose = require('mongoose')


const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        // trim removes any white space before or after the string
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = Task;