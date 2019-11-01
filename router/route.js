const router = require('express').Router()
const {subscribe,readmessage,chatlogs,register,getmessages,addmessage} = require('../controller/controler')

// This is for Chat App

router.post('/addmessage', addmessage)

router.get('/getmessages', getmessages)

router.get('/chatlogs', chatlogs)

router.post('/register', register)

router.put('/readmessage', readmessage)

router.post('/subscribe',subscribe)








module.exports = router;
