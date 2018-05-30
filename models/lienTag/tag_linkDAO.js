module.exports = function (pg, url) {
    var module = {};

    const pool = new pg.Pool({
        connectionString: url,
        ssl: true
    });


    module.getTagByIdUserChannel = function(id_user, channelId, callback){
        console.log('______getTagByIdUserChannel______');
        pool.connect(function (err, client, done) {
            var query = {
                name: 'fetch-tag-by-user-channel',
                text: 'SELECT * FROM public.tag_link WHERE id_user=$1 AND id_channel=$2',
                values: [id_user, channelId]
            };
            pool.query(query, (err, res) => {
                done();client.end().then(()=>console.log('disconnected'))
                    .catch();
                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else {
                    console.log('success');
                    console.log(res.rows);
                    callback.success(res.rows);
                }
            })
        });
    };

    //create a tag_link
    module.addTagLink = function (tag_link, callback) {
        console.log('______add_tag_link______');
        console.log(tag_link);
        pool.connect(function (err, client, done) {
            var query = {
                name: 'create-tag-link',
                text: 'INSERT INTO public.tag_link (id_user, id_tag, id_channel) VALUES ($1, $2, $3) RETURNING *',
                values: [tag_link.id_user, tag_link.id_tag, tag_link.channelId]
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
                    callback.success(tag_link);
                }
            })
        });
    };




    return module;
};