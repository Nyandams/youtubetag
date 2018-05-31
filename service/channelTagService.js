module.exports = function(pool){

    const tagLinkDAO = require('../models/lienTag/tag_linkDAO')(pool);

    const tagDAO = require('../models/tag/tagDAO')(pool);

    const commentDAO = require('../models/comment/commentDAO')(pool);

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
    module.getTagUserByChannel = function(id_user, channelId, callback){
        console.log('___getTagUserByChannel___');
        tagLinkDAO.getTagByIdUserChannel(id_user, channelId, {
            success: function (tagsUser) {
                console.log(tagsUser);
                callback.success(tagsUser);
            },
            fail: function (err) {
                callback.fail(err);
            }
        })
    };


    return module;
};
