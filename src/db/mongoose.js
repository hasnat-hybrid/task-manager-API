const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_CONNECTION,
{
    useNewUrlParser: true
}).catch((Error) => {
    console.log(Error);
})