module.exports = function(){
    const pg = require('pg');
    const url = process.env.DATABASE_URL;

    const tagLinkDAO = require('../models/lienTag/tag_linkDAO')(pg, url);

    const tagDAO = require('../models/tag/tagDAO')(pg, url);

    const commentDAO = require('../models/comment/commentDAO')(pg, url);

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

                        //récupération des tags principaux
                        for(let i = 0; i<idTagsPrincipaux.length; i++){
                            console.log('recupération du tag correspondant à l\'id');
                            tagDAO.getById(idTagsPrincipaux[i].id_tag,{
                                success: function (tag) {
                                    tags.push(tag);
                                },
                                fail: function (err) {
                                    console.log('Tag n°'+idTagsPrincipaux[i].id_tag+ ' non trouvé en DB' );
                                }
                            })
                        }

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
/*
    // on récupère les tags d'un utilisateur vis à vis d'une chaine
    module.getTagUserByChannel = function(id_user, channelId, callback){

        tagLinkDAO.getTagByIdUserChannel(id_user, channelId, {
            success: function (tagLinks) {
                let tags = [];
                for(let i = 0; i<tagLinks.length; i++){
                    tagDAO.getById(tagLinks[i].id_tag,{
                        success: function (tag) {
                            tags.push(tag);
                        },
                        fail: function (err) {
                            console.log('Tag n°'+idTagsPrincipaux[i]+ 'non trouvé en DB' );
                        }
                    })
                }
                callback.success(tags);
            },
            fail: function (err) {
                callback.fail(err);
            }
        })
    };
*/

    return module;
};
