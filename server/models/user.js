let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    email: {
        type: String,
        requried: true,
    },
    name: {
        type: String,
        requried: true,
    },
    employee_id: {
        type: Number,
        requried: true,
    },
    password: {
        type: String,
        required: true,
    },
});

//Export Module
let User = (module.exports = mongoose.model("user", userSchema));
