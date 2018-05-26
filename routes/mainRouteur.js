const express = require('express');
const router = express();
userRoute = require('../routes/userRouteur');
homeRoute = require('../routes/homeRouteur');
console.log("main Router");


router.use('/user', userRoute);
router.use('/', homeRoute);

module.exports = router;