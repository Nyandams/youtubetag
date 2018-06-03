module.exports.controller = function (app, authService, pool) {

    const escape = require("html-escape");

    const Comment = require('../models/comment/comment');
    const commentDAO = require('../models/comment/commentDAO')(pool);

    const userDAO = require('../models/user/userDAO')(pool);
    const User = require('../models/user/user');

    const tagDAO = require('../models/tag/tagDAO')(pool);
    const tag    = require('../models/tag/tag');

    //youtubeService
    const ytService = require('../service/ytService');

    const channelTagService = require('../service/channelTagService')(pool);


    app.post('/search', function (req, res) {
        console.log('search');
        authService.authenticate(req, {
            success: function (id) {
                console.log('success connexion');
                userDAO.getById(id, {
                    success: function (user) {
                        ytService().ytSearch(req.body.search, {
                            success: function (tabChan) {
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
                });

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




    app.get('/search/tag', function (req, res) {
        console.log('get search tag ');
        authService.authenticate(req, {
            success: function (id) {
                userDAO.getById(id, {
                    success: function (user) {
                        tagDAO.getAll({
                            success: function (tagArray) {
                                console.log('appel réussi');

                                res.status(200);
                                res.render('pages/searchTag', {
                                    locals: {
                                        title: 'Recherche : ' + req.body.search,
                                        tags: tagArray,
                                        authenticated: true,
                                        isadmin: user.is_admin_user
                                    }
                                });
                            },
                            fail: function (err) {
                                res.render('pages/error', {
                                    locals: {
                                        error: err, title: err
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
                });

            },

            fail: function () {
                tagDAO.getAll({
                    success: function (tagArray) {
                        console.log('appel réussi');

                        res.status(200);
                        res.render('pages/searchTag', {
                            locals: {
                                title: 'Recherche : ' + req.body.search,
                                tags: tagArray
                            }
                        });
                    },
                    fail: function (err) {
                        res.render('pages/error', {
                            locals: {
                                error: err, title: err
                            }
                        });
                    }
                });
            }
        });
    });


    app.post('/search/tag', function (req, res) {
        console.log('search tag');
        authService.authenticate(req, {
            success: function (id) {
                console.log('success connexion');
                userDAO.getById(id, {
                    success: function (user) {

                        channelTagService.getChannelsByTag(req.body.search, {
                            success: function (tabChan) {
                                tagDAO.getAll({
                                   success: function (tagArray) {
                                       console.log('appel réussi');

                                       res.status(200);
                                       res.render('pages/searchTag', {
                                           locals: {
                                               title: 'Recherche : ' + req.body.search,
                                               channels: tabChan,
                                               authenticated: true,
                                               tags: tagArray,
                                               isadmin: user.is_admin_user
                                           }
                                       });
                                   },
                                   fail: function (err) {
                                       res.render('pages/error', {
                                           locals: {
                                               error: error, title: error, authenticated: true,
                                               isadmin: user.is_admin_user
                                           }
                                       });
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
                });

            },
            fail: function () {
                console.log('deconnecté');

                channelTagService.getChannelsByTag(req.body.search, {
                    success: function (tabChan) {
                        console.log(tabChan);
                        tagDAO.getAll({
                            success: function (tagArray) {
                                console.log('appel réussi');

                                res.status(200);
                                res.render('pages/searchTag', {
                                    locals: {
                                        title: 'Recherche par tag ',
                                        channels: tabChan,
                                        tags: tagArray
                                    }
                                });
                            },
                            fail: function (err) {
                                res.render('pages/error', {
                                    locals: {
                                        error: err, title: err
                                    }
                                });
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

        channelTagService.getChannelTag(req.params.channelId, {
            success: function (channelTag) {
                console.log('channel tag service success');
                authService.authenticate(req, {
                    success: function (id) {
                        console.log('connecté');
                        userDAO.getById(id, {
                            success: function (user) {

                                tagDAO.getAll({
                                    success: function (tagArray) {
                                        console.log('recuperation des tags posé par l\'user');
                                        channelTagService.getTagUserByChannel(user.id_user, req.params.channelId, {
                                            success: function (tagsUtilisateur) {
                                                console.log('tagsUtilisateur: ' + tagsUtilisateur);
                                                res.status(200);
                                                res.render('pages/channel', {
                                                    locals: {
                                                        title: channelTag.channel.title,
                                                        comments: channelTag.comments,
                                                        channel: channelTag.channel,
                                                        tags: tagArray,
                                                        tagsChannel: channelTag.tags,
                                                        tagsUtilisateur: tagsUtilisateur,
                                                        authenticated: true,
                                                        isadmin: user.is_admin_user
                                                    }
                                                });
                                            },
                                            fail: function (error) {
                                                console.log('get tags utilisateur fail');
                                                res.status(500);
                                                res.render('pages/error', {locals: {error: error, title: 'error'}});
                                            }
                                        });
                                    },
                                    fail: function (error) {
                                        console.log('get all tag fail');
                                        res.status(500);
                                        res.render('pages/error', {locals: {error: error, title: 'error'}});
                                    }
                                });

                            },
                            fail: function (error) {
                                console.log('getUserByIdFail');
                                res.status(500);
                                res.render('pages/error', {locals: {error: error, title: 'error'}});
                            }
                        })
                    },
                    fail: function () {
                        console.log('deconnecté');
                        res.status(200);
                        res.render('pages/channel', {
                            locals: {
                                title: channelTag.channel.title,
                                comments: channelTag.comments,
                                channel: channelTag.channel,
                                tagsChannel: channelTag.tags
                            }
                        });

                    }
                });

            },
            fail: function (error) {
                console.log('error channelTagService');
                res.status(500);
                res.render('pages/error', {locals: {error: error, title: 'error'}});
            }
        })
    });



    // create a comment
    app.post('/comment/add/:channelId', function (req, res) {
        console.log('_____add_comment______');
        authService.authenticate(req, {
            success: function (id) {
                console.log('connecté');
                userDAO.getById(id, {
                    success: function (user) {

                        let comment = new Comment(null, user.pseudo_user, escape(req.body.content), req.params.channelId);
                        commentDAO.create(comment, {
                            success: function (commentCreated) {
                                res.status(401);
                                res.redirect('/channel/' + req.params.channelId);
                            },
                            fail: function (err) {
                                console.log('getbyid tags fail');
                                res.status(500);
                                res.render('pages/error', {locals: {error: err, title: err}});
                            }
                        });
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

    })
};