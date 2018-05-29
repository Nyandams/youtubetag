module.exports.controller = function (app, authService) {
    const escape = require("html-escape");

//recup BD
    const pg = require('pg');
    const pgUrl = process.env.DATABASE_URL;
//DTO + DAO
    const User = require('../models/user/user');
    const UserDAO = require('../models/user/userDAO')(pg, pgUrl);

    console.log('userRouter');

//get signup page
    app.get('/user/signup', function (req, res) {
        console.log('______________get signup________________');
        authService.authenticate(req, {
            success: function (idUser) {
                UserDAO.getById(idUser, {
                    success: function () {
                        res.status(200);
                        res.redirect('/');
                    },
                    fail: function () {
                        res.status(404);
                        res.render('pages/404', {locals: {title: 'error 404'}});
                    }
                })

            },
            fail: function () {
                res.status(200);
                res.render('pages/signup', {locals: {title: 'Sign up', authenticated: false}});
            }
        });
    });

//get signin page
    app.get('/user/signin', function (req, res) {
        authService.authenticate(req, {
            success: function (idUser) {
                res.render('pages/home', {locals: {title: 'YoutubeTag', authenticated: true}})
            },
            fail: function () {
                res.render('pages/signin', {locals: {title: 'Sign in'}});
            }
        })


    });

//sign up
    app.post('/user/signup', function (req, res) {
        console.log('signup');

        const user = new User(null, escape(req.body.pseudo_user), authService.hashPassword(req.body.password_user), escape(req.body.email_user), false, null);
        UserDAO.getByEmailPseudo(user.pseudo_user, user.email_user, {
            fail: function () {
                UserDAO.create(user, {
                    success: function (savedUser) {
                        console.log("account created");
                        var token = authService.createToken(savedUser.id_user);
                        res.cookie('youtubetag', token, {expires: new Date(Date.now()+900000), httpOnly: true});
                        res.status(201);
                        res.render('pages/home', {
                            locals: {
                                title: 'YoutubeTag',
                                authenticated: true,
                                isadmin: user.is_admin_user
                            }
                        });
                    },
                    fail: function (errors) {
                        if (errors == null) {
                            res.status(500);
                            res.render('pages/error', {locals: {error: errors}});
                        }
                    }
                });
            },
            success: function () {
                console.log("Pseudo ou Email déjà existant dans la base de données");
                res.status(409);
                console.log('un autre utilisateur a ce pseudo ou email')
                res.render('pages/signup', {
                    locals: {
                        title: 'Sign up',
                        authenticated: false,
                        status: false
                    }
                });
            }
        });


    });

    //signout
    app.get('/user/signout', function(req, res) {
        res.clearCookie('youtubetag');
        res.redirect('/');
    });

    app.post('/user/signin', function (req, res) {
        console.log('signin');
        UserDAO.getByEmail(req.body.email_user, {
            success: function (user) {
                if (authService.checkPassword(req.body.password_user, user.password_user)) {
                    console.log('authenticated');
                    var token = authService.createToken(user.id_user);
                    res.status(200);
                    res.cookie('youtubetag', token, {expires: new Date(Date.now()+900000), httpOnly: true});
                    res.render('pages/home', {
                        locals: {
                            title: 'YoutubeTag',
                            authenticated: true,
                            isadmin: user.is_admin_user
                        }
                    });
                } else {
                    console.log('bad password');
                    res.status(401);
                    res.render('pages/signin', {locals: {title: 'Sign in', status: false}});
                }
            },
            fail: function () {
                res.status(401);
                res.render('pages/signin', {locals: {title: 'Sign up'}});
            }
        })

    });
};