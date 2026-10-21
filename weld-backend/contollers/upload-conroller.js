const { uploadHelper } = require('../helpers/cloudinary-helper')
const Image = require('../model/image-model')
const cloudinary = require('../config/cloudinary')
const uploadImage = async (req, res) => {
  try {
    const {category} = req.body
    console.log(category)
  
    const uploadResult = await uploadHelper(req.file.path)
    console.log(uploadResult)
    const { public_id, url } = uploadResult.uploadResult

    const newUploaded = await Image.create({
      publicId: public_id,
      url: url,
      category:category,
      uploadedBy: req.user.userId
    })

    res.status(200).json({
      success: true,
      data: newUploaded
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'internal server error'
    })
    console.log(error)
  }
}


const getAllImages = async (req, res) => {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10)
    const requestedLimit = Number.parseInt(req.query.limit, 10)
    const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 10
    const skip = (page - 1) * limit

    const sortBy = req.query.sortBy || 'createdAt'
    const sortOrder = req.query.sortOrder === 'asc'? 1 : -1;
    const sortObj = {}
    sortObj[sortBy] = sortOrder
    if (sortBy !== '_id') sortObj._id = 1
    console.log(sortBy)

    const [images, totalImages] = await Promise.all([
      Image.find().sort(sortObj).skip(skip).limit(limit),
      Image.countDocuments()
    ])
    res.status(200).json({
      success: true,
      data: images,
      nbHits: totalImages,
      page,
      limit,
      hasMore: skip + images.length < totalImages
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'internal server error'
    })
    console.log(error)
  }
}

const getImagesType = async(req,res)=>{
  try{
  const category = req.query.category
  console.log(category)
  const images = await Image.find({category:category})

  if(!images){
    const allImages = await Image.find()

    res.status(200).json({
      data:allImages,
      nbHits: allImages.length
    })
  }

  res.status(200).json({
    success:true,
    data:images,
    nbHits:images.length
  })
  } catch(error){
    console.log(error)
        res.status(500).json({
      success: false,
      message: 'internal server error'
    })
  }

}

const delteImages = async (req, res) => {
  const ImageId = req.params.id
  try {

    const image = await Image.findById({ _id: ImageId })

    console.log(image)
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'image not found'
      })
    }

    const userId = req.user.userId
    console.log(userId)

    if (image.uploadedBy.toHexString() !== userId) {
      return res.status(401).json({
        success: false,
        message: 'not authorized to delete this image'
      })
    }
    await cloudinary.uploader.destroy(image.publicId)
    const deleted = await Image.findByIdAndDelete(ImageId)
    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'deleted succefully'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'internal server error'
    })
  }
}


module.exports = {
  uploadImage,
  getAllImages,
  delteImages,
  getImagesType
}
