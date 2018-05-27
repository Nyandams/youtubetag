module.exports.controller = function (app) {


//authentifications method
    const authService = require('./authService');

//BD
    const pg = require('pg');
    const url = process.env.DATABASE_URL;

//DTO et DAO
    const User = require('../models/user/user');
    const userDAO = require('../models/user/userDAO')(pg, url);

//accueil
    app.get('/', function (req, res) {
        console.log('home');

        authService().authenticate(req, {
            success: function (id) {
                console.log(req);
                userDAO.getById(id, {
                    success: function (user) {
                        res.status(200);
                        res.render('pages/home', {
                            title: 'YoutubeTag',
                            authenticated: true,
                            isadmin: user.is_admin_user
                        });
                    },
                    fail: function (err) {
                        res.render('pages/error', {locals:{error: err, title: error}});
                    }
                });
            },

            fail: function () {
                res.status(200);
                res.render('pages/home', {locals: {title: 'YoutubeTag', authenticated: false}});
            }
        });
    });
};