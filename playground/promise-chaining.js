require('../src/db/mongoose');
const e = require('express');
const User = require('../src/models/user');

// User.findByIdAndUpdate('659532fb2086cc4b1b32f619', { age: 1 , password : "Ajitesh@2003"}).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 1 });
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// });

  


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age:age });
    const count = await User.countDocuments({ age });
    return count;
}

updateAgeAndCount("659532fb2086cc4b1b32f619",78).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
})