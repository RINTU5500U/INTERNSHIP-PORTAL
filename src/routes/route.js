const express = require("express");
const router = express.Router();
const { createCollege } = require("../Controllers/collegeController")
const { createIntern, getIntern } = require("../controllers/internController")

router.post("/functionup/colleges", createCollege)
router.post("/functionup/interns", createIntern)
router.get("/functionup/collegeDetails", getIntern)

router.all("/**", (req, res) => {
    try {
        return res.status(400).send({ status: false, msg: "The api you request is not available" })
    } catch (err) {
        return res.status(500).send(err.message)
    }
})


module.exports = router;