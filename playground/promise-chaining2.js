require('../src/db/mongoose');
const Task = require('../src/models/tasks');


// Task.deleteOne({_id : '65953324034c2a5358566445'}).then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// });


const TaskDeleteAndCount = async (id) => {
    const task = await Task.deleteOne({_id : id});
    const count = await Task.countDocuments({ completed : false });
    return count;
}


TaskDeleteAndCount("659537939a174058b7ed6194").then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})