module.exports.controller = function (app, authService, pool) {
    //routeur de l'accueil + recherche de youtuber
    const escape = require("html-escape");

//DTO et DAO
    const Favoris = require('../models/favoris/favoris');
    const favorisDAO = require('../models/favoris/favorisDAO')(pool);

    const User = require('../models/user/user');
    const userDAO = require('../models/user/userDAO')(pool);

    const channelTagService = require('../service/channelTagService')(pool);

    // add a favorites
    app.post('/channel/fav/add/:idChannel', function (req, res) {
        console.log('____add a fav______');
        authService.authenticate(req, {
            success: function (id) {
                console.log('connecté');
                userDAO.getById(id, {
                    success: function (user) {
                        let fav = new Favoris(user.id_user, req.params.idChannel);
                        favorisDAO.addFavoris(fav, {
                            success: function () {
                                res.status(201);
                                res.redirect('/channel/' + req.params.idChannel);
                            },
                            fail: function (err) {
                                console.log('fail add_tag');
                                res.status(409);
                                res.redirect('/channel/' + req.params.idChannel);

                            }
                        })
                    },
                    fail: function (err) {
                        console.log('getbyid tags fail');
                        res.status(500);
                        res.render('pages/error', {locals: {error: err, title: 'error', authenticated:true, isadmin: user.is_admin_user}});
                    }
                });

            },
            fail: function (error) {
                console.log('non connecté');
                res.status(401);
                res.render('pages/401', {locals: {title: 'error 401'}});
            }
        })
    });


    //get the tags interface
    app.get('/favorite', function (req, res) {
        console.log('home');
        authService.authenticate(req, {
            success: function (id) {
                userDAO.getById(id, {
                    success: function (user) {
                        channelTagService.getChannelsByUser(user.id_user, {
                            success: function (channels) {
                                console.log('getChannelsByUser success');
                                res.status(200);
                                res.render('pages/profil', {locals: {channels: channels, title: 'Favorites', authenticated: true, isadmin: user.is_admin_user}});
                            },
                            fail: function (err) {
                                console.log('getChannelsByUser');
                                res.status(500);
                                res.render('pages/error', {locals: {error: err, title: error, authenticated: true, isadmin: user.is_admin_user}});
                            }
                        })

                    },
                    fail: function (err) {
                        console.log('getbyid tags fail');
                        res.status(500);
                        res.render('pages/error', {locals: {error: err, title: error}});
                    }
                });

            },

            fail: function (err) {
                console.log('non connecté');
                res.status(401);
                res.render('pages/401', {locals: {title: 'error 401'}});
            }
        });
    });



    app.delete('/favorite/delete/:channelId', function (req, res) {
        console.log('____delete a favorite______');
        authService.authenticate(req, {
            success: function (id) {
                console.log('connecté');
                userDAO.getById(id, {
                    success: function (user) {
                        favorisDAO.delete(user.id_user, req.params.channelId, {
                            success: function () {
                                res.status(200);
                                res.redirect('/favorite');
                            },
                            fail: function (err) {
                                console.log('fail delete favorite');
                                res.status(500);
                                res.redirect('/favorite');

                            }
                        })
                    },
                    fail: function (err) {
                        console.log('getbyid tags fail');
                        res.status(500);
                        res.render('pages/error', {locals: {error: err, title: 'error', authenticated:true, isadmin: user.is_admin_user}});
                    }
                });

            },
            fail: function (error) {
                console.log('non connecté');
                res.status(401);
                res.render('pages/401', {locals: {title: 'error 401'}});
            }
        })
    });


};

