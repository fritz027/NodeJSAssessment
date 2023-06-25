const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const User = require('../model/User')
dotenv.config({ path: './config/config.env'})



const secretKey = process.env.TOKEN_SECRET_KEY


function generateToken(payload) {
    return jwt.sign(payload, secretKey, {expiresIn: "1h"})
}

function getUserFromToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded.id;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

async function isPasswordMatch(password, hashedPassword) {
  const passwordMatched = await bcrypt.compare(password, hashedPassword)
  return passwordMatched
}


//Register User 
async function registerUser(firstName, lastName, email, password) {
    const user = new User({
      firstName,
      lastName,
      email,
      password
    })
    await user.save()
    const token = generateToken({id: user._id.toString()})
    return {token, user}
}

async function loginUser(email, password) {
  const user = await User.findOne({ email }).select('+password')
  console.log('this is user: ', user)
  if (!user) {
    throw new Error('Invalid Credentials')
  }

  console.log(user)
  const isValidPassword = await isPasswordMatch(password, user.password)
  if (!isValidPassword) {
    throw new Error('Invalid Credentials')
  }

  const token = generateToken({id: user._id.toString()})

  return {token, user};
}

module.exports = { generateToken, getUserFromToken, isPasswordMatch, registerUser, loginUser }