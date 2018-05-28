module.exports = function() {
    const YtChannel = require('../models/ytChannel/ytChannel');
    const YouTube = require('youtube-node');

    const module ={};

    const youTube = new YouTube();

    youTube.setKey('AIzaSyCc_SHX_DcowckZkccEfjIxQ3uOzW9k9Pw');


    module.ytSearch = function(search, callback){


        youTube.search(search, 25, {type: 'channel', part: 'snippet'}, function (error, result) {
            if (error) {
                console.log(error);
                callback.fail(error);
            }
            else {
                console.log('ytSearch success');

                //console.log(JSON.stringify(result, null, 2));
                var tabResult = [];

                for(var i = 0; i<result.items.length; i++){
                    let ytChannel = new YtChannel(result.items[i].id.channelId, result.items[i].snippet.title, result.items[i].snippet.description, result.items[i].snippet.thumbnails.default.url);
                    tabResult.push(ytChannel);
                }
                //console.log(tabResult);
                callback.success(tabResult);
            }
        });
    };


    return module;
};