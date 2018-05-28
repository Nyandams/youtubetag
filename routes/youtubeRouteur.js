module.exports.controller = function (app, authService) {

    //BD
    const pg = require('pg');
    const url = process.env.DATABASE_URL;

    const userDAO = require('../models/user/userDAO')(pg, url);
    const User = require('../models/user/user');

    //youtubeService
    const ytService = require('./ytService');

    app.post('/search', function (req, res) {
        console.log('search');
        authService.authenticate(req, {
            success: function (id) {
                console.log('success connexion');
                userDAO.getById(id, {
                    success: function (user) {
                        var tabChan = ytService().ytSearch(req.body.search, {
                            success: function (tabChan) {
                                console.log(tabChan);

                                console.log('appel réussi');
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
                            fail: function (error) {
                                console.log('search yt fail');
                                res.status(500);
                                res.render('pages/error', {
                                    locals: {
                                        error: error, title: error, authenticated: true,
                                        isadmin: user.is_admin_user
                                    }
                                });
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
                ytService().ytSearch(req.body.search, {
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
                    fail: function (error) {
                        console.log('search yt fail');
                        res.status(500);
                        res.render('pages/error', {locals: {error: error, title: error}});
                    }
                });


            }
        })
    });

    app.get('/channel/:channelId', function (req, res) {
        console.log('channel: ' + req.params.channelId);
        authService.authenticate(req, {
            success: function (id) {
                console.log('success connexion');
                userDAO.getById(id, {
                    success: function (user) {
                        ytService().ytChannel(req.params.channelId,{
                            success: function (channel) {
                                res.status(200);
                                res.render('pages/channel', {
                                    locals: {
                                        title: channel.title,
                                        channel: channel,
                                        authenticated: true,
                                        isadmin: user.is_admin_user
                                    }
                                });
                            }
                        },{
                            fail: function (error) {
                                res.render('pages/error', {
                                    locals: {
                                        error: error, title: error,
                                        authenticated: true,
                                        isadmin: user.is_admin_user
                                    }
                                });
                            }
                        })

                    },
                    fail: function (error) {
                        console.log('getbyid home fail');
                        res.status(500);
                        res.render('pages/error', {locals: {error: err, title: error}});
                    }
                })
            },
            fail: function () {
                console.log('deconnecté');
                ytService().ytChannel(req.params.channelId, {
                    success: function (channel) {
                        console.log(channel);
                        console.log('appel réussi');
                        res.status(200);
                        res.render('pages/channel', {
                            locals: {
                                title: channel.title,
                                channel: channel
                            }
                        });
                    },
                    fail: function (error) {
                        console.log('channel non trouvé');
                        res.status(500);
                        res.render('pages/error', {locals: {error: error, title: error}});
                    }
                });
            }
        })
    });
};