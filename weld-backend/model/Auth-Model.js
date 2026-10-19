const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,'please provide username'],
    unique:true,
    maxLength:20
  },
  email:{
    type:String,
    required:[true,'please provide email'],
    unique:true
  },
  password:{
    type:String,
    required:[true,'please provide password']
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  }
},{timestamps:true})

module.exports = mongoose.model('Auth',authSchema)