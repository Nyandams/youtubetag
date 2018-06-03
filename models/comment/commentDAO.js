module.exports = function (pool) {

    var module = {};
    var Comment = require('./comment');

    /**
     * @desc create a comment
     * @param {Comment} comment
     * @param {Function} callback
     */
    module.create = function (comment, callback) {
        console.log('______create_comment______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'create-comment',
                text: 'INSERT INTO public.comment (content, channel_id, pseudo_user) VALUES ($1,$2,$3) RETURNING *',
                values: [comment.content, comment.channel_id, comment.pseudo_user]
            };

            client.query(query, (err, res) => {
                done();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else if(res.rowCount == 0) {
                    console.log('fail');
                    callback.fail(null);
                } else {
                    console.log('success');
                    comment.id_comment = res.rows[0].id_comment;
                    callback.success(comment);
                }
            })
        });
    };



    /**
     * @desc return a channel which the id is channel_id
     * @param {String} channel_id
     * @param {Function} callback
     */
    module.getByIdChannel = function (channel_id, callback) {
        console.log('______getByIdChannel__comment____');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'fetch-comment-by-id-channel',
                text: 'SELECT * FROM public.comment WHERE channel_id = $1 ORDER BY id_comment DESC',
                values: [channel_id]
            };
            client.query(query, (err, res) => {
                done();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else {
                    console.log('success');
                    callback.success(res.rows);
                }
            })
        });
    };
    return module;
};