module.exports.controller = function (app, authService) {
    //routeur de l'accueil + recherche de youtuber

//BD
    const pg = require('pg');
    const url = process.env.DATABASE_URL;

//DTO et DAO
    const Tag = require('../models/tag/tag');
    const tagDAO = require('../models/tag/tagDAO')(pg, url);
    const userDAO = require('../models/user/userDAO')(pg, url);

    //suppression d'un
    app.delete('/tag/delete/:id', function (req, res) {
        console.log('_______delete______');
        authService.authenticate(req, {
            success: function (id) {
                console.log('connecté');
                userDAO.getById(id, {
                    success: function (user) {
                        if (user.is_admin_user) {
                            tagDAO.delete(req.params.id, {
                                success: function (result) {
                                    console.log('delete success');
                                    res.status(200);
                                    res.redirect('/tags');
                                },
                                fail: function (err) {
                                    console.log('delete tag fail');
                                    res.status(500);
                                    res.render('pages/error', {locals: {error: err, title: error, authenticated: true, isadmin: user.is_admin_user}});
                                }
                            });
                        } else {
                            console.log('access forbidden');
                            res.status(403);
                            res.render('pages/403', {locals: {title: 'error 403', authenticated: true}});
                        }
                    },
                    fail: function (err) {
                        console.log('getbyid tags fail');
                        res.status(500);
                        res.render('pages/error', {locals: {error: err, title: error}});
                    }
                })
            },
            fail: function (error) {
                console.log('deconnecté')
                console.log('non connecté');
                res.status(403);
                res.render('pages/403', {locals: {title: 'error 403'}});
            }
        })
    });

//accueil
    app.get('/tags', function (req, res) {
        console.log('home');
        authService.authenticate(req, {
            success: function (id) {
                userDAO.getById(id, {
                    success: function (user) {
                        if (user.is_admin_user) {

                            // noinspection JSAnnotator
                            tagDAO.getAll({
                                success: function (tagArray) {
                                    res.status(200);
                                    res.render('pages/tags', {
                                        locals: {
                                            title: 'Tags Interface',
                                            authenticated: true,
                                            isadmin: user.is_admin_user,
                                            tags: tagArray
                                        }
                                    });
                                },
                                fail: function (error) {
                                    console.log('getbyid tags fail');
                                    res.status(403);
                                    res.render('pages/403', {
                                        locals: {
                                            error: error,
                                            title: error,
                                            authenticated: true,
                                            isadmin: user.is_admin_user
                                        }
                                    });
                                }
                            });
                        } else {
                            console.log('access forbidden');
                            res.status(403);
                            res.render('pages/403', {locals: {title: 'error 403', authenticated: true}});
                        }

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
                res.status(403);
                res.render('pages/403', {locals: {title: 'error 403'}});
            }
        });
    });


};

