module.exports.controller = function (app, authService) {
    //routeur de l'accueil + recherche de youtuber
    const escape = require("html-escape");
//BD
    const pg = require('pg');
    const url = process.env.DATABASE_URL;

//DTO et DAO
    const Tag = require('../models/tag/tag');
    const tagDAO = require('../models/tag/tagDAO')(pg, url);
    const userDAO = require('../models/user/userDAO')(pg, url);
    const TagLink = require('../models/lienTag/tag_link');
    const tagLinkDAO = require('../models/lienTag/tag_linkDAO')(pg, url);


    // create a tag
    app.post('/channel/tag/add/:idChannel', function (req, res) {
        console.log('____add a tag link______');
        authService.authenticate(req, {
            success: function (id) {
                console.log('connecté');
                userDAO.getById(id, {
                    success: function (user) {
                        let tag_link = new TagLink(user.id_user, escape(req.body.id_tag), req.params.idChannel);
                        tagLinkDAO.addTagLink(tag_link, {
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
                res.render('pages/401', {locals: {title: 'error 403'}});
            }
        })
    });


    app.delete('/taglink/delete/:channelId/:idTag', function (req, res) {
        console.log('____delete a tag link______');
        authService.authenticate(req, {
            success: function (id) {
                console.log('connecté');
                userDAO.getById(id, {
                    success: function (user) {
                        tagLinkDAO.delete(user.id_user, req.params.channelId, req.params.idTag, {
                            success: function () {
                                res.status(200);
                                res.redirect('/channel/' + req.params.channelId);
                            },
                            fail: function (err) {
                                console.log('fail delete taglink');
                                res.status(500);
                                res.redirect('/channel/' + req.params.channelId);

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
                res.render('pages/401', {locals: {title: 'error 403'}});
            }
        })
    });



};

