const router = require('express').Router()
const {testing,readmessage,chatlogs,register,getmessages,addmessage} = require('../controller/controler')

// This is for Chat App

router.post('/addmessage', addmessage)

router.get('/getmessages', getmessages)

router.get('/chatlogs', chatlogs)

router.post('/register', register)

router.put('/readmessage', readmessage)

router.get('/testing',testing)








module.exports = router;
