const Tag = require('./tag.js');

module.exports = function (pg, url) {
    var module = {};
    var Tag = require('./tag');

    const pool = new pg.Pool({
        connectionString: url,
        ssl: true
    });


    module.getAll = function(callback){
        console.log('______get_all_tag______');
        pool.connect(function (err, client, done) {
            var query = {
                name: 'fetch-all-tag',
                text: 'SELECT * FROM public.tag'
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

    //create a tag
    module.create = function (tag, callback) {
        console.log('______create_tag______');
        pool.connect(function (err, client, done) {
            var query = {
                name: 'create-tag',
                text: 'INSERT INTO public.tag (libelle_tag) VALUES ($1) RETURNING *',
                values: [tag.libelle_tag]
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
                    tag.id_tag = res.rows[0].id_tag;
                    callback.success(tag);
                }
            })
        });
    };


    //callback succeed(rows) if the tag with id_tag exists
    module.getById = function (id_tag, callback) {
        console.log('______getById_tag______');
        pool.connect(function (err, client, done) {
            var query = {
                name: 'fetch-by-id-tag',
                text: 'SELECT * FROM public.tag WHERE id_tag = $1',
                values: [id_tag]
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
                    var tag = new Tag(res.rows[0].id_tag, res.rows[0].libelle_tag);
                    callback.success(tag);
                }
            })
        });
    };

    // update of a tag
    module.update = function (tag, callback) {
        console.log('______update_tag______');
        pool.connect(function (err, client, done) {
            var query = {
                name: 'update-tag',
                text: 'UPDATE public.tag SET libelle_tag=$1 WHERE id_tag=$2 RETURNING *',
                values: [tag.libelle_tag, tag.id_tag]
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
                    var tag = new Tag(res.rows[0].id_tag, res.rows[0].libelle_tag);
                    callback.success(tag);
                }
            })
        });
    };

    // update of a tag
    module.delete = function (id, callback) {
        console.log('______delete_tag______');
        pool.connect(function (err, client, done) {
            var query = {
                name: 'delete-tag',
                text: 'DELETE FROM public.tag WHERE id_tag=$1',
                values: [id]
            };
            pool.query(query, (err, res) => {
                done();
                client.end().then(()=>console.log('disconnected'))
                    .catch();

                pool.end().then(() => console.log('pool has ended'));

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