const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middlewares/authMiddleware')
const  {adminMidleware} = require('../middlewares/adminMiddleware')
const multerUploadMiddleware = require('../middlewares/multer-upload-middleware')
const {uploadImage,getAllImages, delteImages, getImagesType} = require('../contollers/upload-conroller')

router.post('/upload',
  authMiddleware,
  adminMidleware,
  multerUploadMiddleware.single('image'),
  uploadImage
  )

router.get('/images',getAllImages)
router.get('/images/type',getImagesType)
router.delete('/images/:id',authMiddleware,adminMidleware,delteImages)

module.exports = router