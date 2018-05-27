module.exports = function() {


    const module = {};

    const youtubeSearch = require('youtube-api-v3-search');

    module.ytSearch = function (param) {
        const options = {
            maxResults: '25',
            q: param,
            part: 'snippet',
            type: 'channel'
        };

        youtubeSearch('AIzaSyCc_SHX_DcowckZkccEfjIxQ3uOzW9k9Pw', options, function (error, result) {
            return result;
        });
    };
    return module;
};