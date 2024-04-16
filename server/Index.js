const express = require("express");
const cors = require("cors");
// const Book = require("./models/book");
const Nat_Hist = require("./models/Natural_History");
const nat_hist_routes = require("./router/nat_hist_router");
const user_routes = require("./router/user_router"); // new
const config = require("./config/db_config");
const session = require("express-session"); // new
const passport = require("passport"); // new

// Adding Mongoose
const mongoose = require("mongoose");
mongoose.connect(config.database);
let db = mongoose.connection;
db.once("open", function () {
    console.log("Connected to MongoDB");
});
db.on("error", function (err) {
    console.log("DB Error");
});

// Configuring our server
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/nat_hist", nat_hist_routes);
app.use("/user", user_routes); // new

// Initialize session new
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {},
    })
);

require("./config/passport")(passport); // new
app.use(passport.initialize()); // new
app.use(passport.session()); // new

// Home page route
app.get("/", function (req, res) {
    //Query MongoDB for books
    Nat_Hist.find({})
        .then((items) => {
            // Pass books as JSON response
            res.json(items);
        })
        .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
