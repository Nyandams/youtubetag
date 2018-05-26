const express = require('express');
const router = express();

console.log("main Router");
userRoute = require('../routes/userRouteur');
homeRouter = require('../routes/homeRouteur')
router.use('/user', userRoute);
router.use('', homeRouter);

module.exports = router;
