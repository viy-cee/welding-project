const adminMidleware = (req,res,next)=>{
  try {
    const {role} =  req.user
    if(role !== 'admin'){
      return res.status(400).json({
        success:false,
        message:'not authorized to access this route'
      })
    }

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({
      suceess:false,
      message:"internal server error"
    })
  }
}

module.exports = {adminMidleware}