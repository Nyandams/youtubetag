module.exports = function (pool) {
    var module = {};


    //return tags from tag_link
    module.getTagByIdUserChannel = function (id_user, channelId, callback) {
        console.log('______getTagByIdUserChannel______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'fetch-tag-by-user-channel',
                text: 'SELECT tl.id_tag, ta.libelle_tag FROM tag_link tl JOIN tag ta on ta.id_tag = tl.id_tag WHERE tl.id_user=$1 AND tl.id_channel=$2',
                values: [id_user, channelId]
            };
            console.log('id_client: '+ id_user);
            console.log('channelId: '+ channelId);
            client.query(query, (err, res) => {
                done();
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


    //return 25 id_channel which have the tag
    module.getIdChannelByTag = function (id_tag, callback) {
        console.log('______getTagByIdUserChannel______');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'fetch-id-channel-by-tag',
                text: 'SELECT DISTINCT id_channel FROM public.tag_link WHERE id_tag=$1',
                values: [id_tag]
            };
            console.log(id_tag);
            client.query(query, (err, res) => {
                done();
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
            if (err) throw err;

            var query = {
                name: 'create-tag-link',
                text: 'INSERT INTO public.tag_link (id_user, id_tag, id_channel) VALUES ($1, $2, $3) RETURNING *',
                values: [tag_link.id_user, tag_link.id_tag, tag_link.channelId]
            };

            client.query(query, (err, res) => {
                done();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else if (res.rowCount == 0) {
                    console.log('fail');
                    callback.fail(null);
                } else {
                    console.log('success');
                    callback.success(tag_link);
                }
            })
        });
    };


    //get the 3 principals id_tag for a youtube channel
    module.getPrincipalIdTag = function (channelId, callback) {
        console.log('______getprincipalTag_____');
        pool.connect(function (err, client, done) {
            if (err) throw err;

            var query = {
                name: 'fetch-principal-tag-channel',
                text: 'SELECT id_tag FROM public.tag_link WHERE id_channel=$1 GROUP BY(id_tag) ORDER BY(count(*)) DESC LIMIT 3;',
                values: [channelId]
            };
            client.query(query, (err, res) => {
                done();
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

    // delete a tag_link
    module.delete = function (id_user, channelId, id_tag, callback) {
        console.log('______delete_tag_link_____');
        pool.connect(function (err, client, done) {
            if (err) throw err;
            var query = {
                name: 'delete-tag-link',
                text: 'DELETE FROM public.tag_link WHERE id_user=$1 AND id_channel=$2 AND id_tag=$3',
                values: [id_user, channelId, id_tag]
            };
            client.query(query, (err, res) => {
                done();

                if (err) {
                    console.log(err.stack);
                    callback.fail(err);
                } else {
                    console.log('success');
                    callback.success(res);
                }
            })
        });
    };

    return module;
};