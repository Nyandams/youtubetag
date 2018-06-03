module.exports = function() {
    const YtChannel = require('../models/ytChannel/ytChannel');
    const YouTube = require('youtube-node');
    const simpleYoutube = require('simple-youtube-api');
    const simpleAPI = new simpleYoutube('AIzaSyCc_SHX_DcowckZkccEfjIxQ3uOzW9k9Pw');

    const module ={};

    const youTube = new YouTube();
    // api key
    youTube.setKey('AIzaSyCc_SHX_DcowckZkccEfjIxQ3uOzW9k9Pw');


    /**
     * @desc return a {ytChannel} or error
     * @param channelId
     * @param callback
     */
    module.ytChannel = function(channelId, callback){

        var ytChannel = 'https://www.youtube.com/channel/' + channelId;
        console.log(ytChannel);
        simpleAPI.getChannel(ytChannel)
            .then(results => {

                let ytChannel = new YtChannel(results.raw.id, results.raw.snippet.title, results.raw.snippet.description, results.raw.snippet.thumbnails.high.url);
                callback.success(ytChannel);
            })
            .catch(function(error){
                console.log('_________error  ytChannel api simple-youtube-api____________');
                callback.fail(error);
            });
    };

    /**
     * @desc return a maximum of 25 {ytChannel}
     * @param {String} search
     * @param {Function} callback
     */
    module.ytSearch = function(search, callback){
        console.log('ytSearch');
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
                    let ytChannel = new YtChannel(result.items[i].id.channelId, result.items[i].snippet.title, result.items[i].snippet.description, result.items[i].snippet.thumbnails.high.url);
                    tabResult.push(ytChannel);
                }
                callback.success(tabResult);
            }
        });
    };


    return module;
};