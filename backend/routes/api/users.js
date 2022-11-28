// backend/routes/api/users.js
const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { application } = require('express');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// sign up endpoint
router.post(
    '/',
    // validateSignup,
    async (req, res, next) => {

      const { email, password, username, firstName, lastName } = req.body;

      let checkUserName = await User.findOne({
        where: {
          username: req.body.username
        }
      })
      let checkEmail = await User.findOne({
        where: {
          email: req.body.email
        }
      })
      // console.log("this is username:", username)
      // console.log("true/false for users", !username)

      if(!username || !email || !password || !firstName || !lastName){
        res.status(400);
        return res.json({
          "message": "Validation error",
          "statusCode": 400,
          "errors": {
            "email": "Invalid email",
            "username": "Username is required",
            "firstName": "First Name is required",
            "lastName": "Last Name is required"
          }
        })
      }

      if(checkEmail){
        res.status(403)
        return res.json({
          "message": "User already exists",
          "statusCode": 403,
          "errors": {
            "email": "User with that email already exists"
          }
        })
      }
      // if(checkEmail){
      //   const err = new Error('User already exists');
      //   err.status = 403;
      //   err.statusCode = 403;
      //   err.errors = {
      //     email: "User with that email already exists"
      //   };
      //   return next(err);
      // }
      if(checkUserName){
        res.status(403)
        return res.json({
          "message": "User already exists",
          "statusCode": 403,
          "errors": {
            "email": "User with that username already exists"
          }
        })
      }

      const user = await User.signup({ email, username, password, firstName, lastName });

      await setTokenCookie(res, user);

      let token = await setTokenCookie(res,user);

      return res.json({
        // user
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        token: token
      })
    },
    validateSignup
  );

  module.exports = router;
