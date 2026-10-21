const Project = require('../model/project-asset-model')
const cloudinary = require('../config/cloudinary')
const {uploadHelper} = require('../helpers/cloudinary-helper')

const uploadAsset = async(req,res)=>{
  try{
  const {name} = req.body
  if(!name){
    return res.status(400).json({
      success:false,
      message:'must provide name'
    })
  }

  const result = await uploadHelper(req.file.path)

  const { public_id, url } = result.uploadResult


  const asset = await Project.create({
    image:url,
    publicId:public_id,
    name:name,
    uploadedBy:req.user.userId
  })

  res.status(200).json({
    success:true,
    data:asset
  })
} catch(error){
  console.log(error)
  res.status(500).json({
    success:false,
    message:'inernal server error'
  })
}
}

const getAsset = async (req,res)=>{
  const name = req.query.name
  try{
  if(!name){
    return res.status(400).json({
      success:false,
      message:'must provide name'
    })
  }

  
  const asset = await Project.findOne({name:name})
    if(!asset){
    return res.status(400).json({
      success:false,
      message:'asset not found'
    })
  }
  res.status(200).send(
    asset.image
  )

  } catch(error){
      console.log(error)
  res.status(500).json({
    success:false,
    message:'inernal server error'
  })
  }
}

module.exports = {
  uploadAsset,
  getAsset
}