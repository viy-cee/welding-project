const cloudinary = require('../config/cloudinary')

const uploadHelper = async (filePath) => {
  try {
    const uploadResult = await 
    cloudinary.uploader.upload(filePath)
    return {
      uploadResult
    }
  } catch (error) {
    console.error(error)
    throw new Error(`Error while uploaing to cloudinary`)
  }

}

module.exports = {uploadHelper}