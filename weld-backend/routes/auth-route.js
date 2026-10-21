const express = require('express')

const router = express.Router()

const {register,login,changePassword} = require('../contollers/auth-controller')
const {authMiddleware} = require('../middlewares/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.post('/password',authMiddleware,changePassword)

module.exports = router