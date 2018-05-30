const Comment = require('./comment.js');

module.exports = function (pg, url) {

    var module = {};
    var Comment = require('./comment');

    const pool = new pg.Pool({
        connectionString: url,
        ssl: true
    });


    //create a comment
    module.create = function (comment, callback) {
        console.log('______create_comment______');
        pool.connect(function (err, client, done) {
            var query = {
                name: 'create-comment',
                text: 'INSERT INTO public.comment (content, channel_id, pseudo_user) VALUES ($1,$2,$3) RETURNING *',
                values: [comment.content, comment.channel_id, comment.pseudo_user]
            };

            pool.query(query, (err, res) => {
                done();
                client.end().then(()=>console.log('disconnected'))
                    .catch();

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


    //callback succeed(rows) if the tag with
    module.getByIdChannel = function (channel_id, callback) {
        console.log('______getByIdChannel__comment____');
        pool.connect(function (err, client, done) {
            var query = {
                name: 'fetch-comment-by-id-channel',
                text: 'SELECT * FROM public.comment WHERE channel_id = $1 ORDER BY id_comment DESC',
                values: [channel_id]
            };
            pool.query(query, (err, res) => {
                done();
                client.end().then(()=>console.log('disconnected'))
                    .catch();

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