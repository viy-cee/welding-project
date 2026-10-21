const bcrypt = require('bcryptjs')
const Auth = require('../model/Auth-Model')
const jwt = require('jsonwebtoken')

const register = async (req,res)=>{
  const {email,password,role} = req.body

  try {
    const existingUser = await Auth.findOne({email})
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:'user already exists please login'
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const result = await Auth.create({
      email,
      password:hashedPassword,
      role:role?role:'user'
    })

    if(!result){
      return res.status(400).json({
        success:false,
        message:'failed please try agin later'
      })
    }

    res.status(201).json({
      success:true,
      data:result
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:'error occured try again leter'
    })
  }
}

const login = async (req,res)=>{
  try {
  const {email,password} = req.body
  const isRegisterd = await Auth.findOne({email})
  if(!isRegisterd){
    return res.status(404).json({
      success:false,
      message:'user does not exist'
    })
  }
  const isMatch = await bcrypt.compare(password,isRegisterd.password)

  if(!isMatch){
    return res.status(401).json({
      success:false,
      message:'Wrong password try again'
    })
  }


  const token = await jwt.sign({
    email: isRegisterd.email,
    role:isRegisterd.role,
    userId:isRegisterd._id
  },process.env.JWT_SECRET,{expiresIn:'10h'})

  res.status(200).json({
    success:true,
    email:isRegisterd.email,
    data:token,
    role:isRegisterd.role
  })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:'error occured try again leter'
    })
  }
}

const changePassword = async(req,res)=>{
  try {
    const {oldPassword,newPassword} = req.body

    const userId = req.user.userId

    const isExist = await Auth.findById(userId)
    if(!isExist){
     return res.status(404).json({
        success:false,
        message:'user not found'
      })
    }

    const isMatch = await bcrypt.compare(oldPassword,isExist.password)

    if(!isMatch){
     return res.status(400).json({
      success:false,
      message:'wrong password'
     })
    }
    const salt = await bcrypt.genSalt(10)
    const newHashedPassword = await bcrypt.hash(newPassword,salt)


    isExist.password = newHashedPassword

    await isExist.save()
    res.status(200).json({
      success:true,
      message:'successfully changed password'
    })

  } catch (error) {
        console.log(error);
        res.status(500).json({
      success: false,
      message: 'Some error occured please try again'
    })
  }
}

module.exports = {
  register,
  login,
  changePassword
}