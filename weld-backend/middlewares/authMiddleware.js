const jwt = require('jsonwebtoken')
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader.split(' ')[1]
  console.log(token)

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided please login to continue'
    })
  }

  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

    req.user = decodedToken

    next()
  } catch (error) {
    console.error(error)
  }

}

module.exports = { authMiddleware }