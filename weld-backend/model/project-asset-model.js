const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  image:{
    type:String,
    required:true
  },
  name:{
    type:String
  },
  pubcilId:{
    type:String
  },
  uploadedBy:{
  type:mongoose.Types.ObjectId,
  required:true
  }
})

module.exports = mongoose.model('Project',projectSchema);