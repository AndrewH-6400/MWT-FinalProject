let mongoose = require("mongoose");
let nat_histSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    entrant: {
        type: String,
    },
    img: {
        data: Buffer,
        contentType: String,
    },
});

let nat_hist = (module.exports = mongoose.model(
    "natural_histories",
    nat_histSchema
));
