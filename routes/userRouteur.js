const express = require('express');
const userRoute = express.Router();
const escape = require("html-escape");
//authentication service
const authService = require('./authService');

//recup BD
const pg = require('pg');
const pgUrl = process.env.DATABASE_URL;
//DTO + DAO
const User = require('../models/user/user');
const UserDAO = require('../models/user/userDAO')(pg, pgUrl);

//sign up
userRoute.post('/signup', function (req, res) {
  console.log('signup');

  const user = new User(null, escape(req.body.pseudo_user), authService().hashPassword(req.body.password_user), escape(req.body.email_user), false, null);
  UserDAO.getByEmailPseudo(user.pseudo_user,user.email_user,{
    fail: function () {
      UserDAO.create(user, {
        success: function (savedUser) {
          var token = authService().createToken(savedUser.id_user);
          res.cookie('youtubetag', token, { maxAge: 900000, httpOnly: true});
          res.status(201).json('User created, token: ' + token);
        },
        fail: function (errors) {
          if (errors == null) {
            res.status(500).json('error database');
          }
        }
      });
    },
    success: function () {
      console.log("Pseudo ou Email déjà existant dans la base de données");
      res.status(409).json('Pseudo or email already used by someone else');
    }
  });


});

userRoute.post('/signin', function(req, res){
  console.log('signin');
  UserDAO.getByPseudo(req.pseudo_user,{
    success: function (user) {
      if(authService().checkPassword(req.body.password_user, user.password_user)){
        var token = authService().createToken();
        res.status(200).json({idToken: token,
                              expiresIn: 900000});
      } else {
        res.status(401).json('wrong password');
      }
    },
    fail: function () {
      res.status(401).json('email doesn\'t exist');
    }
  })

});
module.exports = userRoute;
