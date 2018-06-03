module.exports.controller = function (app, authService, pool) {
    //routeur de l'accueil + recherche de youtuber


    //DTO et DAO
    const User = require('../models/user/user');
    const userDAO = require('../models/user/userDAO')(pool);

    //accueil and search by name
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
                        res.status(500);
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


};

