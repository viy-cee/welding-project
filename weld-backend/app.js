require('dotenv').config()
const express = require('express');
const { connectDB } = require('./connectDb/conectDB');

const cors = require('cors')

const app = express();
const AuthRoute = require('./routes/auth-route')
const FileRoute = require('./routes/fileUpload-route')

app.use(express.json())
app.use(cors())
app.use('/auth',AuthRoute)
app.use('/api/v1',FileRoute)

const port = process.env.PORT || 3000

app.listen(port, async()=>{
  await connectDB()
  console.log(`server is listening on ${port}`)
})