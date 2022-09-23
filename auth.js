require('dotenv').config()
const jwt = require('jsonwebtoken')

const validateJWT = (req,res,next) =>{
    const token = req.cookies.token;
    try {
      const user = jwt.verify(token, process.env.token_secret_key);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).end()
    }
  }


module.exports = {validateJWT}