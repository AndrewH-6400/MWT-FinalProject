const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
let User = require("../models/user");

let Nat_Hist = require("../models/Natural_History");
const { title } = require("process");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads");
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).send("Unauthorized");
    jwt.verify(token, "secret", (err, decoded) => {
        if (err) return res.status(403).send("Invalid Token");
        req.user = decoded;
        next();
    });
}

// router
//     .route("/add")
//     .get((req, res) => {
//         //console.log("genres", base_genres)
//     })
//     .post(verifyToken, upload.single("image"), async (req, res) => {
//         await check("title", "Title is required").notEmpty().run(req);
//         await check("description", "Description is required")
//             .notEmpty()
//             .run(req);
//         const errors = validationResult(req);

//         if (errors.isEmpty()) {
//             let nat_hist = new Nat_Hist();
//             nat_hist.title = req.body.title;
//             nat_hist.description = req.body.description;
//             try {
//                 //await nat_hist.save();
//                 res.json({ message: "Succesfully Added " });
//             } catch (err) {
//                 console.error(err);
//                 res.status(500).json({ error: "Internal Server Error" });
//             }
//         } else {
//             res.status(400).json({ errors: errors.array() });
//         }
//     });

router
    .route("/add/image")
    .post(verifyToken, upload.single("image"), async (req, res) => {
        console.log(req.file);
        let nat_hist = new Nat_Hist();
        nat_hist.title = req.body.title;
        nat_hist.description = req.body.description;
        //console.log(typeof req.body.userId);
        nat_hist.entrant = req.body.userId;

        let upload_dir = path.join(__dirname, "../uploads");

        nat_hist.img = {
            data: fs.readFileSync(
                path.join(upload_dir + "/" + req.file.filename)
            ),
            contentType: "image/png",
        };
        await nat_hist.save();
        res.send("Image upload successfull");
    });

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const nat_hist = await Nat_Hist.findById(req.params.id);
            res.json({ item: nat_hist });
        } catch (err) {
            console.error("Error fetching item by ID", err);
            res.status(500).json({ error: "Internal Server Error " });
        }
    })
    .delete(verifyToken, async (req, res) => {
        try {
            const nat_hist = await Nat_Hist.findById(req.params.id);
            const user = await User.findOne({ name: req.user.name });
            if (user.employee_id < 1000 || nat_hist.entrant == req.user.id) {
                const query = { _id: req.params.id };
                console.log("Success");
                const result = await Nat_Hist.deleteOne(query);
                if (result.deletedCount > 0) {
                    res.json({ message: "Successfully Deleted" });
                } else {
                    res.status(404).json({ error: "Item not found" });
                }
            } else {
                console.log("does not have permission");
                res.status(403).json({
                    error: "You do not have permission to delete",
                });
            }
        } catch (error) {
            console.log("Error deleting item by id:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
router
    .route("/edit/:id")
    .get(async (req, res) => {
        try {
            const nat_hist = await Nat_Hist.findById(req.params.id);
            //console.log(nat_hist);
            res.json({ item: nat_hist });
        } catch (error) {
            console.error("Error fetching item by id:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    })
    .post(verifyToken, upload.single("image"), async (req, res) => {
        try {
            if (req.file != null) {
                let upload_dir = path.join(__dirname, "../uploads");
                const nat_hist_ver = await Nat_Hist.findById(req.params.id);
                const user = await User.findOne({ name: req.user.name });

                if (
                    user.employee_id < 1000 ||
                    nat_hist_ver.entrant == req.user.id
                ) {
                    console.log("Success");
                    let nat_hist = {
                        title: req.body.title,
                        description: req.body.description,
                        img: {
                            data: fs.readFileSync(
                                path.join(upload_dir + "/" + req.file.filename)
                            ),
                            contentType: "image/png",
                        },
                    };
                    const query = { _id: req.params.id };
                    await Nat_Hist.updateOne(query, nat_hist);
                }
            } else {
                const nat_hist_ver = await Nat_Hist.findById(req.params.id);
                const user = await User.findOne({ name: req.user.name });

                if (
                    user.employee_id < 1000 ||
                    nat_hist_ver.entrant == req.user.id
                ) {
                    console.log("Success");
                    let nat_hist = {
                        title: req.body.title,
                        description: req.body.description,
                    };
                    const query = { _id: req.params.id };
                    await Nat_Hist.updateOne(query, nat_hist);
                }
            }

            res.json({ message: "Successfully Updated" });
        } catch (error) {
            console.error("Error updating item by id:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

module.exports = router;
