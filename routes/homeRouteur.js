module.exports.controller = function (app, authService) {
    //routeur de l'accueil + recherche de youtuber

    //youtubeService
    const ytService = require('./ytService2');

//BD
    const pg = require('pg');
    const url = process.env.DATABASE_URL;

//DTO et DAO
    const User = require('../models/user/user');
    const userDAO = require('../models/user/userDAO')(pg, url);

//accueil
    app.get('/', function (req, res) {
        console.log('home');
        authService.authenticate(req, {
            success: function (id) {
                userDAO.getById(id, {
                    success: function (user) {
                        res.status(200);
                        res.render('pages/home', {
                            locals: {
                                title: 'YoutubeTag',
                                authenticated: true,
                                isadmin: user.is_admin_user
                            }
                        });
                    },
                    fail: function (err) {
                        console.log('getbyid home fail');
                        res.render('pages/error', {locals: {error: err, title: error}});
                    }
                });
            },

            fail: function () {
                console.log('home deconnecté');
                res.status(200);
                res.render('pages/home', {locals: {title: 'YoutubeTag'}});
            }
        });
    });

    app.post('/search', function (req, res) {
        console.log('search');
        authService.authenticate(req, {
            success: function (id) {
                console.log('success connexion');
                userDAO.getById(id, {
                    success: function (user) {
                        var tabChan = ytService().ytSearch(req.body.search);
                        res.status(200);
                        res.render('pages/home', {
                            locals: {
                                title: 'Recherche : ' + req.body.search,
                                channels: tabChan,
                                authenticated: true,
                                isadmin: user.is_admin_user
                            }
                        });
                    },
                    fail: function (err) {
                        console.log('getbyid home fail');
                        res.status(500);
                        res.render('pages/error', {locals: {error: err, title: error}});
                    }
                })
            },
            fail: function () {
                console.log('deconnecté');
                var tabChan = ytService().ytSearch(req.body.search, {
                    success: function (tabChan) {
                        console.log(tabChan);

                        console.log('appel réussi');
                        res.status(200);
                        res.render('pages/home', {
                            locals: {
                                title: 'Recherche : ' + req.body.search,
                                channels: tabChan
                            }
                        });
                    },
                    fail: function(error){
                        console.log('search yt fail');
                        res.status(500);
                        res.render('pages/error', {locals: {error: error, title: error}});
                    }
                });


            }
        })
    });


};

