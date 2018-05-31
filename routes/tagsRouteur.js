module.exports.controller = function (app, authService, pool) {
    //routeur de l'accueil + recherche de youtuber
    const escape = require("html-escape");

//DTO et DAO
    const Tag = require('../models/tag/tag');
    const tagDAO = require('../models/tag/tagDAO')(pool);
    const userDAO = require('../models/user/userDAO')(pool);


    // create a tag
    app.post('/tag/add', function(req, res){
        console.log('____add tag______');
        let tag = new Tag(null, escape(req.body.libelle_tag));
        authService.authenticate(req, {
            success: function (id) {
                console.log('connecté');
                userDAO.getById(id, {
                    success: function (user) {
                        if (user.is_admin_user) {
                            tagDAO.create(tag, {
                                success: function (tagSaved) {
                                    console.log('add success');
                                    res.status(201);
                                    res.redirect('/tags');
                                },
                                fail: function (err) {
                                    console.log('add tag fail');
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
                });

            },
            fail: function (error) {
                console.log('non connecté');
                res.status(403);
                res.render('pages/403', {locals: {title: 'error 403'}});
            }
        })
    });

    // update a tag
    app.put('/tag/update', function(req, res){
        console.log('____update tag______');
        let tag = new Tag(escape(req.body.id_tag), escape(req.body.libelle_tag));
        authService.authenticate(req, {
            success: function (id) {
                console.log('connecté');
                userDAO.getById(id, {
                    success: function (user) {
                        if (user.is_admin_user) {
                            tagDAO.update(tag, {
                                success: function (tagUpdated) {
                                    console.log('update success');
                                    res.status(200);
                                    res.redirect('/tags');
                                },
                                fail: function (err) {
                                    console.log('update tag fail');
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
                });

            },
            fail: function (error) {
                console.log('deconnecté')
                console.log('non connecté');
                res.status(403);
                res.render('pages/403', {locals: {title: 'error 403'}});
            }
        })
    });


    //suppression d'un tag
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
                });

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

