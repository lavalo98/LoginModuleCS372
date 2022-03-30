const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    return res.render("registration", {alertShow: ""})
});

router.get('/', (req, res) => {
    return res.render("registration", {alertShow: ""})
});


module.exports = router;