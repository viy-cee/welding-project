const express = require('express')
const router = express.Router()

const {uploadAsset,getAsset} = require('../contollers/Project-Asset');
const {authMiddleware} = require('../middlewares/authMiddleware')
const {adminMidleware} = require('../middlewares/adminMiddleware')
const multerMiddleware = require('../middlewares/multer-upload-middleware')

router.post('/send',
  authMiddleware,
  adminMidleware,
  multerMiddleware.single('image'),
  uploadAsset)
router.get('/get',getAsset)

module.exports = router