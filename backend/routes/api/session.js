// backend/routes/api/session.js
const express = require('express');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

   // log in
   router.post(
    '/',
    // validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;

      if(!credential || !password){
        res.status(400);
        return res.json({
          "message": "Validation error",
          "statusCode": 400,
          "errors": {
            "credential": "Email or username is required",
            "password": "Password is required"
          }
        })
      }

      const user = await User.login({ credential, password });

      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }

      let token = await setTokenCookie(res, user);


      return res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        token: token
      });
    },
    validateLogin
  );

  //log out
  router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

  router.get('/', requireAuth, async (req,res, next) => {
    let {user} = req;
    // console.log(user)
    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    })
  })

  router.get(
    '/',
    restoreUser,
    (req, res) => {
      const { user } = req;
      // console.log(user.dataValues)
      if (user) {
        return res.json({
          user: user.toSafeObject()
          // id: user.id,
          // firstName: user.firstName,
          // lastName: user.lastName,
          // email: user.email,
          // username: user.username
        });
      } else return res.json({});
    }
  );



module.exports = router;
