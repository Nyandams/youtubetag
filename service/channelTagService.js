module.exports = function (pool) {

    const util = require('util')

    const tagLinkDAO = require('../models/lienTag/tag_linkDAO')(pool);

    const tagDAO = require('../models/tag/tagDAO')(pool);

    const commentDAO = require('../models/comment/commentDAO')(pool);


    const Favoris = require('../models/favoris/favoris');
    const favorisDAO = require('../models/favoris/favorisDAO')(pool);

    const ytService = require('../service/ytService');

    const ChannelTag = require('../models/ytChannel/channelTag');

    const module = {};

    // recupère la chaine et les 3 tags principaux de la chaine + les commentaires
    module.getChannelTag = function (channelId, callback) {
        console.log('recupération de la channel yt');
        ytService().ytChannel(channelId, {
            success: function (ytChannel) {
                console.log('recupération des id_tag principaux');
                tagLinkDAO.getPrincipalIdTag(channelId, {
                    success: function (idTagsPrincipaux) {
                        let tags = [];
                        var cpt = 0;
                        //récupération des tags principaux
                        for(let i = 0; i<idTagsPrincipaux.length; i++){
                            console.log('recupération du tag correspondant à l\'id');
                            tagDAO.getById(idTagsPrincipaux[i].id_tag,{
                                success: function (tag) {
                                    console.log('success recupération');
                                    tags.push(tag);
                                },
                                fail: function (err) {
                                    console.log('Tag n°'+idTagsPrincipaux[i].id_tag+ ' non trouvé en DB' );
                                }
                            });
                            cpt++;
                            console.log('cpt: '+ cpt);
                        }

                        //c'est sale mais c'est pour empêcher le côté asynchrone de js
                        while(cpt < idTagsPrincipaux.length){}

                        console.log('tags après la recup des tag');
                        console.log(tags);

                        console.log('recupération des commentaires');
                        commentDAO.getByIdChannel(channelId, {
                            success: function (comments) {
                                let channeltag = new ChannelTag(ytChannel, tags, comments);
                                callback.success(channeltag);
                            },
                            fail: function (err) {
                                callback.fail(err);
                            }

                        });

                    },
                    fail: function (err) {
                        callback.fail(err);
                    }
                })
            },
            fail: function (error) {
                callback.fail(error);
            }
        })
    };

    // on récupère les tags d'un utilisateur vis à vis d'une chaine
    module.getTagUserByChannel = function (id_user, channelId, callback) {
        console.log('___getTagUserByChannel___');
        tagLinkDAO.getTagByIdUserChannel(id_user, channelId, {
            success: function (tagsUser) {
                console.log('tag de l\'utilisateur vis à vis de la chaine:' + util.inspect(tagsUser));
                callback.success(tagsUser);
            },
            fail: function (err) {
                callback.fail(err);
            }
        })
    };

    // get 25 channels that have the tag id_tag
    module.getChannelsByTag = function (id_tag, callback) {
        console.log('_____getChannelsByTag_____');

        tagLinkDAO.getIdChannelByTag(id_tag,{
            success: function (idArray) {
                let channels = [];
                var cpt = 0;
                for(let i = 0; i < idArray.length; i++){
                    ytService().ytChannel(idArray[i].id_channel, {
                        success: function (chan) {
                            console.log('success recuperation');
                            channels.push(chan);
                            console.log('channels en cours: '+channels)
                            cpt++;
                            console.log(cpt);
                            if(cpt == idArray.length){
                                console.log('channels by tag: '+channels);
                                callback.success(channels);

                            }
                        },
                        fail: function (err) {
                            console.log('la channel n\'a pas pu être récupéré');
                        }
                    });


                }
            },
            fail: function (err) {
                callback.fail(err);
            }
        })
    };


    // get all the favorites of an user
    module.getChannelsByUser = function (id_user, callback) {
        console.log('_____getChannelsFavorite_____');

        favorisDAO.getByUser(id_user, {
            success: function (idArray) {
                let channels = [];
                var cpt = 0;
                if (idArray.length == 0) {
                    callback.success(channels);
                } else {
                    for (let i = 0; i < idArray.length; i++) {
                        ytService().ytChannel(idArray[i].id_channel, {
                            success: function (chan) {
                                console.log('success recuperation');
                                channels.push(chan);
                                console.log('channels en cours: ' + channels)
                                cpt++;
                                console.log(cpt);
                                if (cpt >= idArray.length) {
                                    console.log('channels by tag: ' + channels);
                                    callback.success(channels);

                                }
                            },
                            fail: function (err) {
                                console.log('la channel n\'a pas pu être récupéré');
                                cpt++;
                            }
                        });


                    }
                }

            },
            fail: function (err) {
                callback.fail(err);
            }
        })
    };

    return module;
};
