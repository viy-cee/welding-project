const { uploadHelper } = require('../helpers/cloudinary-helper')
const Image = require('../model/image-model')
const uploadImage = async (req, res) => {
  try {
    const uploadResult = await uploadHelper(req.file.path)
    console.log(uploadResult)
    const { public_id, url } = uploadResult.uploadResult

    const newUploaded = await Image.create({
      publicId:public_id,
      url:url,
      uploadedBy:req.user.userId
    })

      res.status(200).json({
        success: true,
        data:newUploaded
      })
  } catch (error) {
    console.log(error)
  }
}

const getAllImages = async (req,res)=>{
  const images = await Image.find({})
  if(!images){
    return res.status(404).json({
      success:false,
      message:'no images found'
    })
  }
  res.status(200).json({
    success:true,
    data:images
  })
}


module.exports = {
  uploadImage,
  getAllImages
}